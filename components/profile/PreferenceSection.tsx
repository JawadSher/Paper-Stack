import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

interface PreferenceSectionProps {
  title: string;
  children: React.ReactNode;
}

export function PreferenceSection({ title, children }: PreferenceSectionProps) {
  return (
    <View className="gap-3">
      <Typography variant="label" color="muted">
        {title}
      </Typography>
      <View className="overflow-hidden rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark">
        {children}
      </View>
    </View>
  );
}

interface PreferenceRowProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

export function PreferenceRow({ label, value, children, onPress }: PreferenceRowProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 active:bg-muted dark:border-border-dark dark:active:bg-muted-dark"
    >
      <Typography variant="bodySmall" weight="medium" className="flex-1">
        {label}
      </Typography>
      {children ?? (
        <Typography variant="bodySmall" color="muted" align="right" className="max-w-52">
          {value}
        </Typography>
      )}
    </Container>
  );
}
