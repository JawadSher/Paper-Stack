// LEGACY — paper generation removed, types kept for UI compat
import { boards } from "@/constants/boards";
import { subjects, subjectsByClass } from "@/constants/subjects";
import type { ClassLevel, Subject } from "@/types";

export type PaperTypeFilter = "annual" | "supplementary" | "all";
export type YearFilter = "all" | 2024 | 2023 | 2022 | 2021 | 2020 | 2019;

export const paperYears: Exclude<YearFilter, "all">[] = [2024, 2023, 2022, 2021, 2020, 2019];

export function getBoard(boardId?: string | string[]) {
  const id = Array.isArray(boardId) ? boardId[0] : boardId;
  return boards.find((board) => board.id === id);
}

export function getClassLevel(classId?: string | string[]): ClassLevel | undefined {
  const value = Number(Array.isArray(classId) ? classId[0] : classId);
  return value === 9 || value === 10 || value === 11 || value === 12 ? value : undefined;
}

export function getSubject(classLevel?: ClassLevel, subjectId?: string | string[]) {
  const id = Array.isArray(subjectId) ? subjectId[0] : subjectId;
  return classLevel ? subjectsByClass[classLevel].find((subject) => subject.id === id) : undefined;
}

export function sortSubjects(subjects: Subject[]) {
  const compulsory = new Set(["English", "Urdu", "Islamiat"]);

  return [...subjects].sort((left, right) => {
    const leftCompulsory = compulsory.has(left.name);
    const rightCompulsory = compulsory.has(right.name);

    if (leftCompulsory !== rightCompulsory) {
      return leftCompulsory ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });
}

export function getSubjectById(subjectId?: string | string[]) {
  const id = Array.isArray(subjectId) ? subjectId[0] : subjectId;
  return subjects.find((subject) => subject.id === id);
}

export function formatFileSize(bytes?: number | null) {
  if (!bytes || bytes <= 0) {
    return "PDF";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
