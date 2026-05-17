import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, View } from "react-native";

import { boards } from "@/constants/boards";
import type { Board, ClassLevel, Paper } from "@/types";

import { BoardBadge } from "../papers/BoardBadge";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { YearChip } from "./YearChip";

export interface PaperFilters {
  boardIds: Board["id"][];
  classes: ClassLevel[];
  years: number[];
  paperTypes: NonNullable<Paper["session"]>[];
}

export interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: PaperFilters;
  onApplyFilters: (filters: PaperFilters) => void;
}

const classLevels: ClassLevel[] = [9, 10, 11, 12];
const years = [2019, 2020, 2021, 2022, 2023, 2024];
const paperTypes: NonNullable<Paper["session"]>[] = ["annual", "supplementary"];

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function FilterSheet({ visible, onClose, filters, onApplyFilters }: FilterSheetProps) {
  const translateY = useRef(new Animated.Value(420)).current;
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }

    Animated.timing(translateY, {
      toValue: visible ? 0 : 420,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [filters, translateY, visible]);

  const resetFilters = useMemo<PaperFilters>(
    () => ({ boardIds: [], classes: [], years: [], paperTypes: [] }),
    [],
  );

  const apply = () => {
    onApplyFilters(draft);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        <Animated.View
          className="max-h-[82%] rounded-t-2xl border border-border bg-background p-5 dark:border-border-dark dark:bg-background-dark"
          style={{ transform: [{ translateY }] }}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <Typography variant="heading3">Filters</Typography>
            <Button variant="ghost" size="sm" onPress={onClose}>
              Close
            </Button>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} className="gap-5">
            <View className="mb-5 gap-3">
              <Typography variant="label" color="muted">
                Board
              </Typography>
              <View className="flex-row flex-wrap gap-2">
                {boards.map((board) => {
                  const selected = draft.boardIds.includes(board.id);
                  return (
                    <Pressable
                      key={board.id}
                      onPress={() =>
                        setDraft((current) => ({
                          ...current,
                          boardIds: toggleValue(current.boardIds, board.id),
                        }))
                      }
                      className={selected ? "opacity-100" : "opacity-60"}
                    >
                      <BoardBadge board={board} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View className="mb-5 gap-3">
              <Typography variant="label" color="muted">
                Class
              </Typography>
              <View className="flex-row flex-wrap gap-2">
                {classLevels.map((classLevel) => (
                  <Pressable
                    key={classLevel}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        classes: toggleValue(current.classes, classLevel),
                      }))
                    }
                    className={[
                      "rounded-full border px-4 py-2",
                      draft.classes.includes(classLevel)
                        ? "border-primary bg-primary dark:border-primary-dark dark:bg-primary-dark"
                        : "border-border bg-card dark:border-border-dark dark:bg-card-dark",
                    ].join(" ")}
                  >
                    <Typography
                      variant="caption"
                      weight="semibold"
                      className={
                        draft.classes.includes(classLevel) ? "text-primary-foreground" : undefined
                      }
                    >
                      {classLevel}
                    </Typography>
                  </Pressable>
                ))}
              </View>
            </View>
            <View className="mb-5 gap-3">
              <Typography variant="label" color="muted">
                Year
              </Typography>
              <View className="flex-row flex-wrap gap-2">
                {years.map((year) => (
                  <YearChip
                    key={year}
                    year={year}
                    selected={draft.years.includes(year)}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        years: toggleValue(current.years, year),
                      }))
                    }
                  />
                ))}
              </View>
            </View>
            <View className="mb-6 gap-3">
              <Typography variant="label" color="muted">
                Paper Type
              </Typography>
              <View className="flex-row flex-wrap gap-2">
                {paperTypes.map((paperType) => {
                  const selected = draft.paperTypes.includes(paperType);
                  return (
                    <Pressable
                      key={paperType}
                      onPress={() =>
                        setDraft((current) => ({
                          ...current,
                          paperTypes: toggleValue(current.paperTypes, paperType),
                        }))
                      }
                      className={[
                        "rounded-full border px-4 py-2",
                        selected
                          ? "border-primary bg-primary dark:border-primary-dark dark:bg-primary-dark"
                          : "border-border bg-card dark:border-border-dark dark:bg-card-dark",
                      ].join(" ")}
                    >
                      <Typography
                        variant="caption"
                        weight="semibold"
                        className={selected ? "text-primary-foreground" : undefined}
                      >
                        {paperType === "annual" ? "Annual" : "Supplementary"}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View className="flex-row gap-3 pt-3">
            <Button
              variant="secondary"
              fullWidth
              onPress={() => {
                setDraft(resetFilters);
                onApplyFilters(resetFilters);
              }}
            >
              Reset
            </Button>
            <Button fullWidth onPress={apply}>
              Apply
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
