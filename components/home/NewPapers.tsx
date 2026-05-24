import { FileSearch } from "lucide-react-native";
import { View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { PaperCard } from "@/components/papers/PaperCard";
import { Typography } from "@/components/ui/Typography";
import { useRecentPapers } from "@/hooks/api";
import type { Board, Subject } from "@/types";

export function NewPapers() {
  const { data: recentPapers = [], isLoading } = useRecentPapers(5);

  return (
    <View className="gap-4">
      <Typography variant="heading3">Recently Added</Typography>
      {isLoading ? (
        <View className="gap-3">
          {[0, 1, 2].map((item) => (
            <SkeletonLoader key={item} variant="paperCard" />
          ))}
        </View>
      ) : recentPapers.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="No recent papers"
          subtitle="Newly published papers will appear here."
        />
      ) : (
        <View className="gap-3">
          {recentPapers.map((paper) => {
            const board = paper.board as Board | undefined;
            const subject = paper.subject as Subject | undefined;

            return board ? (
              <PaperCard key={paper.id} paper={paper} board={board} subject={subject} />
            ) : null;
          })}
        </View>
      )}
    </View>
  );
}
