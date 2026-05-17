import { View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { questionYears } from "@/constants/questions";
import { colors } from "@/constants/theme";

interface YearDotsProps {
  years: number[];
}

export function YearDots({ years }: YearDotsProps) {
  return (
    <View className="flex-row items-center justify-between">
      {questionYears.map((year) => {
        const appeared = years.includes(year);

        return (
          <View key={year} className="items-center gap-1">
            <View
              className="h-4 w-4 rounded-full border"
              style={{
                backgroundColor: appeared ? colors.primary.light : "transparent",
                borderColor: appeared ? colors.primary.light : colors.border.light,
              }}
            />
            <Typography variant="caption" color="muted">
              {year}
            </Typography>
          </View>
        );
      })}
    </View>
  );
}
