import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SubjectGrid } from "@/components/browse/SubjectGrid";
import { getBoard, getClassLevel } from "@/components/browse/browseData";
import { Typography } from "@/components/ui/Typography";
import { subjectsByClass } from "@/constants/subjects";

export default function SubjectListScreen() {
  const { boardId, classId } = useLocalSearchParams<{ boardId: string; classId: string }>();
  const board = getBoard(boardId);
  const classLevel = getClassLevel(classId);

  if (!board || !classLevel) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-5 dark:bg-background-dark">
        <Typography variant="heading3">Subjects not found</Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <Typography variant="heading2">Class {classLevel} Subjects</Typography>
          <Typography variant="bodySmall" color="muted">
            {board.shortName} papers sorted with compulsory subjects first.
          </Typography>
        </View>
        <SubjectGrid board={board} classLevel={classLevel} subjects={subjectsByClass[classLevel]} />
      </ScrollView>
    </SafeAreaView>
  );
}
