import { useMemo, useState } from "react";
import { FlatList, Platform, RefreshControl, View } from "react-native";
import { FileSearch } from "lucide-react-native";

import { EmptyState } from "@/components/common/EmptyState";
import type { Board, Paper } from "@/types";

import type { PaperTypeFilter, YearFilter } from "./browseData";
import { PaperListItem } from "./PaperListItem";

interface PaperListProps {
  papers: Paper[];
  board: Board;
  accentColor?: string;
  selectedYear: YearFilter;
  selectedType: PaperTypeFilter;
}

export function PaperList({
  papers,
  board,
  accentColor = board.color,
  selectedYear,
  selectedType,
}: PaperListProps) {
  const [refreshing, setRefreshing] = useState(false);
  const filteredPapers = useMemo(
    () =>
      papers.filter((paper) => {
        const yearMatches = selectedYear === "all" || paper.year === selectedYear;
        const typeMatches = selectedType === "all" || paper.session === selectedType;

        return yearMatches && typeMatches;
      }),
    [papers, selectedType, selectedYear],
  );

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <FlatList
      data={filteredPapers}
      keyExtractor={(item) => item.id}
      getItemLayout={(_, index) => ({ length: 132, offset: 132 * index, index })}
      initialNumToRender={8}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews={Platform.OS === "android"}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      ListEmptyComponent={
        <EmptyState
          icon={FileSearch}
          title="No papers found"
          subtitle="Try a different year or paper type."
        />
      }
      renderItem={({ item }) => (
        <PaperListItem paper={item} board={board} accentColor={accentColor} />
      )}
    />
  );
}
