import { useRouter } from "expo-router";
import { ExternalLink } from "lucide-react-native";
import { memo, useState } from "react";
import { Pressable } from "react-native";

import { generatePapers, getBoard, getSubjectById, getViewerParams } from "@/components/browse/browseData";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import type { CommonQuestion } from "@/constants/questions";

import { FrequencyBar } from "./FrequencyBar";
import { YearDots } from "./YearDots";

interface QuestionCardProps {
  question: CommonQuestion;
  boardId?: string;
}

function QuestionCardComponent({ question, boardId }: QuestionCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const openPaper = () => {
    const board = getBoard(boardId ?? question.paperRefs[0]?.boardId);
    const subject = getSubjectById(question.subjectId);

    if (!board || !subject) {
      return;
    }

    const year = question.paperRefs[0]?.year ?? question.years[0];
    const paper =
      generatePapers(board, question.classId, subject).find((item) => item.year === year) ??
      generatePapers(board, question.classId, subject)[0];

    router.push({
      pathname: "/(stack)/viewer/[paperId]",
      params: getViewerParams(paper, subject, board),
    } as never);
  };

  return (
    <Card className="gap-4">
      <Pressable accessibilityRole="button" onPress={() => setExpanded((value) => !value)} className="gap-3">
        <Badge label={question.chapterName} size="sm" />
        <Typography variant="body" weight="medium" numberOfLines={expanded ? undefined : 3}>
          {question.text}
        </Typography>
      </Pressable>
      <FrequencyBar frequency={question.years.length} />
      <YearDots years={question.years} />
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
