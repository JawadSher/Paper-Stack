import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

const popularSubjects = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "Computer Science",
  "English",
  "Urdu",
];

export function PopularSubjects() {
  const router = useRouter();

  return (
    <View className="gap-4">
      <Typography variant="heading3">Popular Subjects</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {popularSubjects.map((subject) => (
            <Pressable
              key={subject}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/search",
                  params: { subject },
                } as never)
              }
              className="rounded-full border border-border bg-card px-4 py-2 active:opacity-80 dark:border-border-dark dark:bg-card-dark"
            >
              <Typography variant="bodySmall" weight="medium">
                {subject}
              </Typography>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
