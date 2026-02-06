"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { SocketProvider } from "@/lib/socket/SocketProvider";
import { useState } from "react";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>{children}</SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
