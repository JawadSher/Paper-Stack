import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import type { ClassLevel } from "@/types";

interface ClassSelectorProps {
  selectedClass?: ClassLevel;
  onSelect: (classLevel: ClassLevel) => void;
}

const classes: ClassLevel[] = [9, 10, 11, 12];

export function ClassSelector({ selectedClass, onSelect }: ClassSelectorProps) {
  const indicator = useRef(new Animated.Value(Math.max(0, classes.indexOf(selectedClass ?? 9))))
    .current;

  useEffect(() => {
    Animated.spring(indicator, {
      toValue: Math.max(0, classes.indexOf(selectedClass ?? 9)),
      useNativeDriver: false,
      friction: 9,
      tension: 80,
    }).start();
  }, [indicator, selectedClass]);

  const translateX = indicator.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ["0%", "100%", "200%", "300%"],
  });

  return (
    <View className="gap-3">
      <View className="flex-row gap-2 rounded-lg bg-muted p-1 dark:bg-muted-dark">
        {classes.map((classLevel) => {
          const selected = selectedClass === classLevel;

          return (
            <Pressable
              key={classLevel}
              accessibilityRole="button"
              onPress={() => onSelect(classLevel)}
              className={[
                "h-12 flex-1 items-center justify-center rounded-md",
                selected ? "bg-primary dark:bg-primary-dark" : "bg-transparent",
              ].join(" ")}
            >
              <Typography
                variant="bodySmall"
                weight="semibold"
                className={selected ? "text-white dark:text-white" : undefined}
              >
                Class {classLevel}
              </Typography>
            </Pressable>
          );
        })}
      </View>
      <View className="h-1 overflow-hidden rounded-full bg-muted dark:bg-muted-dark">
        <Animated.View
          className="h-1 w-1/4 rounded-full"
          style={{ backgroundColor: colors.primary.light, transform: [{ translateX }] }}
        />
      </View>
    </View>
  );
}
