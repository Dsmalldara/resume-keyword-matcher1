"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for longer
            gcTime: 10 * 60 * 1000, // 10 minutes - cache persists longer in memory
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            refetchOnReconnect: "always", // Refetch when reconnecting to network
            retry: 1, // Retry failed requests once
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
