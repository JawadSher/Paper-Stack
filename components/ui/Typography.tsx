import { Text, type TextProps } from "react-native";

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

export function Typography({
  variant = "body",
  color = "foreground",
  weight,
  align = "left",
  className,
  ...props
}: TypographyProps) {
  const resolvedWeight =
    weight ?? (variant.startsWith("heading") || variant === "label" ? "semibold" : "regular");

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
    />
  );
}
