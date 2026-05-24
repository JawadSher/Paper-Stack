import { useMemo, useState } from "react";
import { FlatList, Platform, Pressable, View } from "react-native";
import { ChevronDown } from "lucide-react-native";

import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { PaperCard } from "@/components/papers/PaperCard";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import type { SearchFilters } from "@/components/search/FilterChips";
import type { Board, Paper, Subject } from "@/types";

type SortOption = "newest" | "oldest" | "board";

interface SearchResultsProps {
  results: Paper[];
  totalCount: number;
  isLoading: boolean;
  filters: SearchFilters;
}

type Row =
  | { type: "header"; id: string; title: string }
  | { type: "paper"; id: string; paper: Paper };

const sortLabels: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  board: "Board A-Z",
};

export function SearchResults({ results, totalCount, isLoading, filters }: SearchResultsProps) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const groupedBySubject = filters.subjectIds.length === 0;
  const rows = useMemo<Row[]>(() => {
    const sorted = [...results].sort((left, right) => {
      if (sort === "oldest") {
        return left.year - right.year;
      }

      if (sort === "board") {
        return (left.board?.shortName ?? "").localeCompare(right.board?.shortName ?? "");
      }

      return right.year - left.year;
    });

    if (!groupedBySubject) {
      return sorted.map((paper) => ({ type: "paper", id: paper.id, paper }));
    }

    const seen = new Set<string>();
    const output: Row[] = [];

    sorted.forEach((paper) => {
      const subjectId = paper.subject?.id ?? paper.subjectId;
      if (!seen.has(subjectId)) {
        seen.add(subjectId);
        output.push({
          type: "header",
          id: `header-${subjectId}`,
          title: paper.subject?.name ?? "Unknown Subject",
        });
      }

      output.push({ type: "paper", id: paper.id, paper });
    });

    return output;
  }, [groupedBySubject, results, sort]);

  if (isLoading) {
    return (
      <View className="gap-3">
        {[0, 1, 2].map((item) => (
          <SkeletonLoader key={item} variant="paperCard" />
        ))}
      </View>
    );
  }

  return (
    <View className="gap-4">
      <View className="flex-row items-start justify-between gap-3">
        <Typography variant="bodySmall" color="muted" weight="medium">
          {totalCount} papers found
        </Typography>
        <View className="items-end">
          <Pressable
            accessibilityRole="button"
            onPress={() => setSortOpen((value) => !value)}
            className="flex-row items-center gap-1 rounded-full border border-border bg-card px-3 py-2 active:opacity-80 dark:border-border-dark dark:bg-card-dark"
          >
            <Typography variant="caption" weight="semibold">
              {sortLabels[sort]}
            </Typography>
            <ChevronDown color={colors.mutedForeground.light} size={14} />
          </Pressable>
          {sortOpen ? (
            <View className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark">
              {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  onPress={() => {
                    setSort(option);
                    setSortOpen(false);
                  }}
                  className="px-3 py-2 active:bg-muted dark:active:bg-muted-dark"
                >
                  <Typography variant="caption" weight={sort === option ? "semibold" : "regular"}>
                    {sortLabels[option]}
                  </Typography>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({ length: 150, offset: 150 * index, index })}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={Platform.OS === "android"}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) =>
          item.type === "header" ? (
            <Typography variant="label" color="muted" className="pt-2">
              {item.title}
            </Typography>
          ) : (
            <PaperCard
              paper={item.paper}
              board={item.paper.board as Board}
              subject={item.paper.subject as Subject | undefined}
            />
          )
        }
      />
    </View>
  );
}
