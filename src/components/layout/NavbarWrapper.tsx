"use client";

import { useAuth } from "@/features/auth/AuthContext";
import { Navbar } from "./Navbar";

export function NavbarWrapper() {
  const { user, status } = useAuth();

  return <Navbar user={user} status={status} />;
}
