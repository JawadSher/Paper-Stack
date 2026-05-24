import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  fetchPaperById,
  fetchPapersByIds,
  fetchPapersBySubject,
  fetchRecentPapers,
} from "@/lib/queries";

export function usePapersBySubject(
  boardId: string,
  subjectId: string,
  classLevel: number,
  yearFilter?: number,
  sessionFilter?: string,
) {
  return useQuery({
    queryKey: queryKeys.papers.bySubject(
      boardId,
      subjectId,
      classLevel,
      yearFilter,
      sessionFilter,
    ),
    queryFn: () =>
      fetchPapersBySubject(boardId, subjectId, classLevel, yearFilter, sessionFilter),
    enabled: !!boardId && !!subjectId && !!classLevel,
  });
}

export function usePaper(id: string) {
  return useQuery({
    queryKey: queryKeys.papers.detail(id),
    queryFn: () => fetchPaperById(id),
    enabled: !!id,
  });
}

export function useRecentPapers(limit = 10) {
  return useQuery({
    queryKey: queryKeys.papers.recent(),
    queryFn: () => fetchRecentPapers(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePapersByIds(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.papers.byIds(ids),
    queryFn: () => fetchPapersByIds(ids),
    enabled: ids.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}
