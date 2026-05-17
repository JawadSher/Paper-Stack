import { useState } from "react";
import { Modal, Pressable, TextInput, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  onJumpToPage: (page: number) => void;
}

export function PageIndicator({ currentPage, totalPages, onJumpToPage }: PageIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(String(currentPage || 1));

  const jump = () => {
    const page = Math.max(1, Math.min(totalPages || 1, Number(value) || 1));
    onJumpToPage(page);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setValue(String(currentPage || 1));
          setVisible(true);
        }}
        className="min-w-20 items-center rounded-full bg-muted px-3 py-2 dark:bg-muted-dark"
      >
        <Typography variant="caption" weight="semibold">
          {currentPage || 1} / {totalPages || "-"}
        </Typography>
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full max-w-sm gap-4 rounded-lg border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark">
            <View className="gap-1">
              <Typography variant="heading3">Jump to page</Typography>
              <Typography variant="bodySmall" color="muted">
                Enter a page between 1 and {totalPages || 1}.
              </Typography>
            </View>
            <TextInput
              value={value}
              onChangeText={setValue}
              keyboardType="number-pad"
              autoFocus
              placeholder="Page number"
              placeholderTextColor={colors.mutedForeground.light}
              className="rounded-lg border border-border bg-background px-4 py-3 font-sans text-lg text-foreground dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
            />
            <View className="flex-row gap-3">
              <Button variant="ghost" fullWidth onPress={() => setVisible(false)}>
                Cancel
              </Button>
              <Button fullWidth onPress={jump}>
                Jump
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
