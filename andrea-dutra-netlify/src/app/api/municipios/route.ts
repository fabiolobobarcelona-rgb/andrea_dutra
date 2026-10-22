import { NextResponse } from "next/server";
import { z } from "zod";

const stateCode = z.string().regex(/^[A-Z]{2}$/);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = stateCode.safeParse(searchParams.get("uf")?.toUpperCase());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Informe uma sigla de estado válida." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${parsed.data}/municipios?orderBy=nome`,
    { next: { revalidate: 86_400 } },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Não foi possível consultar os municípios no IBGE." },
      { status: 502 },
    );
  }

  const municipalities: unknown = await response.json();
  const municipalitySchema = z.array(
    z.object({ id: z.number(), nome: z.string() }),
  );
  const result = municipalitySchema.safeParse(municipalities);

  if (!result.success) {
    return NextResponse.json(
      { error: "A resposta do IBGE veio em um formato inesperado." },
      { status: 502 },
    );
  }

  return NextResponse.json(result.data);
}
