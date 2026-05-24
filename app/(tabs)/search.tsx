import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterSheet, type PaperFilters } from "@/components/common/FilterSheet";
import { Button } from "@/components/ui/Button";
import { FilterChips, type SearchFilters } from "@/components/search/FilterChips";
import { RecentSearches, saveRecentSearch } from "@/components/search/RecentSearches";
import { SearchEmpty } from "@/components/search/SearchEmpty";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchResults } from "@/components/search/SearchResults";
import {
  useAllSubjects,
  useBoards,
  useSearchPapers,
  type MobileSearchFilters,
} from "@/hooks/api";

const emptySearchFilters: SearchFilters = {
  boardIds: [],
  classes: [],
  subjectIds: [],
  years: [],
  paperTypes: [],
};

function getActiveFilterCount(filters: SearchFilters) {
  return (
    filters.boardIds.length +
    filters.classes.length +
    filters.subjectIds.length +
    filters.years.length +
    filters.paperTypes.length
  );
}

function toPaperFilters(filters: SearchFilters): PaperFilters {
  return {
    boardIds: filters.boardIds,
    classes: filters.classes,
    years: filters.years,
    paperTypes: filters.paperTypes,
  };
}

function toMobileFilters(filters: SearchFilters): MobileSearchFilters {
  return {
    boardId: filters.boardIds[0],
    subjectId: filters.subjectIds[0],
    classLevel: filters.classes[0],
    year: filters.years[0],
    session: filters.paperTypes[0],
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
  const [page, setPage] = useState(1);
  const { data: allBoards = [] } = useBoards();
  const { data: allSubjects = [] } = useAllSubjects();
  const mobileFilters = useMemo(() => toMobileFilters(filters), [filters]);
  const { data: searchResult, isLoading, isFetching } = useSearchPapers(
    query,
    mobileFilters,
    page,
  );
  const results = searchResult?.data ?? [];
  const totalCount = searchResult?.count ?? 0;
  const hasMore = searchResult?.hasMore ?? false;
  const activeFilterCount = getActiveFilterCount(filters);
  const hasQuery = query.trim().length > 0;
  const hasSearchState = hasQuery || activeFilterCount > 0;

  useEffect(() => {
    setPage(1);
  }, [query, filters]);

  useEffect(() => {
    const subjectParam = Array.isArray(params.subject) ? params.subject[0] : params.subject;

    if (!subjectParam) {
      return;
    }

    const subjectMatches = allSubjects
      .filter((subject) => subject.name.toLowerCase() === subjectParam.toLowerCase())
      .map((subject) => subject.id);

    setQuery(subjectParam);
    setFilters((current) => ({
      ...current,
      subjectIds: subjectMatches,
    }));
  }, [allSubjects, params.subject]);

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
          <FilterChips
            filters={filters}
            boards={allBoards}
            subjects={allSubjects}
            onRemove={removeFilter}
            onClearAll={clearFilters}
          />
          {hasSearchState ? (
            totalCount === 0 && !isLoading ? (
              <SearchEmpty query={query} filters={filters} onClearFilters={clearFilters} />
            ) : (
              <View className="gap-4">
                <SearchResults
                  results={results}
                  totalCount={totalCount}
                  isLoading={isLoading}
                  filters={filters}
                />
                <Button
                  onPress={() => setPage((current) => current + 1)}
                  disabled={!hasMore || isFetching}
                >
                  Load more
                </Button>
              </View>
            )
          ) : (
            <RecentSearches
              boards={allBoards}
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
          boards={allBoards}
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
