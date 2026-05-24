import { useMemo, useState } from "react";
import { Platform, Pressable, RefreshControl, SectionList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Download, FolderDown } from "lucide-react-native";
import { useRouter } from "expo-router";

import { getBoard, getSubjectById } from "@/components/browse/browseData";
import { EmptyState } from "@/components/common/EmptyState";
import { DownloadedPaperCard } from "@/components/downloads/DownloadedPaperCard";
import { DownloadGroupHeader } from "@/components/downloads/DownloadGroupHeader";
import { StorageUsageBar } from "@/components/downloads/StorageUsageBar";
import { Typography } from "@/components/ui/Typography";
import { usePapersByIds } from "@/hooks/api";
import { useDownloads, type DownloadedPaper } from "@/hooks/useDownloads";
import { PAPER_STACK_DOWNLOAD_FOLDER_NAME } from "@/lib/offline-files";
import { usePaperStackStore } from "@/store";
import type { Board, ClassLevel, Subject } from "@/types";

type SortOption = "newest" | "subject" | "board";

const sorts: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Subject A-Z", value: "subject" },
  { label: "Board", value: "board" },
];
const classes: ClassLevel[] = [9, 10, 11, 12];

export default function DownloadsScreen() {
  const router = useRouter();
  const {
    isHydratingDownloads,
    refreshDownloads,
    deleteDownload,
    clearAllDownloads,
    totalSize,
  } = useDownloads();
  const downloads = usePaperStackStore((state) => state.downloads);
  const downloadedIds = Object.keys(downloads);
  const { data: serverPapers = [] } = usePapersByIds(downloadedIds);
  const downloadedPapers = downloadedIds
    .map((paperId) => {
      const download = downloads[paperId];
      const serverPaper = serverPapers.find((paper) => paper.id === paperId);
      const paper = serverPaper ?? download.paperSnapshot;
      const board = paper?.board
        ? ({ displayOrder: 0, isActive: true, ...paper.board } as Board)
        : paper
          ? getBoard(paper.boardId)
          : undefined;
      const subject =
        paper?.subject
          ? ({ displayOrder: 0, isCompulsory: false, isActive: true, ...paper.subject } as Subject)
          : paper
            ? getSubjectById(paper.subjectId)
            : undefined;

      return paper && board && subject ? { download, paper, board, subject } : undefined;
    })
    .filter((item): item is DownloadedPaper => Boolean(item));
  const [sort, setSort] = useState<SortOption>("newest");
  const [classFilter, setClassFilter] = useState<ClassLevel | undefined>();
  const sections = useMemo(() => {
    const filtered = downloadedPapers.filter(
      (item) => !classFilter || item.paper.classLevel === classFilter,
    );
    const sorted = [...filtered].sort((left, right) => {
      if (sort === "subject") {
        return left.subject.name.localeCompare(right.subject.name);
      }

      if (sort === "board") {
        return left.board.shortName.localeCompare(right.board.shortName);
      }

      return (
        new Date(right.download.downloadedAt).getTime() -
        new Date(left.download.downloadedAt).getTime()
      );
    });
    const groups = new Map<string, DownloadedPaper[]>();

    sorted.forEach((item) => {
      groups.set(item.subject.name, [...(groups.get(item.subject.name) ?? []), item]);
    });

    return Array.from(groups.entries()).map(([subjectName, data]) => ({
      subjectName,
      data,
    }));
  }, [classFilter, downloadedPapers, sort]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.paper.id}
        getItemLayout={(_, index) => ({ length: 158, offset: 158 * index, index })}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={Platform.OS === "android"}
        stickySectionHeadersEnabled
        refreshControl={
          <RefreshControl
            refreshing={isHydratingDownloads}
            onRefresh={refreshDownloads}
            tintColor="#C96442"
          />
        }
        contentContainerClassName="gap-4 px-5 pb-10 pt-5"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="gap-5">
            <View className="gap-2">
              <Typography variant="heading2">Downloads</Typography>
              <Typography variant="bodySmall" color="muted">
                Papers saved for offline reading.
              </Typography>
            </View>
            <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
              <View className="h-11 w-11 items-center justify-center rounded-lg bg-muted dark:bg-muted-dark">
                <FolderDown color="#C96442" size={22} />
              </View>
              <View className="flex-1 gap-1">
                <Typography variant="body" weight="semibold">
                  Offline folder
                </Typography>
                <Typography variant="caption" color="muted">
                  {PAPER_STACK_DOWNLOAD_FOLDER_NAME}
                </Typography>
              </View>
            </View>
            <StorageUsageBar totalSize={totalSize} onClearAll={clearAllDownloads} />
            <View className="gap-3">
              <View className="flex-row gap-2">
                {sorts.map((item) => {
                  const selected = sort === item.value;

                  return (
                    <Pressable
                      key={item.value}
                      accessibilityRole="button"
                      onPress={() => setSort(item.value)}
                      className={[
                        "rounded-full border px-3 py-2",
                        selected
                          ? "border-primary bg-primary dark:border-primary-dark dark:bg-primary-dark"
                          : "border-border bg-card dark:border-border-dark dark:bg-card-dark",
                      ].join(" ")}
                    >
                      <Typography
                        variant="caption"
                        weight="semibold"
                        className={selected ? "text-white dark:text-white" : undefined}
                      >
                        {item.label}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
              <View className="flex-row gap-2">
                {classes.map((classLevel) => {
                  const selected = classFilter === classLevel;

                  return (
                    <Pressable
                      key={classLevel}
                      accessibilityRole="button"
                      onPress={() => setClassFilter(selected ? undefined : classLevel)}
                      className={[
                        "rounded-full border px-3 py-2",
                        selected
                          ? "border-primary bg-primary dark:border-primary-dark dark:bg-primary-dark"
                          : "border-border bg-card dark:border-border-dark dark:bg-card-dark",
                      ].join(" ")}
                    >
                      <Typography
                        variant="caption"
                        weight="semibold"
                        className={selected ? "text-white dark:text-white" : undefined}
                      >
                        Class {classLevel}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={Download}
            title="No papers downloaded yet"
            subtitle="Downloaded papers are available offline."
            actionLabel="Browse papers to download"
            onAction={() => router.push("/(stack)/boards" as never)}
          />
        }
        renderSectionHeader={({ section }) => (
          <DownloadGroupHeader subjectName={section.subjectName} count={section.data.length} />
        )}
        renderItem={({ item }) => (
          <DownloadedPaperCard item={item} onDelete={(paperId) => deleteDownload(paperId)} />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        SectionSeparatorComponent={() => <View className="h-2" />}
      />
    </SafeAreaView>
  );
}
