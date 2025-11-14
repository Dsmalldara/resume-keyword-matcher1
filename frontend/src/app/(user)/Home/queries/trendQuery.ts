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
      console.log("Fetching trend data with limit:", limit);
      return customInstance({
        url: `/analysis/trend?limit=${limit}`,
        method: "GET",
      });
    },
  });
};

export default useGetTrendQuery;
