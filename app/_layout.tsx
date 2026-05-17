import { Stack } from "expo-router";
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

import { NativeWindThemeProvider } from "@/components/providers/nativewind-theme-provider";
import { colorForScheme, colors } from "@/constants/theme";
import { usePaperStackStore } from "@/store";
// @ts-ignore: side-effect import of CSS handled by Expo Router
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NativeWindThemeProvider>
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"}
          backgroundColor={backgroundColor}
        />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor },
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </NativeWindThemeProvider>
    </QueryClientProvider>
  );
}
