import { Alert, Pressable, View } from "react-native";
import { Trash2 } from "lucide-react-native";

import { Typography } from "@/components/ui/Typography";

interface StorageUsageBarProps {
  totalSize: number;
  onClearAll: () => void;
}

export function formatBytes(bytes?: number | null) {
  if (!bytes || bytes <= 0) {
    return "0 MB";
  }

  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function StorageUsageBar({ totalSize, onClearAll }: StorageUsageBarProps) {
  const capacity = 1024 * 1024 * 1024;
  const progress = Math.min(1, totalSize / capacity);

  const confirmClear = () => {
    Alert.alert("Clear all downloads?", "Downloaded papers will no longer be available offline.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: onClearAll },
    ]);
  };

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Typography variant="body" weight="semibold">
            Used {formatBytes(totalSize)} of device storage
          </Typography>
          <Typography variant="caption" color="muted">
            Downloaded papers are stored locally for offline access.
          </Typography>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={totalSize === 0}
          onPress={confirmClear}
          className="flex-row items-center gap-2 rounded-full bg-muted px-3 py-2 active:opacity-80 disabled:opacity-40 dark:bg-muted-dark"
        >
          <Trash2 color="#C96442" size={15} />
          <Typography variant="caption" color="primary" weight="semibold">
            Clear all
          </Typography>
        </Pressable>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-muted dark:bg-muted-dark">
        <View className="h-2 rounded-full bg-primary dark:bg-primary-dark" style={{ width: `${Math.max(2, progress * 100)}%` }} />
      </View>
    </View>
  );
}
