import { supabase, unwrap, unwrapNullable } from "@/lib/supabase";
import { mapBoard, type Board } from "@/types";

export async function fetchBoards(search?: string): Promise<Board[]> {
  let query = supabase
    .from("boards")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (search) {
    query = query.or(`name.ilike.%${search}%,short_name.ilike.%${search}%`);
  }

  const rows = unwrap(await query);
  return rows.map(mapBoard);
}

export async function fetchBoardsByProvince(): Promise<Record<string, Board[]>> {
  const boards = await fetchBoards();

  return boards.reduce<Record<string, Board[]>>((acc, board) => {
    if (!acc[board.province]) {
      acc[board.province] = [];
    }

    acc[board.province].push(board);
    return acc;
  }, {});
}

export async function fetchBoardById(id: string): Promise<Board | null> {
  const row = unwrapNullable(
    await supabase
      .from("boards")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single(),
  );

  return row ? mapBoard(row) : null;
}
