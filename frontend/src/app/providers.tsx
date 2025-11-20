"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000, // 10 minutes - Data is considered 'fresh' for this period.
            // No fetch will occur, even on mount/focus, if within this time.
            gcTime: 30 * 60 * 1000, // 30 minutes - Cache remains in memory (inactive) before being garbage collected.

            refetchOnMount: false, // Prevents refetch when a component remounts (like on navigation back).
            refetchOnWindowFocus: false, // Prevents refetch when the user switches tabs and returns.
            refetchOnReconnect: false,

            retry: 1,
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
