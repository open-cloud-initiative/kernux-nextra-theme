// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ParsedDiffHeadings } from "@/svc/diff";
import { classNames } from "@/utils/common";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import Link from "next/link";

export const DiffSidenav = ({ items }: { items: ParsedDiffHeadings[] }) => {
  return (
    <>
      {items.map((item) => {
        if ((item.children ?? []).length > 0) {
          return (
            <div key={item.title + item.type}>
              <Collapsible
                className={"group/collapsible-" + item.title + item.type}
              >
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger
                      className={classNames(
                        item.type === "deleted"
                          ? "text-dunkelrot-80 line-through"
                          : item.type === "inserted"
                            ? "text-dunkelgruen-80"
                            : "",
                        "mb-2",
                      )}
                    >
                      {item.type === "replaced"
                        ? (() => {
                            const [deletedText, insertedText] =
                              item.title.split(" → ");
                            return (
                              <span className="flex items-center">
                                <span className="text-dunkelrot-80 line-through">
                                  {deletedText}
                                </span>
                                <span className="mx-1 text-gray-500">→</span>
                                <span className="text-dunkelgruen-80">
                                  {insertedText}
                                </span>
                              </span>
                            );
                          })()
                        : item.title}
                      <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <DiffSidenav items={item.children ?? []} />
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            </div>
          );
        } else {
          return (
            <Link
              className={classNames(
                item.type === "deleted"
                  ? "text-dunkelrot-80 line-through"
                  : item.type === "inserted"
                    ? "text-dunkelgruen-80"
                    : "",
              )}
              key={item.title + item.type}
              href={"diff/#" + item.id}
            >
              <SidebarMenuItem>
                <SidebarMenuButton>{item.title}</SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          );
        }
      })}
    </>
  );
};
