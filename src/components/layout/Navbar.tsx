"use client";
import Link from "next/link";
import type { AuthStatus } from "@/features/auth/AuthContext";
import { User } from "@/features/profile/types";

export function Navbar({
  user,
  status,
}: {
  user: User | null;
  status: AuthStatus;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Talemy */}
        <Link
          href="/"
          className="h-10 w-fit px-4 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold transition-all duration-300 hover:scale-105 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20"
        >
          Talemy
        </Link>
        <div className="flex items-center gap-4">
          {status === "authenticated" && user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Bonjour, {user.name}
              </span>
              <Link
                href={"/dashboard"}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
              >
                {"Tableau de bord"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
