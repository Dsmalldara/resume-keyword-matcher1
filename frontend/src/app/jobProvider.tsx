"use client"
import React, { createContext, useContext, useState, useEffect } from "react";

type JobDataType = {
  jobDescription: string;
  jobTitle?: string;
  company?: string;
};

type JobContextType = {
  jobData: JobDataType | null;
  updateJobData: (partial: Partial<JobDataType>) => void;
  clearJobData: () => void;
};

const JobContext = createContext<JobContextType | null>(null);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobData, setJobData] = useState<JobDataType | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("jobData");
    if (stored) {
      try {
        setJobData(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse stored job data:", error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever jobData changes
  useEffect(() => {
    if (isHydrated) {
      if (jobData) {
        localStorage.setItem("jobData", JSON.stringify(jobData));
      } else {
        localStorage.removeItem("jobData");
      }
    }
  }, [jobData, isHydrated]);

   const updateJobData = (partial: Partial<JobDataType>) => {
    setJobData((prev) => ({ ...prev, ...partial } as JobDataType));
  };

  const clearJobData = () => {
    setJobData(null);
  };

  return (
    <JobContext.Provider value={{ jobData, updateJobData, clearJobData }}>
      {children}
    </JobContext.Provider>
  );
}

export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJob must be used inside <JobProvider>");
  }
  return context;
};