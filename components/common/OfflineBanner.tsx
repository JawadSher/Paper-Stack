import { useEffect, useState } from "react";
import { View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { WifiOff } from "lucide-react-native";

import { Typography } from "../ui/Typography";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOffline(state.isConnected === false || state.isInternetReachable === false);
    });

    return unsubscribe;
  }, []);

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
