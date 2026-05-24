import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchAllSubjects, fetchSubjectsByBoardClass } from "@/lib/queries";

export function useAllSubjects() {
  return useQuery({
    queryKey: queryKeys.subjects.all(),
    queryFn: fetchAllSubjects,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubjectsByBoardClass(boardId: string, classLevel: number) {
  return useQuery({
    queryKey: queryKeys.subjects.byBoardClass(boardId, classLevel),
    queryFn: () => fetchSubjectsByBoardClass(boardId, classLevel),
    enabled: !!boardId && !!classLevel,
    staleTime: 5 * 60 * 1000,
  });
}
