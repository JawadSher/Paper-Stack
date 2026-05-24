import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";

import { colors } from "@/constants/theme";

const onboardingFlagKey = "paper-stack:onboarding-complete";
const shimmerTextWidth = 292;
const shimmerBandWidth = 96;

function BrandText({ shimmer }: { shimmer: Animated.Value }) {
  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerBandWidth, shimmerTextWidth + shimmerBandWidth],
  });

  const counterTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [shimmerBandWidth, -(shimmerTextWidth + shimmerBandWidth)],
  });

  const textStyle = {
    fontFamily: "Poppins_700Bold",
    fontSize: 46,
    lineHeight: 56,
    letterSpacing: 0,
    textAlign: "center" as const,
  };

  return (
    <View style={{ width: shimmerTextWidth, overflow: "hidden" }}>
      <Text style={[textStyle, { color: colors.foreground.light }]}>
        Paper{" "}
        <Text style={{ color: colors.primary.light }}>
          Stack
        </Text>
      </Text>
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          top: 0,
          width: shimmerBandWidth,
          overflow: "hidden",
          transform: [{ translateX: shimmerTranslate }],
        }}
      >
        <Animated.Text
          style={[
            textStyle,
            {
              width: shimmerTextWidth,
              color: "#FFFFFF",
              textShadowColor: `${colors.primary.light}99`,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 12,
              transform: [{ translateX: counterTranslate }],
            },
          ]}
        >
          Paper{" "}
          <Text style={{ color: "#FFD2C3" }}>
            Stack
          </Text>
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

export default function SplashScreenRoute() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1450,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ).start();

    const timer = setTimeout(async () => {
      const completed = await AsyncStorage.getItem(onboardingFlagKey).catch(() => null);
      router.replace((completed ? "/(tabs)/home" : "/onboarding") as Href);
    }, 1500);

    return () => clearTimeout(timer);
  }, [opacity, router, shimmer]);

  return (
    <View className="flex-1 items-center justify-center gap-8 bg-background dark:bg-background-dark">
      <Animated.View style={{ opacity }}>
        <Image
          source={require("@/assets/images/icon.png")}
          contentFit="contain"
          style={{ height: 204, width: 204 }}
        />
      </Animated.View>
      <Animated.View style={{ opacity }}>
        <BrandText shimmer={shimmer} />
      </Animated.View>
    </View>
  );
}
