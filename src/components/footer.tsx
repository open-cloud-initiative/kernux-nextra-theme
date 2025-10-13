// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { useMemo, type ReactElement } from "react";
import { useConfig, useThemeConfig } from "../contexts";
import { renderComponent } from "../utils";
import { A, H4 } from "@open-cloud-initiative/kernux-react";
import clsx from "clsx";

type Link = { name: string; href: string; column: string };

function groupLinksByColumn(links: Link[]): Record<string, Link[]> {
  const groups: Record<string, Link[]> = {};

  for (const link of links) {
    if (!groups[link.column]) {
      groups[link.column] = [];
    }
    groups[link.column].push(link);
  }

  return groups;
}

export function Footer(): ReactElement {
  const themeConfig = useThemeConfig();
  const links = themeConfig.footer.links;
  const linkChunks = groupLinksByColumn(links);
  const config = useConfig();
  const { directories } = config.normalizePagesResult;
  const displayOnlyInFooter = useMemo(() => {
    return directories.filter((dir) => dir.displayOnlyInFooter);
  }, [directories]);

  return (
    <footer className="bg-footer text-footer-foreground border-solid border-border border-t print:bg-transparent">
      <div className="container text-sm pb-8 pt-16 sm:pt-24 lg:pt-32">
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="space-y-8 mr-8">
            {renderComponent(themeConfig.footer.logo ?? themeConfig.logo)}
            {renderComponent(themeConfig.footer.description)}
          </div>
          {Object.entries(linkChunks).length > 0 && (
            <nav
              className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4  lg:mt-0"
              aria-label="Rechtliche und weiterführende Informationen"
            >
              {Object.entries(linkChunks).map(([column, links], i) => (
                <div key={i} className="space-y-4">
                  <H4 className="text-sm font-semibold leading-6">{column}</H4>
                  <ul role="list" className="space-y-4">
                    {links.map((item) => (
                      <li key={`${item.name}-${i}`}>
                        <A className="!text-footer-foreground" href={item.href}>
                          {item.name}
                        </A>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>
        {displayOnlyInFooter.length > 0 && (
          <nav className="mt-xl">
            <ul className="flex flex-row flex-wrap gap-md">
              {displayOnlyInFooter.map((dir) => (
                <li key={dir.route}>
                  <A className="!text-footer-foreground" href={dir.route}>
                    {dir.title}
                  </A>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {themeConfig.footer.copyright && (
          <div className={clsx("mt-xl pt-8")}>
            {renderComponent(themeConfig.footer.copyright)}
          </div>
        )}
      </div>
    </footer>
  );
}
