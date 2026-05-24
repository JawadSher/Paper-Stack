import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

function StackHeader() {
  const router = useRouter();

  return (
    <SafeAreaView
      edges={["top"]}
      className="border-b border-border bg-background dark:border-border-dark dark:bg-background-dark"
    >
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-80 dark:bg-muted-dark"
        >
          <ChevronLeft color={colors.foreground.light} size={22} />
        </Pressable>
        <Typography variant="bodySmall" weight="semibold">
          Paper Stack
        </Typography>
      </View>
    </SafeAreaView>
  );
}

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <StackHeader />,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="viewer/[paperId]" options={{ headerShown: false }} />
    </Stack>
  );
}
