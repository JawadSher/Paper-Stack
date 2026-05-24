import { Link } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { Typography } from "@/components/ui/Typography";
import { useBoards } from "@/hooks/api";
import { mergeBoardsWithFallback } from "@/lib/board-fallback";
import { usePaperStackStore } from "@/store";

import { BoardCard } from "./BoardCard";

function AnimatedBoardItem({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        delay: index * 70,
        tension: 120,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        delay: index * 70,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, scale]);

  return (
    <Animated.View
      className="w-[48%]"
      style={{ opacity, transform: [{ scale }] }}
    >
      {children}
    </Animated.View>
  );
}

export function BoardGrid() {
  const { data: allBoards = [], isLoading } = useBoards();
  const { userPreferences } = usePaperStackStore();
  // OFFLINE FALLBACK — remove when confident in connectivity
  const boardsToUse = mergeBoardsWithFallback(allBoards);
  const selectedIds = userPreferences.selectedBoards?.length
    ? userPreferences.selectedBoards
    : userPreferences.selectedBoard
      ? [userPreferences.selectedBoard]
      : [];
  const selectedBoards = boardsToUse.filter((board) => selectedIds.includes(board.id));

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Typography variant="heading3">Browse by Board</Typography>
        <Link href={"/(stack)/boards" as never}>
          <Typography variant="bodySmall" color="primary" weight="semibold">
            See all
          </Typography>
        </Link>
      </View>
      {isLoading ? (
        <View className="flex-row flex-wrap gap-3">
          {[0, 1].map((item) => (
            <View key={item} className="w-[48%]">
              <SkeletonLoader variant="boardCard" />
            </View>
          ))}
        </View>
      ) : selectedBoards.length ? (
        <View className="flex-row flex-wrap gap-3">
          {selectedBoards.map((board, index) =>
            board ? (
              <AnimatedBoardItem key={board.id} index={index}>
                <BoardCard board={board} />
              </AnimatedBoardItem>
            ) : null,
          )}
        </View>
      ) : (
        <View className="min-h-36 items-center justify-center gap-3 rounded-lg border border-border bg-card px-5 py-6 dark:border-border-dark dark:bg-card-dark">
          <BookOpen color="#C96442" size={28} />
          <View className="gap-1">
            <Typography variant="body" weight="semibold" align="center">
              No boards selected
            </Typography>
            <Typography variant="caption" color="muted" align="center">
              Pick boards in onboarding or profile to personalize this grid.
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
}
