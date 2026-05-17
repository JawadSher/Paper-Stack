import { ActivityIndicator, Pressable, type PressableProps, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

import { Typography } from "./Typography";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  children?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-primary bg-primary dark:border-primary-dark dark:bg-primary-dark",
  secondary: "border-border bg-transparent dark:border-border-dark",
  ghost: "border-transparent bg-transparent",
  danger: "border-destructive bg-destructive dark:border-destructive-dark dark:bg-destructive-dark",
};

const textColors: Record<ButtonVariant, "foreground" | "primary" | "destructive"> = {
  primary: "foreground",
  secondary: "foreground",
  ghost: "foreground",
  danger: "foreground",
};

const iconColors: Record<ButtonVariant, string> = {
  primary: "#FFFFFF",
  secondary: "#C96442",
  ghost: "#3D3929",
  danger: "#FFFFFF",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-4",
  lg: "h-12 px-5",
};

const textSizes: Record<ButtonSize, "caption" | "bodySmall" | "body"> = {
  sm: "caption",
  md: "bodySmall",
  lg: "body",
};

const iconSizes: Record<ButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const iconColor = iconColors[variant];
  const contentColor =
    variant === "primary" || variant === "danger" ? "primary" : textColors[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={[
        "flex-row items-center justify-center rounded-lg border",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? "w-full" : "self-start",
        isDisabled ? "opacity-50" : "active:opacity-80",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {LeftIcon ? <LeftIcon color={iconColor} size={iconSizes[size]} /> : null}
          {children ? (
            <Typography
              color={contentColor}
              variant={textSizes[size]}
              weight="semibold"
              className={
                variant === "primary" || variant === "danger"
                  ? "text-primary-foreground"
                  : undefined
              }
            >
              {children}
            </Typography>
          ) : null}
          {RightIcon ? <RightIcon color={iconColor} size={iconSizes[size]} /> : null}
        </View>
      )}
    </Pressable>
  );
}
