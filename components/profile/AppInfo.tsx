import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { ExternalLink, Share2, Star } from "lucide-react-native";
import { Linking, Pressable, Share, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

export function AppInfo() {
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const shareApp = async () => {
    const message = "PaperStack - past papers for Pakistani students, offline.";

    if (await Sharing.isAvailableAsync()) {
      const uri = `${FileSystem.cacheDirectory}paperstack-share.txt`;
      await FileSystem.writeAsStringAsync(uri, message);
      await Sharing.shareAsync(uri, { dialogTitle: "Share PaperStack" });
      return;
    }

    await Share.share({ message });
  };

  return (
    <View className="gap-3">
      <View className="px-4 py-3">
        <Typography variant="bodySmall" weight="semibold">
          PaperStack {version}
        </Typography>
        <Typography variant="caption" color="muted">
          Made for Pakistani students
        </Typography>
      </View>
      <Pressable
        accessibilityRole="button"
        // TODO: replace with real Play Store / App Store URL after publishing
        onPress={() =>
          Linking.openURL("https://play.google.com/store/apps/details?id=com.paperstack.app")
        }
        className="flex-row items-center gap-3 border-t border-border px-4 py-3 active:bg-muted dark:border-border-dark dark:active:bg-muted-dark"
      >
        <Star color={colors.primary.light} size={18} />
        <Typography variant="bodySmall" className="flex-1">
          Rate the app
        </Typography>
        <ExternalLink color={colors.mutedForeground.light} size={16} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={shareApp}
        className="flex-row items-center gap-3 border-t border-border px-4 py-3 active:bg-muted dark:border-border-dark dark:active:bg-muted-dark"
      >
        <Share2 color={colors.primary.light} size={18} />
        <Typography variant="bodySmall" className="flex-1">
          Share PaperStack
        </Typography>
      </Pressable>
    </View>
  );
}
