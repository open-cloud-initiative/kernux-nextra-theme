// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {useRouter} from 'next/router'
import {useMounted} from 'nextra/hooks'
import type {ReactElement} from 'react'
import {useThemeConfig} from '../contexts'
import {getGitIssueUrl, renderComponent} from '../utils'
import {A} from '@open-cloud-initiative/kernux-react'

export function NotFoundPage(): ReactElement | null {
  const themeConfig = useThemeConfig()

  const mounted = useMounted()
  const {asPath} = useRouter()
  const {content, labels} = themeConfig.notFound
  if (!content) {
    return null
  }

  return (
    <p className="text-center">
      <A
        href={getGitIssueUrl({
          repository: themeConfig.docsRepositoryBase,
          title: `Found broken \`${mounted ? asPath : ''}\` link. Please fix!`,
          labels,
        })}
        newWindow
        className="text-primary-600 underline decoration-from-font [text-underline-position:from-font]"
      >
        {renderComponent(content)}
      </A>
    </p>
  )
}
