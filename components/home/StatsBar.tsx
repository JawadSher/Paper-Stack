import { View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";

export function StatsBar() {
  const boardCount = boards.length;
  const subjectCount = subjects.length;
  const stats = [
    `${(boardCount * subjectCount * 6 * 2).toLocaleString()}+ Papers`,
    `${boardCount} Boards`,
    "5 Years",
  ];

  return (
    <View className="flex-row gap-2 rounded-lg bg-muted p-2 dark:bg-muted-dark">
      {stats.map((stat) => (
        <View
          key={stat}
          className="min-h-10 flex-1 items-center justify-center rounded-md bg-card px-2 dark:bg-card-dark"
        >
          <Typography variant="caption" weight="semibold" align="center">
            {stat}
          </Typography>
        </View>
      ))}
    </View>
  );
}
