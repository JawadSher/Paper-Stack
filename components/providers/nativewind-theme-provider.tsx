import { useColorScheme } from "nativewind";
import { PropsWithChildren, useEffect } from "react";

import { usePaperStackStore } from "@/store";

export function NativeWindThemeProvider({ children }: PropsWithChildren) {
  const theme = usePaperStackStore((state) => state.userPreferences.theme);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  return children;
}
