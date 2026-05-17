import { Text, type TextProps } from "react-native";

import { usePaperStackStore } from "@/store";

type TypographyVariant =
  | "heading1"
  | "heading2"
  | "heading3"
  | "body"
  | "bodySmall"
  | "caption"
  | "label";

type TypographyColor =
  | "foreground"
  | "muted"
  | "primary"
  | "destructive"
  | "card"
  | "accent";

type TypographyWeight = "regular" | "medium" | "semibold" | "bold";

type TypographyAlign = "left" | "center" | "right";

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  numberOfLines?: number;
}

const variantClasses: Record<TypographyVariant, string> = {
  heading1: "text-3xl leading-10",
  heading2: "text-2xl leading-8",
  heading3: "text-xl leading-7",
  body: "text-base leading-6",
  bodySmall: "text-sm leading-5",
  caption: "text-xs leading-4",
  label: "text-sm leading-5 uppercase",
};

const colorClasses: Record<TypographyColor, string> = {
  foreground: "text-foreground dark:text-foreground-dark",
  muted: "text-muted-foreground dark:text-muted-foreground-dark",
  primary: "text-primary dark:text-primary-dark",
  destructive: "text-destructive dark:text-destructive-dark",
  card: "text-card-foreground dark:text-card-foreground-dark",
  accent: "text-accent-foreground dark:text-accent-foreground-dark",
};

const weightClasses: Record<TypographyWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const alignClasses: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const textSizeScale = {
  small: 0.92,
  medium: 1,
  large: 1.1,
};

const variantMetrics: Record<TypographyVariant, { fontSize: number; lineHeight: number }> = {
  heading1: { fontSize: 30, lineHeight: 40 },
  heading2: { fontSize: 24, lineHeight: 32 },
  heading3: { fontSize: 20, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24 },
  bodySmall: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
  label: { fontSize: 14, lineHeight: 20 },
};

export function Typography({
  variant = "body",
  color = "foreground",
  weight,
  align = "left",
  className,
  style,
  ...props
}: TypographyProps) {
  const textSize = usePaperStackStore((state) => state.userPreferences.textSize ?? "medium");
  const resolvedWeight =
    weight ?? (variant.startsWith("heading") || variant === "label" ? "semibold" : "regular");
  const scale = textSizeScale[textSize];
  const metrics = variantMetrics[variant];

  return (
    <Text
      className={[
        "font-sans tracking-normal",
        variantClasses[variant],
        colorClasses[color],
        weightClasses[resolvedWeight],
        alignClasses[align],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
      style={[
        {
          fontSize: metrics.fontSize * scale,
          lineHeight: metrics.lineHeight * scale,
        },
        style,
      ]}
    />
  );
}
