import { NextResponse } from "next/server";
import { z } from "zod";

const estimateInput = z.object({
  city: z.string().min(2).max(100),
  state: z.string().regex(/^[A-Z]{2}$/),
  postalCode: z.string().regex(/^$|^\d{5}-?\d{3}$/),
  eventDate: z.string().date(),
  eventType: z.enum([
    "corporativo",
    "festival",
    "cultural",
    "privado",
    "teatro",
  ]),
  guests: z.number().int().min(1).max(100_000),
  format: z.enum(["duo", "trio", "quarteto", "banda"]),
  stage: z.enum(["interno", "externo"]),
  lodging: z.boolean(),
  airTravel: z.boolean(),
});

const baseArtistFees = {
  duo: 8_500,
  trio: 10_500,
  quarteto: 14_000,
  banda: 19_500,
} satisfies Record<z.infer<typeof estimateInput>["format"], number>;

type EstimateInput = z.infer<typeof estimateInput>;

async function getRoadDistance(
  city: string,
  state: string,
  postalCode: string,
) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const url = new URL(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
  );
  url.searchParams.set("origins", "Rio de Janeiro, RJ, Brasil");
  url.searchParams.set(
    "destinations",
    postalCode
      ? `${postalCode}, Brasil`
      : `${city}, ${state}, Brasil`,
  );
  url.searchParams.set("mode", "driving");
  url.searchParams.set("language", "pt-BR");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("O serviço de rotas não respondeu corretamente.");
  }

  const data: unknown = await response.json();
  const result = z
    .object({
      status: z.string(),
      rows: z.array(
        z.object({
          elements: z.array(
            z.object({
              status: z.string(),
              distance: z.object({ value: z.number() }).optional(),
            }),
          ),
        }),
      ),
    })
    .safeParse(data);

  if (
    !result.success ||
    result.data.status !== "OK" ||
    result.data.rows[0]?.elements[0]?.status !== "OK"
  ) {
    throw new Error("Não foi possível obter uma rota para essa cidade.");
  }

  const distanceMeters = result.data.rows[0].elements[0].distance?.value;
  if (distanceMeters === undefined) {
    throw new Error("O serviço de rotas não retornou a distância.");
  }

  return Math.round(distanceMeters / 1_000);
}

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

async function getMunicipalPibPerCapita(city: string, state: string) {
  const municipalityResponse = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`,
    { next: { revalidate: 86_400 } },
  );

  if (!municipalityResponse.ok) {
    throw new Error("O IBGE não conseguiu identificar a cidade selecionada.");
  }

  const municipalityData: unknown = await municipalityResponse.json();
  const municipalities = z
    .array(z.object({ id: z.number(), nome: z.string() }))
    .safeParse(municipalityData);
  const municipality = municipalities.success
    ? municipalities.data.find(
        (item) => normalizeName(item.nome) === normalizeName(city),
      )
    : undefined;

  if (!municipality) {
    throw new Error("A cidade selecionada não corresponde ao estado informado.");
  }

  const [pibResponse, populationResponse] = await Promise.all([
    fetch(
      `https://api.sidra.ibge.gov.br/values/t/5938/n6/${municipality.id}/v/37/p/2023`,
      { next: { revalidate: 86_400 } },
    ),
    fetch(
      `https://api.sidra.ibge.gov.br/values/t/6579/n6/${municipality.id}/v/9324/p/2024`,
      { next: { revalidate: 86_400 } },
    ),
  ]);

  if (!pibResponse.ok || !populationResponse.ok) {
    return null;
  }

  const sidraRows = z.array(
    z
      .object({
        D1C: z.string().optional(),
        D3C: z.string().optional(),
        V: z.string().optional(),
      })
      .passthrough(),
  );
  const [pibData, populationData] = await Promise.all([
    pibResponse.json() as Promise<unknown>,
    populationResponse.json() as Promise<unknown>,
  ]);
  const pibRows = sidraRows.safeParse(pibData);
  const populationRows = sidraRows.safeParse(populationData);
  const getValue = (
    rows: typeof pibRows,
    year: string,
  ): number | null => {
    if (!rows.success) return null;
    const value = rows.data.find(
      (row) => row.D1C === String(municipality.id) && row.D3C === year,
    )?.V;
    return value && /^\d+(?:\.\d+)?$/.test(value) ? Number(value) : null;
  };
  const pibInThousands = getValue(pibRows, "2023");
  const population = getValue(populationRows, "2024");

  if (!pibInThousands || !population) return null;

  return (pibInThousands * 1_000) / population;
}

function makeEstimate(
  input: EstimateInput,
  distanceKm: number | null,
  pibPerCapita: number | null,
) {
  const musicians = { duo: 2, trio: 3, quarteto: 4, banda: 6 }[input.format];
  const artistFee = baseArtistFees[input.format];
  const eventDate = new Date(`${input.eventDate}T12:00:00`);
  const month = eventDate.getMonth() + 1;
  const seasonalFactor = [6, 10, 11, 12].includes(month) ? 1.08 : 1;
  const guestFactor = input.guests > 500 ? 1.08 : input.guests > 200 ? 1.04 : 1;
  const economicFactor =
    pibPerCapita === null
      ? 1
      : Math.max(
          0.94,
          Math.min(1.06, 1 + Math.log(pibPerCapita / 50_000) * 0.04),
        );
  const adjustedFee = Math.round(
    artistFee * seasonalFactor * guestFactor * economicFactor,
  );
  const technicalCosts = Math.round(
    adjustedFee * (input.stage === "externo" ? 0.12 : 0.06),
  );
  const operationalCosts = Math.round(adjustedFee * 0.08);
  const lodgingCosts = input.lodging ? musicians * 560 : 0;
  const logistics =
    distanceKm === null || input.airTravel
      ? null
      : Math.round(distanceKm * 2 * musicians * 1.2 + lodgingCosts);
  const subtotal = adjustedFee + technicalCosts + operationalCosts;
  const minimum = subtotal + (logistics ?? 0);
  const maximum = Math.round(minimum * 1.22);

  return {
    artistFee: adjustedFee,
    operationalCosts,
    technicalCosts,
    logistics,
    minimum,
    maximum,
    distanceKm,
    pibPerCapita,
    note: [
      "Esta é uma referência inicial, não uma proposta comercial. Produção, deslocamento, disponibilidade de agenda e necessidades técnicas são confirmados pela equipe.",
      pibPerCapita === null
        ? "O fator econômico não foi aplicado porque os dados municipais do IBGE estão indisponíveis."
        : "O ajuste econômico é uma referência limitada a ±6%, baseada no PIB municipal de 2023 e na população estimada de 2024 (SIDRA/IBGE); requer calibração da produção.",
    ].join(" "),
  };
}

async function getAiNote(
  input: EstimateInput,
  estimate: ReturnType<typeof makeEstimate>,
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content:
            "Escreva uma observação breve e específica em português para uma estimativa preliminar de show. Não altere nem prometa valores; não invente distâncias, PIB ou disponibilidade. Seja transparente sobre itens a confirmar.",
        },
        {
          role: "user",
          content: JSON.stringify({
            cidade: `${input.city}, ${input.state}`,
            data: input.eventDate,
            tipo: input.eventType,
            convidados: input.guests,
            formato: input.format,
            palco: input.stage,
            hospedagem: input.lodging,
            transporteAereo: input.airTravel,
            distanciaRodoviariaKm: estimate.distanceKm,
            pibPerCapita: estimate.pibPerCapita,
            faixa: [estimate.minimum, estimate.maximum],
          }),
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("A geração da observação pela IA falhou.");
  }

  const body: unknown = await response.json();
  const result = z
    .object({
      choices: z.array(
        z.object({
          message: z.object({ content: z.string().nullable() }),
        }),
      ),
    })
    .safeParse(body);
  const note = result.success ? result.data.choices[0]?.message.content : null;

  if (!note) {
    throw new Error("A IA não retornou uma observação utilizável.");
  }

  return note;
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = estimateInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Confira os dados do evento e tente novamente." },
      { status: 400 },
    );
  }

  try {
    const input = parsed.data;
    const [pibPerCapita, distanceKm] = await Promise.all([
      getMunicipalPibPerCapita(input.city, input.state),
      input.airTravel
        ? Promise.resolve(null)
        : getRoadDistance(input.city, input.state, input.postalCode),
    ]);
    const estimate = makeEstimate(input, distanceKm, pibPerCapita);
    const aiNote = await getAiNote(input, estimate);

    return NextResponse.json({
      ...estimate,
      note: aiNote ?? estimate.note,
      mode: aiNote ? "assistida" : "orientativa",
      distanceSource: distanceKm === null ? "indisponível" : "Google Maps",
      economySource:
        pibPerCapita === null
          ? "indisponível"
          : "SIDRA/IBGE · PIB 2023 · população estimada 2024",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível calcular a estimativa.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
