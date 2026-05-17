import { useMemo, useState } from "react";
import { Platform, Pressable, SectionList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Download } from "lucide-react-native";
import { useRouter } from "expo-router";

import { EmptyState } from "@/components/common/EmptyState";
import { DownloadedPaperCard } from "@/components/downloads/DownloadedPaperCard";
import { DownloadGroupHeader } from "@/components/downloads/DownloadGroupHeader";
import { StorageUsageBar } from "@/components/downloads/StorageUsageBar";
import { Typography } from "@/components/ui/Typography";
import { useDownloads, type DownloadedPaper } from "@/hooks/useDownloads";
import type { ClassLevel } from "@/types";

type SortOption = "newest" | "subject" | "board";

const sorts: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Subject A-Z", value: "subject" },
  { label: "Board", value: "board" },
];
const classes: ClassLevel[] = [9, 10, 11, 12];

export default function DownloadsScreen() {
  const router = useRouter();
  const { downloadedPapers, totalSize, deleteDownload, clearAllDownloads } = useDownloads();
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
