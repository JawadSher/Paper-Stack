import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  ClassLevel,
  Download,
  Paper,
  TextSizePreference,
  ThemePreference,
  UserPreferences,
} from "@/types";

interface PaperStackState {
  userPreferences: UserPreferences;
  downloads: Record<string, Download>;
  downloadProgress: Record<string, number>;
  bookmarkedPapers: Map<string, Paper>;
  setSelectedBoard: (boardId?: string) => void;
  setSelectedBoards: (boardIds: string[]) => void;
  setSelectedClass: (classLevel?: ClassLevel) => void;
  setTheme: (theme: ThemePreference) => void;
  setTextSize: (textSize: TextSizePreference) => void;
  addDownload: (download: Download) => void;
  removeDownload: (paperId: string) => void;
  clearDownloads: () => void;
  setDownloadProgress: (paperId: string, progress: number) => void;
  clearDownloadProgress: (paperId: string) => void;
  toggleBookmark: (paperId: string, paper: Paper) => void;
  hydrateStore: () => void;
}

const initialPreferences: UserPreferences = {
  theme: "system",
  textSize: "medium",
};

type PersistedPaperStackState = Pick<
  PaperStackState,
  "userPreferences" | "downloads"
> & {
  bookmarkedPapers: [string, Paper][];
};

export const usePaperStackStore = create<PaperStackState>()(
  persist(
    (set) => ({
      userPreferences: initialPreferences,
      downloads: {},
      downloadProgress: {},
      bookmarkedPapers: new Map<string, Paper>(),
      setSelectedBoard: (boardId) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            selectedBoard: boardId,
            selectedBoards: boardId ? [boardId] : [],
          },
        })),
      setSelectedBoards: (boardIds) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            selectedBoard: boardIds[0],
            selectedBoards: boardIds,
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
      setTextSize: (textSize) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            textSize,
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
      clearDownloads: () => set({ downloads: {}, downloadProgress: {} }),
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
      toggleBookmark: (paperId, paper) =>
        set((state) => {
          const bookmarkedPapers = new Map(state.bookmarkedPapers);

          if (bookmarkedPapers.has(paperId)) {
            bookmarkedPapers.delete(paperId);
          } else {
            bookmarkedPapers.set(paperId, paper);
          }

          return { bookmarkedPapers };
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
          bookmarkedPapers: Array.from(state.bookmarkedPapers.entries()),
        }) as PersistedPaperStackState,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as PersistedPaperStackState | undefined;

        return {
          ...currentState,
          ...persisted,
          downloadProgress: {},
          bookmarkedPapers: new Map(persisted?.bookmarkedPapers ?? []),
        };
      },
    },
  ),
);
