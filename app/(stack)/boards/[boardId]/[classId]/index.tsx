import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen } from "lucide-react-native";

import { SubjectGrid } from "@/components/browse/SubjectGrid";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { Typography } from "@/components/ui/Typography";
import { useBoard, useSubjectsByBoardClass } from "@/hooks/api";

export default function SubjectListScreen() {
  const { boardId, classId } = useLocalSearchParams<{ boardId: string; classId: string }>();
  const classLevel = Number(classId);
  const validClassLevel =
    classLevel === 9 || classLevel === 10 || classLevel === 11 || classLevel === 12
      ? classLevel
      : undefined;
  const { data: board } = useBoard(boardId);
  const { data: subjects = [], isLoading } = useSubjectsByBoardClass(
    boardId,
    validClassLevel ?? 0,
  );

  if (!validClassLevel) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-5 dark:bg-background-dark">
        <Typography variant="heading3">Subjects not found</Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="overflow-hidden rounded-lg border bg-card p-5 dark:bg-card-dark"
          style={{ borderColor: board?.color ?? "#C96442" }}
        >
          <View
            className="absolute bottom-0 right-0 h-24 w-24 rounded-full opacity-10"
            style={{ backgroundColor: board?.color ?? "#C96442" }}
          />
          <View className="flex-row items-start gap-4">
            <View
              className="h-12 w-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${board?.color ?? "#C96442"}22` }}
            >
              <BookOpen color={board?.color ?? "#C96442"} size={24} />
            </View>
            <View className="flex-1 gap-2">
              <Typography variant="heading2">Class {validClassLevel} Subjects</Typography>
              <Typography variant="bodySmall" color="muted">
                {board?.shortName ?? "Board"} subjects sorted with compulsory subjects first.
              </Typography>
            </View>
          </View>
        </View>
        {isLoading || !board ? (
          <View className="flex-row flex-wrap gap-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <View key={item} className="w-[48%]">
                <SkeletonLoader variant="boardCard" />
              </View>
            ))}
          </View>
        ) : (
          <SubjectGrid board={board} classLevel={validClassLevel} subjects={subjects} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
