"use client";
import { useAuth } from "@/features/auth/AuthContext";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardPage from "./dashboard/page";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "anonymous") {
      setLoading(false);
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [status, router]);
  return (
    <>
      {loading || status === "loading" ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
