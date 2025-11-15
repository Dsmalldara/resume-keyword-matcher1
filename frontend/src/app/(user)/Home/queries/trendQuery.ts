import { useQuery } from "@tanstack/react-query";
import { customInstance } from "@/api/client";

interface TrendRecord {
  id: string;
  createdAt: string;
  matchPercentage: number;
  jobTitle: string;
}

export const useGetTrendQuery = (limit: number = 30) => {
  return useQuery({
    queryKey: ["analysis", "trend", limit],
    queryFn: async (): Promise<TrendRecord[]> => {
      return customInstance({
        url: `/analysis/trend?limit=${limit}`,
        method: "GET",
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useGetTrendQuery;
