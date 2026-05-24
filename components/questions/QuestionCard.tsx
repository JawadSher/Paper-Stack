import { useRouter } from "expo-router";
import { ExternalLink } from "lucide-react-native";
import { memo, useState } from "react";
import { Pressable } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import type { CommonQuestion } from "@/types";

import { FrequencyBar } from "./FrequencyBar";
import { YearDots } from "./YearDots";

interface QuestionCardProps {
  question: CommonQuestion;
  boardId?: string;
}

function QuestionCardComponent({ question, boardId }: QuestionCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const years = question.years ?? question.yearsAppeared;

  const openPaper = () => {
    const paperId = question.questionPaperLinks?.[0]?.paperId;

    if (!paperId) {
      return;
    }

    router.push({
      pathname: "/(stack)/viewer/[paperId]",
      params: {
        paperId,
        boardId: boardId ?? question.boardId,
        subjectId: question.subjectId,
        classLevel: String(question.classLevel),
        year: String(question.questionPaperLinks?.[0]?.year ?? question.yearsAppeared[0] ?? ""),
      },
    } as never);
  };

  return (
    <Card className="gap-4">
      <Pressable accessibilityRole="button" onPress={() => setExpanded((value) => !value)} className="gap-3">
        <Badge label={question.chapterName} size="sm" />
        <Typography variant="body" weight="medium" numberOfLines={expanded ? undefined : 3}>
          {question.text ?? question.questionText}
        </Typography>
      </Pressable>
      <FrequencyBar frequency={years.length} />
      <YearDots years={years} />
      <Pressable
        accessibilityRole="button"
        onPress={openPaper}
        className="flex-row items-center gap-2 self-start rounded-full bg-muted px-3 py-2 active:opacity-80 dark:bg-muted-dark"
      >
        <ExternalLink color="#C96442" size={15} />
        <Typography variant="caption" color="primary" weight="semibold">
          View in paper
        </Typography>
      </Pressable>
    </Card>
  );
}

export const QuestionCard = memo(
  QuestionCardComponent,
  (prev, next) => prev.question.id === next.question.id && prev.boardId === next.boardId,
);
