import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ClassSelector } from "@/components/browse/ClassSelector";
import { boardDescriptions, getBoard } from "@/components/browse/browseData";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import type { ClassLevel } from "@/types";

export default function BoardDetailScreen() {
  const router = useRouter();
  const { boardId } = useLocalSearchParams<{ boardId: string }>();
  const board = getBoard(boardId);

  if (!board) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-5 dark:bg-background-dark">
        <Typography variant="heading3">Board not found</Typography>
      </SafeAreaView>
    );
  }

  const selectClass = (classLevel: ClassLevel) => {
    router.push({
      pathname: "/(stack)/boards/[boardId]/[classId]",
      params: { boardId: board.id, classId: String(classLevel) },
    } as never);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 px-5 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          <Badge label={board.province} color={board.color} />
          <Typography variant="heading2">{board.name}</Typography>
          <Typography variant="bodySmall" color="muted">
            {boardDescriptions[board.id]}
          </Typography>
        </View>
        <View className="gap-4">
          <Typography variant="heading3">Choose Class</Typography>
          <ClassSelector onSelect={selectClass} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
