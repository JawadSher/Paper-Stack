import { Text, View } from "react-native";

import { boards } from "@/constants/boards";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background px-5 pt-16 dark:bg-background-dark">
      <Text className="font-sans font-semibold text-3xl text-foreground dark:text-foreground-dark">
        PaperStack
      </Text>
      <Text className="mt-2 font-sans font-normal text-base text-muted-foreground dark:text-muted-foreground-dark">
        Pakistan board papers, downloads, and bookmarks in one place.
      </Text>
      <View className="mt-8 rounded-lg border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
        <Text className="font-sans font-semibold text-lg text-card-foreground dark:text-card-foreground-dark">
          Boards configured
        </Text>
        <Text className="mt-1 font-sans font-normal text-sm text-muted-foreground dark:text-muted-foreground-dark">
          {boards.length} Pakistan educational boards are ready.
        </Text>
      </View>
    </View>
  );
}
