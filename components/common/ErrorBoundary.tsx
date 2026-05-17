import { Component, type ErrorInfo, type ReactNode } from "react";
import { View } from "react-native";
import { TriangleAlert } from "lucide-react-native";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { colors } from "@/constants/theme";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("PaperStack boundary caught error", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-8 dark:bg-background-dark">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-muted dark:bg-muted-dark">
          <TriangleAlert color={colors.primary.light} size={30} />
        </View>
        <View className="gap-2">
          <Typography variant="heading3" align="center">
            Something went wrong
          </Typography>
          <Typography variant="bodySmall" color="muted" align="center">
            PaperStack hit a problem on this screen. Try again to reload the app shell.
          </Typography>
        </View>
        <Button onPress={() => this.setState({ hasError: false })}>Try again</Button>
      </View>
    );
  }
}
