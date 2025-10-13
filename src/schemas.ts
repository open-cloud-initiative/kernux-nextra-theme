// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { fc, reactNode } from "nextra/schemas";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { z } from "zod";

export type KernuxThemeConfig = z.infer<typeof themeSchema>;
export type PartialDocsThemeConfig = z.infer<typeof publicThemeSchema>;

const i18nSchema = /* @__PURE__ */ (() =>
  z.array(
    z.strictObject({
      direction: z.enum(["ltr", "rtl"]).optional(),
      locale: z.string(),
      name: z.string(),
    }),
  ))();

export const themeOptionsSchema = /* @__PURE__ */ (() =>
  z.strictObject({
    light: z.string(),
    dark: z.string(),
    system: z.string(),
  }))();

export const themeSchema = /* @__PURE__ */ (() =>
  z.strictObject({
    glossaryPage: z.string().optional(),
    feedback: z
      .strictObject({
        title: z.string(),
        description: z.custom<ReactNode>().optional(),
        buttonText: z.string(),
        gitlabProjectId: z.string(),
        labels: z.array(z.string()).optional(),
        feedbackServerUrl: z.string(),
      })
      .optional(),
    layoutComponent: z
      .custom<(props: PropsWithChildren) => ReactNode>()
      .optional(),
    docsRepositoryBase: z.string().optional(),
    umbrellaFooter: z.boolean().optional(),
    umbrellaHeader: z.boolean().optional(),
    banner: z.custom<FC>(...reactNode).optional(),
    headerLowerBadgeLogoPath: z.string().optional(),
    headerCenterElement: z.custom<ReactNode | FC>(...reactNode).optional(),
    disableSearch: z.boolean(),
    hidePrimaryMenu: z.boolean(),
    primaryMenu: z
      .object({
        title: z.string(),
        iconEnabled: z.boolean().optional(),
      })
      .optional(),
    components: z.record(z.custom<FC>(...fc)).optional(),
    faviconGlyph: z.string().optional(),
    accessibilityLanguages: z
      .strictObject({
        leichteSpracheHref: z.string().optional(),
        gebaerdenSprachenHref: z.string().optional(),
      })
      .optional(),
    footer: z.strictObject({
      component: z.custom<ReactNode | FC<{ menu: boolean }>>(...reactNode),
      links: z
        .array(
          z.object({
            name: z.string(),
            href: z.string(),
            column: z.string(),
          }),
        )
        .optional()
        .default([]),
      logo: z.custom<ReactNode | FC>(...reactNode),
      description: z.custom<ReactNode | FC>(...reactNode),
      copyright: z.custom<ReactNode | FC>(...reactNode),
    }),
    toc: z
      .strictObject({
        title: z.string().optional(),
        iconEnabled: z.boolean().optional(),
      })
      .optional(),
    head: z.custom<ReactNode | FC>(...reactNode),
    i18n: i18nSchema,
    logo: z.custom<ReactNode | FC>(...reactNode),
    logoText: z.string().optional(),
    logoLink: z.boolean().or(z.string()),
    notFound: z.strictObject({
      content: z.custom<ReactNode | FC>(...reactNode),
      labels: z.string(),
    }),
    search: z.strictObject({
      component: z.custom<ReactNode | FC<{ className?: string }>>(...reactNode),
      emptyResult: z.custom<ReactNode | FC>(...reactNode),
      error: z.string().or(z.function().returns(z.string())),
      loading: z.custom<ReactNode | FC>(...reactNode),
      // Can't be React component
      placeholder: z.string().or(z.function().returns(z.string())),
    }),
    sidebar: z.strictObject({
      disable: z.boolean(),
      autoCollapse: z.boolean().optional(),
      defaultMenuCollapseLevel: z.number().min(1).int(),
      toggleButton: z.boolean(),
    }),
  }))();

export const publicThemeSchema = /* @__PURE__ */ (() =>
  themeSchema.deepPartial().extend({
    // to have `locale` and `text` as required properties
    i18n: i18nSchema.optional(),
  }))();
