import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trouver un professeur",
  description:
    "Parcourez notre sélection de professeurs qualifiés et trouvez celui qui correspond à vos besoins.",
};

export default function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
