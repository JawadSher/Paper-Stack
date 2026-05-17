import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react-native";

import { colors } from "@/constants/theme";

import { Typography } from "../ui/Typography";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
}

type ToastListener = (toast: ToastOptions) => void;

const listeners = new Set<ToastListener>();

export function useToast() {
  const showToast = useCallback((toast: ToastOptions) => {
    listeners.forEach((listener) => listener(toast));
  }, []);

  return { showToast };
}

const toastStyles: Record<
  ToastType,
  { icon: typeof CheckCircle2; color: string; className: string }
> = {
  success: {
    icon: CheckCircle2,
    color: "#2DB896",
    className: "border-chart-3 bg-card dark:bg-card-dark",
  },
  error: {
    icon: AlertCircle,
    color: colors.destructive.dark,
    className: "border-destructive bg-card dark:border-destructive-dark dark:bg-card-dark",
  },
  info: {
    icon: Info,
    color: colors.primary.light,
    className: "border-primary bg-card dark:border-primary-dark dark:bg-card-dark",
  },
  warning: {
    icon: TriangleAlert,
    color: "#B4552D",
    className: "border-chart-5 bg-card dark:bg-card-dark",
  },
};

export interface ToastProps {
  toast: ToastOptions;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const type = toast.type ?? "info";
  const style = toastStyles[type];
  const Icon = style.icon;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -120, duration: 180, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start(onDismiss);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss, opacity, translateY]);

  return (
    <Animated.View
      className="absolute left-4 right-4 top-14 z-50"
      style={{ opacity, transform: [{ translateY }] }}
    >
      <Pressable
        onPress={onDismiss}
        className={["flex-row items-start gap-3 rounded-xl border p-4 shadow-md", style.className].join(
          " ",
        )}
      >
        <Icon color={style.color} size={22} />
        <View className="flex-1 gap-1">
          <Typography variant="bodySmall" weight="semibold">
            {toast.title}
          </Typography>
          {toast.message ? (
            <Typography variant="caption" color="muted">
              {toast.message}
            </Typography>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ToastHost() {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  useEffect(() => {
    const listener: ToastListener = (nextToast) => setToast(nextToast);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return toast ? <Toast toast={toast} onDismiss={() => setToast(null)} /> : null;
}
