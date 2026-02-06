import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";

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
