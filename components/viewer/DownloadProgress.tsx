import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { Check, X } from "lucide-react-native";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

interface DownloadProgressProps {
  visible: boolean;
  completed: boolean;
  progress: number;
  onCancel: () => void;
}

export function DownloadProgress({
  visible,
  completed,
  progress,
  onCancel,
}: DownloadProgressProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : -12,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      className="absolute left-5 right-5 top-5 z-20 rounded-full border border-border bg-card px-4 py-3 shadow-sm dark:border-border-dark dark:bg-card-dark"
      style={{ opacity, transform: [{ translateY }] }}
    >
      <View className="flex-row items-center gap-3">
        <View className="flex-1 gap-2">
          <View className="flex-row items-center justify-between">
            <Typography variant="caption" weight="semibold">
              {completed ? "Downloaded" : "Downloading..."}
            </Typography>
            <Typography variant="caption" color="muted">
              {Math.round(progress * 100)}%
            </Typography>
          </View>
          <View className="h-1.5 overflow-hidden rounded-full bg-muted dark:bg-muted-dark">
            <View
              className="h-1.5 rounded-full bg-primary dark:bg-primary-dark"
              style={{ width: `${Math.max(4, Math.round(progress * 100))}%` }}
            />
          </View>
        </View>
        {completed ? (
          <Check color={colors.primary.light} size={20} />
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={onCancel}
            className="h-8 w-8 items-center justify-center rounded-full bg-muted dark:bg-muted-dark"
          >
            <X color={colors.foreground.light} size={17} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}
