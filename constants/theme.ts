export const colors = {
  background: {
    light: "#FAF9F5",
    dark: "#262624",
  },
  foreground: {
    light: "#3D3929",
    dark: "#C3C0B6",
  },
  card: {
    light: "#FAF9F5",
    dark: "#262624",
  },
  cardForeground: {
    light: "#1A1A19",
    dark: "#FAF9F5",
  },
  popover: {
    light: "#FFFFFF",
    dark: "#30302E",
  },
  popoverForeground: {
    light: "#28261B",
    dark: "#E5E5E2",
  },
  primary: {
    light: "#C96442",
    dark: "#D97757",
  },
  primaryForeground: {
    light: "#FFFFFF",
    dark: "#FFFFFF",
  },
  secondary: {
    light: "#E9E6DC",
    dark: "#FAF9F5",
  },
  secondaryForeground: {
    light: "#535146",
    dark: "#30302E",
  },
  muted: {
    light: "#EDE9DE",
    dark: "#1B1B19",
  },
  mutedForeground: {
    light: "#83827D",
    dark: "#B7B5A9",
  },
  accent: {
    light: "#E9E6DC",
    dark: "#1C1B17",
  },
  accentForeground: {
    light: "#28261B",
    dark: "#F5F4EE",
  },
  destructive: {
    light: "#1A1A19",
    dark: "#EF4444",
  },
  destructiveForeground: {
    light: "#FFFFFF",
    dark: "#FFFFFF",
  },
  border: {
    light: "#DAD9D4",
    dark: "#3E3E38",
  },
  input: {
    light: "#B4B2A7",
    dark: "#52514A",
  },
  ring: {
    light: "#C96442",
    dark: "#D97757",
  },
  chart: {
    1: {
      light: "#B05730",
      dark: "#B05730",
    },
    2: {
      light: "#9C87F5",
      dark: "#9C87F5",
    },
    3: {
      light: "#DED8C4",
      dark: "#1C1B17",
    },
    4: {
      light: "#DBD3F0",
      dark: "#2F2B48",
    },
    5: {
      light: "#B4552D",
      dark: "#B4552D",
    },
  },
  sidebar: {
    light: "#F5F4EE",
    dark: "#1F1E1D",
  },
  sidebarForeground: {
    light: "#3D3D3A",
    dark: "#C3C0B6",
  },
  sidebarPrimary: {
    light: "#C96442",
    dark: "#343434",
  },
  sidebarPrimaryForeground: {
    light: "#FBFBFB",
    dark: "#FBFBFB",
  },
  sidebarAccent: {
    light: "#E9E6DC",
    dark: "#1A1A19",
  },
  sidebarAccentForeground: {
    light: "#343434",
    dark: "#C3C0B6",
  },
  sidebarBorder: {
    light: "#EBEBEB",
    dark: "#EBEBEB",
  },
  sidebarRing: {
    light: "#B5B5B5",
    dark: "#B5B5B5",
  },
  surface: {
    light: "#FAF9F5",
    dark: "#262624",
  },
  text: {
    primary: {
      light: "#3D3929",
      dark: "#C3C0B6",
    },
    secondary: {
      light: "#83827D",
      dark: "#B7B5A9",
    },
  },
  boards: {
    federal: "#C96442",
    punjab: "#B05730",
    sindh: "#9C87F5",
    kpk: "#DBD3F0",
    balochistan: "#B4552D",
    ajk: "#D97757",
    gilgitBaltistan: "#DED8C4",
  },
} as const;

export const colorForScheme = (
  color: { light: string; dark: string },
  scheme: "light" | "dark",
) => color[scheme];

export const radii = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;

export const fontFamilies = {
  sans: "Poppins_400Regular",
  sansMedium: "Poppins_500Medium",
  sansSemiBold: "Poppins_600SemiBold",
  sansBold: "Poppins_700Bold",
  serif: "Lora_400Regular",
  serifBold: "Lora_700Bold",
  mono: "RobotoMono_400Regular",
  monoMedium: "RobotoMono_500Medium",
} as const;

export const legacyColors = {
  primary: colors.primary.light,
  background: {
    light: colors.background.light,
    dark: colors.background.dark,
  },
  surface: {
    light: colors.card.light,
    dark: colors.card.dark,
  },
  text: {
    primary: {
      light: colors.foreground.light,
      dark: colors.foreground.dark,
    },
    secondary: {
      light: colors.mutedForeground.light,
      dark: colors.mutedForeground.dark,
    },
  },
  border: {
    light: colors.border.light,
    dark: colors.border.dark,
  },
  accent: {
    purple: colors.chart[2].light,
    teal: colors.chart[3].light,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;

export const theme = {
  colors,
  spacing,
  fontSizes,
} as const;

export type AppTheme = typeof theme;
