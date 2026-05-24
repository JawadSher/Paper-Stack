import { useCallback, useEffect, useRef, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";

import {
  ensurePaperStackDownloadDirectory,
  getDownloadMetadataUri,
  getDownloadPdfUri,
  writeDownloadMetadata,
} from "@/lib/offline-files";
import { trackDownload } from "@/lib/queries";
import { usePaperStackStore } from "@/store";
import type { Download, Paper } from "@/types";

type DownloadState = "idle" | "downloading" | "downloaded" | "error" | "cancelled";

interface UseDownloadResult {
  downloadState: DownloadState;
  progress: number;
  startDownload: () => Promise<Download | void>;
  cancelDownload: () => Promise<void>;
}

export function useDownload(paper: Paper): UseDownloadResult {
  const downloads = usePaperStackStore((state) => state.downloads);
  const addDownload = usePaperStackStore((state) => state.addDownload);
  const removeDownload = usePaperStackStore((state) => state.removeDownload);
  const setDownloadProgress = usePaperStackStore((state) => state.setDownloadProgress);
  const clearDownloadProgress = usePaperStackStore((state) => state.clearDownloadProgress);
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
    clearDownloadProgress(paper.id);
    setDownloadState("cancelled");
    setProgress(0);
  }, [clearDownloadProgress, paper.id]);

  const startDownload = useCallback(async () => {
    if (downloadState === "downloading" || downloadState === "downloaded") {
      return downloads[paper.id];
    }

    if (!paper.pdfUrl) {
      setDownloadState("error");
      return;
    }

    const targetUri = getDownloadPdfUri(paper.id, paper.title || paper.id);
    const metadataUri = getDownloadMetadataUri(paper.id);

    if (!targetUri || !metadataUri) {
      setDownloadState("error");
      return;
    }

    const fileName = targetUri.split("/").pop() ?? `${paper.id}.pdf`;
    targetUriRef.current = targetUri;

    try {
      const directory = await ensurePaperStackDownloadDirectory();

      if (!directory) {
        setDownloadState("error");
        return;
      }

      setDownloadState("downloading");
      setProgress(0);
      setDownloadProgress(paper.id, 0.01);

      const task = FileSystem.createDownloadResumable(paper.pdfUrl, targetUri, {}, (data) => {
        const total = data.totalBytesExpectedToWrite;
        const written = data.totalBytesWritten;
        const nextProgress = total > 0 ? Math.min(1, written / total) : 0;
        setProgress(nextProgress);
        setDownloadProgress(paper.id, nextProgress);
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
        fileSizeBytes: info.exists ? info.size : (paper.fileSizeBytes ?? undefined),
        downloadedAt: new Date().toISOString(),
        metadataUri,
        paperSnapshot: paper,
      };

      await writeDownloadMetadata(download);
      addDownload(download);
      trackDownload(paper.id).catch(() => undefined);
      setProgress(1);
      setDownloadProgress(paper.id, 1);
      setDownloadState("downloaded");
      taskRef.current = null;
      targetUriRef.current = null;
      clearDownloadProgress(paper.id);

      return download;
    } catch {
      setDownloadState("error");
      setProgress(0);
      clearDownloadProgress(paper.id);

      if (targetUriRef.current) {
        await FileSystem.deleteAsync(targetUriRef.current, { idempotent: true });
      }

      await FileSystem.deleteAsync(metadataUri, { idempotent: true });
    }
  }, [
    addDownload,
    clearDownloadProgress,
    downloadState,
    downloads,
    paper,
    setDownloadProgress,
  ]);

  return {
    downloadState,
    progress,
    startDownload,
    cancelDownload,
  };
}
