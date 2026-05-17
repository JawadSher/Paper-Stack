import { useRouter } from "expo-router";
import { BookmarkCheck, BookmarkPlus, Share2, X } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

interface ViewerHeaderProps {
  title: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
}

export function ViewerHeader({
  title,
  isBookmarked,
  onToggleBookmark,
  onShare,
}: ViewerHeaderProps) {
  const router = useRouter();
  const BookmarkIcon = isBookmarked ? BookmarkCheck : BookmarkPlus;

  return (
    <View className="flex-row items-center gap-3 border-b border-border bg-background px-4 py-3 dark:border-border-dark dark:bg-background-dark">
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-80 dark:bg-muted-dark"
      >
        <X color={colors.foreground.light} size={21} />
      </Pressable>
      <Typography variant="bodySmall" weight="semibold" numberOfLines={1} className="flex-1">
        {title}
      </Typography>
      <Pressable
        accessibilityRole="button"
        onPress={onToggleBookmark}
        className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-80 dark:bg-muted-dark"
      >
        <BookmarkIcon color={isBookmarked ? colors.primary.light : colors.foreground.light} size={21} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onShare}
        className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-80 dark:bg-muted-dark"
      >
        <Share2 color={colors.foreground.light} size={20} />
      </Pressable>
    </View>
  );
}
