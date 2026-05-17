import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import { ChevronRight, User } from "lucide-react-native";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { AppInfo } from "@/components/profile/AppInfo";
import { BoardSelector } from "@/components/profile/BoardSelector";
import { PreferenceRow, PreferenceSection } from "@/components/profile/PreferenceSection";
import { ThemeToggle } from "@/components/profile/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { boards } from "@/constants/boards";
import { formatBytes } from "@/components/downloads/StorageUsageBar";
import { useDownloads } from "@/hooks/useDownloads";
import { usePaperStackStore } from "@/store";
import type { ClassLevel, TextSizePreference } from "@/types";

const classes: ClassLevel[] = [9, 10, 11, 12];
const textSizes: { label: string; value: TextSizePreference }[] = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const preferences = usePaperStackStore((state) => state.userPreferences);
  const setSelectedBoards = usePaperStackStore((state) => state.setSelectedBoards);
  const setSelectedClass = usePaperStackStore((state) => state.setSelectedClass);
  const setTheme = usePaperStackStore((state) => state.setTheme);
  const setTextSize = usePaperStackStore((state) => state.setTextSize);
  const bookmarkCount = usePaperStackStore((state) => state.bookmarkedPaperIds.size);
  const { downloadedPapers, totalSize } = useDownloads();
  const [boardSelectorVisible, setBoardSelectorVisible] = useState(false);
  const selectedBoardIds = preferences.selectedBoards?.length
    ? preferences.selectedBoards
    : preferences.selectedBoard
      ? [preferences.selectedBoard]
      : [];
  const boardLabel = selectedBoardIds.length
    ? selectedBoardIds
        .map((id) => boards.find((board) => board.id === id)?.shortName)
        .filter(Boolean)
        .join(", ")
    : "Not set";

  const clearCache = async () => {
    try {
      await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}paperstack-share.txt`, {
        idempotent: true,
      });
      Alert.alert("Cache cleared", "Temporary PaperStack cache files were cleared.");
    } catch {
      Alert.alert("Cache cleared", "Temporary PaperStack cache files were cleared.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 px-5 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-3">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-muted dark:bg-muted-dark">
            <User color="#C96442" size={38} />
          </View>
          <View className="items-center gap-1">
            <Typography variant="heading3">Guest User</Typography>
            <Typography variant="bodySmall" color="muted">
              {downloadedPapers.length + bookmarkCount} papers accessed
            </Typography>
          </View>
        </View>

        <PreferenceSection title="My Preferences">
          <PreferenceRow label="Board" value={boardLabel} onPress={() => setBoardSelectorVisible(true)} />
          <PreferenceRow label="Class">
            <View className="flex-row gap-1">
              {classes.map((classLevel) => {
                const selected = preferences.selectedClass === classLevel;

                return (
                  <Pressable
                    key={classLevel}
                    accessibilityRole="button"
                    onPress={() => setSelectedClass(classLevel)}
                    className={[
                      "h-8 w-9 items-center justify-center rounded-md",
                      selected ? "bg-primary dark:bg-primary-dark" : "bg-muted dark:bg-muted-dark",
                    ].join(" ")}
                  >
                    <Typography
                      variant="caption"
                      weight="semibold"
                      className={selected ? "text-white dark:text-white" : undefined}
                    >
                      {classLevel}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>
          </PreferenceRow>
        </PreferenceSection>

        <PreferenceSection title="Appearance">
          <View className="border-b border-border px-4 py-3 dark:border-border-dark">
            <Typography variant="bodySmall" weight="medium" className="mb-3">
              Theme
            </Typography>
            <ThemeToggle value={preferences.theme} onChange={setTheme} />
          </View>
          <PreferenceRow label="Text Size">
            <View className="flex-row gap-1">
              {textSizes.map((item) => {
                const selected = (preferences.textSize ?? "medium") === item.value;

                return (
                  <Pressable
                    key={item.value}
                    accessibilityRole="button"
                    onPress={() => setTextSize(item.value)}
                    className={[
                      "rounded-md px-2 py-1.5",
                      selected ? "bg-primary dark:bg-primary-dark" : "bg-muted dark:bg-muted-dark",
                    ].join(" ")}
                  >
                    <Typography
                      variant="caption"
                      weight="semibold"
                      className={selected ? "text-white dark:text-white" : undefined}
                    >
                      {item.label}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>
          </PreferenceRow>
        </PreferenceSection>

        <PreferenceSection title="Bookmarks">
          <PreferenceRow label="Saved Papers" onPress={() => router.push("/(stack)/bookmarks" as never)}>
            <View className="flex-row items-center gap-2">
              <Badge label={`${bookmarkCount}`} size="sm" />
              <ChevronRight color="#83827D" size={17} />
            </View>
          </PreferenceRow>
        </PreferenceSection>

        <PreferenceSection title="Storage">
          <PreferenceRow label="Downloaded Papers" onPress={() => router.push("/(tabs)/downloads" as never)}>
            <View className="flex-row items-center gap-2">
              <Typography variant="bodySmall" color="muted">
                {formatBytes(totalSize)}
              </Typography>
              <ChevronRight color="#83827D" size={17} />
            </View>
          </PreferenceRow>
          <PreferenceRow label="Clear cache" value="Temporary files" onPress={clearCache} />
        </PreferenceSection>

        <PreferenceSection title="About">
          <AppInfo />
        </PreferenceSection>
      </ScrollView>
      <BoardSelector
        visible={boardSelectorVisible}
        selectedBoardIds={selectedBoardIds}
        onClose={() => setBoardSelectorVisible(false)}
        onSave={setSelectedBoards}
      />
    </SafeAreaView>
  );
}
