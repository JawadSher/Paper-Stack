import { useRouter } from "expo-router";
import { Download, WifiOff } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { useDownloads } from "@/hooks/useDownloads";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

import { Typography } from "../ui/Typography";

export function OfflineDownloadsShortcut() {
  const router = useRouter();
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const { downloadedPapers, isHydratingDownloads } = useDownloads();
  const downloadCount = downloadedPapers.length;
  const isOffline = !isConnected || !isInternetReachable;

  if (!isOffline) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push("/(tabs)/downloads" as never)}
      className="flex-row items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4 active:opacity-85 dark:border-primary-dark/30 dark:bg-primary-dark/10"
    >
      <View className="h-11 w-11 items-center justify-center rounded-lg bg-primary dark:bg-primary-dark">
        {downloadCount > 0 ? (
          <Download color="#FFFFFF" size={22} />
        ) : (
          <WifiOff color="#FFFFFF" size={22} />
        )}
      </View>
      <View className="flex-1 gap-1">
        <Typography variant="body" weight="semibold">
          {downloadCount > 0 ? "Offline papers available" : "You are offline"}
        </Typography>
        <Typography variant="caption" color="muted">
          {downloadCount > 0
            ? `${downloadCount} saved paper${downloadCount === 1 ? "" : "s"} can be opened now.`
            : isHydratingDownloads
              ? "Checking saved papers on this device..."
            : "Downloads will appear here after you save papers for offline reading."}
        </Typography>
      </View>
    </Pressable>
  );
}
