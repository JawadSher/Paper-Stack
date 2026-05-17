import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export interface CardProps {
  children: React.ReactNode;
  onPress?: PressableProps["onPress"];
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const cardClassName =
  "rounded-xl border border-border bg-card p-4 shadow-sm dark:border-border-dark dark:bg-card-dark";

export function Card({ children, onPress, style, className }: CardProps) {
  const classes = [cardClassName, onPress ? "active:opacity-90" : "", className]
    .filter(Boolean)
    .join(" ");

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} className={classes} style={style}>
        {children}
      </Pressable>
    );
  }

  return (
    <View className={classes} style={style}>
      {children}
    </View>
  );
}
