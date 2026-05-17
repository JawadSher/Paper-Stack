import { useRouter } from "expo-router";
import { memo } from "react";
import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import type { Board } from "@/types";

interface BoardCardProps {
  board: Board;
  paperCount: number;
}

function BoardCardComponent({ board, paperCount }: BoardCardProps) {
  const router = useRouter();

  return (
    <Card
      className="min-h-32 flex-1 gap-3"
      style={{ borderLeftColor: board.color, borderLeftWidth: 5 }}
      onPress={() =>
        router.push({
          pathname: "/(stack)/boards/[boardId]",
          params: { boardId: board.id },
        } as never)
      }
    >
      <View className="gap-1">
        <Typography variant="body" weight="semibold" numberOfLines={2}>
          {board.shortName}
        </Typography>
        <Typography variant="caption" color="muted">
          {board.province}
        </Typography>
      </View>
      <Typography variant="caption" color="primary" weight="semibold">
        {paperCount}+ papers
      </Typography>
    </Card>
  );
}

export const BoardCard = memo(
  BoardCardComponent,
  (prev, next) => prev.board.id === next.board.id && prev.paperCount === next.paperCount,
);
