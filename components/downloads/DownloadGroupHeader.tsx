import { View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";

interface DownloadGroupHeaderProps {
  subjectName: string;
  count: number;
}

export function DownloadGroupHeader({ subjectName, count }: DownloadGroupHeaderProps) {
  return (
    <View className="flex-row items-center gap-2 border-b border-border bg-background py-3 dark:border-border-dark dark:bg-background-dark">
      <Typography variant="bodySmall" weight="semibold" className="flex-1">
        {subjectName}
      </Typography>
      <Badge label={`${count}`} size="sm" />
    </View>
  );
}
