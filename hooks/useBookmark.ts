import { usePaperStackStore } from "@/store";
import type { Paper } from "@/types";

export function useBookmark(paperId: Paper["id"]) {
  const isBookmarked = usePaperStackStore((state) => state.bookmarkedPaperIds.has(paperId));
  const toggleBookmarkInStore = usePaperStackStore((state) => state.toggleBookmark);

  return {
    isBookmarked,
    toggleBookmark: () => toggleBookmarkInStore(paperId),
  };
}
