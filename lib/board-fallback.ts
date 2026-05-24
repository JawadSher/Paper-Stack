import { boards as fallbackBoards } from "@/constants/boards";
import type { Board } from "@/types";

export function mergeBoardsWithFallback(boards: Board[]) {
  const byId = new Map(fallbackBoards.map((board) => [board.id, board]));

  boards.forEach((board) => {
    byId.set(board.id, {
      ...byId.get(board.id),
      ...board,
      color: board.color,
    });
  });

  return Array.from(byId.values()).sort(
    (left, right) =>
      (left.displayOrder ?? 0) - (right.displayOrder ?? 0) ||
      left.name.localeCompare(right.name),
  );
}

export function groupBoardsByProvince(boards: Board[]) {
  return boards.reduce<Record<string, Board[]>>((groups, board) => {
    groups[board.province] = [...(groups[board.province] ?? []), board];
    return groups;
  }, {});
}
