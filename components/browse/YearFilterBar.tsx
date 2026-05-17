import { Pressable, ScrollView, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

import { type YearFilter, paperYears } from "./browseData";

interface YearFilterBarProps {
  selectedYear: YearFilter;
  onSelect: (year: YearFilter) => void;
}

const years: YearFilter[] = ["all", ...paperYears];

export function YearFilterBar({ selectedYear, onSelect }: YearFilterBarProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2">
        {years.map((year) => {
          const selected = selectedYear === year;

          return (
            <Pressable
              key={year}
              accessibilityRole="button"
              onPress={() => onSelect(year)}
              className={[
                "rounded-full border px-4 py-2 active:opacity-80",
                selected
                  ? "border-primary bg-primary dark:border-primary-dark dark:bg-primary-dark"
                  : "border-border bg-card dark:border-border-dark dark:bg-card-dark",
              ].join(" ")}
            >
              <Typography
                variant="bodySmall"
                weight="semibold"
                className={selected ? "text-white dark:text-white" : undefined}
              >
                {year === "all" ? "All" : year}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
