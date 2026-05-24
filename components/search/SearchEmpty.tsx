import { useRouter } from "expo-router";
import { SearchX } from "lucide-react-native";
import { View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/Button";
import type { SearchFilters } from "@/components/search/FilterChips";

interface SearchEmptyProps {
  query: string;
  filters: SearchFilters;
  onClearFilters: () => void;
}

export function SearchEmpty({ query, filters, onClearFilters }: SearchEmptyProps) {
  const router = useRouter();
  const hasFilters =
    filters.boardIds.length +
      filters.classes.length +
      filters.subjectIds.length +
      filters.years.length +
      filters.paperTypes.length >
    0;

  return (
    <View className="gap-3">
      <EmptyState
        icon={SearchX}
        title={`No papers found for "${query || "your search"}"`}
        subtitle="Try searching by subject name, year, or board."
      />
      <View className="gap-3 px-8">
        {hasFilters ? (
          <Button variant="secondary" fullWidth onPress={onClearFilters}>
            Clear filters
          </Button>
        ) : null}
        <Button
          fullWidth
          onPress={() => router.push("/(stack)/boards" as never)}
        >
          Browse all papers
        </Button>
      </View>
    </View>
  );
}
