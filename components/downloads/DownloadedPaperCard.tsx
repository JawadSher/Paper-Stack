import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Pressable, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FileText, Trash2 } from "lucide-react-native";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import type { DownloadedPaper } from "@/hooks/useDownloads";

import { formatBytes } from "./StorageUsageBar";

interface DownloadedPaperCardProps {
  item: DownloadedPaper;
  onDelete: (paperId: string) => void;
}

function relativeDate(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.max(0, Math.floor(diff / 86400000));

  if (days === 0) {
    return "Downloaded today";
  }

  if (days === 1) {
    return "Downloaded yesterday";
  }

  return `Downloaded ${days} days ago`;
}

export function DownloadedPaperCard({ item, onDelete }: DownloadedPaperCardProps) {
  const router = useRouter();
  const accentColor = item.board.color || "#C96442";

  const openPaper = () => {
    router.push({
      pathname: "/(stack)/viewer/[paperId]",
      params: {
        paperId: item.paper.id,
        pdfUrl: item.download.localUri || item.paper.pdfUrl,
        title: item.paper.title,
        boardId: item.paper.boardId,
        boardName: item.board.shortName,
        subjectId: item.paper.subjectId,
        subjectName: item.subject.name,
        classLevel: String(item.paper.classLevel),
        year: String(item.paper.year),
        session: item.paper.session,
        fileSizeBytes: item.paper.fileSizeBytes
          ? String(item.paper.fileSizeBytes)
          : undefined,
      },
    } as never);
  };

  const share = async () => {
    if (item.download.localUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(item.download.localUri, { dialogTitle: item.paper.title });
    }
  };

  const deleteAction = () => (
    <Pressable
      accessibilityRole="button"
      onPress={() => onDelete(item.paper.id)}
      className="ml-3 w-20 items-center justify-center rounded-lg bg-destructive dark:bg-destructive-dark"
    >
      <Trash2 color="#FFFFFF" size={21} />
      <Typography variant="caption" weight="semibold" className="mt-1 text-white dark:text-white">
        Delete
      </Typography>
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={deleteAction} overshootRight={false}>
      <Pressable
        accessibilityRole="button"
        onPress={openPaper}
        onLongPress={share}
        className="gap-3 rounded-lg border border-border bg-card p-4 active:opacity-90 dark:border-border-dark dark:bg-card-dark"
        style={{ borderLeftWidth: 4, borderLeftColor: accentColor }}
      >
        <View className="flex-row items-start gap-3">
          <View
            className="h-11 w-11 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            <FileText color={accentColor} size={21} />
          </View>
          <View className="flex-1 gap-2">
            <Typography variant="body" weight="semibold" numberOfLines={2}>
              {item.subject.name} - {item.paper.year} - {item.board.shortName}
            </Typography>
            <View className="flex-row flex-wrap items-center gap-2">
              <Badge
                label={formatBytes(item.download.fileSizeBytes ?? item.paper.fileSizeBytes ?? 0)}
                size="sm"
              />
              <Typography variant="caption" color="muted">
                {relativeDate(item.download.downloadedAt)}
              </Typography>
            </View>
          </View>
        </View>
        <View className="items-end">
          <Button size="sm" onPress={openPaper} style={{ backgroundColor: accentColor }}>
            Open
          </Button>
        </View>
      </Pressable>
    </Swipeable>
  );
}
