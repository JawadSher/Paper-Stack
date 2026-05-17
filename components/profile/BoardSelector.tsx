import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Check } from "lucide-react-native";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { boardsByProvince } from "@/constants/boards";
import { colors } from "@/constants/theme";

interface BoardSelectorProps {
  visible: boolean;
  selectedBoardIds: string[];
  onClose: () => void;
  onSave: (boardIds: string[]) => void;
}

export function BoardSelector({
  visible,
  selectedBoardIds,
  onClose,
  onSave,
}: BoardSelectorProps) {
  const [draft, setDraft] = useState(selectedBoardIds);

  useEffect(() => {
    if (visible) {
      setDraft(selectedBoardIds);
    }
  }, [selectedBoardIds, visible]);

  const toggle = (boardId: string) => {
    setDraft((current) =>
      current.includes(boardId)
        ? current.filter((id) => id !== boardId)
        : [...current, boardId],
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="max-h-[82%] gap-4 rounded-t-2xl border border-border bg-background p-5 dark:border-border-dark dark:bg-background-dark">
          <View className="flex-row items-center justify-between">
            <Typography variant="heading3">Select Boards</Typography>
            <Button variant="ghost" size="sm" onPress={onClose}>
              Close
            </Button>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-5 pb-3">
              {Object.entries(boardsByProvince).map(([province, provinceBoards]) => (
                <View key={province} className="gap-2">
                  <Typography variant="label" color="muted">
                    {province}
                  </Typography>
                  {provinceBoards.map((board) => {
                    const selected = draft.includes(board.id);

                    return (
                      <Pressable
                        key={board.id}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        onPress={() => toggle(board.id)}
                        className="flex-row items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 active:opacity-90 dark:border-border-dark dark:bg-card-dark"
                        style={{ borderLeftColor: board.color, borderLeftWidth: 5 }}
                      >
                        <View className="flex-1">
                          <Typography variant="bodySmall" weight="semibold">
                            {board.shortName}
                          </Typography>
                          <Typography variant="caption" color="muted" numberOfLines={1}>
                            {board.name}
                          </Typography>
                        </View>
                        <View
                          className="h-6 w-6 items-center justify-center rounded-md border"
                          style={{
                            backgroundColor: selected ? colors.primary.light : "transparent",
                            borderColor: selected ? colors.primary.light : colors.border.light,
                          }}
                        >
                          {selected ? <Check color="#FFFFFF" size={15} /> : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
          <Button
            fullWidth
            onPress={() => {
              onSave(draft);
              onClose();
            }}
          >
            Save
          </Button>
        </View>
      </View>
    </Modal>
  );
}
