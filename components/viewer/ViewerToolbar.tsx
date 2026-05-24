import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { MessageSquareText, ZoomIn, ZoomOut } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DownloadButton } from "@/components/papers/DownloadButton";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import type { Paper } from "@/types";

import { PageIndicator } from "./PageIndicator";

interface ViewerToolbarProps {
  paper: Paper;
  accentColor?: string;
  currentPage: number;
  totalPages: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onJumpToPage: (page: number) => void;
  onDownload: () => Promise<void>;
  onCommonQuestions: () => void;
}

export function ViewerToolbar({
  paper,
  accentColor = colors.primary.light,
  currentPage,
  totalPages,
  onZoomIn,
  onZoomOut,
  onJumpToPage,
  onDownload,
  onCommonQuestions,
}: ViewerToolbarProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 220 });
    translateY.value = withTiming(0, { duration: 220 });
  }, [opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      className="absolute left-0 right-0 gap-3 border-t border-border bg-background/95 px-4 pt-3 dark:border-border-dark dark:bg-background-dark"
      style={[style, { bottom: 0, paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View className="flex-row items-center justify-center gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={onZoomOut}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-80 dark:bg-muted-dark"
        >
          <ZoomOut color={colors.foreground.light} size={19} />
        </Pressable>
        <PageIndicator
          currentPage={currentPage}
          totalPages={totalPages}
          onJumpToPage={onJumpToPage}
        />
        <Pressable
          accessibilityRole="button"
          onPress={onZoomIn}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-80 dark:bg-muted-dark"
        >
          <ZoomIn color={colors.foreground.light} size={19} />
        </Pressable>
      </View>
      <View className="flex-row items-center justify-between gap-3">
        <DownloadButton paperId={paper.id} fileName={`${paper.title}.pdf`} onDownload={onDownload} />
        <Pressable
          accessibilityRole="button"
          onPress={onCommonQuestions}
          className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full active:opacity-80"
          style={{ backgroundColor: accentColor }}
        >
          <MessageSquareText color="#FFFFFF" size={18} />
          <Typography variant="caption" weight="semibold" className="text-white dark:text-white">
            Common Questions
          </Typography>
        </Pressable>
      </View>
    </Animated.View>
  );
}
