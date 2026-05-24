import { useRouter } from "expo-router";
import { BookmarkCheck, BookmarkPlus, Share2, X } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

interface ViewerHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
}

export function ViewerHeader({
  title,
  subtitle,
  accentColor = colors.primary.light,
  isBookmarked,
  onToggleBookmark,
  onShare,
}: ViewerHeaderProps) {
  const router = useRouter();
  const BookmarkIcon = isBookmarked ? BookmarkCheck : BookmarkPlus;

  return (
    <View
      className="flex-row items-center gap-3 border-b bg-background px-4 py-3 dark:bg-background-dark"
      style={{ borderBottomColor: `${accentColor}3D` }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-full active:opacity-80"
        style={{ backgroundColor: `${accentColor}18` }}
      >
        <X color={accentColor} size={21} />
      </Pressable>
      <View className="flex-1 gap-0.5">
        <Typography variant="bodySmall" weight="semibold" numberOfLines={1}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="caption" color="muted" numberOfLines={1}>
            {subtitle}
          </Typography>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onToggleBookmark}
        className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-80 dark:bg-muted-dark"
      >
        <BookmarkIcon color={isBookmarked ? accentColor : colors.foreground.light} size={21} />
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
