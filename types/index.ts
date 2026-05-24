export type Province =
  | "Federal"
  | "Punjab"
  | "Sindh"
  | "KPK"
  | "Balochistan"
  | "AJK"
  | "Gilgit-Baltistan";

export type Session = "annual" | "supplementary" | "model";

export type PaperStatus = "DRAFT" | "LIVE" | "PROCESSING";

export type ClassLevel = 9 | 10 | 11 | 12;

export type ThemePreference = "light" | "dark" | "system";
export type TextSizePreference = "small" | "medium" | "large";

export type Board = {
  id: string;
  name: string;
  shortName: string;
  province: Province;
  description?: string | null;
  websiteUrl?: string | null;
  color: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  classes?: ClassLevel[];
};

export type Subject = {
  id: string;
  name: string;
  icon: string;
  displayOrder: number;
  isCompulsory: boolean;
  isActive: boolean;
  classLevel?: ClassLevel;
};

export type Paper = {
  id: string;
  boardId: string;
  subjectId: string;
  classLevel: ClassLevel;
  year: number;
  session: Session;
  title: string;
  pdfUrl?: string | null;
  storagePath?: string | null;
  fileSizeBytes?: number | null;
  status?: PaperStatus;
  viewCount?: number;
  downloadCount?: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  board?: Pick<Board, "id" | "name" | "shortName" | "province" | "color">;
  subject?: Pick<Subject, "id" | "name" | "icon">;
  thumbnailUrl?: string;
};

export type CommonQuestion = {
  id: string;
  subjectId: string;
  boardId: string;
  classLevel: ClassLevel;
  questionText: string;
  chapterName: string;
  chapterId: string;
  section?: "short_questions" | "long_questions" | "mcq" | "practical" | null;
  marks?: number | null;
  frequency: number;
  yearsAppeared: number[];
  questionPaperLinks?: {
    id: string;
    paperId: string;
    pageNumber?: number | null;
    year: number;
  }[];
  text?: string;
  classId?: string;
  years?: number[];
  boardIds?: string[];
};

export type Download = {
  paperId: string;
  localUri: string;
  fileName: string;
  fileSizeBytes?: number;
  downloadedAt: string;
  metadataUri?: string;
  paperSnapshot?: Paper;
};

export type UserPreferences = {
  selectedBoard?: string;
  selectedBoards?: string[];
  selectedClass?: ClassLevel;
  theme: ThemePreference;
  textSize?: TextSizePreference;
};

export type PaginatedResult<T> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type Question = {
  id: string;
  paperId: Paper["id"];
  subjectId: Subject["id"];
  classLevel: ClassLevel;
  prompt: string;
  marks?: number;
  section?: string;
  pageNumber?: number;
};

export function mapBoard(row: any): Board {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    province: row.province,
    description: row.description,
    websiteUrl: row.website_url,
    color: row.color,
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSubject(row: any): Subject {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    displayOrder: row.display_order,
    isCompulsory: row.is_compulsory,
    isActive: row.is_active,
  };
}

export function mapPaper(row: any): Paper {
  const fileSizeBytes =
    row.file_size_bytes === null || row.file_size_bytes === undefined
      ? null
      : Number(row.file_size_bytes);

  return {
    id: row.id,
    boardId: row.board_id,
    subjectId: row.subject_id,
    classLevel: row.class_level,
    year: row.year,
    session: row.session,
    title: row.title,
    pdfUrl: row.pdf_url,
    storagePath: row.storage_path,
    fileSizeBytes: fileSizeBytes && fileSizeBytes > 0 ? fileSizeBytes : null,
    status: row.status,
    viewCount: row.view_count,
    downloadCount: row.download_count,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    board: row.boards ? mapBoard(row.boards) : undefined,
    subject: row.subjects ? mapSubject(row.subjects) : undefined,
  };
}

export function mapCommonQuestion(row: any): CommonQuestion {
  const q: CommonQuestion = {
    id: row.id,
    subjectId: row.subject_id,
    boardId: row.board_id,
    classLevel: row.class_level,
    questionText: row.question_text,
    chapterName: row.chapter_name,
    chapterId: row.chapter_id,
    section: row.section,
    marks: row.marks,
    frequency: row.frequency,
    yearsAppeared: row.years_appeared ?? [],
    questionPaperLinks: row.question_paper_links ?? [],
    text: row.question_text,
    classId: String(row.class_level),
    years: row.years_appeared ?? [],
    boardIds: [row.board_id],
  };

  return q;
}
