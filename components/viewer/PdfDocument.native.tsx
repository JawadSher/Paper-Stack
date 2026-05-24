import Constants from "expo-constants";
import type { ComponentType } from "react";
import { useEffect, useMemo } from "react";
import { Linking, Pressable, View } from "react-native";
import { ExternalLink, FileText } from "lucide-react-native";

import { Typography } from "@/components/ui/Typography";

interface PdfDocumentProps {
  sourceUri: string;
  accentColor?: string;
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
  accentColor = "#C96442",
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
      <View className="flex-1 items-center justify-center px-5 pb-36">
        <View className="w-full max-w-md items-center gap-5 rounded-lg border border-border bg-card p-6 dark:border-border-dark dark:bg-card-dark">
          <View
            className="h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            <FileText color={accentColor} size={30} />
          </View>
          <View className="gap-2">
            <Typography variant="heading3" align="center">
              Open PDF preview
            </Typography>
            <Typography variant="bodySmall" color="muted" align="center">
              Expo Go cannot render the native PDF preview. Open the paper externally, or use a
              development build for in-app reading.
            </Typography>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => Linking.openURL(sourceUri)}
            className="h-11 flex-row items-center justify-center gap-2 rounded-full px-5 active:opacity-80"
            style={{ backgroundColor: accentColor }}
          >
            <ExternalLink color="#FFFFFF" size={17} />
            <Typography variant="bodySmall" weight="semibold" className="text-white dark:text-white">
              Open PDF
            </Typography>
          </Pressable>
        </View>
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
