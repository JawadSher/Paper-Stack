import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { AlertCircle, Check, Download } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";

import { colors } from "@/constants/theme";
import { usePaperStackStore } from "@/store";
import type { Download as DownloadRecord, Paper } from "@/types";

import { Typography } from "../ui/Typography";

export interface DownloadButtonProps {
  paperId: Paper["id"];
  fileName?: string;
  onDownload?: (paperId: Paper["id"]) => Promise<DownloadRecord | void> | DownloadRecord | void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const ringSize = 28;
const strokeWidth = 3;
const radius = (ringSize - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

export function DownloadButton({ paperId, fileName, onDownload }: DownloadButtonProps) {
  const downloads = usePaperStackStore((state) => state.downloads);
  const progress = usePaperStackStore((state) => state.downloadProgress[paperId] ?? 0);
  const addDownload = usePaperStackStore((state) => state.addDownload);
  const setDownloadProgress = usePaperStackStore((state) => state.setDownloadProgress);
  const clearDownloadProgress = usePaperStackStore((state) => state.clearDownloadProgress);
  const [error, setError] = useState(false);
  const animatedProgress = useRef(new Animated.Value(progress)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const downloaded = Boolean(downloads[paperId]);
  const downloading = progress > 0 && progress < 1 && !downloaded;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [animatedProgress, progress]);

  useEffect(() => {
    if (downloading) {
      rotate.setValue(0);
      Animated.loop(
        Animated.timing(rotate, { toValue: 1, duration: 900, useNativeDriver: true }),
      ).start();
      return;
    }

    rotate.stopAnimation();
  }, [downloading, rotate]);

  useEffect(() => {
    if (downloaded) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.12, useNativeDriver: true, tension: 180, friction: 8 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 180, friction: 8 }),
      ]).start();
    }
  }, [downloaded, scale]);

  const strokeDashoffset = useMemo(
    () =>
      animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
      }),
    [animatedProgress],
  );

  const handlePress = async () => {
    if (downloaded || downloading) {
      return;
    }

    try {
      setError(false);
      setDownloadProgress(paperId, 0.08);
      const result = await onDownload?.(paperId);
      setDownloadProgress(paperId, 1);
      addDownload(
        result ?? {
          paperId,
          localUri: "",
          fileName: fileName ?? `${paperId}.pdf`,
          downloadedAt: new Date().toISOString(),
        },
      );
      clearDownloadProgress(paperId);
    } catch {
      setError(true);
      clearDownloadProgress(paperId);
    }
  };

  if (downloaded) {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable className="flex-row items-center gap-1.5 rounded-full bg-chart-3 px-3 py-2 dark:bg-chart-3-dark">
        <Check color={colors.chart[3].dark} size={16} />
        <Typography variant="caption" weight="semibold">
          Downloaded
        </Typography>
        </Pressable>
      </Animated.View>
    );
  }

  if (downloading) {
    return (
      <View className="flex-row items-center gap-2 rounded-full bg-muted px-3 py-2 dark:bg-muted-dark">
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          }}
        >
        <Svg width={ringSize} height={ringSize}>
          <Circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            stroke={colors.border.light}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            stroke={colors.primary.light}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            rotation="-90"
            origin={`${ringSize / 2}, ${ringSize / 2}`}
          />
        </Svg>
        </Animated.View>
        <Typography variant="caption" weight="semibold">
          {Math.round(progress * 100)}%
        </Typography>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      className={[
        "flex-row items-center gap-1.5 rounded-full px-3 py-2 active:opacity-80",
        error ? "bg-destructive dark:bg-destructive-dark" : "bg-primary dark:bg-primary-dark",
      ].join(" ")}
    >
      {error ? <AlertCircle color="#FFFFFF" size={16} /> : <Download color="#FFFFFF" size={16} />}
      <Typography variant="caption" weight="semibold" className="text-primary-foreground">
        {error ? "Retry" : "Download"}
      </Typography>
    </Pressable>
  );
}
