// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { defineConfig } from "tsdown";

export default defineConfig({
  name: "kernux-nextra-theme",
  entry: ["src/index.ts", "src/withMarkdownWebBook.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    "nextra",
    "next",
    "next/dynamic",
    "next/router",
    "next/image",
    "next/link",
    "flexsearch",
    "sonner",
    "@heroicons/react",
    "clsx",
    "lodash",
    "lucide-react",
    "tailwind-merge",
    "class-variance-authority",
    "cmdk",
    "react-syntax-highlighter",
    "recharts",
  ],
  publicDir: "public",
  outExtension: () => ({ js: ".js" }),
  treeshake: true,
});
