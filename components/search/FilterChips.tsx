import { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, View } from "react-native";
import { X } from "lucide-react-native";

import { Typography } from "@/components/ui/Typography";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import { colors } from "@/constants/theme";
import type { SearchFilters } from "@/hooks/useSearch";

interface FilterChipsProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters, value: string | number) => void;
  onClearAll: () => void;
}

export function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-14)).current;
  const chips = [
    ...filters.boardIds.map((value) => ({
      key: "boardIds" as const,
      value,
      label: boards.find((board) => board.id === value)?.shortName ?? value,
    })),
    ...filters.classes.map((value) => ({ key: "classes" as const, value, label: `Class ${value}` })),
    ...filters.subjectIds.map((value) => ({
      key: "subjectIds" as const,
      value,
      label: subjects.find((subject) => subject.id === value)?.name ?? value,
    })),
    ...filters.years.map((value) => ({ key: "years" as const, value, label: String(value) })),
    ...filters.paperTypes.map((value) => ({
      key: "paperTypes" as const,
      value,
      label: value === "annual" ? "Annual" : "Supplementary",
    })),
  ];

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: chips.length ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateX, {
      toValue: chips.length ? 0 : -14,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [chips.length, opacity, translateX]);

  if (!chips.length) {
    return null;
  }

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-center gap-2">
          {chips.map((chip) => (
            <Pressable
              key={`${chip.key}-${chip.value}`}
              accessibilityRole="button"
              onPress={() => onRemove(chip.key, chip.value)}
              className="flex-row items-center gap-2 rounded-full border border-border bg-card px-3 py-2 active:opacity-80 dark:border-border-dark dark:bg-card-dark"
            >
              <Typography variant="caption" weight="semibold">
                {chip.label}
              </Typography>
              <X color={colors.mutedForeground.light} size={14} />
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={onClearAll}
            className="rounded-full bg-muted px-3 py-2 active:opacity-80 dark:bg-muted-dark"
          >
            <Typography variant="caption" color="primary" weight="semibold">
              Clear all
            </Typography>
          </Pressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
