import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import type { ThemePreference } from "@/types";

interface ThemeToggleProps {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
}

const options: { label: string; value: ThemePreference }[] = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <View className="flex-row rounded-lg bg-muted p-1 dark:bg-muted-dark">
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            onPress={() => onChange(option.value)}
            className={[
              "h-9 flex-1 items-center justify-center rounded-md",
              selected ? "bg-primary dark:bg-primary-dark" : "bg-transparent",
            ].join(" ")}
          >
            <Typography
              variant="caption"
              weight="semibold"
              className={selected ? "text-white dark:text-white" : undefined}
            >
              {option.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
