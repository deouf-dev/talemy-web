import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emploi du temps",
  description: "Gérez votre emploi du temps et vos disponibilités.",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
