import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterSheet, type PaperFilters } from "@/components/common/FilterSheet";
import { FilterChips } from "@/components/search/FilterChips";
import { RecentSearches, saveRecentSearch } from "@/components/search/RecentSearches";
import { SearchEmpty } from "@/components/search/SearchEmpty";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchResults } from "@/components/search/SearchResults";
import { subjects } from "@/constants/subjects";
import {
  emptySearchFilters,
  getActiveFilterCount,
  type SearchFilters,
  useSearch,
} from "@/hooks/useSearch";

function toPaperFilters(filters: SearchFilters): PaperFilters {
  return {
    boardIds: filters.boardIds,
    classes: filters.classes,
    years: filters.years,
    paperTypes: filters.paperTypes,
  };
}

function mergePaperFilters(current: SearchFilters, filters: PaperFilters): SearchFilters {
  return {
    ...current,
    boardIds: filters.boardIds,
    classes: filters.classes,
    years: filters.years,
    paperTypes: filters.paperTypes,
  };
}

export default function SearchScreen() {
  const params = useLocalSearchParams<{ subject?: string; q?: string }>();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(emptySearchFilters);
  const [filterVisible, setFilterVisible] = useState(false);
  const { results, isLoading, totalCount } = useSearch(query, filters);
  const activeFilterCount = getActiveFilterCount(filters);
  const hasQuery = query.trim().length > 0;
  const hasSearchState = hasQuery || activeFilterCount > 0;

  useEffect(() => {
    const subjectParam = Array.isArray(params.subject) ? params.subject[0] : params.subject;

    if (!subjectParam) {
      return;
    }

    const subjectMatches = subjects
      .filter((subject) => subject.name.toLowerCase() === subjectParam.toLowerCase())
      .map((subject) => subject.id);

    setQuery(subjectParam);
    setFilters((current) => ({
      ...current,
      subjectIds: subjectMatches,
    }));
  }, [params.subject]);

  useEffect(() => {
    const q = Array.isArray(params.q) ? params.q[0] : params.q;

    if (q) {
      setQuery(q);
      saveRecentSearch(q);
    }
  }, [params.q]);

  const submitSearch = async (term: string) => {
    setQuery(term);
    await saveRecentSearch(term);
  };

  const removeFilter = (key: keyof SearchFilters, value: string | number) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].filter((item) => item !== value),
    }));
  };

  const clearFilters = () => setFilters(emptySearchFilters);

  const paperFilters = useMemo(() => toPaperFilters(filters), [filters]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-5 pb-10 pt-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SearchHeader
            query={query}
            activeFilterCount={activeFilterCount}
            onChangeQuery={setQuery}
            onSubmit={submitSearch}
            onOpenFilters={() => setFilterVisible(true)}
          />
          <FilterChips filters={filters} onRemove={removeFilter} onClearAll={clearFilters} />
          {hasSearchState ? (
            totalCount === 0 && !isLoading ? (
              <SearchEmpty query={query} filters={filters} onClearFilters={clearFilters} />
            ) : (
              <SearchResults
                results={results}
                totalCount={totalCount}
                isLoading={isLoading}
                filters={filters}
              />
            )
          ) : (
            <RecentSearches
              onSelectSearch={(term) => {
                setQuery(term);
                saveRecentSearch(term);
              }}
              onSelectBoard={(boardId) =>
                setFilters((current) => ({
                  ...current,
                  boardIds: [boardId],
                }))
              }
            />
          )}
          <View className="h-2" />
        </ScrollView>
        <FilterSheet
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          filters={paperFilters}
          onApplyFilters={(nextFilters) =>
            setFilters((current) => mergePaperFilters(current, nextFilters))
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
