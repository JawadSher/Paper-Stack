import AsyncStorage from "@react-native-async-storage/async-storage";
import { Clock, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { BoardBadge } from "@/components/papers/BoardBadge";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import type { Board } from "@/types";

export const recentSearchesKey = "paper-stack:recent-searches";

interface RecentSearchesProps {
  boards: Board[];
  onSelectSearch: (term: string) => void;
  onSelectBoard: (boardId: string) => void;
}

export async function saveRecentSearch(term: string) {
  const cleaned = term.trim();

  if (!cleaned) {
    return;
  }

  const stored = await AsyncStorage.getItem(recentSearchesKey);
  const current = stored ? (JSON.parse(stored) as string[]) : [];
  const next = [cleaned, ...current.filter((item) => item.toLowerCase() !== cleaned.toLowerCase())].slice(
    0,
    8,
  );
  await AsyncStorage.setItem(recentSearchesKey, JSON.stringify(next));
}

export function RecentSearches({ boards, onSelectSearch, onSelectBoard }: RecentSearchesProps) {
  const [recent, setRecent] = useState<string[]>([]);

  const loadRecent = async () => {
    const stored = await AsyncStorage.getItem(recentSearchesKey);
    setRecent(stored ? (JSON.parse(stored) as string[]).slice(0, 8) : []);
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const remove = async (term: string) => {
    const next = recent.filter((item) => item !== term);
    setRecent(next);
    await AsyncStorage.setItem(recentSearchesKey, JSON.stringify(next));
  };

  const clear = async () => {
    setRecent([]);
    await AsyncStorage.removeItem(recentSearchesKey);
  };

  return (
    <View className="gap-7">
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Typography variant="heading3">Recent</Typography>
          {recent.length ? (
            <Pressable accessibilityRole="button" onPress={clear}>
              <Typography variant="bodySmall" color="primary" weight="semibold">
                Clear
              </Typography>
            </Pressable>
          ) : null}
        </View>
        {recent.length ? (
          <View className="gap-2">
            {recent.map((term) => (
              <Pressable
                key={term}
                accessibilityRole="button"
                onPress={() => onSelectSearch(term)}
                className="flex-row items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 active:opacity-90 dark:border-border-dark dark:bg-card-dark"
              >
                <Clock color={colors.mutedForeground.light} size={18} />
                <Typography variant="bodySmall" className="flex-1" numberOfLines={1}>
                  {term}
                </Typography>
                <Pressable
                  accessibilityRole="button"
                  onPress={(event) => {
                    event.stopPropagation();
                    remove(term);
                  }}
                  className="h-8 w-8 items-center justify-center rounded-full bg-muted dark:bg-muted-dark"
                >
                  <X color={colors.mutedForeground.light} size={15} />
                </Pressable>
              </Pressable>
            ))}
          </View>
        ) : (
          <Typography variant="bodySmall" color="muted">
            Searches you run will appear here.
          </Typography>
        )}
      </View>
      <View className="gap-3">
        <Typography variant="heading3">Browse by Board</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {boards.map((board) => (
              <Pressable
                key={board.id}
                accessibilityRole="button"
                onPress={() => onSelectBoard(board.id)}
                className="active:opacity-80"
              >
                <BoardBadge board={board} size="md" />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
