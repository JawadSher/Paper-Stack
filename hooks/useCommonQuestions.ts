import { useEffect, useMemo, useState } from "react";

import { commonQuestions, type CommonQuestion } from "@/constants/questions";
import type { Board, ClassLevel, Subject } from "@/types";

export type MinFrequency = 2 | 3 | 4 | 5;

export interface QuestionGroup {
  chapterId: string;
  chapterName: string;
  questions: CommonQuestion[];
}

export function useCommonQuestions(
  subjectId?: Subject["id"],
  boardId?: Board["id"],
  classId?: ClassLevel,
  minFrequency: MinFrequency = 2,
) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 220);
    return () => clearTimeout(timer);
  }, [boardId, classId, minFrequency, subjectId]);

  const data = useMemo(() => {
    const subjectQuestions = commonQuestions.filter((question) => {
      const subjectMatches = !subjectId || question.subjectId === subjectId;
      const boardMatches = !boardId || question.boardIds.includes(boardId);
      const classMatches = !classId || question.classId === classId;

      return subjectMatches && boardMatches && classMatches;
    });
    const repeatQuestions = subjectQuestions
      .filter((question) => question.years.length >= minFrequency)
      .sort((left, right) => right.years.length - left.years.length || left.text.localeCompare(right.text));
    const groups = new Map<string, QuestionGroup>();

    repeatQuestions.forEach((question) => {
      const existing = groups.get(question.chapterId);

      if (existing) {
        existing.questions.push(question);
        return;
      }

      groups.set(question.chapterId, {
        chapterId: question.chapterId,
        chapterName: question.chapterName,
        questions: [question],
      });
    });

    const groupedQuestions = Array.from(groups.values()).sort(
      (left, right) =>
        Math.max(...right.questions.map((question) => question.years.length)) -
          Math.max(...left.questions.map((question) => question.years.length)) ||
        left.chapterName.localeCompare(right.chapterName),
    );
    const topicCounts = subjectQuestions.reduce<Record<string, number>>((counts, question) => {
      counts[question.chapterName] = (counts[question.chapterName] ?? 0) + question.years.length;
      return counts;
    }, {});
    const mostRepeatedTopic =
      Object.entries(topicCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? "No repeated topic";

    return {
      groupedQuestions,
      totalAnalyzed: subjectQuestions.length * 5,
      repeatCount: repeatQuestions.length,
      mostRepeatedTopic,
      questions: repeatQuestions,
    };
  }, [boardId, classId, minFrequency, subjectId]);

  return {
    ...data,
    isLoading,
  };
}
