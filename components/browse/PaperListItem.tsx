import { useRouter } from "expo-router";
import { Bookmark, ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import * as Sharing from "expo-sharing";

import { DownloadButton } from "@/components/papers/DownloadButton";
import { BoardBadge } from "@/components/papers/BoardBadge";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import { usePaperStackStore } from "@/store";
import { useDownload } from "@/hooks/useDownload";
import type { Board, Paper } from "@/types";

import { formatFileSize, getSubjectById } from "./browseData";

interface PaperListItemProps {
  paper: Paper;
  board: Board;
  accentColor?: string;
}

const sessionLabels: Record<NonNullable<Paper["session"]>, string> = {
  annual: "Annual",
  supplementary: "Supplementary",
  model: "Model",
};

export function PaperListItem({ paper, board, accentColor = board.color }: PaperListItemProps) {
  const router = useRouter();
  const bookmarked = usePaperStackStore((state) => state.bookmarkedPapers.has(paper.id));
  const toggleBookmark = usePaperStackStore((state) => state.toggleBookmark);
  const { startDownload } = useDownload(paper);

  const openPaper = () => {
    router.push({
      pathname: "/(stack)/viewer/[paperId]",
      params: {
        paperId: paper.id,
        pdfUrl: paper.pdfUrl ?? undefined,
        title: paper.title,
        boardId: paper.boardId,
        boardName: board.shortName,
        subjectId: paper.subjectId,
        subjectName: getSubjectById(paper.subjectId)?.name,
        classLevel: String(paper.classLevel),
        year: String(paper.year),
        session: paper.session,
        fileSizeBytes: paper.fileSizeBytes ? String(paper.fileSizeBytes) : undefined,
      },
    } as never);
  };

  const sharePaper = async () => {
    const available = await Sharing.isAvailableAsync();

    if (available && paper.pdfUrl) {
      await Sharing.shareAsync(paper.pdfUrl, { dialogTitle: paper.title });
    }
  };

  const bookmarkAction = () => (
    <Pressable
      accessibilityRole="button"
      onPress={() => toggleBookmark(paper.id, paper)}
      className="mr-3 w-20 items-center justify-center rounded-lg bg-primary dark:bg-primary-dark"
    >
      <Bookmark color="#FFFFFF" fill="#FFFFFF" size={22} />
      <Typography variant="caption" weight="semibold" className="mt-1 text-white dark:text-white">
        Save
      </Typography>
    </Pressable>
  );

  return (
    <Swipeable renderLeftActions={bookmarkAction} overshootLeft={false}>
      <Pressable
        accessibilityRole="button"
        onPress={openPaper}
        onLongPress={sharePaper}
        className="flex-row items-center gap-3 rounded-lg border bg-card p-4 active:opacity-90 dark:bg-card-dark"
        style={{ borderColor: `${accentColor}66`, borderLeftColor: accentColor, borderLeftWidth: 5 }}
      >
        <View
          className="w-20 items-center rounded-lg px-2 py-3"
          style={{ backgroundColor: `${accentColor}18` }}
        >
          <Typography
            variant="heading3"
            weight="bold"
            numberOfLines={1}
            style={{ color: accentColor }}
          >
            {paper.year}
          </Typography>
        </View>
        <View className="flex-1 gap-2">
          <View className="flex-row flex-wrap items-center gap-2">
            <Typography variant="body" weight="semibold">
              {sessionLabels[paper.session ?? "annual"]}
            </Typography>
            <View className="rounded-full bg-muted px-2 py-1 dark:bg-muted-dark">
              <Typography variant="caption" color="muted" weight="medium">
                {formatFileSize(paper.fileSizeBytes)}
              </Typography>
            </View>
          </View>
          <View className="flex-row flex-wrap items-center gap-2">
            <BoardBadge board={board} />
            <Pressable
              accessibilityRole="button"
              onPress={(event) => {
                event.stopPropagation();
                toggleBookmark(paper.id, paper);
              }}
              className="h-8 w-8 items-center justify-center rounded-full bg-muted dark:bg-muted-dark"
            >
              <Bookmark
                color={bookmarked ? accentColor : colors.mutedForeground.light}
                fill={bookmarked ? accentColor : "transparent"}
                size={16}
              />
            </Pressable>
          </View>
        </View>
        <View className="items-end gap-2">
          <DownloadButton
            paperId={paper.id}
            fileName={`${paper.title}.pdf`}
            onDownload={startDownload}
          />
          <ChevronRight color={accentColor} size={20} />
        </View>
      </Pressable>
    </Swipeable>
  );
}
