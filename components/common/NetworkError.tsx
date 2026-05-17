import { WifiOff } from "lucide-react-native";

import { EmptyState } from "@/components/common/EmptyState";

interface NetworkErrorProps {
  onRetry: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <EmptyState
      icon={WifiOff}
      title="Could not connect"
      subtitle="Check your internet connection and try again."
      actionLabel="Retry"
      onAction={onRetry}
    />
  );
}
