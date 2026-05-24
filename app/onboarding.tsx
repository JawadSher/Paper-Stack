import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, useRouter } from "expo-router";
import { BookOpen, Check, Download, Search, Zap } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Platform, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { Typography } from "@/components/ui/Typography";
import { boards as boardsFallback } from "@/constants/boards";
import { colors } from "@/constants/theme";
import { useBoards } from "@/hooks/api";
import { usePaperStackStore } from "@/store";
import type { ClassLevel } from "@/types";

const onboardingFlagKey = "paper-stack:onboarding-complete";

const features = [
  { label: "All Pakistan boards", icon: BookOpen },
  { label: "Offline access", icon: Download },
  { label: "Smart search", icon: Search },
  { label: "Common questions", icon: Zap },
];

const classOptions: { classLevel: ClassLevel; subjects: string }[] = [
  { classLevel: 9, subjects: "Physics, Biology, Mathematics" },
  { classLevel: 10, subjects: "Chemistry, English, Pakistan Studies" },
  { classLevel: 11, subjects: "Physics, Computer Science, Economics" },
  { classLevel: 12, subjects: "Mathematics, Biology, Statistics" },
];

function PaperStackLogo() {
  return (
    <View className="h-24 w-24 items-center justify-center">
      <View
        className="absolute h-14 w-16 rounded-md border border-border bg-muted dark:border-border-dark dark:bg-muted-dark"
        style={{
          transform: [
            { translateX: -8 },
            { translateY: 8 },
            { rotate: "-8deg" },
          ],
        }}
      />
      <View
        className="absolute h-14 w-16 rounded-md border border-border bg-secondary dark:border-border-dark dark:bg-secondary-dark"
        style={{
          transform: [{ translateX: 3 }, { translateY: 1 }, { rotate: "5deg" }],
        }}
      />
      <View className="h-14 w-16 rounded-md border-2 border-primary bg-card px-3 py-3 dark:border-primary-dark dark:bg-card-dark">
        <View className="mb-2 h-1.5 rounded-full bg-primary dark:bg-primary-dark" />
        <View className="mb-2 h-1.5 w-8 rounded-full bg-muted-foreground dark:bg-muted-foreground-dark" />
        <View className="h-1.5 w-10 rounded-full bg-muted dark:bg-muted-dark" />
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { data: boards = [], isLoading: boardsLoading } = useBoards();
  // OFFLINE FALLBACK — remove when confident in connectivity
  const boardsToShow = !boardsLoading && boards.length === 0 ? boardsFallback : boards;
  const setSelectedBoards = usePaperStackStore(
    (state) => state.setSelectedBoards,
  );
  const setSelectedClass = usePaperStackStore(
    (state) => state.setSelectedClass,
  );
  const [step, setStep] = useState(0);
  const [selectedBoardIds, setSelectedBoardIds] = useState<string[]>([]);
  const [selectedClass, setSelectedClassLevel] = useState<
    ClassLevel | undefined
  >();
  const selectedBoardSet = useMemo(
    () => new Set(selectedBoardIds),
    [selectedBoardIds],
  );

  const toggleBoard = (boardId: string) => {
    setSelectedBoardIds((current) =>
      current.includes(boardId)
        ? current.filter((id) => id !== boardId)
        : [...current, boardId],
    );
  };

  const finish = async () => {
    if (!selectedClass) {
      return;
    }

    setSelectedBoards(selectedBoardIds);
    setSelectedClass(selectedClass);
    await AsyncStorage.setItem(onboardingFlagKey, "true");
    router.replace("/(tabs)/home" as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark ">
      <View className="flex-1 px-5 py-6">
        <View className="mb-6 flex-row justify-center gap-2">
          {[0, 1, 2].map((item) => (
            <View
              key={item}
              className={[
                "h-1.5 rounded-full",
                item === step
                  ? "w-8 bg-primary dark:bg-primary-dark"
                  : "w-3 bg-muted dark:bg-muted-dark",
              ].join(" ")}
            />
          ))}
        </View>

        {step === 0 ? (
          <View className="flex-1 justify-between">
            <View className="items-center gap-6 pt-10">
              <PaperStackLogo />
              <View className="gap-3">
                <Typography variant="heading1" align="center">
                  Every past paper. One place.
                </Typography>
                <Typography variant="body" color="muted" align="center">
                  Access 5 years of past papers from all Pakistan boards,
                  offline.
                </Typography>
              </View>
              <View className="w-full gap-3 pt-4">
                {features.map(({ label, icon: Icon }) => (
                  <View
                    key={label}
                    className="flex-row items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 dark:border-border-dark dark:bg-card-dark"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-muted dark:bg-muted-dark">
                      <Icon color={colors.primary.light} size={20} />
                    </View>
                    <Typography variant="bodySmall" weight="medium">
                      {label}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
            <Button fullWidth size="lg" onPress={() => setStep(1)}>
              Get Started
            </Button>
          </View>
        ) : null}

        {step === 1 ? (
          <View className="flex-1 gap-5">
            <View className="gap-2">
              <Typography variant="heading2">
                Which board are you from?
              </Typography>
              <Typography variant="bodySmall" color="muted">
                Choose one or more boards you follow.
              </Typography>
            </View>
            {boardsLoading ? (
              <View className="gap-3">
                {[0, 1, 2, 3].map((item) => (
                  <SkeletonLoader key={item} variant="boardCard" />
                ))}
              </View>
            ) : (
            <FlatList
              data={boardsToShow}
              keyExtractor={(item) => item.id}
              getItemLayout={(_, index) => ({
                length: 108,
                offset: 108 * index,
                index,
              })}
              initialNumToRender={8}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={Platform.OS === "android"}
              numColumns={2}
              columnWrapperClassName="gap-3"
              contentContainerClassName="gap-3 pb-4"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = selectedBoardSet.has(item.id);

                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => toggleBoard(item.id)}
                    className={[
                      "min-h-24 flex-1 rounded-lg border bg-card p-3 active:opacity-85 dark:bg-card-dark",
                      selected
                        ? "border-primary dark:border-primary-dark"
                        : "border-border dark:border-border-dark",
                    ].join(" ")}
                    style={{ borderLeftColor: item.color, borderLeftWidth: 5 }}
                  >
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="flex-1 gap-1">
                        <Typography
                          variant="bodySmall"
                          weight="semibold"
                          numberOfLines={2}
                        >
                          {item.shortName}
                        </Typography>
                        <Typography variant="caption" color="muted">
                          {item.province}
                        </Typography>
                      </View>
                      {selected ? (
                        <Check color={colors.primary.light} size={18} />
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
            />
            )}
            <View className="flex-row gap-3">
              <Button variant="ghost" fullWidth onPress={() => setStep(2)}>
                Skip
              </Button>
              <Button
                fullWidth
                disabled={selectedBoardIds.length === 0}
                onPress={() => setStep(2)}
              >
                Next
              </Button>
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View className="flex-1 justify-between gap-5">
            <View className="gap-5">
              <View className="gap-2">
                <Typography variant="heading2">
                  Which class are you in?
                </Typography>
                <Typography variant="bodySmall" color="muted">
                  This helps PaperStack put the right papers first.
                </Typography>
              </View>
              <View className="gap-3">
                {classOptions.map((item) => {
                  const selected = selectedClass === item.classLevel;

                  return (
                    <Pressable
                      key={item.classLevel}
                      accessibilityRole="button"
                      onPress={() => setSelectedClassLevel(item.classLevel)}
                      className={[
                        "flex-row items-center gap-4 rounded-lg border bg-card p-4 active:opacity-85 dark:bg-card-dark",
                        selected
                          ? "border-primary dark:border-primary-dark"
                          : "border-border dark:border-border-dark",
                      ].join(" ")}
                    >
                      <Typography
                        variant="heading1"
                        color="primary"
                        className="w-16"
                      >
                        {item.classLevel}
                      </Typography>
                      <View className="flex-1 gap-1">
                        <Typography variant="heading3">
                          Class {item.classLevel}
                        </Typography>
                        <Typography
                          variant="bodySmall"
                          color="muted"
                          numberOfLines={2}
                        >
                          {item.subjects}
                        </Typography>
                      </View>
                      {selected ? (
                        <Check color={colors.primary.light} size={22} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <Button
              fullWidth
              size="lg"
              disabled={!selectedClass}
              onPress={finish}
            >
              Done
            </Button>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
