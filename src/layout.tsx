// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import clsx from "clsx";
import { NextraThemeLayoutProps } from "nextra";
import { MDXProvider } from "nextra/mdx";
import { ReactElement, ReactNode } from "react";
import {
  Banner,
  Feedback,
  Head,
  Navbar,
  Sidebar,
  UmbrellaFooter,
  UmbrellaHeader,
} from "./components";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "./components/ui/sidebar";
import {
  ConfigProvider,
  ThemeConfigProvider,
  useConfig,
  useThemeConfig,
} from "./contexts";
import { HeadingTracker } from "./contexts/active-headline-context";
import { getComponents } from "./mdx-components";
import { cn, renderComponent } from "./utils";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

function Header() {
  const config = useConfig();
  const sidebar = useSidebar();
  const { topLevelNavbarItems } = config.normalizePagesResult;

  return (
    <Navbar toggleSidebar={sidebar.toggleSidebar} items={topLevelNavbarItems} />
  );
}
function InnerLayout({ children }: { children: ReactNode }): ReactElement {
  const themeConfig = useThemeConfig();

  const config = useConfig();

  const dir = "ltr";

  const { activeThemeContext: themeContext } = config.normalizePagesResult;

  const components = getComponents({
    components: themeConfig.components,
  });

  const LayoutComponent = themeConfig.layoutComponent;

  if (themeContext.layout === "empty") {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="text-base" dir={dir}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('dir','${dir}')`,
        }}
      />
      <Head></Head>
      {LayoutComponent ? (
        <TooltipProvider delayDuration={0}>
          <LayoutComponent>
            <MDXProvider disableParentContext components={components}>
              {children}
            </MDXProvider>
          </LayoutComponent>
        </TooltipProvider>
      ) : (
        <SidebarProvider
          style={{
            // @ts-expect-error We are just using this to set CSS variables
            "--sidebar-width": themeContext.layout === "raw" ? "0rem" : "20rem",
            "--sidebar-width-mobile": "20rem",
            ...(themeContext.layout === "raw" && {
              "--center-container": "auto",
            }),
          }}
        >
          <div className="w-full">
            <UmbrellaHeader />
            <Banner />
            <Header />
            <div
              className={cn(
                "flex min-h-svh flex-row",
                themeContext.layout !== "raw" && "content-wrapper",
              )}
            >
              <Sidebar
                docsDirectories={config.normalizePagesResult.docsDirectories}
              />

              <SidebarInset>
                <HeadingTracker>
                  <MDXProvider disableParentContext components={components}>
                    {children}
                  </MDXProvider>
                </HeadingTracker>
                {themeConfig.feedback && (
                  <div
                    className={clsx({
                      "lg:pl-xl pb-xl": themeContext.layout !== "raw",
                      "lg:px-xl pb-xl": themeContext.layout === "raw",
                    })}
                  >
                    <Feedback {...themeConfig.feedback} />
                  </div>
                )}
              </SidebarInset>
            </div>

            <UmbrellaFooter />
            {themeContext.footer &&
              renderComponent(themeConfig.footer.component, {
                menu: config.hideSidebar,
              })}
          </div>
        </SidebarProvider>
      )}
    </div>
  );
}

export default function Layout({
  children,
  themeConfig,
  pageOpts,
}: NextraThemeLayoutProps): ReactElement {
  return (
    <ThemeConfigProvider value={themeConfig}>
      <ConfigProvider value={pageOpts}>
        <InnerLayout>
          {children as ReactNode}
          <Toaster />
        </InnerLayout>
      </ConfigProvider>
    </ThemeConfigProvider>
  );
}
