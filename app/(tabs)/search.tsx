import { Text, View } from "react-native";

export default function SearchScreen() {
  return (
    <View className="flex-1 bg-background px-5 pt-16 dark:bg-background-dark">
      <Text className="font-sans font-semibold text-2xl text-foreground dark:text-foreground-dark">
        Search
      </Text>
      <Text className="mt-2 font-sans text-base text-muted-foreground dark:text-muted-foreground-dark">
        Search scaffolding is ready for papers, boards, classes, and subjects.
      </Text>
    </View>
  );
}
