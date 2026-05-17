import { Pressable, View } from "react-native";
import { Bookmark } from "lucide-react-native";
import { useRouter } from "expo-router";

import { colors } from "@/constants/theme";
import { usePaperStackStore } from "@/store";
import type { Board, Paper, Subject } from "@/types";

import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { BoardBadge } from "./BoardBadge";
import { DownloadButton } from "./DownloadButton";

export interface PaperCardProps {
  paper: Paper;
  board: Board;
  subject?: Subject;
  onDownload?: React.ComponentProps<typeof DownloadButton>["onDownload"];
  onPress?: (paper: Paper) => void;
}

const sessionLabels: Record<NonNullable<Paper["session"]>, string> = {
  annual: "Annual",
  supplementary: "Supplementary",
  model: "Model",
};

export function PaperCard({ paper, board, subject, onDownload, onPress }: PaperCardProps) {
  const router = useRouter();
  const bookmarked = usePaperStackStore((state) => state.bookmarkedPaperIds.has(paper.id));
  const toggleBookmark = usePaperStackStore((state) => state.toggleBookmark);

  const openPaper = () => {
    if (onPress) {
      onPress(paper);
      return;
    }

    router.push({
      pathname: "/pdf-viewer",
      params: { paperId: paper.id, pdfUrl: paper.pdfUrl },
    } as never);
  };

  return (
    <Card onPress={openPaper} className="gap-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-2">
          <Typography variant="heading3" weight="semibold" numberOfLines={2}>
            {subject?.name ?? paper.title}
          </Typography>
          <View className="flex-row flex-wrap items-center gap-2">
            <BoardBadge board={board} />
            <Badge label={`${paper.year}`} size="sm" />
            <Badge label={`Class ${paper.classLevel}`} size="sm" />
            <Badge label={sessionLabels[paper.session ?? "annual"]} size="sm" />
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            toggleBookmark(paper.id);
          }}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted dark:bg-muted-dark"
        >
          <Bookmark
            color={bookmarked ? colors.primary.light : colors.mutedForeground.light}
            fill={bookmarked ? colors.primary.light : "transparent"}
            size={20}
          />
        </Pressable>
      </View>
      <View className="flex-row justify-end">
        <DownloadButton
          paperId={paper.id}
          fileName={`${paper.title || paper.id}.pdf`}
          onDownload={onDownload}
        />
      </View>
    </Card>
  );
}
