import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchBoardById, fetchBoards, fetchBoardsByProvince } from "@/lib/queries";

export function useBoards(search?: string) {
  return useQuery({
    queryKey: queryKeys.boards.list(search),
    queryFn: () => fetchBoards(search),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBoardsByProvince() {
  return useQuery({
    queryKey: queryKeys.boards.grouped(),
    queryFn: fetchBoardsByProvince,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: queryKeys.boards.detail(id),
    queryFn: () => fetchBoardById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
