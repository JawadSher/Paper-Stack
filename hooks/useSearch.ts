// Replaced with Supabase-backed search
import type { Board, ClassLevel, Paper, Subject } from "@/types";

export interface SearchFilters {
  boardIds: Board["id"][];
  classes: ClassLevel[];
  subjectIds: Subject["id"][];
  years: number[];
  paperTypes: NonNullable<Paper["session"]>[];
}

export const emptySearchFilters: SearchFilters = {
  boardIds: [],
  classes: [],
  subjectIds: [],
  years: [],
  paperTypes: [],
};

export { useSearchPapers as useSearch } from "@/hooks/api/useSearchPapers";
