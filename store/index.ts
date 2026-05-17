import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ClassLevel, Download, ThemePreference, UserPreferences } from "@/types";

interface PaperStackState {
  userPreferences: UserPreferences;
  downloads: Record<string, Download>;
  downloadProgress: Record<string, number>;
  bookmarkedPaperIds: Set<string>;
  setSelectedBoard: (boardId?: string) => void;
  setSelectedClass: (classLevel?: ClassLevel) => void;
  setTheme: (theme: ThemePreference) => void;
  addDownload: (download: Download) => void;
  removeDownload: (paperId: string) => void;
  setDownloadProgress: (paperId: string, progress: number) => void;
  clearDownloadProgress: (paperId: string) => void;
  toggleBookmark: (paperId: string) => void;
  hydrateStore: () => void;
}

const initialPreferences: UserPreferences = {
  theme: "system",
};

type PersistedPaperStackState = Pick<
  PaperStackState,
  "userPreferences" | "downloads"
> & {
  bookmarkedPaperIds: string[];
};

export const usePaperStackStore = create<PaperStackState>()(
  persist(
    (set) => ({
      userPreferences: initialPreferences,
      downloads: {},
      downloadProgress: {},
      bookmarkedPaperIds: new Set<string>(),
      setSelectedBoard: (boardId) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            selectedBoard: boardId,
          },
        })),
      setSelectedClass: (classLevel) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            selectedClass: classLevel,
          },
        })),
      setTheme: (theme) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            theme,
          },
        })),
      addDownload: (download) =>
        set((state) => ({
          downloads: {
            ...state.downloads,
            [download.paperId]: download,
          },
        })),
      removeDownload: (paperId) =>
        set((state) => {
          const { [paperId]: _removed, ...downloads } = state.downloads;
          return { downloads };
        }),
      setDownloadProgress: (paperId, progress) =>
        set((state) => ({
          downloadProgress: {
            ...state.downloadProgress,
            [paperId]: Math.max(0, Math.min(progress, 1)),
          },
        })),
      clearDownloadProgress: (paperId) =>
        set((state) => {
          const { [paperId]: _removed, ...downloadProgress } =
            state.downloadProgress;
          return { downloadProgress };
        }),
      toggleBookmark: (paperId) =>
        set((state) => {
          const bookmarkedPaperIds = new Set(state.bookmarkedPaperIds);

          if (bookmarkedPaperIds.has(paperId)) {
            bookmarkedPaperIds.delete(paperId);
          } else {
            bookmarkedPaperIds.add(paperId);
          }

          return { bookmarkedPaperIds };
        }),
      hydrateStore: () => {
        usePaperStackStore.persist.rehydrate();
      },
    }),
    {
      name: "paper-stack-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        ({
          userPreferences: state.userPreferences,
          downloads: state.downloads,
          bookmarkedPaperIds: Array.from(state.bookmarkedPaperIds),
        }) as PersistedPaperStackState,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as PersistedPaperStackState | undefined;

        return {
          ...currentState,
          ...persisted,
          downloadProgress: {},
          bookmarkedPaperIds: new Set(persisted?.bookmarkedPaperIds ?? []),
        };
      },
    },
  ),
);
