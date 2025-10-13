// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import type { Heading } from "nextra";

import { A, H4 } from "@open-cloud-initiative/kernux-react";
import clsx from "clsx";
import { useState } from "react";
import { useActiveHeadline, useThemeConfig } from "..";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";

type TOCProps = {
  toc: Heading[];
  filePath: string;
};

const filterArchrlStyles = (toc: Heading[]): Heading[] => {
  //filter heading if it includes notInToc in the value
  toc = toc.filter(
    (heading) =>
      typeof heading.value === "string" &&
      !heading.value.includes("[notInToc]"),
  );

  // if we have a h5,h4,h6 combination at the start, remove those
  if (
    toc.length >= 3 &&
    toc[0].depth === 5 &&
    toc[1].depth === 4 &&
    toc[2].depth === 6
  ) {
    return toc.slice(3);
  }
  return toc;
};

export function TOC({ toc }: TOCProps) {
  const activeHeadline = useActiveHeadline();
  toc = filterArchrlStyles(toc || []);
  const [isOpen, setIsOpen] = useState(true);

  const config = useThemeConfig();
  const title = config.toc?.title ?? "Inhaltsverzeichnis";

  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <nav className="w-full sm:w-[260px] h-full" id="toc">
      <div
        className={cn(
          "md:sticky",
          Boolean(config.headerLowerBadgeLogoPath)
            ? "top-[155px]"
            : "top-[115px]",
        )}
        id="toc-inner"
      >
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="md:!block"
        >
          <CollapsibleTrigger className="w-full">
            <div id="toc-title" className="flex items-center gap-2">
              {config.toc?.iconEnabled === true && (
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
              )}
              <H4 className="">{title}</H4>
              <ChevronDown
                className={clsx(
                  "ml-auto transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul
              style={{
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
              }}
              className="flex flex-col gap-xs mt-4"
            >
              {toc.map((heading) => (
                <li key={heading.id}>
                  <A
                    key={heading.id}
                    className={clsx({
                      block: true,
                      "!pl-2": heading.depth === 3,
                      "!pl-4": heading.depth === 4,
                      "!pl-6": heading.depth === 5,
                      "!pl-8": heading.depth === 6,
                      "!decoration-[3px]": activeHeadline === heading.id,
                    })}
                    data-active={activeHeadline === heading.id}
                    href={`#${heading.id}`}
                  >
                    {heading.value}
                  </A>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </nav>
  );
}
