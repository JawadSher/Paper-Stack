import {
  BookOpen,
  Calculator,
  Code2,
  FlaskConical,
  Globe2,
  Languages,
  Microscope,
  PenLine,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import type { Subject } from "@/types";

interface SubjectCardProps {
  subject: Subject;
  paperCount?: number;
  accentColor?: string;
  onPress: () => void;
  onCommonQuestions: () => void;
}

const subjectIcons: Record<string, LucideIcon> = {
  Physics: Microscope,
  Chemistry: FlaskConical,
  Biology: Microscope,
  Mathematics: Calculator,
  "Computer Science": Code2,
  English: Languages,
  Urdu: Languages,
  Islamiat: BookOpen,
  "Pakistan Studies": Globe2,
};

export function SubjectCard({
  subject,
  paperCount,
  accentColor = colors.primary.light,
  onPress,
  onCommonQuestions,
}: SubjectCardProps) {
  const Icon = subjectIcons[subject.name] ?? PenLine;

  return (
    <Card
      onPress={onPress}
      className="min-h-44 flex-1 justify-between gap-4"
      style={{ borderLeftColor: accentColor, borderLeftWidth: 5 }}
    >
      <View className="gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accentColor}22` }}
        >
          <Icon color={accentColor} size={22} />
        </View>
        <View className="gap-2">
          <Typography variant="body" weight="semibold" numberOfLines={2}>
            {subject.name}
          </Typography>
          {typeof paperCount === "number" ? (
            <Badge label={`${paperCount} papers`} size="sm" />
          ) : null}
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={(event) => {
          event.stopPropagation();
          onCommonQuestions();
        }}
        className="self-start rounded-full bg-muted px-3 py-2 active:opacity-80 dark:bg-muted-dark"
      >
        <Typography variant="caption" weight="semibold" style={{ color: accentColor }}>
          Common Questions
        </Typography>
      </Pressable>
    </Card>
  );
}
