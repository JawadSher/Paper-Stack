import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchFeatureFlags } from "@/lib/queries";

export function useFeatureFlags() {
  return useQuery({
    queryKey: queryKeys.settings.flags(),
    queryFn: fetchFeatureFlags,
    staleTime: 10 * 60 * 1000,
  });
}
