import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { Share2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Share, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getClassLevel } from "@/components/browse/browseData";
import { NetworkError } from "@/components/common/NetworkError";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { BoardBadge } from "@/components/papers/BoardBadge";
import { QuestionsList } from "@/components/questions/QuestionsList";
import { SubjectHeader } from "@/components/questions/SubjectHeader";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import {
  useAllSubjects,
  useBoard,
  useBoards,
  useCommonQuestionsGrouped,
} from "@/hooks/api";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { usePaperStackStore } from "@/store";
import type { ClassLevel } from "@/types";

type MinFrequency = 2 | 3 | 4 | 5;

const frequencyOptions: { label: string; value: MinFrequency }[] = [
  { label: "2+ years", value: 2 },
  { label: "3+ years", value: 3 },
  { label: "4+ years", value: 4 },
  { label: "All 5 years", value: 5 },
];

const classes: ClassLevel[] = [9, 10, 11, 12];

function toValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function CommonQuestionsBySubjectScreen() {
  const params = useLocalSearchParams<{
    subjectId: string;
    boardId?: string;
    classId?: string;
  }>();
  const subjectId = toValue(params.subjectId);
  const routeBoardId = toValue(params.boardId);
  const initialClass = getClassLevel(params.classId);
  const selectedPreferenceBoard = usePaperStackStore(
    (state) => state.userPreferences.selectedBoards?.[0] ?? state.userPreferences.selectedBoard,
  );
  const userPreferences = usePaperStackStore((state) => state.userPreferences);
  const [selectedBoardId, setSelectedBoardId] = useState(routeBoardId ?? selectedPreferenceBoard);
  const [selectedClass, setSelectedClass] = useState<ClassLevel | undefined>(initialClass);
  const [minFrequency, setMinFrequency] = useState<MinFrequency>(2);
  const { isConnected } = useNetworkStatus();
  const { data: boards = [] } = useBoards();
  const { data: allSubjects = [] } = useAllSubjects();
  const { data: selectedBoard } = useBoard(selectedBoardId ?? "");
  const baseSubject = allSubjects.find((subject) => subject.id === subjectId);
  const sameNameSubjects = useMemo(
    () => allSubjects.filter((subject) => subject.name === baseSubject?.name),
    [allSubjects, baseSubject?.name],
  );
  const resolvedClass = selectedClass ?? baseSubject?.classLevel;
  const resolvedSubject =
    sameNameSubjects.find((subject) => subject.classLevel === resolvedClass) ?? baseSubject;
  const {
    groupedQuestions,
    totalAnalyzed,
    mostRepeatedTopic,
    isLoading,
    data: questions = [],
  } = useCommonQuestionsGrouped({
    subjectId: resolvedSubject?.id,
    boardId: selectedBoardId ?? userPreferences.selectedBoard,
    classLevel: resolvedClass,
    minFrequency,
  });
  const repeatCount = questions.length;
  const showBoardSelector = !routeBoardId;
  const showClassToggle = sameNameSubjects.length > 1;

  if (!isLoading && !isConnected && questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
        <NetworkError onRetry={() => setMinFrequency(2)} />
      </SafeAreaView>
    );
  }

  const shareSummary = async () => {
    const subjectName = resolvedSubject?.name ?? "Subject";
    const summary = [
      `${subjectName} Common Questions`,
      selectedBoard ? `Board: ${selectedBoard.shortName}` : "Board: All boards",
      resolvedClass ? `Class: ${resolvedClass}` : "Class: All",
      `Repeat questions found: ${repeatCount}`,
      `Most repeated topic: ${mostRepeatedTopic}`,
      "",
      ...questions
        .slice(0, 8)
        .map(
          (question, index) =>
            `${index + 1}. (${(question.years ?? question.yearsAppeared).length}/5) ${question.text ?? question.questionText}`,
        ),
    ].join("\n");

    if (await Sharing.isAvailableAsync()) {
      const uri = `${FileSystem.cacheDirectory}paperstack-common-questions.txt`;
      await FileSystem.writeAsStringAsync(uri, summary);
      await Sharing.shareAsync(uri, { dialogTitle: `${subjectName} common questions` });
      return;
    }

    await Share.share({ title: `${subjectName} common questions`, message: summary });
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-start gap-3">
          <View className="flex-1">
            <SubjectHeader subject={resolvedSubject} board={selectedBoard ?? undefined} classId={resolvedClass} />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={shareSummary}
            className="h-11 w-11 items-center justify-center rounded-lg border border-border bg-card active:opacity-80 dark:border-border-dark dark:bg-card-dark"
          >
            <Share2 color={colors.foreground.light} size={20} />
          </Pressable>
        </View>

        <View className="flex-row gap-2">
          <View className="flex-1 rounded-lg bg-muted p-3 dark:bg-muted-dark">
            <Typography variant="caption" color="muted">
              Analyzed
            </Typography>
            <Typography variant="heading3">{totalAnalyzed}</Typography>
          </View>
          <View className="flex-1 rounded-lg bg-muted p-3 dark:bg-muted-dark">
            <Typography variant="caption" color="muted">
              Repeats
            </Typography>
            <Typography variant="heading3">{repeatCount}</Typography>
          </View>
          <View className="flex-[1.4] rounded-lg bg-muted p-3 dark:bg-muted-dark">
            <Typography variant="caption" color="muted">
              Top topic
            </Typography>
            <Typography variant="bodySmall" weight="semibold" numberOfLines={2}>
              {mostRepeatedTopic}
            </Typography>
          </View>
        </View>

        <View className="gap-4">
          {showBoardSelector ? (
            <View className="gap-3">
              <Typography variant="label" color="muted">
                Board
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {boards.map((board) => (
                    <Pressable
                      key={board.id}
                      accessibilityRole="button"
                      onPress={() => setSelectedBoardId(board.id)}
                      className={selectedBoardId === board.id ? "opacity-100" : "opacity-55"}
                    >
                      <BoardBadge board={board} size="md" />
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : null}

          {showClassToggle ? (
            <View className="gap-3">
              <Typography variant="label" color="muted">
                Class
              </Typography>
              <View className="flex-row gap-2">
                {classes.map((classLevel) => {
                  const selected = resolvedClass === classLevel;

                  return (
                    <Pressable
                      key={classLevel}
                      accessibilityRole="button"
                      onPress={() => setSelectedClass(classLevel)}
                      className={[
                        "h-10 flex-1 items-center justify-center rounded-full border",
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
                        {classLevel}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View className="gap-3">
            <Typography variant="label" color="muted">
              Minimum frequency
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {frequencyOptions.map((option) => {
                  const selected = option.value === minFrequency;

                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      onPress={() => setMinFrequency(option.value)}
                      className={[
                        "rounded-full border px-4 py-2",
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
                        {option.label}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>

        {isLoading ? (
          <View className="gap-3">
            <SkeletonLoader variant="paperCard" />
            <SkeletonLoader variant="paperCard" />
          </View>
        ) : groupedQuestions.length ? (
          <QuestionsList groups={groupedQuestions} boardId={selectedBoardId} />
        ) : (
          <View className="items-center gap-3 py-12">
            <Badge label="No repeated questions" />
            <Typography variant="bodySmall" color="muted" align="center">
              Try a lower frequency, Class 10, or a supported subject such as Physics, Chemistry, or Mathematics.
            </Typography>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
