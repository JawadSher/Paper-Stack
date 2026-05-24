import { supabase, unwrap, unwrapNullable } from "@/lib/supabase";
import { mapPaper, type PaginatedResult, type Paper, type Session } from "@/types";

const PAPER_SELECT = `
  *,
  boards ( id, name, short_name, province, color ),
  subjects ( id, name, icon )
`;

export async function fetchPapersBySubject(
  boardId: string,
  subjectId: string,
  classLevel: number,
  yearFilter?: number,
  sessionFilter?: string,
): Promise<Paper[]> {
  let query = supabase
    .from("papers")
    .select(PAPER_SELECT)
    .eq("board_id", boardId)
    .eq("subject_id", subjectId)
    .eq("class_level", classLevel)
    .eq("status", "LIVE")
    .order("year", { ascending: false })
    .order("session", { ascending: true });

  if (yearFilter) {
    query = query.eq("year", yearFilter);
  }

  if (sessionFilter && sessionFilter !== "all") {
    query = query.eq("session", sessionFilter as Session);
  }

  const rows = unwrap(await query);
  return rows.map(mapPaper);
}

export async function fetchPaperById(id: string): Promise<Paper | null> {
  const row = unwrapNullable(
    await supabase
      .from("papers")
      .select(PAPER_SELECT)
      .eq("id", id)
      .eq("status", "LIVE")
      .single(),
  );

  if (!row) {
    return null;
  }

  supabase.rpc("increment_paper_view", { paper_id: id }).then(() => undefined);

  return mapPaper(row);
}

export async function fetchRecentPapers(limit = 10): Promise<Paper[]> {
  const rows = unwrap(
    await supabase
      .from("papers")
      .select(PAPER_SELECT)
      .eq("status", "LIVE")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit),
  );

  return rows.map(mapPaper);
}

export async function fetchPapersByIds(ids: string[]): Promise<Paper[]> {
  if (!ids.length) {
    return [];
  }

  const rows = unwrap(
    await supabase
      .from("papers")
      .select(PAPER_SELECT)
      .in("id", ids)
      .eq("status", "LIVE"),
  );

  return rows.map(mapPaper);
}

export async function searchPapers(
  query: string,
  filters: {
    boardId?: string;
    classLevel?: number;
    year?: number;
    session?: string;
    subjectId?: string;
  },
  page = 1,
  pageSize = 20,
): Promise<PaginatedResult<Paper>> {
  if (query.length < 2) {
    return { data: [], count: 0, page, pageSize, hasMore: false };
  }

  let dbQuery = supabase
    .from("papers")
    .select(PAPER_SELECT, { count: "exact" })
    .eq("status", "LIVE")
    .ilike("title", `%${query}%`)
    .order("year", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (filters.boardId) {
    dbQuery = dbQuery.eq("board_id", filters.boardId);
  }

  if (filters.subjectId) {
    dbQuery = dbQuery.eq("subject_id", filters.subjectId);
  }

  if (filters.classLevel) {
    dbQuery = dbQuery.eq("class_level", filters.classLevel);
  }

  if (filters.year) {
    dbQuery = dbQuery.eq("year", filters.year);
  }

  if (filters.session && filters.session !== "all") {
    dbQuery = dbQuery.eq("session", filters.session as Session);
  }

  const { data, error, count } = await dbQuery;

  if (error) {
    throw new Error(error.message);
  }

  const papers = (data ?? []).map(mapPaper);
  const total = count ?? 0;

  return {
    data: papers,
    count: total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}
