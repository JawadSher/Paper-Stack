export const queryKeys = {
  boards: {
    all: () => ["boards"] as const,
    list: (search?: string) => ["boards", "list", search ?? ""] as const,
    grouped: () => ["boards", "grouped"] as const,
    detail: (id: string) => ["boards", "detail", id] as const,
  },
  subjects: {
    all: () => ["subjects"] as const,
    byBoardClass: (boardId: string, classLevel: number) =>
      ["subjects", "board-class", boardId, classLevel] as const,
  },
  papers: {
    bySubject: (
      boardId: string,
      subjectId: string,
      classLevel: number,
      year?: number,
      session?: string,
    ) => ["papers", "subject", boardId, subjectId, classLevel, year ?? "all", session ?? "all"] as const,
    detail: (id: string) => ["papers", "detail", id] as const,
    search: (q: string, filters: Record<string, unknown>) =>
      ["papers", "search", q, filters] as const,
    recent: () => ["papers", "recent"] as const,
    byIds: (ids: string[]) => ["papers", "by-ids", [...ids].sort().join(",")] as const,
  },
  questions: {
    list: (filters: Record<string, unknown>) => ["questions", "list", filters] as const,
  },
  settings: {
    flags: () => ["settings", "flags"] as const,
  },
} as const;
