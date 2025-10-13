// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { z } from "zod";
import { Folder, MdxFile, PageMapItem } from "nextra";
import { ReactNode, FC } from "react";

const ERROR_ROUTES = new Set(["/404", "/500"]);

export type pageThemeSchema = z.ZodObject<
  {
    breadcrumb: z.ZodBoolean;
    collapsed: z.ZodBoolean;
    footer: z.ZodBoolean;
    layout: z.ZodEnum<["default", "full", "raw"]>;
    navbar: z.ZodBoolean;
    pagination: z.ZodBoolean;
    sidebar: z.ZodBoolean;
    timestamp: z.ZodBoolean;
    toc: z.ZodBoolean;
    typesetting: z.ZodEnum<["default", "article"]>;
    topContent: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
    bottomContent: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
  },
  "strict",
  z.ZodTypeAny,
  {
    breadcrumb: boolean;
    collapsed: boolean;
    footer: boolean;
    layout: "default" | "full" | "raw" | "empty";
    navbar: boolean;
    pagination: boolean;
    sidebar: boolean;
    timestamp: boolean;
    toc: boolean;
    typesetting: "default" | "article";
    topContent?: ReactNode | FC;
    bottomContent?: ReactNode | FC;
  },
  {
    breadcrumb: boolean;
    collapsed: boolean;
    footer: boolean;
    layout: "default" | "full" | "raw";
    navbar: boolean;
    pagination: boolean;
    sidebar: boolean;
    timestamp: boolean;
    toc: boolean;
    typesetting: "default" | "article";
    topContent?: ReactNode | FC;
    bottomContent?: ReactNode | FC;
  }
>;
export type menuItemSchema = z.ZodObject<
  {
    display: z.ZodOptional<z.ZodEnum<["normal", "hidden", "children"]>>;
    items: z.ZodRecord<
      z.ZodString,
      z.ZodObject<
        {
          href: z.ZodOptional<z.ZodString>;
          newWindow: z.ZodOptional<z.ZodBoolean>;
          title: z.ZodString;
        },
        "strict",
        z.ZodTypeAny,
        {
          title: string;
          href?: string | undefined;
          newWindow?: boolean | undefined;
        },
        {
          title: string;
          href?: string | undefined;
          newWindow?: boolean | undefined;
        }
      >
    >;
    title: z.ZodString;
    type: z.ZodLiteral<"menu">;
  },
  "strict",
  z.ZodTypeAny,
  {
    type: "menu";
    title: string;
    items: Record<
      string,
      {
        title: string;
        href?: string | undefined;
        newWindow?: boolean | undefined;
      }
    >;
    display?: "children" | "normal" | "hidden" | undefined;
  },
  {
    type: "menu";
    title: string;
    items: Record<
      string,
      {
        title: string;
        href?: string | undefined;
        newWindow?: boolean | undefined;
      }
    >;
    display?: "children" | "normal" | "hidden" | undefined;
  }
>;

export type displaySchema = z.ZodEnum<["normal", "hidden", "children"]>;
type PageTheme = z.infer<pageThemeSchema>;
type Display = z.infer<displaySchema>;
type IMenuItem = z.infer<menuItemSchema>;

type FolderWithoutChildren = Omit<Folder, "children">;
export type Item = (MdxFile | FolderWithoutChildren) & {
  title: string;
  type: string;
  children: Item[];
  display?: Display;
  withIndexPage?: boolean;
  theme?: PageTheme;
  isUnderCurrentDocsTree?: boolean;

  href?: string;

  displayOnlyInFooter?: boolean;
  defaultOpen?: boolean;
};
type PageItem = (MdxFile | FolderWithoutChildren) & {
  title: string;
  type: string;
  href?: string;
  newWindow?: boolean;
  children?: PageItem[];
  firstChildRoute?: string;
  display?: Display;
  withIndexPage?: boolean;
  isUnderCurrentDocsTree?: boolean;
};
type MenuItem = (MdxFile | FolderWithoutChildren) &
  IMenuItem & {
    children?: PageItem[];
  };
type DocsItem = (MdxFile | FolderWithoutChildren) & {
  title: string;
  type: string;
  children: DocsItem[];
  firstChildRoute?: string;
  withIndexPage?: boolean;
  isUnderCurrentDocsTree?: boolean;
};

type NormalizedResult = {
  activeType?: string;
  activeIndex: number;
  activeThemeContext: PageTheme;
  activePath: Item[];
  directories: Item[];
  flatDirectories: Item[];
  docsDirectories: DocsItem[];
  flatDocsDirectories: DocsItem[];
  topLevelNavbarItems: (PageItem | MenuItem)[];
};

const DEFAULT_PAGE_THEME = {
  breadcrumb: true,
  collapsed: false,
  footer: true,
  layout: "default" as const,
  navbar: true,
  pagination: true,
  sidebar: true,
  timestamp: true,
  toc: true,
  typesetting: "default" as const,
};
function extendMeta(_meta: any = {}, fallback: any, metadata: any = {}) {
  const theme = {
    ...fallback.theme,
    ..._meta.theme,
    ...metadata.theme,
  };
  return {
    ...fallback,
    ..._meta,
    display: metadata.display || _meta.display || fallback.display,
    theme,
  };
}
function findFirstRoute(items: Item[]): string | undefined {
  for (const item of items) {
    if (item.route) return item.route;
    if (item.children) {
      const route = findFirstRoute(item.children);
      if (route) return route;
    }
  }
}

function normalizePages({
  list,
  route,
  docsRoot = "",
  underCurrentDocsRoot = false,
  pageThemeContext = DEFAULT_PAGE_THEME,
}: {
  list: PageMapItem[];
  route: string;
  docsRoot?: string;
  underCurrentDocsRoot?: boolean;
  pageThemeContext?: PageTheme;
}): NormalizedResult {
  let meta: Record<string, any> = {};
  let metaKeys: string[] = [];
  const items: Array<any> = [];
  list.sort((a, b) => {
    if ("data" in a) return -1;
    if ("data" in b) return 1;
    return a.name.localeCompare(b.name);
  });
  for (const [index, item] of list.entries()) {
    if ("data" in item) {
      meta = item.data;
      metaKeys = Object.keys(meta).filter((key) => key !== "*");
      for (const key of metaKeys) {
        if (typeof meta[key] !== "string") continue;
        meta[key] = { title: meta[key] };
      }
      continue;
    }

    const prevItem = list[index - 1];
    if (prevItem && (prevItem as MdxFile).name === item.name) {
      items[items.length - 1] = {
        ...prevItem,
        withIndexPage: true,
        // @ts-expect-error fixme
        frontMatter: item.frontMatter,
      };
      continue;
    }
    items.push(item);
  }
  items.sort((a, b) => {
    const indexA = metaKeys.indexOf(a.name);
    const indexB = metaKeys.indexOf(b.name);
    if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
  for (const [index, metaKey] of metaKeys.entries()) {
    const metaItem = meta[metaKey];
    const item = items.find((item2) => item2.name === metaKey);
    if (metaItem.type === "menu") {
      if (item) {
        item.items = metaItem.items;
        if (typeof window === "undefined") {
          const { children } = items.find((i) => i.name === metaKey);
          for (const [key, value] of Object.entries(item.items)) {
            if (
              !(value as any).href &&
              children.every((i: any) => i.name !== key)
            ) {
              throw new Error(
                `Validation of "_meta" file has failed.
The field key "${metaKey}.items.${key}" in \`_meta\` file refers to a page that cannot be found, remove this key from "_meta" file.`,
              );
            }
          }
        }
      }
    }
    if (item) continue;
    if (typeof window === "undefined") {
      const isValid =
        metaItem.type === "separator" ||
        metaItem.type === "menu" ||
        metaItem.href;
      if (!isValid) {
        throw new Error(
          `Validation of "_meta" file has failed.
The field key "${metaKey}" in \`_meta\` file refers to a page that cannot be found, remove this key from "_meta" file.`,
        );
      }
    }
    const currentItem = items[index];
    if (currentItem && currentItem.name === metaKey) continue;
    items.splice(
      index,
      // index at which to start changing the array
      0,
      // remove zero items
      { name: metaKey, ...meta[metaKey] },
    );
  }
  const directories = [];
  const flatDirectories = [];
  const docsDirectories = [];
  const flatDocsDirectories = [];
  const topLevelNavbarItems = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title: _title, href: _href, ...fallbackMeta } = meta["*"] || {};
  let activeType = fallbackMeta.type;
  let activeIndex = 0;
  let activeThemeContext = {
    ...pageThemeContext,
    ...fallbackMeta.theme,
  };
  let activePath: Item[] = [];

  for (const currentItem of items) {
    const extendedMeta = extendMeta(
      meta[currentItem.name],
      fallbackMeta,
      currentItem.frontMatter,
    );
    const { display, type = "doc" } = extendedMeta;
    const extendedPageThemeContext = {
      ...pageThemeContext,
      ...extendedMeta.theme,
    };
    const isCurrentDocsTree = route.startsWith(docsRoot);
    const normalizedChildren =
      currentItem.children &&
      normalizePages({
        list: currentItem.children,
        route,
        docsRoot:
          type === "page" || type === "menu" ? currentItem.route : docsRoot,
        underCurrentDocsRoot: underCurrentDocsRoot || isCurrentDocsTree,
        pageThemeContext: extendedPageThemeContext,
      });

    const title =
      extendedMeta.title ||
      (type !== "separator" &&
        (currentItem.frontMatter?.sidebarTitle ||
          currentItem.frontMatter?.title ||
          currentItem.name));
    const getItem = () => ({
      ...currentItem,
      type,
      ...extendedMeta,
      ...(title && { title }),
      ...(display && { display }),
      ...(normalizedChildren && { children: [] }),
    });
    const item = getItem();
    const docsItem = getItem();
    const pageItem = getItem();
    docsItem.isUnderCurrentDocsTree = isCurrentDocsTree;
    if (type === "separator") {
      item.isUnderCurrentDocsTree = isCurrentDocsTree;
    }
    if (currentItem.route === route) {
      activePath = [item];
      activeType = type;
      activeThemeContext = {
        ...activeThemeContext,
        ...extendedPageThemeContext,
      };
      switch (type) {
        case "page":
        case "menu":
          activeIndex = topLevelNavbarItems.length;
          break;
        case "doc":
          activeIndex = flatDocsDirectories.length;
      }
    }
    if (ERROR_ROUTES.has(currentItem.route)) {
      continue;
    }
    const isHidden = display === "hidden";
    if (normalizedChildren) {
      if (
        normalizedChildren.activeIndex !== void 0 &&
        normalizedChildren.activeType !== void 0
      ) {
        activeThemeContext = normalizedChildren.activeThemeContext;
        activeType = normalizedChildren.activeType;
        if (isHidden) {
          continue;
        }
        activePath = [
          item,
          // Do not include folder which shows only his children
          ...normalizedChildren.activePath.filter(
            (item2: any) => item2.display !== "children",
          ),
        ];
        switch (activeType) {
          case "page":
          case "menu":
            activeIndex =
              topLevelNavbarItems.length + normalizedChildren.activeIndex;
            break;
          case "doc":
            activeIndex =
              flatDocsDirectories.length + normalizedChildren.activeIndex;
            break;
        }
        if (currentItem.withIndexPage && type === "doc") {
          activeIndex++;
        }
      }
      switch (type) {
        case "page":
        case "menu":
          pageItem.children.push(...normalizedChildren.directories);
          docsDirectories.push(...normalizedChildren.docsDirectories);
          if (normalizedChildren.flatDirectories.length) {
            const route2 = findFirstRoute(normalizedChildren.flatDirectories);
            if (route2) pageItem.firstChildRoute = route2;
            topLevelNavbarItems.push(pageItem);
          } else if (pageItem.withIndexPage) {
            topLevelNavbarItems.push(pageItem);
          }
          break;
        case "doc":
          docsItem.children.push(...normalizedChildren.docsDirectories);
          if (item.withIndexPage && display !== "children") {
            flatDocsDirectories.push(docsItem);
          }
      }
      flatDirectories.push(...normalizedChildren.flatDirectories);
      flatDocsDirectories.push(...normalizedChildren.flatDocsDirectories);
      item.children.push(...normalizedChildren.directories);
    } else {
      if (isHidden) {
        continue;
      }
      flatDirectories.push(item);
      switch (type) {
        case "page":
        case "menu":
          topLevelNavbarItems.push(pageItem);
          break;
        case "doc": {
          const withHrefProp = "href" in item;
          if (!withHrefProp) {
            flatDocsDirectories.push(docsItem);
          }
        }
      }
    }
    if (isHidden) {
      continue;
    }
    if (type === "doc" && display === "children") {
      if (docsItem.children) {
        directories.push(...docsItem.children);
        docsDirectories.push(...docsItem.children);
      }
    } else {
      directories.push(item);
    }
    switch (type) {
      case "page":
      case "menu":
        docsDirectories.push(pageItem);
        break;
      case "doc":
        if (display !== "children") {
          docsDirectories.push(docsItem);
        }
        break;
      case "separator":
        docsDirectories.push(item);
    }
  }
  const result = {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    directories,
    flatDirectories,
    docsDirectories,
    flatDocsDirectories,
    topLevelNavbarItems,
  };
  return result;
}
export { normalizePages };
