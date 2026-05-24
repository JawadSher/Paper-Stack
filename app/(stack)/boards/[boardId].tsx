import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen, GraduationCap } from "lucide-react-native";

import { ClassSelector } from "@/components/browse/ClassSelector";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { useBoard } from "@/hooks/api";
import type { ClassLevel } from "@/types";

export default function BoardDetailScreen() {
  const router = useRouter();
  const { boardId } = useLocalSearchParams<{ boardId: string }>();
  const { data: board, isLoading } = useBoard(boardId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background px-5 pt-5 dark:bg-background-dark">
        <SkeletonLoader variant="paperCard" />
      </SafeAreaView>
    );
  }

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
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 px-5 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="overflow-hidden rounded-lg border bg-card p-5 dark:bg-card-dark"
          style={{ borderColor: board.color }}
        >
          <View className="absolute bottom-0 right-0 h-28 w-28 rounded-full opacity-10" style={{ backgroundColor: board.color }} />
          <View className="gap-4">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1 gap-2">
                <Badge label={board.province} color={board.color} />
                <Typography variant="heading2">{board.shortName}</Typography>
              </View>
              <View
                className="h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${board.color}22` }}
              >
                <BookOpen color={board.color} size={24} />
              </View>
            </View>
            <View className="gap-2">
              <Typography variant="body" weight="semibold">
                {board.name}
              </Typography>
              {board.description ? (
                <Typography variant="bodySmall" color="muted">
                  {board.description}
                </Typography>
              ) : null}
            </View>
          </View>
        </View>
        <View className="gap-4">
          <View className="flex-row items-center gap-3">
            <View
              className="h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${board.color}22` }}
            >
              <GraduationCap color={board.color} size={22} />
            </View>
            <View className="flex-1">
              <Typography variant="heading3">Choose Class</Typography>
              <Typography variant="caption" color="muted">
                Select a class to browse available subjects and papers.
              </Typography>
            </View>
          </View>
          <ClassSelector accentColor={board.color} onSelect={selectClass} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
