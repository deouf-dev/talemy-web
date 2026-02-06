"use client";

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
import { useAuth } from "@/features/auth/AuthContext";

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
    roles: ["TEACHER"], // Only for teachers
  },
  {
    href: "/dashboard/profile",
    label: "Profil",
    icon: User,
    roles: ["TEACHER"], // Only for teachers
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleMenuItems = menuItems.filter(
    (item) => !user?.role || item.roles.includes(user.role),
  );

  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-card border-r overflow-y-auto">
      <nav className="p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}
