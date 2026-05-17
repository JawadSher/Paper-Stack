import { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BoardGrid } from "@/components/home/BoardGrid";
import { ContinueBrowsing } from "@/components/home/ContinueBrowsing";
import { HomeHeader } from "@/components/home/HomeHeader";
import { NewPapers } from "@/components/home/NewPapers";
import { PopularSubjects } from "@/components/home/PopularSubjects";
import { StatsBar } from "@/components/home/StatsBar";

function StaggeredSection({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function HomeScreen() {
  const sections = [
    <HomeHeader key="header" hasNewPapers />,
    <StatsBar key="stats" />,
    <ContinueBrowsing key="continue" />,
    <BoardGrid key="boards" />,
    <PopularSubjects key="subjects" />,
    <NewPapers key="new" />,
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 px-5 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, index) => (
          <StaggeredSection key={section.key} delay={index * 100}>
            {section}
          </StaggeredSection>
        ))}
        <View className="h-2" />
      </ScrollView>
    </SafeAreaView>
  );
}
