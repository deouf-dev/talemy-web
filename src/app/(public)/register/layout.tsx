import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte Talemy et commencez à apprendre.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
