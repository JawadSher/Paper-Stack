import { ChevronDown, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Platform, Pressable, SectionList, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import type { CommonQuestion } from "@/types";

import { QuestionCard } from "./QuestionCard";

export interface QuestionGroup {
  chapterId: string;
  chapterName: string;
  questions: CommonQuestion[];
}

interface QuestionsListProps {
  groups: QuestionGroup[];
  boardId?: string;
}

export function QuestionsList({ groups, boardId }: QuestionsListProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const sections = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        data: collapsed.has(group.chapterId) ? [] : group.questions,
      })),
    [collapsed, groups],
  );

  const toggle = (chapterId: string) => {
    setCollapsed((current) => {
      const next = new Set(current);

      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }

      return next;
    });
  };

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      getItemLayout={(_, index) => ({ length: 206, offset: 206 * index, index })}
      initialNumToRender={8}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews={Platform.OS === "android"}
      stickySectionHeadersEnabled
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
      SectionSeparatorComponent={() => <View className="h-4" />}
      renderSectionHeader={({ section }) => {
        const isCollapsed = collapsed.has(section.chapterId);
        const Icon = isCollapsed ? ChevronRight : ChevronDown;

        return (
          <Pressable
            accessibilityRole="button"
            onPress={() => toggle(section.chapterId)}
            className="flex-row items-center gap-2 border-b border-border bg-background py-3 dark:border-border-dark dark:bg-background-dark"
          >
            <Icon color={colors.mutedForeground.light} size={18} />
            <Typography variant="bodySmall" weight="semibold" className="flex-1">
              {section.chapterName}
            </Typography>
            <Badge label={`${section.questions.length}`} size="sm" />
          </Pressable>
        );
      }}
      renderItem={({ item }) => <QuestionCard question={item} boardId={boardId} />}
    />
  );
}
