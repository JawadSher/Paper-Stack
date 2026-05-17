import { Pressable } from "react-native";

import { Typography } from "../ui/Typography";

export interface YearChipProps {
  year: number;
  selected?: boolean;
  onPress?: (year: number) => void;
}

export function YearChip({ year, selected = false, onPress }: YearChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(year)}
      className={[
        "rounded-full border px-3 py-2 active:opacity-80",
        selected
          ? "border-primary bg-primary dark:border-primary-dark dark:bg-primary-dark"
          : "border-border bg-card dark:border-border-dark dark:bg-card-dark",
      ].join(" ")}
    >
      <Typography
        variant="caption"
        weight="semibold"
        className={selected ? "text-primary-foreground" : undefined}
      >
        {year}
      </Typography>
    </Pressable>
  );
}
