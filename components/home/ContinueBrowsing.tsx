import AsyncStorage from "@react-native-async-storage/async-storage";
import { Search } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { PaperCard } from "@/components/papers/PaperCard";
import { Typography } from "@/components/ui/Typography";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import { usePapersByIds } from "@/hooks/api";
import type { Board, Paper, Subject } from "@/types";

const historyKey = "paper-stack:paper-history";

function normalizeHistory(value: string | null): Paper[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as Paper[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((paper): paper is Paper =>
        Boolean(paper?.id && paper?.boardId && paper?.subjectId),
      )
      .slice(0, 5);
  } catch {
    return [];
  }
}

export function ContinueBrowsing() {
  const [loading, setLoading] = useState(true);
  const [storedPaperHistory, setStoredPaperHistory] = useState<Paper[]>([]);
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const { data: hydratedPapers = [] } = usePapersByIds(historyIds);
  const papersToShow = hydratedPapers.length > 0 ? hydratedPapers : storedPaperHistory;
  const boardMap = useMemo(
    () => new Map(boards.map((board) => [board.id, board])),
    [],
  );
  const subjectMap = useMemo(
    () => new Map(subjects.map((subject) => [subject.id, subject])),
    [],
  );

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(historyKey)
      .then((value) => {
        if (mounted) {
          const history = normalizeHistory(value);
          setStoredPaperHistory(history);
          setHistoryIds(history.map((paper) => paper.id));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View className="gap-4">
      <Typography variant="heading3">Continue Browsing</Typography>
      {loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {[0, 1].map((item) => (
              <View key={item} className="w-64">
                <SkeletonLoader variant="boardCard" />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : papersToShow.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {papersToShow.map((paper) => {
              const board = (paper.board as Board | undefined) ?? boardMap.get(paper.boardId);
              const subject = (paper.subject as Subject | undefined) ?? subjectMap.get(paper.subjectId);

              return board ? (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  board={board}
                  subject={subject}
                  variant="compactHorizontal"
                />
              ) : null;
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="min-h-36 items-center justify-center gap-3 rounded-lg border border-border bg-card px-5 py-6 dark:border-border-dark dark:bg-card-dark">
          <Search color="#C96442" size={28} />
          <View className="gap-1">
            <Typography variant="body" weight="semibold" align="center">
              Start exploring papers
            </Typography>
            <Typography variant="caption" color="muted" align="center">
              Recently opened papers will appear here.
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
}
