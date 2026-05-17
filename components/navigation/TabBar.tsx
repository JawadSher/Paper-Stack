import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Download, Home, Search, User } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Keyboard, Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import { usePaperStackStore } from "@/store";

const tabConfig = {
  home: { label: "Home", icon: Home },
  search: { label: "Search", icon: Search },
  downloads: { label: "Downloads", icon: Download },
  profile: { label: "Profile", icon: User },
};

function TabButton({
  routeName,
  active,
  onPress,
  badge,
}: {
  routeName: keyof typeof tabConfig;
  active: boolean;
  onPress: () => void;
  badge?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const Icon = tabConfig[routeName].icon;
  const tint = active ? colors.primary.light : colors.mutedForeground.light;

  useEffect(() => {
    if (active) {
      Animated.spring(scale, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [active, scale]);

  const press = async () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: active ? 1.2 : 1, tension: 200, friction: 10, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start();
    Haptics.selectionAsync().catch(() => undefined);
    onPress();
  };

  return (
    <Pressable accessibilityRole="button" onPress={press} className="flex-1 items-center gap-1 py-2">
      <Animated.View style={{ transform: [{ scale }] }} className="relative items-center">
        <Icon color={tint} size={22} strokeWidth={active ? 2.8 : 2} />
        {badge ? (
          <View className="absolute -right-3 -top-2 min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 dark:bg-primary-dark">
            <Typography variant="caption" weight="bold" className="text-white dark:text-white">
              {badge}
            </Typography>
          </View>
        ) : null}
      </Animated.View>
      <Typography
        variant="caption"
        weight={active ? "semibold" : "medium"}
        className={active ? "text-primary dark:text-primary-dark" : "text-muted-foreground dark:text-muted-foreground-dark"}
      >
        {tabConfig[routeName].label}
      </Typography>
      <View className="h-1 w-5 overflow-hidden rounded-full">
        {active ? <View className="h-1 rounded-full bg-primary dark:bg-primary-dark" /> : null}
      </View>
    </Pressable>
  );
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeDownloads = usePaperStackStore((store) => Object.keys(store.downloadProgress).length);
  const keyboardVisible = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(keyboardVisible, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(keyboardVisible, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [keyboardVisible]);

  const translateY = keyboardVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  return (
    <Animated.View
      className="border-t border-border bg-card dark:border-border-dark dark:bg-card-dark"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        transform: [{ translateY }],
        display: Platform.OS === "web" ? "flex" : undefined,
      }}
    >
      <View className="flex-row px-2 pt-1">
        {state.routes
          .filter((route) => route.name in tabConfig)
          .map((route) => {
            const index = state.routes.findIndex((item) => item.key === route.key);
            const active = state.index === index;
            const routeName = route.name as keyof typeof tabConfig;

            return (
              <TabButton
                key={route.key}
                routeName={routeName}
                active={active}
                badge={routeName === "downloads" ? activeDownloads : undefined}
                onPress={() => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!active && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                }}
              />
            );
          })}
      </View>
    </Animated.View>
  );
}
