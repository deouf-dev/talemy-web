"use client";
import { useState, useEffect } from "react";
import { AuthContextValue, AuthContext } from "./AuthContext";
import { getToken, setToken, clearToken } from "./token";
import { apiFetch } from "@/lib/api/apiFetch";
import { User } from "../profile/types";
import { fetchMe } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthContextValue["status"]>("anonymous");
  const [user, setUser] = useState<User | null>(null);
  const token = getToken();

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchMe(token)
        .then((data) => {
          setUser(data.user);
          setStatus("authenticated");
        })
        .catch(() => {
          logout();
        });
    } else {
      setStatus("anonymous");
    }
  }, []);

  const login = (newToken: string, user: User) => {
    setToken(newToken);
    setStatus("loading");
    setUser(user);
    fetchMe(newToken)
      .then((data) => {
        setUser(data.user);
        setStatus("authenticated");
      })
      .catch(() => {
        logout();
      });
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setStatus("anonymous");
  };

  return (
    <AuthContext.Provider value={{ status, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
