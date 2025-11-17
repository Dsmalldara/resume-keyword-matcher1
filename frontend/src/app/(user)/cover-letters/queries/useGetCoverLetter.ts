import { queryKeys } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getCoverlettersLetters,
  getCoverlettersLettersSingleId,
} from "@/api/generated/cover-letters/cover-letters";
import { GetCoverlettersLettersParams } from "@/api/models";
export const useGetIndividualLetter = (coverLetterId?: string) => {
  return useQuery({
    queryKey: [
      queryKeys.coverletters,
      queryKeys.coverletters[1],
      coverLetterId,
    ],

    queryFn: () => {
      return getCoverlettersLettersSingleId(coverLetterId || "");
    },
  });
};

export const useGetCoverLetters = (params?: GetCoverlettersLettersParams) => {
  return useQuery({
    queryKey: [
      queryKeys.coverletters,
      params?.page ?? 1,
      params?.perPage ?? 10,
    ],
    queryFn: () => getCoverlettersLetters(params),
  });
};
