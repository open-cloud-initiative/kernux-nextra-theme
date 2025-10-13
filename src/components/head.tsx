// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import NextHead from "next/head";
import { useMounted } from "nextra/hooks";
import type { ReactElement } from "react";
import { useThemeConfig } from "../contexts";

export function Head(): ReactElement {
  const mounted = useMounted();
  const themeConfig = useThemeConfig();

  // `head` can be either FC or ReactNode. We have to directly call it if it's an
  // FC because hooks like Next.js' `useRouter` aren't allowed inside NextHead.
  const head =
    typeof themeConfig.head === "function"
      ? themeConfig.head({})
      : themeConfig.head;
  return (
    <NextHead>
      {themeConfig.faviconGlyph ? (
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${themeConfig.faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`}
        />
      ) : null}
      {mounted ? (
        <meta name="theme-color" content="#fff" />
      ) : (
        <>
          <meta
            name="theme-color"
            content="#fff"
            media="(prefers-color-scheme: light)"
          />
        </>
      )}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      <style>{`:root{--nextra-navbar-height:76px;--nextra-menu-height:3.75rem;--nextra-banner-height:2.5rem;}`}</style>
      {head}
    </NextHead>
  );
}
