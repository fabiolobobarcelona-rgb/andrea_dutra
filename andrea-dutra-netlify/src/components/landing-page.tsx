"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Instagram,
  Menu,
  Play,
  X,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { EffectCoverflow, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";

const contactEmail = "codaprod@gmail.com";
const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
  "Olá! Gostaria de conversar sobre a contratação de um show da Andrea Dutra.",
)}`;
const youtubeUrl = "https://www.youtube.com/@andreadutraCantora";

const navigation = [
  { label: "A artista", href: "#artista" },
  { label: "Projetos", href: "#projetos" },
  { label: "Discografia", href: "#discografia" },
  { label: "Contato", href: "#orcamento" },
];

const proofPoints = [
  { value: "5", label: "discos solo" },
  { value: "6 CDs + DVD", label: "com o Arranco de Varsóvia" },
  { value: "TIM 2006", label: "Melhor Grupo de Samba" },
  { value: "Versalhes · MIDEM", label: "palcos internacionais" },
  { value: "Desde 2016", label: "na Orquestra Lunar" },
];

type ProjectCategory = "Samba" | "Jazz" | "Tributos";

type Project = {
  name: string;
  category: ProjectCategory;
  description: string;
  image: string;
  imageAlt: string;
  formation: string;
};

const projects: Project[] = [
  {
    name: "Todo Aquele Samba",
    category: "Samba",
    description:
      "Samba jazz, samba funk, samba de quadra, de raiz — um passeio brasileiro que encontra o público.",
    image: "/images/press-04-04.webp",
    imageAlt: "Capa do álbum Samba de Cartola",
    formation: "A partir de duo",
  },
  {
    name: "Arranco de Varsóvia",
    category: "Samba",
    description:
      "A força de um trio vocal dedicado ao samba de raiz, com repertório e história próprios.",
    image: "/images/press-04-11.webp",
    imageAlt: "Capa do álbum Na Panela pra Dançar",
    formation: "A partir de trio",
  },
  {
    name: "Orquestra Lunar",
    category: "Samba",
    description:
      "Samba de gafieira, brazilian jazz e outras bossas em uma formação ampla e dançante.",
    image: "/images/press-10-01.webp",
    imageAlt: "Andrea Dutra em apresentação ao vivo",
    formation: "Orquestra · 10 integrantes",
  },
  {
    name: "BrazJazz",
    category: "Jazz",
    description:
      "O encontro da MPB com o jazz: ritmos brasileiros, improviso e uma sonoridade contemporânea.",
    image: "/images/press-04-08.webp",
    imageAlt: "Capa ilustrada do álbum Jamba",
    formation: "A partir de duo",
  },
  {
    name: "Todo Aquele Jazz",
    category: "Jazz",
    description:
      "Samba jazz, brazilian jazz e standards de jazz temperados à brasileira.",
    image: "/images/press-03-01.webp",
    imageAlt: "Andrea Dutra interpretando uma canção ao vivo",
    formation: "A partir de duo",
  },
  {
    name: "The Great American Songbook",
    category: "Jazz",
    description:
      "Canções inesquecíveis dos grandes compositores que construíram a história do jazz.",
    image: "/images/press-04-07.webp",
    imageAlt: "Capa do álbum Quarteto Moderno",
    formation: "Formação sob consulta",
  },
  {
    name: "Elton e Parceiros",
    category: "Tributos",
    description:
      "As canções de Elton Medeiros e seus encontros com Zé Keti, Cartola e Paulinho da Viola.",
    image: "/images/press-04-01.webp",
    imageAlt: "Capa do álbum Na Cadência do Samba, do Arranco de Varsóvia",
    formation: "Andrea e dois violões de 7 cordas",
  },
  {
    name: "Agora Esse Mundo é Meu",
    category: "Tributos",
    description:
      "Um encontro delicado com as canções de Fátima Guedes e a força de suas histórias.",
    image: "/images/press-04-12.webp",
    imageAlt: "Capa ilustrada do álbum Onde a Dor Vira Beleza",
    formation: "Duo com Domingos Teixeira",
  },
  {
    name: "Cole Porter Deluxe",
    category: "Tributos",
    description:
      "Standards, histórias e sofisticação no repertório de um dos grandes compositores americanos.",
    image: "/images/press-04-06.webp",
    imageAlt: "Capa do álbum Black Museu Brasileiro",
    formation: "Formação sob consulta",
  },
  {
    name: "Para Viver um Grande Amor",
    category: "Tributos",
    description:
      "A trilha do filme inspirado no musical de Vinícius de Moraes e Carlos Lyra.",
    image: "/images/press-04-02.webp",
    imageAlt: "Capa do álbum O Amor de Uns Tempos pra Cá",
    formation: "Duo com Manoela Marinho",
  },
];

const albums = [
  { title: "Black Museu Brasileiro", year: "1998", cover: "press-04-06.webp" },
  { title: "Quarteto Moderno", year: "2003", cover: "press-04-07.webp" },
  { title: "Jamba", year: "2013", cover: "press-04-08.webp" },
  { title: "Reconsidere", year: "2019", cover: "press-04-03.webp" },
  { title: "Samba de Cartola", year: "2020", cover: "press-04-04.webp" },
  { title: "Rua da Amargura", year: "2020", cover: "press-04-05.webp" },
  { title: "Disseram", year: "2021", cover: "press-04-13.webp" },
  { title: "Na Panela pra Dançar", year: "2014", cover: "press-04-11.webp" },
  { title: "Na Cadência do Samba", year: "2006", cover: "press-04-01.webp" },
  { title: "Pãozinho de Açúcar (Ao Vivo)", year: "2010", cover: "press-04-10.webp" },
  { title: "O Amor de Uns Tempos pra Cá", year: "2007", cover: "press-04-02.webp" },
  { title: "Onde a Dor Vira Beleza", year: "2020", cover: "press-04-12.webp" },
  { title: "Andrea Dutra", year: "1993", cover: "press-04-09.webp" },
];

const gallery = [
  {
    src: "/images/press-02-01.webp",
    alt: "Andrea Dutra cantando e celebrando no palco",
    label: "A voz em primeiro plano",
    width: 1840,
    height: 2261,
  },
  {
    src: "/images/press-03-01.webp",
    alt: "Andrea Dutra em um show em preto e branco",
    label: "Presença",
    width: 554,
    height: 718,
  },
  {
    src: "/images/press-05-01.webp",
    alt: "Andrea Dutra em uma apresentação iluminada",
    label: "Ao vivo",
    width: 1805,
    height: 1080,
  },
  {
    src: "/images/press-10-01.webp",
    alt: "Andrea Dutra em um palco com iluminação colorida",
    label: "Encontro com o público",
    width: 4030,
    height: 2851,
  },
];

const faqs = [
  {
    question: "Como contratar um show?",
    answer:
      "Conte à produção a data, a cidade, o tipo de evento e o formato desejado. A equipe confirma a disponibilidade e prepara uma proposta personalizada.",
  },
  {
    question: "Qual é a antecedência ideal?",
    answer:
      "Quanto antes, melhor — especialmente para festivais, teatros, programações culturais e datas concorridas. A disponibilidade é sempre confirmada caso a caso.",
  },
  {
    question: "Quais formatos estão disponíveis?",
    answer:
      "Os projetos vão de duo e trio a quarteto e formações ampliadas, incluindo a Orquestra Lunar, com dez integrantes. Cada projeto tem sua própria formação.",
  },
  {
    question: "Andrea Dutra atende todo o Brasil?",
    answer:
      "Sim. Eventos em diferentes cidades são avaliados mediante consulta de agenda, logística e características da produção.",
  },
  {
    question: "Há shows para eventos corporativos?",
    answer:
      "Sim. Os projetos podem integrar eventos corporativos, festivais, teatros, programações culturais e celebrações privadas.",
  },
  {
    question: "É possível criar um projeto personalizado?",
    answer:
      "Sim. Repertório, formação e contexto podem ser conversados com a produção para avaliar uma proposta que faça sentido para a ocasião.",
  },
];

const states = [
  ["AC", "Acre"],
  ["AL", "Alagoas"],
  ["AP", "Amapá"],
  ["AM", "Amazonas"],
  ["BA", "Bahia"],
  ["CE", "Ceará"],
  ["DF", "Distrito Federal"],
  ["ES", "Espírito Santo"],
  ["GO", "Goiás"],
  ["MA", "Maranhão"],
  ["MT", "Mato Grosso"],
  ["MS", "Mato Grosso do Sul"],
  ["MG", "Minas Gerais"],
  ["PA", "Pará"],
  ["PB", "Paraíba"],
  ["PR", "Paraná"],
  ["PE", "Pernambuco"],
  ["PI", "Piauí"],
  ["RJ", "Rio de Janeiro"],
  ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"],
  ["RO", "Rondônia"],
  ["RR", "Roraima"],
  ["SC", "Santa Catarina"],
  ["SP", "São Paulo"],
  ["SE", "Sergipe"],
  ["TO", "Tocantins"],
] as const;

const quoteSchema = z.object({
  state: z.string().length(2, "Selecione um estado."),
  city: z.string().min(2, "Selecione uma cidade."),
  postalCode: z
    .string()
    .regex(/^$|^\d{5}-?\d{3}$/, "Informe um CEP válido."),
  eventDate: z.string().min(1, "Informe a data do evento."),
  eventType: z.enum(["corporativo", "festival", "cultural", "privado", "teatro"]),
  guests: z.coerce
    .number({ invalid_type_error: "Informe o número de convidados." })
    .int("Informe um número inteiro.")
    .min(1, "Informe pelo menos 1 convidado.")
    .max(100_000, "O limite é de 100.000 convidados."),
  format: z.enum(["duo", "trio", "quarteto", "banda"]),
  stage: z.enum(["interno", "externo"]),
  lodging: z.boolean(),
  airTravel: z.boolean(),
});

type QuoteValues = z.infer<typeof quoteSchema>;
type Municipality = { id: number; nome: string };
type EstimateResult = {
  artistFee: number;
  operationalCosts: number;
  technicalCosts: number;
  logistics: number | null;
  minimum: number;
  maximum: number;
  distanceKm: number | null;
  pibPerCapita: number | null;
  note: string;
  mode: "assistida" | "orientativa";
  distanceSource: string;
  economySource: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function emailLink(subject: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;
}

function SpotifySearch({ title }: { title: string }) {
  const query = encodeURIComponent(`Andrea Dutra ${title}`);
  const links = [
    ["Spotify", `https://open.spotify.com/search/${query}`],
    ["Apple Music", `https://music.apple.com/br/search?term=${query}`],
    ["YouTube Music", `https://music.youtube.com/search?q=${query}`],
    ["Deezer", `https://www.deezer.com/search/${query}`],
  ];

  return (
    <div className="music-links" aria-label={`Ouvir ${title}`}>
      {links.map(([label, href]) => (
        <a href={href} key={label} target="_blank" rel="noreferrer">
          {label}
        </a>
      ))}
    </div>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y: parallax }}
        aria-hidden="true"
      >
        <Image
          src="/images/press-02-01.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 100vw, 70vw"
          className="hero-image"
        />
      </motion.div>
      <div className="section-wrap hero-inner">
        <header className="site-header">
          <Link
            href="#inicio"
            className="wordmark"
            aria-label="Andrea Dutra, início"
            onClick={closeMenu}
          >
            andrea <span>dutra</span>
          </Link>
          <nav
            className="nav-links"
            id="navegacao-principal"
            aria-label="Navegação principal"
            data-open={menuOpen}
          >
            {navigation.map((item) => (
              <Link href={item.href} key={item.label} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="navegacao-principal"
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuButtonRef}
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </header>

        <motion.div
          className="hero-content"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="hero-kicker">Uma voz, muitas histórias</span>
          <h1 className="font-display hero-title">
            Andrea
            <span>Dutra</span>
          </h1>
          <p className="hero-genres">JAZZ · SAMBA · SOUL · MPB</p>
          <p className="hero-copy">
            Mais de três décadas de carreira, palcos no Brasil e no mundo e
            uma voz que faz da música brasileira um encontro inesquecível.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#orcamento">
              Solicitar orçamento <ArrowRight size={15} />
            </a>
            <a
              className="button-quiet"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a className="button-quiet" href="#video">
              <Play size={14} fill="currentColor" /> Assistir vídeo
            </a>
          </div>
        </motion.div>
        <a className="hero-side-note" href="#trajetoria">
          Conheça a trajetória <ArrowDown size={13} />
        </a>
      </div>
    </section>
  );
}

function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="Trajetória em números">
      <div className="section-wrap proof-grid">
        {proofPoints.map((item) => (
          <div className="proof-item" key={item.label}>
            <span className="proof-value">{item.value}</span>
            <span className="proof-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="video-section section-space" id="video">
      <div className="section-wrap video-grid">
        <a
          className="video-card"
          href={youtubeUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Assistir vídeos de Andrea Dutra no YouTube"
        >
          <Image
            src="/images/press-03-01.webp"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 60vw"
            loading="lazy"
          />
          <span className="video-play">
            <Play size={18} fill="currentColor" />
          </span>
          <span className="video-caption">Andrea Dutra ao vivo</span>
        </a>
        <div className="video-copy">
          <span className="eyebrow">No palco, por inteiro</span>
          <h2 className="font-display">Conheça Andrea Dutra ao vivo</h2>
          <p>
            Assista a apresentações e descubra a força de uma interpretação
            que passeia do samba ao jazz — sempre com identidade brasileira.
          </p>
          <a
            className="button-primary"
            href={emailLink("Disponibilidade para show — Andrea Dutra")}
          >
            Solicitar disponibilidade <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Biography() {
  return (
    <section className="bio-section section-space" id="artista">
      <div className="section-wrap bio-grid">
        <div className="bio-photo-wrap">
          <Image
            className="bio-photo"
            src="/images/press-05-01.webp"
            alt="Andrea Dutra em uma apresentação ao vivo"
            fill
            sizes="(max-width: 640px) 90vw, 40vw"
            loading="lazy"
          />
          <div className="bio-photo-note">
            <strong>Desde os anos 80</strong>
            <span>uma trajetória feita de música, encontros e reinvenção.</span>
          </div>
        </div>
        <div className="bio-copy" id="trajetoria">
          <span className="eyebrow">A artista</span>
          <h2 className="font-display">
            Raiz brasileira.
            <br />
            Voz sem fronteiras.
          </h2>
          <p>
            Carioca, cantora, compositora e professora de voz, Andrea Dutra
            transita com naturalidade entre samba, jazz, soul e MPB. Integra o
            Arranco de Varsóvia desde 2001 — grupo vencedor do Prêmio TIM de
            Melhor Grupo de Samba — e a Orquestra Lunar desde 2016.
          </p>
          <p>
            Cantou no Palácio de Versalhes, no Ano do Brasil na França, e no
            MIDEM, em Cannes. Ao longo da carreira, dividiu palcos e gravações
            com nomes como Tim Maia, Ivan Lins, Dona Ivone Lara, Martinho da
            Vila e Marcus Miller.
          </p>
          <ol className="timeline" aria-label="Momentos da carreira">
            <li>
              <span>
                <strong>Anos 1980</strong> — início da carreira profissional
              </span>
            </li>
            <li>
              <span>
                <strong>1993</strong> — primeiro disco solo
              </span>
            </li>
            <li>
              <span>
                <strong>2001</strong> — passa a integrar o Arranco de Varsóvia
              </span>
            </li>
            <li>
              <span>
                <strong>2006</strong> — Prêmio TIM de Melhor Grupo de Samba
              </span>
            </li>
            <li>
              <span>
                <strong>2016 até hoje</strong> — Orquestra Lunar e projetos
                autorais
              </span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [filter, setFilter] = useState<"Todos" | ProjectCategory>("Todos");
  const categories: ("Todos" | ProjectCategory)[] = [
    "Todos",
    "Samba",
    "Jazz",
    "Tributos",
  ];
  const visibleProjects =
    filter === "Todos"
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <section className="projects-section section-space" id="projetos">
      <div className="section-wrap">
        <div className="project-tools">
          <div className="section-heading">
            <span className="eyebrow">Escolha a trilha do seu evento</span>
            <h2 className="font-display">Projetos com personalidade</h2>
            <p>
              Do formato intimista à grande formação, um repertório para cada
              ocasião — sempre com a assinatura de Andrea Dutra.
            </p>
          </div>
          <div className="filter-list" aria-label="Filtrar projetos">
            {categories.map((category) => (
              <button
                className="filter-button"
                type="button"
                key={category}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="project-grid" aria-live="polite">
          {visibleProjects.map((project) => (
            <article className="project-card" key={project.name}>
              <div className="project-image">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 850px) 50vw, 25vw"
                  loading="lazy"
                />
                <span className="project-category">{project.category}</span>
              </div>
              <div className="project-content">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-facts">
                  <span>
                    Formação <strong>{project.formation}</strong>
                  </span>
                  <span>
                    Duração <strong>Sob consulta</strong>
                  </span>
                </div>
                <a
                  className="button-primary"
                  href={emailLink(`Proposta para o projeto ${project.name}`)}
                >
                  Solicitar proposta <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<
    (typeof gallery)[number] | null
  >(null);

  useEffect(() => {
    if (!selectedPhoto) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedPhoto(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedPhoto]);

  return (
    <section className="gallery-section section-space" id="galeria">
      <div className="section-wrap">
        <div className="section-heading">
          <span className="eyebrow">Quando a música acontece</span>
          <h2 className="font-display">Presença que se sente.</h2>
          <p>Um pouco da energia que transforma cada apresentação em encontro.</p>
        </div>
        <div className="gallery-grid">
          {gallery.map((photo) => (
            <button
              className="gallery-item"
              type="button"
              key={photo.src}
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`Ampliar foto: ${photo.label}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, 35vw"
                loading="lazy"
              />
              <span className="gallery-label">{photo.label}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedPhoto && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.alt}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedPhoto(null);
          }}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Fechar imagem"
          >
            <X size={20} />
          </button>
          <Image
            src={selectedPhoto.src}
            alt={selectedPhoto.alt}
            width={selectedPhoto.width}
            height={selectedPhoto.height}
            sizes="90vw"
            priority
          />
        </div>
      )}
    </section>
  );
}

function Discography() {
  return (
    <section className="discography-section section-space" id="discografia">
      <div className="section-wrap">
        <div className="discography-head">
          <div className="section-heading">
            <span className="eyebrow">Canções que contam histórias</span>
            <h2 className="font-display">Uma discografia viva.</h2>
            <p>
              Discos solo, encontros e projetos que atravessam diferentes
              momentos da música brasileira.
            </p>
          </div>
          <a
            href="https://open.spotify.com/search/Andrea%20Dutra"
            className="button-outline hidden sm:inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            Ouvir no Spotify <ArrowRight size={14} />
          </a>
        </div>
        <Swiper
          className="discography-swiper"
          modules={[EffectCoverflow, Pagination, A11y]}
          effect="coverflow"
          centeredSlides
          grabCursor
          loop
          slidesPerView={1.35}
          spaceBetween={18}
          coverflowEffect={{
            rotate: 4,
            stretch: 0,
            depth: 80,
            modifier: 1.6,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            560: { slidesPerView: 2.5, spaceBetween: 24 },
            850: { slidesPerView: 3.6, spaceBetween: 30 },
            1100: { slidesPerView: 4.5, spaceBetween: 34 },
          }}
          aria-label="Discografia de Andrea Dutra"
        >
          {albums.map((album) => (
            <SwiperSlide key={album.title}>
              <article className="album-card">
                <div className="album-cover">
                  <Image
                    src={`/images/${album.cover}`}
                    alt={`Capa de ${album.title}`}
                    width={480}
                    height={480}
                    sizes="(max-width: 640px) 70vw, 24vw"
                    loading="lazy"
                  />
                </div>
                <h3 className="album-title">{album.title}</h3>
                <span className="album-year">{album.year}</span>
                <SpotifySearch title={album.title} />
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function QuoteCalculator() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [municipalityError, setMunicipalityError] = useState("");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [requestError, setRequestError] = useState("");
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      state: "",
      city: "",
      postalCode: "",
      eventDate: "",
      eventType: "corporativo",
      guests: 150,
      format: "trio",
      stage: "interno",
      lodging: false,
      airTravel: false,
    },
  });

  const selectedState = watch("state");

  useEffect(() => {
    if (!selectedState) {
      setMunicipalities([]);
      setValue("city", "");
      return;
    }

    const controller = new AbortController();
    setMunicipalityError("");
    setMunicipalities([]);
    setValue("city", "");

    fetch(`/api/municipios?uf=${selectedState}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body: unknown = await response.json();
        if (!response.ok) {
          const error = z
            .object({ error: z.string() })
            .safeParse(body);
          throw new Error(
            error.success
              ? error.data.error
              : "Não foi possível carregar os municípios.",
          );
        }
        const data = z
          .array(z.object({ id: z.number(), nome: z.string() }))
          .parse(body);
        setMunicipalities(data);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMunicipalityError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os municípios.",
        );
      });

    return () => controller.abort();
  }, [selectedState, setValue]);

  async function calculateEstimate(values: QuoteValues) {
    setRequestError("");
    setResult(null);

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body: unknown = await response.json();
      if (!response.ok) {
        const error = z.object({ error: z.string() }).safeParse(body);
        throw new Error(
          error.success
            ? error.data.error
            : "Não foi possível calcular a estimativa.",
        );
      }

      const estimate = z
        .object({
          artistFee: z.number(),
          operationalCosts: z.number(),
          technicalCosts: z.number(),
          logistics: z.number().nullable(),
          minimum: z.number(),
          maximum: z.number(),
          distanceKm: z.number().nullable(),
          pibPerCapita: z.number().nullable(),
          note: z.string(),
          mode: z.enum(["assistida", "orientativa"]),
          distanceSource: z.string(),
          economySource: z.string(),
        })
        .parse(body);
      setResult(estimate);
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível calcular a estimativa.",
      );
    }
  }

  return (
    <section className="quote-section section-space" id="orcamento">
      <div className="section-wrap quote-layout">
        <div className="quote-intro">
          <span className="eyebrow">Comece a planejar</span>
          <h2 className="font-display">Uma primeira ideia, sem compromisso.</h2>
          <p>
            Conte um pouco sobre o evento e veja uma faixa inicial de
            investimento. A proposta definitiva depende da agenda e da
            confirmação da produção.
          </p>
          <p>
            A cidade e o PIB municipal são consultados no IBGE. Distância
            rodoviária e observações por IA só são incluídas quando as
            integrações estiverem configuradas.
          </p>
        </div>

        <form
          className="quote-form-card"
          onSubmit={handleSubmit(calculateEstimate)}
          noValidate
        >
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="state">Estado</label>
              <select id="state" {...register("state")}>
                <option value="">Selecione</option>
                {states.map(([code, name]) => (
                  <option value={code} key={code}>
                    {name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <span className="field-error">{errors.state.message}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="city">Cidade</label>
              <select
                id="city"
                {...register("city")}
                disabled={!selectedState || municipalities.length === 0}
              >
                <option value="">
                  {municipalityError
                    ? "Indisponível"
                    : !selectedState
                      ? "Escolha um estado"
                      : municipalities.length === 0
                        ? "Carregando municípios..."
                        : "Selecione"}
                </option>
                {municipalities.map((municipality) => (
                  <option value={municipality.nome} key={municipality.id}>
                    {municipality.nome}
                  </option>
                ))}
              </select>
              {errors.city && (
                <span className="field-error">{errors.city.message}</span>
              )}
              {municipalityError && (
                <span className="field-error">{municipalityError}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="postalCode">CEP do evento (opcional)</label>
              <input
                id="postalCode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                maxLength={9}
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <span className="field-error">
                  {errors.postalCode.message}
                </span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="eventDate">Data do evento</label>
              <input
                id="eventDate"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                {...register("eventDate")}
              />
              {errors.eventDate && (
                <span className="field-error">{errors.eventDate.message}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="eventType">Tipo de evento</label>
              <select id="eventType" {...register("eventType")}>
                <option value="corporativo">Corporativo</option>
                <option value="festival">Festival</option>
                <option value="cultural">Programação cultural</option>
                <option value="privado">Evento privado</option>
                <option value="teatro">Teatro / casa de espetáculo</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="guests">Número de convidados</label>
              <input
                id="guests"
                type="number"
                min="1"
                max="100000"
                inputMode="numeric"
                {...register("guests")}
              />
              {errors.guests && (
                <span className="field-error">{errors.guests.message}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="format">Formato desejado</label>
              <select id="format" {...register("format")}>
                <option value="duo">Duo</option>
                <option value="trio">Trio</option>
                <option value="quarteto">Quarteto</option>
                <option value="banda">Banda / formação ampliada</option>
              </select>
            </div>

            <div className="form-field full">
              <span className="field-legend">Palco e logística</span>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="stage">Palco</label>
                  <select id="stage" {...register("stage")}>
                    <option value="interno">Ambiente interno</option>
                    <option value="externo">Ambiente externo</option>
                  </select>
                </div>
                <div className="form-field">
                  <span className="field-legend">Necessidades</span>
                  <div className="form-checks">
                    <label className="check-label">
                      <input type="checkbox" {...register("lodging")} />
                      Hospedagem
                    </label>
                    <label className="check-label">
                      <input type="checkbox" {...register("airTravel")} />
                      Transporte aéreo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            className="estimate-submit"
            type="submit"
            disabled={isSubmitting || municipalities.length === 0}
          >
            {isSubmitting ? "Calculando…" : "Ver estimativa preliminar"}
            {!isSubmitting && <ArrowRight size={15} />}
          </Button>
          <p className="estimate-status" aria-live="polite">
            {municipalityError
              ? "A consulta de cidades falhou. Tente novamente mais tarde ou fale diretamente com a produção."
              : requestError}
          </p>
          {result && (
            <div className="estimate-result" aria-live="polite">
              <h3>
                Estimativa{" "}
                {result.mode === "assistida" ? "com apoio de IA" : "orientativa"}
              </h3>
              <p className="estimate-range">
                {formatCurrency(result.minimum)} – {formatCurrency(result.maximum)}
              </p>
              <div
                className="estimate-chart"
                aria-hidden="true"
              >
                <ResponsiveContainer width="100%" height={144}>
                  <BarChart
                    data={[
                      { name: "Artístico", amount: result.artistFee },
                      { name: "Operacional", amount: result.operationalCosts },
                      { name: "Técnico", amount: result.technicalCosts },
                      { name: "Logística", amount: result.logistics ?? 0 },
                    ]}
                    layout="vertical"
                    margin={{ top: 4, right: 12, bottom: 4, left: 4 }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke="#dedbd2"
                      strokeDasharray="3 3"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={82}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#68665f", fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(101, 197, 186, 0.12)" }}
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Bar dataKey="amount" barSize={15} radius={[0, 5, 5, 0]}>
                      {["#d85b4a", "#65c5ba", "#c8ae7b", "#77756f"].map(
                        (color) => (
                          <Cell fill={color} key={color} />
                        ),
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="estimate-lines">
                <div>
                  <span>Cachê artístico</span>
                  <strong>{formatCurrency(result.artistFee)}</strong>
                </div>
                <div>
                  <span>Custos operacionais</span>
                  <strong>{formatCurrency(result.operationalCosts)}</strong>
                </div>
                <div>
                  <span>Custos técnicos</span>
                  <strong>{formatCurrency(result.technicalCosts)}</strong>
                </div>
                <div>
                  <span>PIB per capita · {result.economySource}</span>
                  <strong>
                    {result.pibPerCapita === null
                      ? "Série indisponível"
                      : formatCurrency(result.pibPerCapita)}
                  </strong>
                </div>
                <div>
                  <span>Logística</span>
                  <strong>
                    {result.logistics === null
                      ? "A confirmar com a produção"
                      : formatCurrency(result.logistics)}
                  </strong>
                </div>
                {result.distanceKm !== null && (
                  <div>
                    <span>Distância estimada por estrada</span>
                    <strong>
                      {result.distanceKm.toLocaleString("pt-BR")} km ·{" "}
                      {result.distanceSource}
                    </strong>
                  </div>
                )}
              </div>
              <p className="estimate-note">{result.note}</p>
              <a
                className="button-primary mt-4 w-full"
                href={emailLink(
                  `Proposta de show — ${watch("city")}, ${watch("state")}`,
                )}
              >
                Conversar com a produção <ArrowRight size={14} />
              </a>
            </div>
          )}
          <p className="mt-3 text-[0.63rem] leading-relaxed text-[#77756f]">
            Faixas meramente referenciais, calculadas com parâmetros de partida
            que precisam ser validados pela produção. A simulação não consulta
            PIB e não substitui uma proposta comercial.
          </p>
        </form>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="faq-section section-space" id="perguntas">
      <div className="section-wrap faq-grid">
        <div className="section-heading">
          <span className="eyebrow">Tudo o que você precisa saber</span>
          <h2 className="font-display">Perguntas frequentes</h2>
          <p>
            A produção está à disposição para ajudar a encontrar o melhor
            formato para o seu evento.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
      <section className="final-cta section-space">
        <div className="section-wrap final-cta-inner">
          <span className="eyebrow">Uma trilha para a sua ocasião</span>
          <h2 className="font-display">
            Vamos criar uma experiência musical inesquecível?
          </h2>
          <p>
            Conte sobre o seu evento. A produção retorna com uma conversa
            próxima e uma proposta feita para a ocasião.
          </p>
          <div className="final-cta-actions">
            <a
              className="button-primary"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp <ArrowRight size={15} />
            </a>
            <a className="button-quiet" href="#orcamento">
              Solicitar orçamento
            </a>
            <a
              className="button-quiet"
              href={emailLink("Proposta de show — Andrea Dutra")}
            >
              Enviar e-mail
            </a>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="section-wrap">
          <div className="footer-inner">
            <div>
              <Link href="#inicio" className="wordmark">
                andrea <span>dutra</span>
              </Link>
              <p className="footer-note">
                Samba · jazz · soul · música brasileira
              </p>
            </div>
            <nav className="footer-socials" aria-label="Redes sociais">
              <a
                href="https://www.instagram.com/andreadutra/"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram size={14} className="inline-block align-[-2px]" />{" "}
                Instagram
              </a>
              <a href={youtubeUrl} target="_blank" rel="noreferrer">
                YouTube
              </a>
              <a
                href="https://www.facebook.com/andreadutra.cantora"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </nav>
            <a className="footer-email" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          </div>
          <p className="footer-note mt-7">
            © {new Date().getFullYear()} Andrea Dutra. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </>
  );
}

export default function LandingPage() {
  return (
    <>
      <a
        href="#conteudo"
        className="absolute left-3 top-3 z-50 -translate-y-20 rounded-full bg-white px-4 py-3 text-sm text-black focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Hero />
      <main id="conteudo">
        <ProofStrip />
        <VideoSection />
        <Biography />
        <Projects />
        <Gallery />
        <Discography />
        <QuoteCalculator />
        <Faq />
        <Footer />
        </main>
    </>
  );
}
