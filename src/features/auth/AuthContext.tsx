"use client";
import { createContext, useContext } from "react";
import { Role } from "@/lib/auth/roles";
import { clearToken, getToken, setToken } from "./token";
import { User } from "../profile/types";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
