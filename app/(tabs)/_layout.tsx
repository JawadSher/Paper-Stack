import { Tabs } from "expo-router";
import { Download, Home, Search, User } from "lucide-react-native";
import { useColorScheme } from "react-native";

import { colorForScheme, colors } from "@/constants/theme";
import { usePaperStackStore } from "@/store";

const iconSize = 22;

export default function TabLayout() {
  const theme = usePaperStackStore((state) => state.userPreferences.theme);
  const systemTheme = useColorScheme();
  const colorScheme = theme === "system" ? (systemTheme ?? "light") : theme;
  const activeTintColor = colorForScheme(colors.primary, colorScheme);
  const inactiveTintColor = colorForScheme(colors.mutedForeground, colorScheme);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor: colorForScheme(colors.card, colorScheme),
          borderTopColor: colorForScheme(colors.border, colorScheme),
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home stroke={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search stroke={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: "Downloads",
          tabBarIcon: ({ color }) => <Download stroke={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User stroke={color} size={iconSize} />,
        }}
      />
    </Tabs>
  );
}
