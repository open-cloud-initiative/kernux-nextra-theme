// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { DEEP_OBJECT_KEYS, DEFAULT_THEME } from "../default-theme-config";
import { KernuxThemeConfig } from "../schemas";

const ThemeConfigContext = createContext<KernuxThemeConfig>(DEFAULT_THEME);
ThemeConfigContext.displayName = "ThemeConfig";
export const useThemeConfig = () => useContext(ThemeConfigContext);

export function ThemeConfigProvider({
  value,
  children,
}: {
  value: KernuxThemeConfig;
  children: ReactNode;
}): ReactElement {
  const storeRef = useRef<KernuxThemeConfig>();
  storeRef.current ||= {
    ...DEFAULT_THEME,
    ...(value &&
      Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          value && typeof value === "object" && DEEP_OBJECT_KEYS.includes(key)
            ? // @ts-expect-error -- key has always object value
              { ...DEFAULT_THEME[key], ...value }
            : value,
        ]),
      )),
  };

  return (
    <ThemeConfigContext.Provider value={storeRef.current}>
      {children}
    </ThemeConfigContext.Provider>
  );
}
