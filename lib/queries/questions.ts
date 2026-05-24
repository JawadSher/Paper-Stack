import { supabase, unwrap } from "@/lib/supabase";
import { mapCommonQuestion, type CommonQuestion } from "@/types";

export type QuestionFilters = {
  subjectId?: string;
  boardId?: string;
  classLevel?: number;
  minFrequency?: 2 | 3 | 4 | 5;
  chapterId?: string;
};

export async function fetchCommonQuestions(
  filters: QuestionFilters,
): Promise<CommonQuestion[]> {
  let query = supabase
    .from("common_questions")
    .select(
      `
      *,
      question_paper_links (
        id,
        paper_id,
        page_number,
        year
      )
    `,
    )
    .order("frequency", { ascending: false });

  if (filters.subjectId) {
    query = query.eq("subject_id", filters.subjectId);
  }

  if (filters.boardId) {
    query = query.eq("board_id", filters.boardId);
  }

  if (filters.classLevel) {
    query = query.eq("class_level", filters.classLevel);
  }

  if (filters.chapterId) {
    query = query.eq("chapter_id", filters.chapterId);
  }

  if (filters.minFrequency) {
    query = query.gte("frequency", filters.minFrequency);
  }

  const rows = unwrap(await query);
  return rows.map(mapCommonQuestion);
}
