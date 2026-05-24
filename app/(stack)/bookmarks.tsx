import { Bookmark } from "lucide-react-native";
import { useMemo } from "react";
import { Platform, Pressable, SectionList, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { getBoard, getSubjectById } from "@/components/browse/browseData";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { PaperCard } from "@/components/papers/PaperCard";
import { Typography } from "@/components/ui/Typography";
import { usePapersByIds } from "@/hooks/api";
import { usePaperStackStore } from "@/store";
import type { Board, Paper, Subject } from "@/types";

type ResolvedBookmark = { paper: Paper; board: Board; subject: Subject };

export default function BookmarksScreen() {
  const bookmarkedPapers = usePaperStackStore((state) => state.bookmarkedPapers);
  const toggleBookmark = usePaperStackStore((state) => state.toggleBookmark);
  const bookmarkedIds = Array.from(bookmarkedPapers.keys());
  const { data: serverPapers = [], isLoading } = usePapersByIds(bookmarkedIds);
  const papersToShow = serverPapers.length > 0 ? serverPapers : Array.from(bookmarkedPapers.values());
  const sections = useMemo(() => {
    const grouped = new Map<string, ResolvedBookmark[]>();

    papersToShow
      .map((paper) => {
        const board = (paper.board as Board | undefined) ?? getBoard(paper.boardId);
        const subject = (paper.subject as Subject | undefined) ?? getSubjectById(paper.subjectId);
        return board && subject ? { paper, board, subject } : undefined;
      })
      .filter((item): item is ResolvedBookmark => Boolean(item))
      .forEach((item) => {
        const groupKey = item.paper.subject?.name ?? item.subject.name;
        grouped.set(groupKey, [...(grouped.get(groupKey) ?? []), item]);
      });

    return Array.from(grouped.entries()).map(([subjectName, data]) => ({
      subjectName,
      data,
    }));
  }, [papersToShow]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.paper.id}
        getItemLayout={(_, index) => ({ length: 166, offset: 166 * index, index })}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={Platform.OS === "android"}
        stickySectionHeadersEnabled
        contentContainerClassName="gap-4 px-5 pb-10 pt-5"
        ListHeaderComponent={
          <View className="gap-2">
            <Typography variant="heading2">Saved Papers</Typography>
            <Typography variant="bodySmall" color="muted">
              Papers you bookmarked for quick access.
            </Typography>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <SkeletonLoader variant="paperCard" />
          ) : (
            <EmptyState
              icon={Bookmark}
              title="No saved papers yet"
              subtitle="Tap the bookmark icon on any paper."
            />
          )
        }
        renderSectionHeader={({ section }) => (
          <View className="border-b border-border bg-background py-3 dark:border-border-dark dark:bg-background-dark">
            <Typography variant="bodySmall" weight="semibold">
              {section.subjectName}
            </Typography>
          </View>
        )}
        renderItem={({ item }) => (
          <Swipeable
            overshootRight={false}
            renderRightActions={() => (
              <Pressable
                accessibilityRole="button"
                onPress={() => toggleBookmark(item.paper.id, item.paper)}
                className="ml-3 w-24 items-center justify-center rounded-lg bg-destructive dark:bg-destructive-dark"
              >
                <Bookmark color="#FFFFFF" size={21} />
                <Typography
                  variant="caption"
                  weight="semibold"
                  className="mt-1 text-white dark:text-white"
                >
                  Remove
                </Typography>
              </Pressable>
            )}
          >
            <PaperCard paper={item.paper} board={item.board} subject={item.subject} />
          </Swipeable>
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </SafeAreaView>
  );
}
