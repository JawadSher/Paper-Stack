import { boards } from "@/constants/boards";
import { subjects, subjectsByClass } from "@/constants/subjects";
import type { Board, ClassLevel, Paper, Subject } from "@/types";

export type PaperTypeFilter = "annual" | "supplementary" | "all";
export type YearFilter = "all" | 2024 | 2023 | 2022 | 2021 | 2020 | 2019;

export const paperYears: Exclude<YearFilter, "all">[] = [2024, 2023, 2022, 2021, 2020, 2019];

export const boardDescriptions: Record<string, string> = boards.reduce<Record<string, string>>(
  (descriptions, board) => {
    descriptions[board.id] =
      `${board.shortName} papers, schemes, and yearly archives for students preparing across ${board.province}. Browse by class, subject, year, and paper type.`;
    return descriptions;
  },
  {},
);

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

export function getPaperCount(board: Board, classLevel?: ClassLevel, subject?: Subject) {
  const base = board.id.length + (classLevel ?? 10) * 7 + (subject?.name.length ?? 12);
  return 18 + (base % 19);
}

export function generatePapers(board: Board, classLevel: ClassLevel, subject: Subject): Paper[] {
  return paperYears.flatMap((year) =>
    (["annual", "supplementary"] as const).map((session) => ({
      id: `${board.id}-${classLevel}-${subject.id}-${year}-${session}`,
      title: `${subject.name} ${year} ${session === "annual" ? "Annual" : "Supplementary"} Paper`,
      boardId: board.id,
      subjectId: subject.id,
      classLevel,
      year,
      session,
      pdfUrl: `https://example.com/papers/${board.id}/${classLevel}/${subject.id}/${year}-${session}.pdf`,
      fileSizeBytes: 1024 * 1024 * (2 + ((year + session.length + subject.name.length) % 5)),
      createdAt: new Date(year, session === "annual" ? 5 : 10, 15).toISOString(),
      updatedAt: new Date(year, session === "annual" ? 5 : 10, 15).toISOString(),
    })),
  );
}

export function getPaperById(paperId?: string | string[]) {
  const id = Array.isArray(paperId) ? paperId[0] : paperId;

  if (!id) {
    return undefined;
  }

  for (const board of boards) {
    for (const classLevel of board.classes) {
      for (const subject of subjectsByClass[classLevel]) {
        const paper = generatePapers(board, classLevel, subject).find((item) => item.id === id);

        if (paper) {
          return paper;
        }
      }
    }
  }

  return undefined;
}

export function getSubjectById(subjectId?: string | string[]) {
  const id = Array.isArray(subjectId) ? subjectId[0] : subjectId;
  return subjects.find((subject) => subject.id === id);
}

export function getViewerParams(paper: Paper, subject?: Subject, board?: Board) {
  return {
    paperId: paper.id,
    pdfUrl: paper.pdfUrl,
    title: paper.title,
    boardId: paper.boardId,
    boardName: board?.shortName,
    subjectId: paper.subjectId,
    subjectName: subject?.name,
    classLevel: String(paper.classLevel),
    year: String(paper.year),
    session: paper.session ?? "annual",
    fileSizeBytes: paper.fileSizeBytes ? String(paper.fileSizeBytes) : undefined,
  };
}

export function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "PDF";
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
