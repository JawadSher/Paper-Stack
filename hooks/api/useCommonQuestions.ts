import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchCommonQuestions, type QuestionFilters } from "@/lib/queries";
import type { CommonQuestion } from "@/types";

type CommonQuestionGroup = {
  chapterId: string;
  chapterName: string;
  questions: CommonQuestion[];
};

export function useCommonQuestionsQuery(filters: QuestionFilters) {
  return useQuery({
    queryKey: queryKeys.questions.list(filters as Record<string, unknown>),
    queryFn: () => fetchCommonQuestions(filters),
    enabled: !!filters.subjectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCommonQuestionsGrouped(filters: QuestionFilters) {
  const query = useCommonQuestionsQuery(filters);

  const groupedQuestions = (() => {
    if (!query.data) {
      return [];
    }

    const groups: Record<string, CommonQuestionGroup> = {};

    for (const q of query.data) {
      if (!groups[q.chapterId]) {
        groups[q.chapterId] = {
          chapterId: q.chapterId,
          chapterName: q.chapterName,
          questions: [],
        };
      }

      groups[q.chapterId].questions.push(q);
    }

    return Object.values(groups).sort(
      (a, b) =>
        Math.max(...b.questions.map((q) => q.frequency)) -
        Math.max(...a.questions.map((q) => q.frequency)),
    );
  })();

  const totalAnalyzed = query.data?.length ?? 0;
  const mostRepeatedTopic = groupedQuestions[0]?.chapterName ?? null;

  return { ...query, groupedQuestions, totalAnalyzed, mostRepeatedTopic };
}
