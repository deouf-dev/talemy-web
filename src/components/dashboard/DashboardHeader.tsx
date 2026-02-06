"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    roles: ["STUDENT", "TEACHER"],
  },
  {
    href: "/dashboard/schedule",
    label: "Emploi du temps",
    icon: Calendar,
    roles: ["STUDENT", "TEACHER"],
  },
  {
    href: "/dashboard/lessons",
    label: "Cours",
    icon: BookOpen,
    roles: ["STUDENT", "TEACHER"],
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: MessageSquare,
    roles: ["STUDENT", "TEACHER"],
  },
  {
    href: "/dashboard/reviews",
    label: "Avis",
    icon: Star,
    roles: ["TEACHER"],
  },
  {
    href: "/dashboard/profile",
    label: "Profil",
    icon: User,
    roles: ["TEACHER"],
  },
];

export function DashboardHeader() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const visibleMenuItems = menuItems.filter(
    (item) => !user?.role || item.roles.includes(user.role),
  );

  return (
    <header className="fixed top-16 left-0 lg:left-64 right-0 h-16 bg-background border-b z-10">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Mobile menu button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <nav className="p-4 space-y-2 mt-4">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-3 ml-auto">
          <div className="text-right hidden sm:block">
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
