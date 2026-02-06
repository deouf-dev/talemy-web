import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes cours",
  description: "Consultez l'historique de vos cours.",
};

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
