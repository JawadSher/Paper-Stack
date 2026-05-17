import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

import { colors } from "@/constants/theme";

import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-8 py-12">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-muted dark:bg-muted-dark">
        <Icon color={colors.primary.light} size={34} />
      </View>
      <View className="gap-2">
        <Typography variant="heading3" align="center">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="bodySmall" color="muted" align="center">
            {subtitle}
          </Typography>
        ) : null}
      </View>
      {actionLabel && onAction ? <Button onPress={onAction}>{actionLabel}</Button> : null}
    </View>
  );
}
