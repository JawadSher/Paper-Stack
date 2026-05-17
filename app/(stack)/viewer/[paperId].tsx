import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Download, FileWarning } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Share, View } from "react-native";
import * as Sharing from "expo-sharing";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import {
  getBoard,
  getPaperById,
  getSubjectById,
} from "@/components/browse/browseData";
import { DownloadProgress } from "@/components/viewer/DownloadProgress";
import { PdfDocument } from "@/components/viewer/PdfDocument";
import { ViewerHeader } from "@/components/viewer/ViewerHeader";
import { ViewerToolbar } from "@/components/viewer/ViewerToolbar";
import { boards } from "@/constants/boards";
import { useBookmark } from "@/hooks/useBookmark";
import { useDownload } from "@/hooks/useDownload";
import { usePaperStackStore } from "@/store";
import type { ClassLevel, Paper } from "@/types";

const sessionLabels: Record<NonNullable<Paper["session"]>, string> = {
  annual: "Annual",
  supplementary: "Supplementary",
  model: "Model",
};

function toStringValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getClassLevel(value?: string | string[]): ClassLevel {
  const classLevel = Number(toStringValue(value));
  return classLevel === 9 || classLevel === 10 || classLevel === 11 || classLevel === 12
    ? classLevel
    : 10;
}

export default function PdfViewerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    paperId: string;
    pdfUrl?: string;
    title?: string;
    boardId?: string;
    boardName?: string;
    subjectId?: string;
    subjectName?: string;
    classLevel?: string;
    year?: string;
    session?: Paper["session"];
    fileSizeBytes?: string;
  }>();
  const paperId = toStringValue(params.paperId) ?? "paper";
  const storedPaper = getPaperById(paperId);
  const fallbackBoard = getBoard(params.boardId) ?? boards[0];
  const fallbackSubject = getSubjectById(params.subjectId);
  const paper = useMemo<Paper>(
    () =>
      storedPaper ?? {
        id: paperId,
        title: toStringValue(params.title) ?? "Past Paper",
        boardId: fallbackBoard.id,
        subjectId: toStringValue(params.subjectId) ?? fallbackSubject?.id ?? "subject",
        classLevel: getClassLevel(params.classLevel),
        year: Number(toStringValue(params.year)) || 2024,
        session: params.session ?? "annual",
        pdfUrl: toStringValue(params.pdfUrl) ?? "",
        fileSizeBytes: Number(toStringValue(params.fileSizeBytes)) || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    [
      fallbackBoard.id,
      fallbackSubject?.id,
      paperId,
      params.classLevel,
      params.fileSizeBytes,
      params.pdfUrl,
      params.session,
      params.subjectId,
      params.title,
      params.year,
      storedPaper,
    ],
  );
  const board = getBoard(paper.boardId) ?? fallbackBoard;
  const subject = getSubjectById(paper.subjectId) ?? fallbackSubject;
  const netInfo = useNetInfo();
  const downloads = usePaperStackStore((state) => state.downloads);
  const downloaded = downloads[paper.id];
  const { isBookmarked, toggleBookmark } = useBookmark(paper.id);
  const { downloadState, progress, startDownload, cancelDownload } = useDownload(paper);
  const [sourceUri, setSourceUri] = useState(downloaded?.localUri ?? paper.pdfUrl);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [targetPage, setTargetPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [progressVisible, setProgressVisible] = useState(false);
  const offline = netInfo.isConnected === false || netInfo.isInternetReachable === false;
  const resumeKey = `paper-stack:resume-page:${paper.id}`;
  const title = `${subject?.name ?? paper.title} - ${paper.year} ${sessionLabels[paper.session ?? "annual"]} (${board.shortName})`;

  useEffect(() => {
    setSourceUri(downloaded?.localUri ?? paper.pdfUrl);
  }, [downloaded?.localUri, paper.pdfUrl]);

  useEffect(() => {
    const updateHistory = async () => {
      try {
        const value = await AsyncStorage.getItem("paper-stack:paper-history");
        const parsed = value ? (JSON.parse(value) as Paper[]) : [];
        const next = [paper, ...parsed.filter((item) => item?.id !== paper.id)].slice(0, 10);
        await AsyncStorage.setItem("paper-stack:paper-history", JSON.stringify(next));
      } catch {
        // History is non-critical; ignore malformed storage values.
      }
    };

    updateHistory();
  }, [paper]);

  useEffect(() => {
    AsyncStorage.getItem(resumeKey).then((value) => {
      const page = Number(value);

      if (page > 0) {
        setCurrentPage(page);
        setTargetPage(page);
      }
    });
  }, [resumeKey]);

  useEffect(() => {
    if (downloadState === "downloading") {
      setProgressVisible(true);
      return;
    }

    if (downloadState === "downloaded") {
      setProgressVisible(true);
      const timer = setTimeout(() => setProgressVisible(false), 900);
      return () => clearTimeout(timer);
    }

    if (downloadState === "cancelled" || downloadState === "error") {
      const timer = setTimeout(() => setProgressVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [downloadState]);

  const sharePaper = async () => {
    const uri = downloaded?.localUri ?? paper.pdfUrl;
    const available = await Sharing.isAvailableAsync();

    if (downloaded?.localUri && available) {
      await Sharing.shareAsync(downloaded.localUri, { dialogTitle: title });
      return;
    }

    await Share.share({ title, message: uri, url: uri });
  };

  const runDownload = async () => {
    await startDownload();
  };

  const retry = async () => {
    const state = await NetInfo.fetch();
    setFailed(false);
    setLoading(true);

    if ((state.isConnected === false || state.isInternetReachable === false) && !downloaded) {
      setLoading(false);
    }
  };

  if (offline && !downloaded) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
        <ViewerHeader
          title={title}
          isBookmarked={isBookmarked}
          onToggleBookmark={() => toggleBookmark(paper)}
          onShare={sharePaper}
        />
        <EmptyState
          icon={Download}
          title="Download required to view offline"
          subtitle="Connect to the internet or download this paper before going offline."
          actionLabel="Retry"
          onAction={retry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <View className="flex-1">
        <ViewerHeader
          title={title}
          isBookmarked={isBookmarked}
          onToggleBookmark={() => toggleBookmark(paper)}
          onShare={sharePaper}
        />
        <View className="flex-1 bg-muted dark:bg-muted-dark">
          {loading ? (
            <View className="absolute inset-0 z-10 gap-4 bg-background p-5 dark:bg-background-dark">
              <SkeletonLoader variant="paperCard" />
              <SkeletonLoader variant="paperCard" />
              <SkeletonLoader variant="paperCard" />
            </View>
          ) : null}
          {failed ? (
            <EmptyState
              icon={FileWarning}
              title="Could not load PDF"
              subtitle="Check the file or your connection, then try again."
              actionLabel="Retry"
              onAction={retry}
            />
          ) : (
            <PdfDocument
              sourceUri={sourceUri}
              page={targetPage}
              scale={scale}
              onLoadComplete={(pages) => {
                setTotalPages(pages);
                setLoading(false);
              }}
              onPageChanged={(page, pages) => {
                setCurrentPage(page);
                setTotalPages(pages);
                AsyncStorage.setItem(resumeKey, String(page));
              }}
              onError={() => {
                setFailed(true);
                setLoading(false);
              }}
            />
          )}
        </View>
        <DownloadProgress
          visible={progressVisible}
          completed={downloadState === "downloaded"}
          progress={progress}
          onCancel={cancelDownload}
        />
        <ViewerToolbar
          paper={paper}
          currentPage={currentPage}
          totalPages={totalPages}
          onZoomIn={() => setScale((value) => Math.min(2.5, value + 0.15))}
          onZoomOut={() => setScale((value) => Math.max(0.7, value - 0.15))}
          onJumpToPage={(page) => {
            setCurrentPage(page);
            setTargetPage(page);
          }}
          onDownload={runDownload}
          onCommonQuestions={() =>
            router.push({
              pathname: "/(stack)/common-questions/[subjectId]",
              params: {
                boardId: board.id,
                classId: String(paper.classLevel),
                subjectId: paper.subjectId,
              },
            } as never)
          }
        />
      </View>
    </SafeAreaView>
  );
}
