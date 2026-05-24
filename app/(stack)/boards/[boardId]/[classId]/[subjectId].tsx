import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FileSearch, HelpCircle, Layers3 } from "lucide-react-native";

import { PaperList } from "@/components/browse/PaperList";
import { YearFilterBar } from "@/components/browse/YearFilterBar";
import { BoardBadge } from "@/components/papers/BoardBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { NetworkError } from "@/components/common/NetworkError";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { Typography } from "@/components/ui/Typography";
import { useBoard, usePapersBySubject, useSubjectsByBoardClass } from "@/hooks/api";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import type { ClassLevel } from "@/types";

type PaperTypeFilter = "annual" | "supplementary" | "all";
type YearFilter = "all" | 2024 | 2023 | 2022 | 2021 | 2020 | 2019;

const paperTypes: { label: string; value: PaperTypeFilter }[] = [
  { label: "Annual", value: "annual" },
  { label: "Supplementary", value: "supplementary" },
  { label: "All", value: "all" },
];

export default function PaperListScreen() {
  const router = useRouter();
  const { boardId, classId, subjectId } = useLocalSearchParams<{
    boardId: string;
    classId: string;
    subjectId: string;
  }>();
  const numericClass = Number(classId);
  const classLevel: ClassLevel | undefined =
    numericClass === 9 || numericClass === 10 || numericClass === 11 || numericClass === 12
      ? numericClass
      : undefined;
  const [yearFilter, setYearFilter] = useState<Exclude<YearFilter, "all"> | undefined>();
  const [sessionFilter, setSessionFilter] = useState<PaperTypeFilter>("all");
  const { data: board, isLoading: boardLoading } = useBoard(boardId);
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjectsByBoardClass(
    boardId,
    classLevel ?? 0,
  );
  const subject = subjects.find((item) => item.id === subjectId);
  const {
    data: papers = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = usePapersBySubject(boardId, subjectId, classLevel ?? 0, yearFilter, sessionFilter);
  const { isConnected } = useNetworkStatus();

  if ((isLoading || boardLoading || subjectsLoading) && (!board || !subject)) {
    return (
      <SafeAreaView className="flex-1 bg-background p-5 dark:bg-background-dark" edges={["top"]}>
        <SkeletonLoader variant="paperCard" />
      </SafeAreaView>
    );
  }

  if (!board || !classLevel || !subject) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-5 dark:bg-background-dark">
        <Typography variant="heading3">Papers not found</Typography>
      </SafeAreaView>
    );
  }

  const openCommonQuestions = () => {
    router.push({
      pathname: "/(stack)/common-questions/[subjectId]",
      params: { boardId: board.id, classId: String(classLevel), subjectId: subject.id },
    } as never);
  };

  if (error && !isConnected) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
        <NetworkError onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["bottom"]}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-5 pb-28 pt-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={board.color}
            />
          }
        >
          <View
            className="overflow-hidden rounded-lg border bg-card p-5 dark:bg-card-dark"
            style={{ borderColor: board.color }}
          >
            <View
              className="absolute bottom-0 right-0 h-24 w-24 rounded-full opacity-10"
              style={{ backgroundColor: board.color }}
            />
            <View className="flex-row items-start gap-4">
              <View
                className="h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${board.color}22` }}
              >
                <Layers3 color={board.color} size={24} />
              </View>
              <View className="flex-1 gap-2">
                <Typography variant="heading2">{subject.name}</Typography>
                <View className="flex-row flex-wrap items-center gap-2">
                  <BoardBadge board={board} size="md" />
                  <Typography variant="bodySmall" color="muted">
                    Class {classLevel}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
          <YearFilterBar
            selectedYear={yearFilter ?? "all"}
            onSelect={(year) => setYearFilter(year === "all" ? undefined : year)}
          />
          <View className="flex-row gap-2 rounded-lg bg-muted p-1 dark:bg-muted-dark">
            {paperTypes.map((type) => {
              const selected = sessionFilter === type.value;

              return (
                <Pressable
                  key={type.value}
                  accessibilityRole="button"
                  onPress={() => setSessionFilter(type.value)}
                  className={[
                    "h-11 flex-1 items-center justify-center rounded-md",
                    selected ? "" : "bg-transparent",
                  ].join(" ")}
                  style={selected ? { backgroundColor: board.color } : undefined}
                >
                  <Typography
                    variant="caption"
                    weight="semibold"
                    align="center"
                    className={selected ? "text-white dark:text-white" : undefined}
                  >
                    {type.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
          {isLoading ? (
            <View className="gap-3">
              {[0, 1, 2].map((item) => (
                <SkeletonLoader key={item} variant="paperCard" />
              ))}
            </View>
          ) : papers.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="No papers found"
              subtitle="Try adjusting your filters."
            />
          ) : (
            <PaperList
              papers={papers}
              board={board}
              accentColor={board.color}
              selectedYear="all"
              selectedType="all"
            />
          )}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          onPress={openCommonQuestions}
          className="absolute bottom-5 left-5 right-5 flex-row items-center gap-3 rounded-lg border bg-card p-4 shadow-sm active:opacity-90 dark:bg-card-dark"
          style={{ borderColor: board.color }}
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${board.color}22` }}
          >
            <HelpCircle color={board.color} size={21} />
          </View>
          <View className="flex-1">
            <Typography variant="bodySmall" weight="semibold">
              Common Questions for this subject
            </Typography>
            <Typography variant="caption" color="muted">
              Review repeated topics before opening papers.
            </Typography>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
