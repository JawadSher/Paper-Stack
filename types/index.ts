export type ClassLevel = 9 | 10 | 11 | 12;

export type ThemePreference = "light" | "dark" | "system";
export type TextSizePreference = "small" | "medium" | "large";

export interface Board {
  id: string;
  name: string;
  shortName: string;
  description: string;
  province:
    | "Federal"
    | "Punjab"
    | "Sindh"
    | "KPK"
    | "Balochistan"
    | "AJK"
    | "Gilgit-Baltistan";
  classes: ClassLevel[];
  color: string;
}

export interface Subject {
  id: string;
  name: string;
  classLevel: ClassLevel;
}

export interface Paper {
  id: string;
  title: string;
  boardId: Board["id"];
  subjectId: Subject["id"];
  classLevel: ClassLevel;
  year: number;
  session?: "annual" | "supplementary" | "model";
  pdfUrl: string;
  thumbnailUrl?: string;
  fileSizeBytes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Download {
  paperId: Paper["id"];
  localUri: string;
  fileName: string;
  fileSizeBytes?: number;
  downloadedAt: string;
}

export interface Question {
  id: string;
  paperId: Paper["id"];
  subjectId: Subject["id"];
  classLevel: ClassLevel;
  prompt: string;
  marks?: number;
  section?: string;
  pageNumber?: number;
}

export interface UserPreferences {
  selectedBoard?: Board["id"];
  selectedBoards?: Board["id"][];
  selectedClass?: ClassLevel;
  theme: ThemePreference;
  textSize?: TextSizePreference;
}
