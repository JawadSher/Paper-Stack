import * as FileSystem from "expo-file-system/legacy";

import type { Download } from "@/types";

const APP_DOWNLOAD_ROOT = "PaperStack/";
const PAPER_DOWNLOAD_FOLDER = "Papers/";
const STORAGE_PROBE_FILE = ".paperstack-write-test";

export const PAPER_STACK_DOWNLOAD_FOLDER_NAME = "PaperStack/Papers";
export const PAPER_STACK_DOWNLOAD_DIR = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}${APP_DOWNLOAD_ROOT}${PAPER_DOWNLOAD_FOLDER}`
  : null;

export function sanitizeDownloadFileName(value: string) {
  const sanitized = value
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return sanitized || "paper";
}

export function getDownloadPdfUri(paperId: string, title: string) {
  if (!PAPER_STACK_DOWNLOAD_DIR) {
    return null;
  }

  return `${PAPER_STACK_DOWNLOAD_DIR}${paperId}-${sanitizeDownloadFileName(title)}.pdf`;
}

export function getDownloadMetadataUri(paperId: string) {
  if (!PAPER_STACK_DOWNLOAD_DIR) {
    return null;
  }

  return `${PAPER_STACK_DOWNLOAD_DIR}${paperId}.json`;
}

export async function ensurePaperStackDownloadDirectory() {
  if (!PAPER_STACK_DOWNLOAD_DIR) {
    return null;
  }

  await FileSystem.makeDirectoryAsync(PAPER_STACK_DOWNLOAD_DIR, { intermediates: true });

  const probeUri = `${PAPER_STACK_DOWNLOAD_DIR}${STORAGE_PROBE_FILE}`;
  await FileSystem.writeAsStringAsync(probeUri, "ok");
  await FileSystem.deleteAsync(probeUri, { idempotent: true });

  return PAPER_STACK_DOWNLOAD_DIR;
}

export async function writeDownloadMetadata(download: Download) {
  const metadataUri = getDownloadMetadataUri(download.paperId);

  if (!metadataUri) {
    return undefined;
  }

  await FileSystem.writeAsStringAsync(
    metadataUri,
    JSON.stringify({ ...download, metadataUri }, null, 2),
  );

  return metadataUri;
}

export async function readPaperStackDownloadMetadata() {
  if (!PAPER_STACK_DOWNLOAD_DIR) {
    return [];
  }

  const directoryInfo = await FileSystem.getInfoAsync(PAPER_STACK_DOWNLOAD_DIR);

  if (!directoryInfo.exists) {
    return [];
  }

  const files = await FileSystem.readDirectoryAsync(PAPER_STACK_DOWNLOAD_DIR);
  const metadataFiles = files.filter((file) => file.endsWith(".json"));
  const downloads: Download[] = [];

  for (const fileName of metadataFiles) {
    try {
      const metadataUri = `${PAPER_STACK_DOWNLOAD_DIR}${fileName}`;
      const raw = await FileSystem.readAsStringAsync(metadataUri);
      const download = JSON.parse(raw) as Download;
      const fileInfo = download.localUri
        ? await FileSystem.getInfoAsync(download.localUri)
        : { exists: false };

      if (fileInfo.exists) {
        downloads.push({ ...download, metadataUri });
      }
    } catch {
      // Ignore corrupt sidecar files; the user can clear cache from Profile.
    }
  }

  return downloads;
}

export async function deleteDownloadFiles(download?: Download) {
  if (!download) {
    return;
  }

  if (download.localUri) {
    await FileSystem.deleteAsync(download.localUri, { idempotent: true });
  }

  const metadataUri = download.metadataUri ?? getDownloadMetadataUri(download.paperId);

  if (metadataUri) {
    await FileSystem.deleteAsync(metadataUri, { idempotent: true });
  }
}

export async function deletePaperStackDownloadDirectory() {
  if (!PAPER_STACK_DOWNLOAD_DIR) {
    return;
  }

  await FileSystem.deleteAsync(PAPER_STACK_DOWNLOAD_DIR, { idempotent: true });
}
