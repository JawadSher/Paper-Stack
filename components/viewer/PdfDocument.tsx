import { View } from "react-native";
import { useEffect } from "react";
import { FileText } from "lucide-react-native";

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

export function PdfDocument({
  sourceUri,
  accentColor = "#C96442",
  onLoadComplete,
}: PdfDocumentProps) {
  useEffect(() => {
    onLoadComplete(1);
  }, [onLoadComplete]);

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
            PDF preview is native-only
          </Typography>
          <Typography variant="bodySmall" color="muted" align="center">
            Use a native build to render this paper inside the app. The selected file is ready.
          </Typography>
        </View>
        <Typography variant="caption" color="muted" align="center" numberOfLines={1}>
          {sourceUri}
        </Typography>
      </View>
    </View>
  );
}
