import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

interface FrequencyBarProps {
  frequency: number;
  totalYears?: number;
}

function getColor(frequency: number) {
  if (frequency >= 5) {
    return "#16A34A";
  }

  if (frequency >= 4) {
    return "#0F766E";
  }

  if (frequency >= 3) {
    return colors.primary.light;
  }

  return colors.mutedForeground.light;
}

export function FrequencyBar({ frequency, totalYears = 5 }: FrequencyBarProps) {
  const width = useRef(new Animated.Value(0)).current;
  const percentage = Math.min(1, frequency / totalYears);
  const fillColor = getColor(frequency);

  useEffect(() => {
    Animated.timing(width, {
      toValue: percentage,
      duration: 420,
      useNativeDriver: false,
    }).start();
  }, [percentage, width]);

  const animatedWidth = width.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="gap-2">
      <View className="h-2 overflow-hidden rounded-full bg-muted dark:bg-muted-dark">
        <Animated.View
          className="h-2 rounded-full"
          style={{ width: animatedWidth, backgroundColor: fillColor }}
        />
      </View>
      <Typography variant="caption" color="muted" weight="medium">
        Asked in {frequency} out of {totalYears} years
      </Typography>
    </View>
  );
}
