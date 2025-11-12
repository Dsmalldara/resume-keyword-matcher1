import { useFetchResumes } from "@/app/(user)/Home/queries/resumeQuery";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: any): string => {
  const errorMessage =
    error?.response?.data?.error || // JSON error object
    error?.response?.data || // Plain text/HTML response
    error?.message || // Network errors
    "An error occurred";

  // Ensure we return a string
  return typeof errorMessage === "string"
    ? errorMessage
    : JSON.stringify(errorMessage);
};


type queryKeysType ={
  activity: string;
    resume: string;
    job: string;
    profile: string;
    insights: string;
    analysis: ('best-match' | 'improvement' | 'jobs-analyzed')[];
    coverletters: ('coverletters-list' | 'coverletter-detail')[];
}

export const queryKeys:queryKeysType = {
  activity: 'activity',
  resume: 'resume',
  job: 'job',
  profile: 'profile',
  insights: `insights`,
  analysis:[
    'best-match',
    'improvement',
    'jobs-analyzed'
  ],
  coverletters:[
    'coverletters-list',
    'coverletter-detail'
  ]

};


