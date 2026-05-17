import { useCallback, useEffect, useRef, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";

import { usePaperStackStore } from "@/store";
import type { Download, Paper } from "@/types";

type DownloadState = "idle" | "downloading" | "downloaded" | "error" | "cancelled";

interface UseDownloadResult {
  downloadState: DownloadState;
  progress: number;
  startDownload: () => Promise<Download | void>;
  cancelDownload: () => Promise<void>;
}

function sanitizeFileName(value: string) {
  return value.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").toLowerCase();
}

export function useDownload(paper: Paper): UseDownloadResult {
  const downloads = usePaperStackStore((state) => state.downloads);
  const addDownload = usePaperStackStore((state) => state.addDownload);
  const removeDownload = usePaperStackStore((state) => state.removeDownload);
  const [downloadState, setDownloadState] = useState<DownloadState>(
    downloads[paper.id] ? "downloaded" : "idle",
  );
  const [progress, setProgress] = useState(downloads[paper.id] ? 1 : 0);
  const taskRef = useRef<ReturnType<typeof FileSystem.createDownloadResumable> | null>(null);
  const targetUriRef = useRef<string | null>(null);

  useEffect(() => {
    const existing = downloads[paper.id];

    if (!existing?.localUri) {
      setDownloadState("idle");
      setProgress(0);
      return;
    }

    FileSystem.getInfoAsync(existing.localUri)
      .then((info) => {
        if (info.exists) {
          setDownloadState("downloaded");
          setProgress(1);
          return;
        }

        removeDownload(paper.id);
        setDownloadState("idle");
        setProgress(0);
      })
      .catch(() => {
        removeDownload(paper.id);
        setDownloadState("idle");
        setProgress(0);
      });
  }, [downloads, paper.id, removeDownload]);

  const cancelDownload = useCallback(async () => {
    const targetUri = targetUriRef.current;

    try {
      await taskRef.current?.pauseAsync();
    } catch {
      // The task may already be complete or cancelled.
    }

    if (targetUri) {
      await FileSystem.deleteAsync(targetUri, { idempotent: true });
    }

    taskRef.current = null;
    targetUriRef.current = null;
    setDownloadState("cancelled");
    setProgress(0);
  }, []);

  const startDownload = useCallback(async () => {
    if (downloadState === "downloading" || downloadState === "downloaded") {
      return downloads[paper.id];
    }

    const documentDirectory = FileSystem.documentDirectory;

    if (!documentDirectory) {
      setDownloadState("error");
      return;
    }

    const directory = `${documentDirectory}papers/`;
    const fileName = `${sanitizeFileName(paper.title || paper.id)}.pdf`;
    const targetUri = `${directory}${fileName}`;
    targetUriRef.current = targetUri;

    try {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      setDownloadState("downloading");
      setProgress(0);

      const task = FileSystem.createDownloadResumable(paper.pdfUrl, targetUri, {}, (data) => {
        const total = data.totalBytesExpectedToWrite;
        const written = data.totalBytesWritten;
        setProgress(total > 0 ? Math.min(1, written / total) : 0);
      });
      taskRef.current = task;
      const result = await task.downloadAsync();

      if (!result?.uri) {
        setDownloadState("error");
        return;
      }

      const info = await FileSystem.getInfoAsync(result.uri);
      const download = {
        paperId: paper.id,
        localUri: result.uri,
        fileName,
        fileSizeBytes: info.exists ? info.size : paper.fileSizeBytes,
        downloadedAt: new Date().toISOString(),
      };

      addDownload(download);
      setProgress(1);
      setDownloadState("downloaded");
      taskRef.current = null;
      targetUriRef.current = null;

      return download;
    } catch {
      setDownloadState("error");
      setProgress(0);

      if (targetUriRef.current) {
        await FileSystem.deleteAsync(targetUriRef.current, { idempotent: true });
      }
    }
  }, [addDownload, downloadState, downloads, paper]);

  return {
    downloadState,
    progress,
    startDownload,
    cancelDownload,
  };
}
