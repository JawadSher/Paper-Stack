import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export type SkeletonVariant = "paperCard" | "boardCard" | "text";

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
}

function ShimmerBlock({ className }: { className: string }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={["rounded-md bg-muted dark:bg-muted-dark", className].join(" ")}
      style={{ opacity }}
    />
  );
}

export function SkeletonLoader({ variant = "text" }: SkeletonLoaderProps) {
  if (variant === "text") {
    return <ShimmerBlock className="h-4 w-3/4" />;
  }

  if (variant === "boardCard") {
    return (
      <View className="gap-3 rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
        <ShimmerBlock className="h-5 w-2/3" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-1/2" />
      </View>
    );
  }

  return (
    <View className="gap-4 rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
      <View className="flex-row justify-between gap-3">
        <View className="flex-1 gap-3">
          <ShimmerBlock className="h-6 w-3/4" />
          <View className="flex-row gap-2">
            <ShimmerBlock className="h-6 w-16 rounded-full" />
            <ShimmerBlock className="h-6 w-14 rounded-full" />
            <ShimmerBlock className="h-6 w-20 rounded-full" />
          </View>
        </View>
        <ShimmerBlock className="h-10 w-10 rounded-full" />
      </View>
      <View className="items-end">
        <ShimmerBlock className="h-9 w-28 rounded-full" />
      </View>
    </View>
  );
}
