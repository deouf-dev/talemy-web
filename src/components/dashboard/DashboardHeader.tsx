"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/AuthContext";

export function DashboardHeader() {
  const { user } = useAuth();
  return (
    <header className="fixed top-16 left-64 right-0 h-16 bg-background border-b z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.name} {user?.surname}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role === "TEACHER" ? "Professeur" : "Élève"}
            </p>
          </div>
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {`${user?.name} ${user?.surname}`
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
