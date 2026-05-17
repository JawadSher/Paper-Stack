import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  TextInput,
  type NativeSyntheticEvent,
  type TextInputSubmitEditingEventData,
} from "react-native";
import { Search, X } from "lucide-react-native";

import { colors } from "@/constants/theme";

export interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search papers",
  autoFocus = false,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: focused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focusAnim, focused]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.light, colors.primary.light],
  });

  const handleSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    onSubmit?.(event.nativeEvent.text);
  };

  return (
    <Animated.View
      className="flex-row items-center gap-3 rounded-xl border bg-card px-4 py-3 dark:bg-card-dark"
      style={{ borderColor }}
    >
      <Search color={focused ? colors.primary.light : colors.mutedForeground.light} size={20} />
      <TextInput
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground.light}
        returnKeyType="search"
        className="min-h-6 flex-1 p-0 font-sans text-base text-foreground dark:text-foreground-dark"
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeText("")}
          className="h-8 w-8 items-center justify-center rounded-full bg-muted dark:bg-muted-dark"
        >
          <X color={colors.mutedForeground.light} size={16} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
