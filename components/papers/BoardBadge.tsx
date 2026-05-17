import type { Board } from "@/types";

import { Badge } from "../ui/Badge";

export interface BoardBadgeProps {
  board: Board;
  size?: "sm" | "md";
}

export function BoardBadge({ board, size = "sm" }: BoardBadgeProps) {
  return <Badge label={board.shortName} color={board.color} size={size} />;
}
