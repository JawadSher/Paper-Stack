import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { PaperCard } from "@/components/papers/PaperCard";
import { Typography } from "@/components/ui/Typography";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import type { Paper } from "@/types";

const recentPapers: Paper[] = subjects.slice(0, 5).map((subject, index) => ({
  id: `recent-paper-${index + 1}`,
  title: `${subject.name} ${2026 - index} Past Paper`,
  boardId: boards[index % boards.length].id,
  subjectId: subject.id,
  classLevel: subject.classLevel,
  year: 2026 - index,
  session: index % 2 === 0 ? "annual" : "supplementary",
  pdfUrl: `https://example.com/papers/recent-${index + 1}.pdf`,
  createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - index * 86400000).toISOString(),
}));

export function NewPapers() {
  const [loading, setLoading] = useState(true);
  const boardMap = useMemo(() => new Map(boards.map((board) => [board.id, board])), []);
  const subjectMap = useMemo(() => new Map(subjects.map((subject) => [subject.id, subject])), []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="gap-4">
      <Typography variant="heading3">Recently Added</Typography>
      {loading ? (
        <View className="gap-3">
          {[0, 1].map((item) => (
            <SkeletonLoader key={item} variant="paperCard" />
          ))}
        </View>
      ) : (
        <View className="gap-3">
          {recentPapers.map((paper) => {
            const board = boardMap.get(paper.boardId) ?? boards[0];
            const subject = subjectMap.get(paper.subjectId);

            return <PaperCard key={paper.id} paper={paper} board={board} subject={subject} />;
          })}
        </View>
      )}
    </View>
  );
}
