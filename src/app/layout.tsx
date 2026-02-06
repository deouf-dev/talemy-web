import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Talemy - Plateforme de cours particuliers",
    template: "%s | Talemy",
  },
  description:
    "Trouvez les meilleurs professeurs pour des cours particuliers adaptés à vos besoins. Réservez facilement vos cours en ligne.",
  keywords: [
    "cours particuliers",
    "professeurs",
    "éducation",
    "apprentissage",
    "soutien scolaire",
  ],
  authors: [{ name: "deouf-dev" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://talemy-web-92f3728ee5b0.herokuapp.com",
    siteName: "Talemy",
    title: "Talemy - Plateforme de cours particuliers",
    description:
      "Trouvez les meilleurs professeurs pour des cours particuliers adaptés à vos besoins.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Talemy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talemy - Plateforme de cours particuliers",
    description:
      "Trouvez les meilleurs professeurs pour des cours particuliers adaptés à vos besoins.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AppProviders>
          <NavbarWrapper />
          <div className="pt-16">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
