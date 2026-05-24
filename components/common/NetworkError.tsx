import { WifiOff } from "lucide-react-native";

import { EmptyState } from "@/components/common/EmptyState";

interface NetworkErrorProps {
  onRetry: () => void;
  title?: string;
  subtitle?: string;
}

export function NetworkError({
  onRetry,
  title = "Could not connect",
  subtitle = "Check your internet connection and try again.",
}: NetworkErrorProps) {
  return (
    <EmptyState
      icon={WifiOff}
      title={title}
      subtitle={subtitle}
      actionLabel="Retry"
      onAction={onRetry}
    />
  );
}
