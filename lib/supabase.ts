import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js/dist/index.cjs";
import Constants from "expo-constants";

const supabaseUrl = (
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  Constants.expoConfig?.extra?.supabaseUrl
)?.trim() as string;

const supabaseAnonKey = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  Constants.expoConfig?.extra?.supabaseAnonKey
)?.trim() as string;

export const supabaseConfigError = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return "Missing Supabase credentials. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env";
  }

  if (!/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(supabaseUrl)) {
    return "Invalid Supabase URL. EXPO_PUBLIC_SUPABASE_URL should look like https://your-project-ref.supabase.co";
  }

  if (!supabaseAnonKey.startsWith("eyJ") && !supabaseAnonKey.startsWith("sb_publishable_")) {
    return "Invalid Supabase anon key. Use the anon public key from Supabase Project Settings > API.";
  }

  return null;
})();

if (__DEV__ && supabaseConfigError) {
  console.warn(supabaseConfigError);
}

export const supabase = createClient(
  supabaseUrl || "https://example.supabase.co",
  supabaseAnonKey || "missing-supabase-anon-key",
  {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  },
);

export function unwrap<T>({
  data,
  error,
}: {
  data: T | null;
  error: unknown;
}): T {
  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String(error.message)
          : "Supabase error";
    throw new Error(message);
  }

  if (data === null) {
    throw new Error("No data returned");
  }

  return data;
}

export function unwrapNullable<T>({
  data,
  error,
}: {
  data: T | null;
  error: unknown;
}): T | null {
  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String(error.message)
          : "Supabase error";
    throw new Error(message);
  }

  return data;
}
