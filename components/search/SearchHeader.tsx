import { SlidersHorizontal } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { SearchBar } from "@/components/common/SearchBar";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

interface SearchHeaderProps {
  query: string;
  activeFilterCount: number;
  onChangeQuery: (value: string) => void;
  onSubmit: (value: string) => void;
  onOpenFilters: () => void;
}

export function SearchHeader({
  query,
  activeFilterCount,
  onChangeQuery,
  onSubmit,
  onOpenFilters,
}: SearchHeaderProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1">
        <SearchBar
          value={query}
          onChangeText={onChangeQuery}
          onSubmit={onSubmit}
          placeholder="Search subject, board, year"
          autoFocus
        />
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onOpenFilters}
        className="relative h-12 w-12 items-center justify-center rounded-lg border border-border bg-card active:opacity-80 dark:border-border-dark dark:bg-card-dark"
      >
        <SlidersHorizontal color={colors.foreground.light} size={21} />
        {activeFilterCount > 0 ? (
          <View className="absolute -right-1 -top-1 min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 dark:bg-primary-dark">
            <Typography variant="caption" weight="bold" className="text-white dark:text-white">
              {activeFilterCount}
            </Typography>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}
