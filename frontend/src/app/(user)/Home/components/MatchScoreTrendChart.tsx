"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useGetTrendQuery from "../queries/trendQuery";

interface TrendData {
  date: string;
  matchScore: number;
}

export function MatchScoreTrendChart() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: trendRecords } = useGetTrendQuery(30);

  useEffect(() => {
    if (trendRecords) {
      console.log("Trend records fetched:", trendRecords);
      // Transform trend data into chart format
      const sorted = trendRecords.map((record) => ({
        date: new Date(record.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        matchScore: record.matchPercentage || 0,
      }));

      setTrendData(sorted);
      setIsLoading(false);
    }
  }, [trendRecords]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-slate-500">Loading chart...</p>
      </div>
    );
  }

  if (!trendData || trendData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-slate-500">No match score data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={trendData}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
        <YAxis
          stroke="#94a3b8"
          style={{ fontSize: "12px" }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
          formatter={(value) => [`${value}%`, "Match Score"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="matchScore"
          stroke="#3b82f6"
          dot={{ fill: "#3b82f6", r: 4 }}
          activeDot={{ r: 6 }}
          strokeWidth={2}
          name="Match Score"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
