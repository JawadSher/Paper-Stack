import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

const onboardingFlagKey = "paper-stack:onboarding-complete";

function PaperStackMark() {
  const first = useRef(new Animated.Value(20)).current;
  const second = useRef(new Animated.Value(34)).current;
  const third = useRef(new Animated.Value(48)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.spring(first, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.spring(second, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.spring(third, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }),
    ]).start();
  }, [first, second, third]);

  return (
    <View className="h-28 w-28 items-center justify-center">
      {[first, second, third].map((value, index) => (
        <Animated.View
          key={index}
          className="absolute h-16 w-20 rounded-lg border-2 border-primary bg-card dark:border-primary-dark dark:bg-card-dark"
          style={{
            transform: [
              { translateY: value },
              { rotate: index === 0 ? "-7deg" : index === 1 ? "4deg" : "0deg" },
            ],
            opacity: index === 0 ? 0.55 : index === 1 ? 0.75 : 1,
          }}
        />
      ))}
    </View>
  );
}

export default function SplashScreenRoute() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    const timer = setTimeout(async () => {
      const completed = await AsyncStorage.getItem(onboardingFlagKey).catch(() => null);
      router.replace((completed ? "/(tabs)/home" : "/onboarding") as Href);
    }, 1500);

    return () => clearTimeout(timer);
  }, [opacity, router]);

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-background dark:bg-background-dark">
      <PaperStackMark />
      <Animated.View style={{ opacity }}>
        <Typography variant="heading1" align="center">
          PaperStack
        </Typography>
      </Animated.View>
    </View>
  );
}
