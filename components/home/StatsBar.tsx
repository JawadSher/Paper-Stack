import { View } from "react-native";

import { Typography } from "@/components/ui/Typography";

const stats = ["1,200+ Papers", "40+ Boards", "5 Years"];

export function StatsBar() {
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
