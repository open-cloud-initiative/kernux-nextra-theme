// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {isValidElement} from 'react'
import {cleanHtml} from './common'
import {Flexsearch, Footer} from './components'
import {useConfig} from './contexts'
import {KernuxThemeConfig} from './schemas'
import {Logo} from './components/logo'

export const DEFAULT_LOCALE = 'de-DE'

export const DEFAULT_THEME: KernuxThemeConfig = {
  umbrellaHeader: false,
  umbrellaFooter: false,
  headerCenterElement: null,
  disableSearch: false,
  hidePrimaryMenu: false,
  logoText: '',
  footer: {
    component: Footer,
    links: [],
    description: null,
    copyright: (
      <p className="text-sm opacity-75">
        &copy; {new Date().getFullYear()} Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
        Alle Rechte vorbehalten.
      </p>
    ),
  },
  head: function useHead() {
    const {frontMatter, title: pageTitle} = useConfig()

    const title = `${pageTitle}`
    const {description, canonical, image, metaDescription, metaTitle} = frontMatter
    return (
      <>
        <title>{metaTitle ? metaTitle : cleanHtml(title)}</title>
        <meta property="og:title" content={metaTitle ? metaTitle : cleanHtml(title)} />
        {/* We can't use React.Fragment https://nextjs.org/docs/pages/api-reference/components/head#use-minimal-nesting https://github.com/vercel/next.js/pull/67667 */}
        <meta name="description" content={metaDescription ? metaDescription : cleanHtml(description)} />
        ,
        <meta property="og:description" content={metaDescription ? metaDescription : cleanHtml(description)} />,
        {canonical && <link rel="canonical" href={canonical} />}
        {image && <meta name="og:image" content={image} />}
      </>
    )
  },
  i18n: [],
  logo: <Logo width={100} height={50} />,
  logoLink: true,
  notFound: {
    content: 'Submit an issue about broken link →',
    labels: 'bug',
  },
  search: {
    component: Flexsearch,
    emptyResult: (
      <span className="block select-none p-8 text-center text-sm text-gray-400">Kein Ergebnis gefunden</span>
    ),
    error: 'Der Suchindex konnte nicht geladen werden.',
    loading: 'Lädt...',
    placeholder: 'Inhalte durchsuchen...',
  },
  sidebar: {
    disable: true,
    defaultMenuCollapseLevel: 2,
    toggleButton: true,
  },
}

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject = value && typeof value === 'object' && !Array.isArray(value) && !isValidElement(value)
    if (isObject) {
      return key
    }
  })
  .filter(Boolean)
