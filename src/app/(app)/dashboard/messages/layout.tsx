import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description: "Consultez et gérez vos conversations.",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
