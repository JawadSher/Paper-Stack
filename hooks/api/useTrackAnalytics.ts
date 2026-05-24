import { useMutation } from "@tanstack/react-query";

import { trackDownload, trackView } from "@/lib/queries";

export function useTrackAnalytics() {
  return useMutation({
    mutationFn: ({
      paperId,
      event,
    }: {
      paperId: string;
      event: "view" | "download";
    }) => (event === "view" ? trackView(paperId) : trackDownload(paperId)),
    onError: () => {},
    retry: 0,
  });
}
