import LandingPage from "@/components/landing-page";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "#andrea",
      name: "Andrea Dutra",
      jobTitle: "Cantora e compositora",
      description:
        "Cantora brasileira de samba, jazz, soul e MPB. Integrante do Arranco de Varsóvia desde 2001 e da Orquestra Lunar desde 2016.",
      image: "/images/press-02-01.webp",
      email: "codaprod@gmail.com",
      sameAs: [
        "https://www.instagram.com/andreadutra/",
        "https://www.youtube.com/@andreadutraCantora",
        "https://www.facebook.com/andreadutra.cantora",
      ],
      knowsAbout: ["Samba", "Jazz", "Soul", "MPB", "Música brasileira"],
    },
    {
      "@type": "MusicGroup",
      name: "Arranco de Varsóvia",
      description:
        "Grupo de samba de raiz do qual Andrea Dutra é integrante desde 2001.",
      member: { "@id": "#andrea" },
      award: "Prêmio TIM de Melhor Grupo de Samba, 2006",
    },
    {
      "@type": "MusicGroup",
      name: "Orquestra Lunar",
      description:
        "Grupo musical do qual Andrea Dutra é cantora desde 2016.",
      member: { "@id": "#andrea" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Como contratar um show?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Conte à produção a data, a cidade, o tipo de evento e o formato desejado. A equipe confirma disponibilidade e envia uma proposta personalizada.",
          },
        },
        {
          "@type": "Question",
          name: "Com quanta antecedência devo entrar em contato?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Quanto antes, melhor — especialmente para festivais, teatros, programações culturais e eventos em datas concorridas. A disponibilidade é confirmada caso a caso.",
          },
        },
        {
          "@type": "Question",
          name: "Quais formatos estão disponíveis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Há projetos em duo, trio, quarteto e formações ampliadas, incluindo a Orquestra Lunar. A formação depende do projeto e da ocasião.",
          },
        },
        {
          "@type": "Question",
          name: "Andrea Dutra atende eventos em todo o Brasil?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Eventos em diferentes cidades são avaliados mediante consulta de agenda e logística.",
          },
        },
        {
          "@type": "Question",
          name: "Há shows para eventos corporativos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Os repertórios e formatos podem ser adequados a eventos corporativos, festivais, teatros, programações culturais e eventos privados.",
          },
        },
        {
          "@type": "Question",
          name: "É possível criar um projeto personalizado?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. A produção pode conversar sobre repertório, formação e contexto do evento para avaliar uma proposta personalizada.",
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage />
    </>
  );
}
