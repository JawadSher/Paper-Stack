import { useEffect, useMemo, useState } from "react";

import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import { useDebounce } from "@/hooks/useDebounce";
import type { Board, ClassLevel, Paper, Subject } from "@/types";

export interface SearchFilters {
  boardIds: Board["id"][];
  classes: ClassLevel[];
  subjectIds: Subject["id"][];
  years: number[];
  paperTypes: NonNullable<Paper["session"]>[];
}

export interface SearchPaperResult {
  paper: Paper;
  board: Board;
  subject: Subject;
}

const years = [2024, 2023, 2022, 2021, 2020, 2019];
const sessions: NonNullable<Paper["session"]>[] = ["annual", "supplementary"];

export const emptySearchFilters: SearchFilters = {
  boardIds: [],
  classes: [],
  subjectIds: [],
  years: [],
  paperTypes: [],
};

export const searchDataset: SearchPaperResult[] = boards.flatMap((board) =>
  subjects
    .filter((subject) => board.classes.includes(subject.classLevel))
    .flatMap((subject) =>
      years.flatMap((year) =>
        sessions.map((session) => ({
          board,
          subject,
          paper: {
            id: `search-${board.id}-${subject.id}-${year}-${session}`,
            title: `${subject.name} ${year} ${session === "annual" ? "Annual" : "Supplementary"} Paper`,
            boardId: board.id,
            subjectId: subject.id,
            classLevel: subject.classLevel,
            year,
            session,
            pdfUrl: `https://example.com/papers/${board.id}/${subject.classLevel}/${subject.id}/${year}-${session}.pdf`,
            fileSizeBytes: 1024 * 1024 * (2 + ((year + board.id.length + subject.name.length) % 5)),
            createdAt: new Date(year, session === "annual" ? 5 : 10, 12).toISOString(),
            updatedAt: new Date(year, session === "annual" ? 5 : 10, 12).toISOString(),
          },
        })),
      ),
    ),
);

export function getActiveFilterCount(filters: SearchFilters) {
  return (
    filters.boardIds.length +
    filters.classes.length +
    filters.subjectIds.length +
    filters.years.length +
    filters.paperTypes.length
  );
}

export function useSearch(query: string, filters: SearchFilters) {
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [query, filters]);

  const results = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    return searchDataset.filter(({ paper, board, subject }) => {
      const searchable = [
        subject.name,
        board.name,
        board.shortName,
        String(paper.year),
        paper.session === "annual" ? "annual" : "supplementary",
      ]
        .join(" ")
        .toLowerCase();
      const queryMatches = !normalizedQuery || searchable.includes(normalizedQuery);
      const boardMatches = filters.boardIds.length === 0 || filters.boardIds.includes(board.id);
      const classMatches =
        filters.classes.length === 0 || filters.classes.includes(paper.classLevel);
      const subjectMatches =
        filters.subjectIds.length === 0 || filters.subjectIds.includes(subject.id);
      const yearMatches = filters.years.length === 0 || filters.years.includes(paper.year);
      const typeMatches =
        filters.paperTypes.length === 0 || filters.paperTypes.includes(paper.session ?? "annual");

      return (
        queryMatches &&
        boardMatches &&
        classMatches &&
        subjectMatches &&
        yearMatches &&
        typeMatches
      );
    });
  }, [debouncedQuery, filters]);

  return {
    results,
    isLoading,
    totalCount: results.length,
  };
}
