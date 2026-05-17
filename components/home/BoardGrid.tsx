import { Link } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { Typography } from "@/components/ui/Typography";
import { boards } from "@/constants/boards";
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
  const preferences = usePaperStackStore((state) => state.userPreferences);
  const selectedIds = preferences.selectedBoards?.length
    ? preferences.selectedBoards
    : preferences.selectedBoard
      ? [preferences.selectedBoard]
      : [];
  const selectedBoards = selectedIds
    .map((id) => boards.find((board) => board.id === id))
    .filter(Boolean);

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
      {selectedBoards.length ? (
        <View className="flex-row flex-wrap gap-3">
          {selectedBoards.map((board, index) =>
            board ? (
              <AnimatedBoardItem key={board.id} index={index}>
                <BoardCard board={board} paperCount={180 - index * 12} />
              </AnimatedBoardItem>
            ) : null,
          )}
        </View>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No boards selected"
          subtitle="Pick boards in onboarding or profile to personalize this grid."
        />
      )}
    </View>
  );
}
