import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Andrea Dutra | Shows, samba, jazz e música brasileira",
  description:
    "Leve a voz e a presença de Andrea Dutra para o seu evento. Shows de samba, jazz, soul e MPB para eventos corporativos, festivais e projetos culturais.",
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    ...(siteUrl ? { url: siteUrl } : {}),
    siteName: "Andrea Dutra",
    title: "Andrea Dutra — música que cria encontros",
    description:
      "Samba, jazz, soul e MPB. Conheça os projetos e solicite uma proposta para o seu evento.",
    ...(siteUrl
      ? {
          images: [
            {
              url: "/images/press-02-01.webp",
              width: 1840,
              height: 2261,
              alt: "Andrea Dutra cantando ao vivo",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrea Dutra | Shows e eventos",
    description:
      "Uma voz, muitas histórias. Shows de samba, jazz, soul e MPB para o seu evento.",
    ...(siteUrl ? { images: ["/images/press-02-01.webp"] } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#10100f",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
