import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import type { ClassLevel } from "@/types";

interface ClassSelectorProps {
  selectedClass?: ClassLevel;
  accentColor?: string;
  onSelect: (classLevel: ClassLevel) => void;
}

const classes: ClassLevel[] = [9, 10, 11, 12];

export function ClassSelector({ selectedClass, accentColor = colors.primary.light, onSelect }: ClassSelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {classes.map((classLevel) => {
        const selected = selectedClass === classLevel;

        return (
          <Pressable
            key={classLevel}
            accessibilityRole="button"
            onPress={() => onSelect(classLevel)}
            className="min-h-28 w-[48%] justify-between rounded-lg border bg-card p-4 active:opacity-90 dark:bg-card-dark"
            style={{
              borderColor: selected ? accentColor : `${accentColor}66`,
              borderLeftColor: accentColor,
              borderLeftWidth: 5,
            }}
          >
            <Typography variant="caption" color="muted" weight="medium">
              Class
            </Typography>
            <Typography variant="heading1" style={{ color: accentColor }}>
              {classLevel}
            </Typography>
            <Typography variant="caption" color="muted">
              Subjects and papers
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
