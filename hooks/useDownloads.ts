import { useMemo } from "react";
import * as FileSystem from "expo-file-system/legacy";

import { getBoard, getPaperById, getSubjectById } from "@/components/browse/browseData";
import { searchDataset } from "@/hooks/useSearch";
import { usePaperStackStore } from "@/store";
import type { Board, Download, Paper, Subject } from "@/types";
import { useToast } from "@/components/common/Toast";

export interface DownloadedPaper {
  download: Download;
  paper: Paper;
  board: Board;
  subject: Subject;
}

function fallbackPaper(download: Download): DownloadedPaper {
  const subject = getSubjectById("class-10-physics")!;
  const board = getBoard("bise-lahore")!;

  return {
    download,
    board,
    subject,
    paper: {
      id: download.paperId,
      title: download.fileName.replace(/\.pdf$/i, ""),
      boardId: board.id,
      subjectId: subject.id,
      classLevel: subject.classLevel,
      year: new Date(download.downloadedAt).getFullYear(),
      session: "annual",
      pdfUrl: download.localUri,
      fileSizeBytes: download.fileSizeBytes,
      createdAt: download.downloadedAt,
      updatedAt: download.downloadedAt,
    },
  };
}

function resolveDownloadedPaper(download: Download): DownloadedPaper {
  const paper = getPaperById(download.paperId) ?? searchDataset.find((item) => item.paper.id === download.paperId)?.paper;
  const board = paper ? getBoard(paper.boardId) : undefined;
  const subject = paper ? getSubjectById(paper.subjectId) : undefined;

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

  return fallbackPaper(download);
}

export function useDownloads() {
  const { showToast } = useToast();
  const downloads = usePaperStackStore((state) => state.downloads);
  const removeDownload = usePaperStackStore((state) => state.removeDownload);
  const clearDownloads = usePaperStackStore((state) => state.clearDownloads);
  const downloadedPapers = useMemo(
    () =>
      Object.values(downloads)
        .map(resolveDownloadedPaper)
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

  const deleteDownload = async (paperId: string) => {
    const download = downloads[paperId];

    try {
      if (download?.localUri) {
        await FileSystem.deleteAsync(download.localUri, { idempotent: true });
      }

      removeDownload(paperId);
      showToast({ type: "success", title: "Download removed" });
    } catch {
      showToast({ type: "error", title: "Could not delete download" });
    }
  };

  const clearAllDownloads = async () => {
    try {
      await Promise.all(
        Object.values(downloads).map((download) =>
          download.localUri
            ? FileSystem.deleteAsync(download.localUri, { idempotent: true }).catch(() => undefined)
            : Promise.resolve(),
        ),
      );
      clearDownloads();
      showToast({ type: "success", title: "Downloads cleared" });
    } catch {
      showToast({ type: "error", title: "Could not clear downloads" });
    }
  };

  return {
    downloadedPapers,
    totalSize,
    deleteDownload,
    clearAllDownloads,
  };
}
