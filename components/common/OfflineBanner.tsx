import { View } from "react-native";
import { WifiOff } from "lucide-react-native";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";

import { Typography } from "../ui/Typography";

export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const offline = !isConnected || !isInternetReachable;

  if (!offline) {
    return null;
  }

  return (
    <View className="flex-row items-center justify-center gap-2 bg-destructive px-4 py-2 dark:bg-destructive-dark">
      <WifiOff color="#FFFFFF" size={16} />
      <Typography variant="caption" weight="semibold" className="text-destructive-foreground">
        You&apos;re offline. Showing downloaded papers only.
      </Typography>
    </View>
  );
}
