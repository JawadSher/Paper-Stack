import AsyncStorage from "@react-native-async-storage/async-storage";
import { Search } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { PaperCard } from "@/components/papers/PaperCard";
import { Typography } from "@/components/ui/Typography";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import type { Paper } from "@/types";

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
      .filter((paper): paper is Paper => Boolean(paper?.id && paper?.boardId && paper?.subjectId))
      .slice(0, 5);
  } catch {
    return [];
  }
}

export function ContinueBrowsing() {
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState<Paper[]>([]);
  const boardMap = useMemo(() => new Map(boards.map((board) => [board.id, board])), []);
  const subjectMap = useMemo(() => new Map(subjects.map((subject) => [subject.id, subject])), []);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(historyKey)
      .then((value) => {
        if (mounted) {
          setPapers(normalizeHistory(value));
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
      ) : papers.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {papers.map((paper) => {
              const board = boardMap.get(paper.boardId);
              const subject = subjectMap.get(paper.subjectId);

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
        <EmptyState
          icon={Search}
          title="Start exploring papers"
          subtitle="Recently opened papers will appear here."
        />
      )}
    </View>
  );
}
