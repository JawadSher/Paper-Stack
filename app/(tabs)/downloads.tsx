import { Text, View } from "react-native";

import { usePaperStackStore } from "@/store";

export default function DownloadsScreen() {
  const downloads = usePaperStackStore((state) => state.downloads);
  const downloadCount = Object.keys(downloads).length;

  return (
    <View className="flex-1 bg-background px-5 pt-16 dark:bg-background-dark">
      <Text className="font-sans font-semibold text-2xl text-foreground dark:text-foreground-dark">
        Downloads
      </Text>
      <Text className="mt-2 font-sans text-base text-muted-foreground dark:text-muted-foreground-dark">
        {downloadCount} paper{downloadCount === 1 ? "" : "s"} saved offline.
      </Text>
    </View>
  );
}
