import { View } from "react-native";

import { BoardBadge } from "@/components/papers/BoardBadge";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import type { Board, ClassLevel, Subject } from "@/types";

interface SubjectHeaderProps {
  subject?: Subject;
  board?: Board;
  classId?: ClassLevel;
}

export function SubjectHeader({ subject, board, classId }: SubjectHeaderProps) {
  return (
    <View className="gap-3">
      <Typography variant="heading2">
        {subject ? `${subject.name} Common Questions` : "Common Questions"}
      </Typography>
      <View className="flex-row flex-wrap items-center gap-2">
        {board ? <BoardBadge board={board} size="md" /> : <Badge label="All boards" />}
        <Badge label={classId ? `Class ${classId}` : "All classes"} />
      </View>
      <Typography variant="bodySmall" color="muted">
        Questions that appeared multiple times in past 5 years
      </Typography>
    </View>
  );
}
