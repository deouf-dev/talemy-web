import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <DashboardHeader />
      <main className="ml-64 mt-32 p-6">{children}</main>
    </div>
  );
}
