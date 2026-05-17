import { View } from "react-native";

import { Typography } from "./Typography";

type BadgeSize = "sm" | "md";

export interface BadgeProps {
  label: string;
  color?: string;
  size?: BadgeSize;
  className?: string;
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5",
  md: "px-3 py-1",
};

export function Badge({ label, color, size = "md", className }: BadgeProps) {
  return (
    <View
      className={[
        "self-start rounded-full border border-border bg-muted dark:border-border-dark dark:bg-muted-dark",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={color ? { backgroundColor: `${color}22`, borderColor: `${color}66` } : undefined}
    >
      <Typography variant={size === "sm" ? "caption" : "bodySmall"} weight="medium">
        {label}
      </Typography>
    </View>
  );
}
