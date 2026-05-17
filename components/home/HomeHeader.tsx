import { Bell } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { boards } from "@/constants/boards";
import { colors } from "@/constants/theme";
import { usePaperStackStore } from "@/store";

interface HomeHeaderProps {
  hasNewPapers?: boolean;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function HomeHeader({ hasNewPapers = false }: HomeHeaderProps) {
  const preferences = usePaperStackStore((state) => state.userPreferences);
  const boardId = preferences.selectedBoards?.[0] ?? preferences.selectedBoard;
  const board = boards.find((item) => item.id === boardId);

  return (
    <View className="flex-row items-start justify-between gap-4">
      <View className="flex-1 gap-3">
        <View className="gap-1">
          <Typography variant="heading2">{getGreeting()} 👋</Typography>
          <Typography variant="bodySmall" color="muted">
            Find the paper you need, faster.
          </Typography>
        </View>
        <View className="flex-row flex-wrap gap-2">
          <Badge label={board?.shortName ?? "All boards"} color={board?.color} />
          <Badge
            label={preferences.selectedClass ? `Class ${preferences.selectedClass}` : "All classes"}
          />
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        className="relative h-11 w-11 items-center justify-center rounded-lg border border-border bg-card active:opacity-80 dark:border-border-dark dark:bg-card-dark"
      >
        <Bell color={colors.foreground.light} size={21} />
        {hasNewPapers ? (
          <View className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary dark:bg-primary-dark" />
        ) : null}
      </Pressable>
    </View>
  );
}
