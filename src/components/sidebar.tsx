// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Item } from "../contexts/normalizePages";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useConfig, useThemeConfig } from "../contexts";
import { useIsMobile } from "../hooks/use-mobile";
import { H4, Icon } from "@open-cloud-initiative/kernux-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useRouter } from "next/router";
import { PageItem, MenuItem } from "nextra/normalize-pages";
import NextLink from "next/link";
import { useFSRoute } from "nextra/hooks";
import Image from "next/image";

interface SideBarProps {
  docsDirectories: Item[];
}

const CollapsibleMobileNavItem = ({ item }: { item: PageItem | MenuItem }) => {
  const activeRoute = useFSRoute();
  const isActive = item.route === activeRoute;
  const [isOpen, setIsOpen] = useState(false);

  if (
    (item as MenuItem).items &&
    Object.keys((item as MenuItem).items).length > 0
  ) {
    const menuItems = (item as MenuItem).items as Record<
      string,
      {
        title: string;
        href?: string;
        newWindow?: boolean;
        icon?: string;
      }
    >;

    return (
      <Collapsible
        key={item.route || (item as PageItem).href}
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-primary/5 rounded-md"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between w-full p-3 text-left bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span className="font-medium text-sm">{item.title}</span>
            <ChevronDown
              className={clsx(
                "size-4 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="-mt-1 ml-2 space-y-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-1">
            {Object.entries(menuItems).map(([key, menuItem]) => (
              <NextLink
                key={key}
                href={menuItem.href || `/${key}`}
                target={menuItem.newWindow ? "_blank" : undefined}
                rel={menuItem.newWindow ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 p-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {menuItem.icon && (
                  <div className="bg-accent/10 rounded-full flex items-center justify-center size-6">
                    <Image
                      width={12}
                      height={12}
                      src={menuItem.icon}
                      alt={menuItem.title + " Icon" || ""}
                      className="w-3 h-3"
                    />
                  </div>
                )}
                <span>{menuItem.title}</span>
              </NextLink>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const linkHref = (item as PageItem).href || item.route;
  return (
    <NextLink
      key={item.route || (item as PageItem).href}
      href={linkHref}
      target={(item as PageItem).newWindow ? "_blank" : undefined}
      rel={(item as PageItem).newWindow ? "noopener noreferrer" : undefined}
      className={clsx(
        "bg-primary/5 rounded-md block p-3 text-sm transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
        {
          "bg-gray-300 dark:bg-gray-600 font-medium": isActive,
        },
      )}
    >
      {item.title}
    </NextLink>
  );
};

// Component for collapsible mobile navigation items
const CollapsibleMobileNavigation = ({
  items,
}: {
  items: (PageItem | MenuItem)[];
}) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <CollapsibleMobileNavItem
          key={item.route + index.toString}
          item={item}
        />
      ))}
    </div>
  );
};

interface SideBarProps {
  docsDirectories: Item[];
}

const SidebarItem = (item: Item) => {
  const activePath = useConfig().normalizePagesResult.activePath;
  // Check if this item is in the active path (folder containing the active page)
  const isInActivePath = useMemo(() => {
    return activePath.some((path) => path.route === item.route);
  }, [item.route, activePath]);

  const [isOpen, setIsOpen] = useState(item.defaultOpen || isInActivePath);

  if (item.type !== "doc") {
    return null;
  }
  if (item.children?.length === 0 || item.children === undefined) {
    // just render a regular sidebar menu item
    return (
      <SidebarMenuItem key={item.route}>
        <SidebarMenuButton
          className={clsx({
            "bg-kern-action-state-indicator-tint-active": isInActivePath,
          })}
          asChild
        >
          <Link title={item.title} href={item.route}>
            <span data-active={isInActivePath}>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  // has children - render a sidebar group
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/c">
      <CollapsibleTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton
            className={clsx({
              "justify-between whitespace-nowrap overflow-hidden text-ellipsis": true,
            })}
          >
            {item.title}
            <ChevronDown
              className={clsx({
                "size-4": true,
                "transition-transform": true,
                "rotate-180": isOpen,
              })}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarGroup className="pr-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {item.children
                .filter((el) => !el.displayOnlyInFooter)
                .map((child) => (
                  <SidebarItem key={child.route} {...child} />
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};

export function Sidebar(props: SideBarProps) {
  const isMobile = useIsMobile();
  const sidebar = useSidebar();
  const themeConfig = useThemeConfig();
  const router = useRouter();
  // close sidebar on route change
  useEffect(() => {
    if (isMobile) {
      sidebar.setOpenMobile(false);
    }
  }, [router.asPath]);

  const config = useConfig();

  const { activeThemeContext: themeContext } = config.normalizePagesResult;

  const { topLevelNavbarItems } = config.normalizePagesResult;

  console.log(topLevelNavbarItems);
  return (
    <BaseSidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      id="sidebar"
      className={themeContext.layout === "raw" ? "!border-0 !ml-0" : ""}
    >
      {isMobile && (
        <SidebarHeader className="flex z-10 bg-sidebar items-center flex-row justify-end">
          {!themeConfig.hidePrimaryMenu && (
            <button aria-label="Menu" onClick={() => sidebar.toggleSidebar()}>
              <Icon name="close" />
            </button>
          )}
        </SidebarHeader>
      )}

      <SidebarContent className="lg:p-6 p-2 lg:m-0 lg:pl-xl">
        {themeConfig.primaryMenu && (
          <div id="primary-menu-title" className="flex items-center gap-x-2">
            {themeConfig.primaryMenu?.iconEnabled && (
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                    clipRule="evenodd"
                  />
                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
              </div>
            )}
            <H4 className="">{themeConfig.primaryMenu?.title}</H4>
          </div>
        )}
        <div className="max-sm:block hidden">
          <CollapsibleMobileNavigation items={topLevelNavbarItems} />
        </div>
        <SidebarMenu className="p-1">
          {props.docsDirectories
            .filter((el) => !el.displayOnlyInFooter)
            .map((item) => (
              <SidebarItem key={item.route} {...item} />
            ))}
        </SidebarMenu>
      </SidebarContent>
    </BaseSidebar>
  );
}
