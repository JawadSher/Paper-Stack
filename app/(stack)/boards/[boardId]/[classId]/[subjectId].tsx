import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HelpCircle } from "lucide-react-native";

import { PaperList } from "@/components/browse/PaperList";
import { YearFilterBar } from "@/components/browse/YearFilterBar";
import {
  generatePapers,
  getBoard,
  getClassLevel,
  getSubject,
  type PaperTypeFilter,
  type YearFilter,
} from "@/components/browse/browseData";
import { BoardBadge } from "@/components/papers/BoardBadge";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

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
  const board = getBoard(boardId);
  const classLevel = getClassLevel(classId);
  const subject = getSubject(classLevel, subjectId);
  const [selectedYear, setSelectedYear] = useState<YearFilter>("all");
  const [selectedType, setSelectedType] = useState<PaperTypeFilter>("all");
  const papers = useMemo(
    () => (board && classLevel && subject ? generatePapers(board, classLevel, subject) : []),
    [board, classLevel, subject],
  );

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

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-5 pb-28 pt-5"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-3">
            <Typography variant="heading2">{subject.name}</Typography>
            <View className="flex-row flex-wrap items-center gap-2">
              <BoardBadge board={board} size="md" />
              <Typography variant="bodySmall" color="muted">
                Class {classLevel}
              </Typography>
            </View>
          </View>
          <YearFilterBar selectedYear={selectedYear} onSelect={setSelectedYear} />
          <View className="flex-row gap-2 rounded-lg bg-muted p-1 dark:bg-muted-dark">
            {paperTypes.map((type) => {
              const selected = selectedType === type.value;

              return (
                <Pressable
                  key={type.value}
                  accessibilityRole="button"
                  onPress={() => setSelectedType(type.value)}
                  className={[
                    "h-11 flex-1 items-center justify-center rounded-md",
                    selected ? "bg-primary dark:bg-primary-dark" : "bg-transparent",
                  ].join(" ")}
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
          <PaperList
            papers={papers}
            board={board}
            selectedYear={selectedYear}
            selectedType={selectedType}
          />
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          onPress={openCommonQuestions}
          className="absolute bottom-5 left-5 right-5 flex-row items-center gap-3 rounded-lg border border-primary bg-card p-4 shadow-sm active:opacity-90 dark:border-primary-dark dark:bg-card-dark"
        >
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-muted dark:bg-muted-dark">
            <HelpCircle color={colors.primary.light} size={21} />
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
