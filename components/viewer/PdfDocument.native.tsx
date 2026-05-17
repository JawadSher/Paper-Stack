import Constants from "expo-constants";
import type { ComponentType } from "react";
import { useEffect, useMemo } from "react";
import { Linking, Pressable, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

interface PdfDocumentProps {
  sourceUri: string;
  page: number;
  scale: number;
  onLoadComplete: (pages: number) => void;
  onPageChanged: (page: number, pages: number) => void;
  onError: () => void;
}

type NativePdfProps = {
  source: { uri: string; cache?: boolean };
  page: number;
  scale: number;
  minScale: number;
  maxScale: number;
  trustAllCerts: boolean;
  onLoadComplete: (pages: number) => void;
  onPageChanged: (page: number, pages: number) => void;
  onError: () => void;
  style: { flex: number };
};

export function PdfDocument({
  sourceUri,
  page,
  scale,
  onLoadComplete,
  onPageChanged,
  onError,
}: PdfDocumentProps) {
  const NativePdf = useMemo(() => {
    if (Constants.appOwnership === "expo") {
      return null;
    }

    try {
      // react-native-pdf requires native modules that are not available in Expo Go.
      // Loading it lazily keeps the route valid in Expo Go and enables it in dev builds.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("react-native-pdf").default as ComponentType<NativePdfProps>;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!NativePdf) {
      onLoadComplete(1);
    }
  }, [NativePdf, onLoadComplete]);

  if (!NativePdf) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <View className="gap-2">
          <Typography variant="heading3" align="center">
            PDF preview needs a development build
          </Typography>
          <Typography variant="bodySmall" color="muted" align="center">
            Expo Go cannot load react-native-pdf native modules. Open the file externally or use a
            custom dev build for in-app PDF rendering.
          </Typography>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openURL(sourceUri)}
          className="rounded-lg bg-primary px-4 py-3 active:opacity-80 dark:bg-primary-dark"
        >
          <Typography variant="bodySmall" weight="semibold" className="text-white dark:text-white">
            Open PDF
          </Typography>
        </Pressable>
      </View>
    );
  }

  return (
    <NativePdf
      source={{ uri: sourceUri, cache: true }}
      page={page}
      scale={scale}
      minScale={0.7}
      maxScale={2.5}
      trustAllCerts={false}
      onLoadComplete={onLoadComplete}
      onPageChanged={onPageChanged}
      onError={onError}
      style={{ flex: 1 }}
    />
  );
}
