// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT
import {clsx} from 'clsx'

import NextLink from 'next/link'
import {useFSRoute} from 'nextra/hooks'
import {MenuIcon} from 'nextra/icons'
import type {MenuItem, PageItem} from 'nextra/normalize-pages'
import type {ReactElement} from 'react'
import {useThemeConfig} from '../contexts'
import {renderComponent} from '../utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'
import {AccessibilityLanguages} from '..'
import Image from 'next/image'

export type NavBarProps = {
  items: Array<PageItem | MenuItem>
  toggleSidebar?: () => void
}

export const NavigationItem = (item: PageItem | MenuItem): ReactElement => {
  const activeRoute = useFSRoute()
  const isActive = item.route === activeRoute

  console.log('NavigationItem render - item:', item)

  // Handle menu type items with items property
  if ((item as MenuItem).items && Object.keys((item as MenuItem).items).length > 0) {
    const menuItems = (item as MenuItem).items as Record<
      string,
      {title: string; href?: string; newWindow?: boolean; icon?: string}
    >
    return (
      <NavigationMenuItem key={item.route}>
        <NavigationMenuTrigger className="break-words">{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="flex flex-col py-3 px-4 w-[300px] bg-kern-layout-background-default">
            {Object.entries(menuItems).map(([key, menuItem], index, array) => (
              <li key={key} className={index < array.length - 1 ? 'border-b border-border/50 pb-2 mb-2' : ''}>
                <NavigationMenuLink asChild className="">
                  <NextLink
                    href={menuItem.href || `/${key}`}
                    target={menuItem.newWindow ? '_blank' : undefined}
                    rel={menuItem.newWindow ? 'noopener noreferrer' : undefined}
                    className="kern-link !mt-0 !p-0 !text-sm !font-medium !no-underline hover:!text-accent !text-[var(--kern-color-layout-text-default)]"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {menuItem.icon && (
                        <div className="bg-accent/10 rounded-full flex items-center justify-center size-8">
                          <Image width={16} height={16} src={menuItem.icon} alt="" className="w-4 h-4" />
                        </div>
                      )}
                      <div>{menuItem.title}</div>
                    </div>
                  </NextLink>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  const linkHref = (item as PageItem).href || item.route
  return (
    <NavigationMenuItem key={item.route || (item as PageItem).href}>
      <NavigationMenuLink asChild>
        <NextLink
          className={clsx('whitespace-nowrap', 'hover:text-kern-action-default p-sm rounded-lg font-medium text-sm', {
            'font-bold text-kern-action-default': isActive,
          })}
          href={linkHref}
          target={(item as PageItem).newWindow ? '_blank' : undefined}
          rel={(item as PageItem).newWindow ? 'noopener noreferrer' : undefined}
        >
          {item.title}
        </NextLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

export function Navbar({items, toggleSidebar}: NavBarProps): ReactElement {
  const themeConfig = useThemeConfig()

  return (
    <header className="sticky shadow-md top-0 z-20 bg-kern-layout-background-default dark:border-b border-border w-full print:hidden">
      <nav className="container py-4 flex-row flex-wrap flex justify-between items-center gap-4">
        <div className="flex flex-1">
          {themeConfig.logoLink ? (
            <NextLink
              href={typeof themeConfig.logoLink === 'string' ? themeConfig.logoLink : '/'}
              className="flex items-center hover:opacity-75 ltr:mr-auto rtl:ml-auto max-sm:flex-wrap gap-x-3"
            >
              {renderComponent(themeConfig.logo)}
              {Boolean(themeConfig.logoText) && (
                <span className="md:ml-6 block text-sm whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold">
                  {themeConfig.logoText}
                </span>
              )}
            </NextLink>
          ) : (
            <div className="flex items-center ltr:mr-auto rtl:ml-auto">{renderComponent(themeConfig.logo)}</div>
          )}
        </div>
        {themeConfig.headerCenterElement ? (
          <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            {renderComponent(themeConfig.headerCenterElement)}
          </div>
        ) : null}
        <div className="flex flex-row flex-wrap items-center justify-end gap-4">
          <div className="hidden md:block">
            {!themeConfig.hidePrimaryMenu && (
              <NavigationMenu>
                <NavigationMenuList>
                  {items.map(item => (
                    <NavigationItem key={item.route} {...item} />
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          <div className="md:block hidden">
            {!themeConfig.disableSearch &&
              renderComponent(themeConfig.search.component, {
                className: 'max-md:hidden',
              })}
          </div>

          <div className="md:block hidden">
            {themeConfig.docsRepositoryBase && (
              <a href={themeConfig.docsRepositoryBase} className="md:inline-block" id="nav-to-opencode">
                <div className="flex items-center hover:opacity-75" id="nav-to-opencode">
                  <div className="w-8 h-content">
                    <svg
                      id="Ebene_1"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      className="hidden dark:block"
                      viewBox="0 0 117.7 89.3"
                    >
                      <path
                        fill="#ffffff"
                        d="M47.5,35.4h-23.1l-7,13.5c-1.6,3.2-4.8,5-8.2,5h84l7-13.5c1.7-3.3,5.1-5.1,8.5-4.9-.1,0-.2,0-.3,0h-60.9Z"
                      />
                      <path
                        fill="#ffffff"
                        d="M68,24.9l5.5,10.5h20.8l-9.9-19C79,6.3,68.7,0,57.3,0h-16.7c-11.4,0-21.8,6.3-27,16.4L1,40.4c-2.3,4.5-.6,10.1,3.9,12.4,1.4.7,2.8,1,4.2,1,3.3,0,6.5-1.8,8.2-5l12.5-24c2.1-4,6.2-6.5,10.7-6.5h16.7c4.5,0,8.6,2.5,10.7,6.5h0Z"
                      />
                      <path
                        fill="#ffffff"
                        d="M112.7,36.5c-4.5-2.3-10.1-.6-12.4,3.9l-12.5,24c-2.1,4-6.2,6.5-10.7,6.5h-16.7c-4.5,0-8.6-2.5-10.7-6.5l-5.5-10.5h-20.8l9.9,19c5.3,10.1,15.6,16.4,27,16.4h16.7c11.4,0,21.8-6.3,27-16.4l12.5-24c2.4-4.5.6-10.1-3.9-12.4h0Z"
                      />
                    </svg>
                    <svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 117.7 89.3">
                      <path
                        fill="#6382ff"
                        d="M47.5,35.4h-23.1l-7,13.5c-1.6,3.2-4.8,5-8.2,5h84l7-13.5c1.7-3.3,5.1-5.1,8.5-4.9-.1,0-.2,0-.3,0h-60.9Z"
                      />
                      <path
                        fill="#1544ff"
                        d="M68,24.9l5.5,10.5h20.8l-9.9-19C79,6.3,68.7,0,57.3,0h-16.7c-11.4,0-21.8,6.3-27,16.4L1,40.4c-2.3,4.5-.6,10.1,3.9,12.4,1.4.7,2.8,1,4.2,1,3.3,0,6.5-1.8,8.2-5l12.5-24c2.1-4,6.2-6.5,10.7-6.5h16.7c4.5,0,8.6,2.5,10.7,6.5h0Z"
                      />
                      <path
                        fill="#1544ff"
                        d="M112.7,36.5c-4.5-2.3-10.1-.6-12.4,3.9l-12.5,24c-2.1,4-6.2,6.5-10.7,6.5h-16.7c-4.5,0-8.6-2.5-10.7-6.5l-5.5-10.5h-20.8l9.9,19c5.3,10.1,15.6,16.4,27,16.4h16.7c11.4,0,21.8-6.3,27-16.4l12.5-24c2.4-4.5.6-10.1-3.9-12.4h0Z"
                      />
                    </svg>
                  </div>
                  <span className="hidden" id="nav-to-opencode">
                    zu openCode
                  </span>
                </div>
              </a>
            )}
          </div>
          {!themeConfig.hidePrimaryMenu && (
            <button className="block p-sm xl:hidden" aria-label="Menu" onClick={toggleSidebar}>
              <MenuIcon />
            </button>
          )}
          {themeConfig.accessibilityLanguages && (
            <AccessibilityLanguages
              leichteSpracheHref={themeConfig.accessibilityLanguages?.leichteSpracheHref}
              gebaerdenspracheHref={themeConfig.accessibilityLanguages?.gebaerdenSprachenHref}
            />
          )}
        </div>
      </nav>
      {themeConfig.headerLowerBadgeLogoPath && (
        <div className="container bg-[var(--core-color-neutral-50)] py-4">
          <Image
            src={themeConfig.headerLowerBadgeLogoPath}
            alt="Product Logo"
            width={50}
            height={20}
            className="h-8 w-auto"
          />
        </div>
      )}
    </header>
  )
}
