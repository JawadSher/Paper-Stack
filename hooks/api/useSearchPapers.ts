import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/hooks/useDebounce";
import { queryKeys } from "@/lib/query-keys";
import { searchPapers } from "@/lib/queries";

export type MobileSearchFilters = {
  boardId?: string;
  subjectId?: string;
  classLevel?: number;
  year?: number;
  session?: string;
};

export function useSearchPapers(
  query: string,
  filters: MobileSearchFilters = {},
  page = 1,
) {
  const debouncedQuery = useDebounce(query, 350);

  return useQuery({
    queryKey: queryKeys.papers.search(debouncedQuery, { ...filters, page }),
    queryFn: () => searchPapers(debouncedQuery, filters, page),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}
