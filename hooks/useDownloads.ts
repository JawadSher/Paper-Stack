import { useCallback, useEffect, useMemo, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";

import { getBoard, getSubjectById } from "@/components/browse/browseData";
import {
  deleteDownloadFiles,
  deletePaperStackDownloadDirectory,
  readPaperStackDownloadMetadata,
} from "@/lib/offline-files";
import { usePaperStackStore } from "@/store";
import type { Board, Download, Paper, Subject } from "@/types";
import { useToast } from "@/components/common/Toast";

export interface DownloadedPaper {
  download: Download;
  paper: Paper;
  board: Board;
  subject: Subject;
}

function resolveDownloadedPaper(download: Download): DownloadedPaper | undefined {
  const paper = download.paperSnapshot;
  const board =
    paper?.board
      ? ({
          displayOrder: 0,
          isActive: true,
          ...paper.board,
        } as Board)
      : paper
        ? getBoard(paper.boardId)
        : undefined;
  const subject =
    paper?.subject
      ? ({
          displayOrder: 0,
          isCompulsory: false,
          isActive: true,
          ...paper.subject,
        } as Subject)
      : paper
        ? getSubjectById(paper.subjectId)
        : undefined;

  if (paper && board && subject) {
    return {
      download,
      paper: {
        ...paper,
        pdfUrl: download.localUri || paper.pdfUrl,
        fileSizeBytes: download.fileSizeBytes ?? paper.fileSizeBytes,
      },
      board,
      subject,
    };
  }

  return undefined;
}

export function useDownloads() {
  const { showToast } = useToast();
  const downloads = usePaperStackStore((state) => state.downloads);
  const addDownload = usePaperStackStore((state) => state.addDownload);
  const removeDownload = usePaperStackStore((state) => state.removeDownload);
  const clearDownloads = usePaperStackStore((state) => state.clearDownloads);
  const [isHydratingDownloads, setIsHydratingDownloads] = useState(true);
  const downloadedPapers = useMemo(
    () =>
      Object.values(downloads)
        .map(resolveDownloadedPaper)
        .filter((item): item is DownloadedPaper => Boolean(item))
        .sort(
          (left, right) =>
            new Date(right.download.downloadedAt).getTime() -
            new Date(left.download.downloadedAt).getTime(),
        ),
    [downloads],
  );
  const totalSize = downloadedPapers.reduce(
    (total, item) => total + (item.download.fileSizeBytes ?? item.paper.fileSizeBytes ?? 0),
    0,
  );

  const refreshDownloads = useCallback(async () => {
    setIsHydratingDownloads(true);

    try {
      const folderDownloads = await readPaperStackDownloadMetadata();

      folderDownloads.forEach((download) => {
        if (!downloads[download.paperId]) {
          addDownload(download);
        }
      });

      await Promise.all(
        Object.values(downloads).map(async (download) => {
          if (!download.localUri) {
            removeDownload(download.paperId);
            return;
          }

          const info = await FileSystem.getInfoAsync(download.localUri).catch(() => ({
            exists: false,
          }));

          if (!info.exists) {
            removeDownload(download.paperId);
          }
        }),
      );
    } finally {
      setIsHydratingDownloads(false);
    }
  }, [addDownload, downloads, removeDownload]);

  useEffect(() => {
    refreshDownloads();
  }, [refreshDownloads]);

  const deleteDownload = async (paperId: string) => {
    try {
      await deleteDownloadFiles(downloads[paperId]);
      removeDownload(paperId);
      showToast({ type: "success", title: "Download removed" });
    } catch {
      showToast({ type: "error", title: "Could not delete download" });
    }
  };

  const clearAllDownloads = async () => {
    try {
      await deletePaperStackDownloadDirectory();
      clearDownloads();
      showToast({ type: "success", title: "Downloads cleared" });
    } catch {
      showToast({ type: "error", title: "Could not clear downloads" });
    }
  };

  return {
    downloadedPapers,
    totalSize,
    isHydratingDownloads,
    refreshDownloads,
    deleteDownload,
    clearAllDownloads,
  };
}
