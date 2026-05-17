import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { Href, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Lora_400Regular, Lora_700Bold } from "@expo-google-fonts/lora";
import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
} from "@expo-google-fonts/roboto-mono";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NativeWindThemeProvider } from "@/components/providers/nativewind-theme-provider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { OfflineBanner } from "@/components/common/OfflineBanner";
import { ToastHost } from "@/components/common/Toast";
import { colorForScheme, colors } from "@/constants/theme";
import { usePaperStackStore } from "@/store";
// @ts-ignore: side-effect import of CSS handled by Expo Router
import "../global.css";

SplashScreen.preventAutoHideAsync();

const onboardingFlagKey = "paper-stack:onboarding-complete";

function routeFromDeepLink(url: string): Href | null {
  const parsed = Linking.parse(url);
  const path = parsed.path ?? "";

  if (path.startsWith("boards/")) {
    return {
      pathname: "/(stack)/boards/[boardId]",
      params: { boardId: path.replace("boards/", "") },
    } as Href;
  }

  if (path.startsWith("paper/")) {
    return {
      pathname: "/(stack)/viewer/[paperId]",
      params: { paperId: path.replace("paper/", "") },
    } as Href;
  }

  if (path === "search") {
    return {
      pathname: "/(tabs)/search",
      params: { q: String(parsed.queryParams?.q ?? "") },
    } as Href;
  }

  return null;
}

export default function RootLayout() {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      }),
  );
  const hydrateStore = usePaperStackStore((state) => state.hydrateStore);
  const theme = usePaperStackStore((state) => state.userPreferences.theme);
  const systemTheme = useColorScheme();
  const colorScheme = theme === "system" ? (systemTheme ?? "light") : theme;
  const backgroundColor = colorForScheme(colors.background, colorScheme);
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Lora_400Regular,
    Lora_700Bold,
    RobotoMono_400Regular,
    RobotoMono_500Medium,
  });
  const [checkedLaunch, setCheckedLaunch] = useState(false);

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  useEffect(() => {
    AsyncStorage.getItem(onboardingFlagKey)
      .catch(() => null)
      .finally(() => setCheckedLaunch(true));
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && checkedLaunch) {
      SplashScreen.hideAsync();
    }
  }, [checkedLaunch, fontError, fontsLoaded]);

  useEffect(() => {
    if (!checkedLaunch || (!fontsLoaded && !fontError)) {
      return;
    }

    Linking.getInitialURL()
      .then((url) => {
        const route = url ? routeFromDeepLink(url) : null;

        if (route) {
          router.replace(route);
        }
      })
      .catch(() => undefined);

    const subscription = Linking.addEventListener("url", ({ url }) => {
      const route = routeFromDeepLink(url);

      if (route) {
        router.push(route);
      }
    });

    return () => subscription.remove();
  }, [checkedLaunch, fontError, fontsLoaded, router]);

  if ((!fontsLoaded && !fontError) || !checkedLaunch) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <NativeWindThemeProvider>
            <StatusBar
              style={colorScheme === "dark" ? "light" : "dark"}
              backgroundColor={backgroundColor}
            />
            <OfflineBanner />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor },
              }}
            >
              <Stack.Screen name="splash" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(stack)" />
            </Stack>
            <ToastHost />
          </NativeWindThemeProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
