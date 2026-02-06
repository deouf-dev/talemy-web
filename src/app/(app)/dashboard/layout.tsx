import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Gérez vos cours, disponibilités et messages sur Talemy.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <DashboardHeader />
      <main className="lg:ml-64 mt-16 lg:mt-32 p-4 sm:p-6">{children}</main>
    </div>
  );
}
