import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import { NetworkError } from "@/components/common/NetworkError";
import { SearchBar } from "@/components/common/SearchBar";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";
import { useBoardsByProvince } from "@/hooks/api";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function AllBoardsScreen() {
  const router = useRouter();
  const { data: boardsByProvince = {}, isLoading, error, refetch } = useBoardsByProvince();
  const { isConnected } = useNetworkStatus();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = useMemo(
    () => {
      const provinces = Object.keys(boardsByProvince);

      return provinces
        .map((province) => ({
          province,
          boards: boardsByProvince[province].filter((board) => {
            if (!normalizedQuery) {
              return true;
            }

            return `${board.name} ${board.shortName} ${board.province}`
              .toLowerCase()
              .includes(normalizedQuery);
            }),
        }))
        .filter((group) => group.boards.length > 0);
    },
    [boardsByProvince, normalizedQuery],
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3 px-5 pb-10 pt-5"
          showsVerticalScrollIndicator={false}
        >
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <SkeletonLoader key={item} variant="boardCard" />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error && !isConnected && Object.keys(boardsByProvince).length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
        <NetworkError onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (error && Object.keys(boardsByProvince).length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
        <NetworkError
          title="Could not load boards"
          subtitle={error instanceof Error ? error.message : "Check your Supabase credentials."}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <Typography variant="heading2">All Boards</Typography>
          <Typography variant="bodySmall" color="muted">
            Browse every Pakistan board by province.
          </Typography>
        </View>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search boards" />
        {filteredGroups.map((group) => (
          <View key={group.province} className="gap-3">
            <Typography variant="label" color="muted">
              {group.province}
            </Typography>
            {group.boards.map((board) => (
              <Pressable
                key={board.id}
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: "/(stack)/boards/[boardId]",
                    params: { boardId: board.id },
                  } as never)
                }
                className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-4 active:opacity-90 dark:border-border-dark dark:bg-card-dark"
                style={{ borderLeftColor: board.color, borderLeftWidth: 5 }}
              >
                <View className="flex-1 gap-2">
                  <Typography variant="body" weight="semibold" numberOfLines={2}>
                    {board.name}
                  </Typography>
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Typography variant="caption" color="muted" weight="medium">
                      {board.shortName}
                    </Typography>
                    <Badge label={board.province} color={board.color} size="sm" />
                    {/* TODO: show paper counts when board._count.papers is available */}
                  </View>
                </View>
                <ChevronRight color={board.color ?? colors.mutedForeground.light} size={20} />
              </Pressable>
            ))}
          </View>
        ))}
        {filteredGroups.length === 0 ? (
          <View className="items-center py-12">
            <Typography variant="bodySmall" color="muted">
              No boards match your search.
            </Typography>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
