import { useState } from "react";
import { Pressable, View } from "react-native";

import { colors } from "@/constants/theme";
import type { Question } from "@/types";

import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

export interface QuestionCardProps {
  question: Question;
  subjectName: string;
  yearsAppeared: number[];
  totalYears?: number;
}

export function QuestionCard({
  question,
  subjectName,
  yearsAppeared,
  totalYears = 5,
}: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const sortedYears = [...yearsAppeared].sort((a, b) => a - b);

  return (
    <Card className="gap-3">
      <Pressable onPress={() => setExpanded((value) => !value)} className="gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <Badge label={subjectName} size="sm" color={colors.chart[2].light} />
          <Badge label={`Asked ${yearsAppeared.length}/${totalYears} years`} size="sm" />
        </View>
        <Typography variant="body" numberOfLines={expanded ? undefined : 3}>
          {question.prompt}
        </Typography>
        <View className="flex-row items-center gap-2">
          {sortedYears.map((year) => (
            <View key={year} className="items-center gap-1">
              <View
                className="h-2.5 w-2.5 rounded-full bg-primary dark:bg-primary-dark"
              />
              <Typography variant="caption" color="muted">
                {String(year).slice(2)}
              </Typography>
            </View>
          ))}
        </View>
      </Pressable>
    </Card>
  );
}

export { QuestionCard as PaperQuestionCard };
