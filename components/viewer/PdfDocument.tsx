import { View } from "react-native";
import { useEffect } from "react";

import { Typography } from "@/components/ui/Typography";

interface PdfDocumentProps {
  sourceUri: string;
  page: number;
  scale: number;
  onLoadComplete: (pages: number) => void;
  onPageChanged: (page: number, pages: number) => void;
  onError: () => void;
}

export function PdfDocument({ sourceUri, onLoadComplete }: PdfDocumentProps) {
  useEffect(() => {
    onLoadComplete(1);
  }, [onLoadComplete]);

  return (
    <View className="flex-1 items-center justify-center gap-2 px-8">
      <Typography variant="heading3" align="center">
        PDF preview is native-only
      </Typography>
      <Typography variant="bodySmall" color="muted" align="center">
        Open this screen in Expo Go or a native build to view the PDF. Source: {sourceUri}
      </Typography>
    </View>
  );
}
