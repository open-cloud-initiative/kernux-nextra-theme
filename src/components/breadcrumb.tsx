// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import cn from 'clsx'

import {ArrowRightIcon} from 'nextra/icons'
import type {Item} from '../contexts/normalizePages'
import type {ReactElement} from 'react'
import {Fragment} from 'react'
import {A} from '@open-cloud-initiative/kernux-react'

export function Breadcrumb({
  activePath,
  className,
  linkClassName,
}: {
  activePath: Item[]
  className?: string
  linkClassName?: string
}): ReactElement {
  return (
    <nav aria-label="Seitenpfad" className="mt-1.5 flex flex-wrap items-center gap-1 overflow-hidden text-sm">
      {activePath.map((item, index, arr) => {
        const nextItem = arr[index + 1]
        let href: string
        if (nextItem) {
          if (item.withIndexPage) {
            href = item.route
          } else if (item.children.length > 0 && item.children[0].route === nextItem.route) {
            href = ''
          } else {
            href = item.children[0].route
          }
        } else {
          href = ''
        }

        const ComponentToUse = href ? A : 'span'

        return (
          <Fragment key={item.route + item.name}>
            {index > 0 && <ArrowRightIcon height="14" className="shrink-0 relative top-[2px] rtl:rotate-180" />}
            <ComponentToUse
              className={cn(
                'transition-colors opacity-70',
                nextItem
                  ? 'min-w-6 overflow-hidden text-ellipsis hover:opacity-100'
                  : ' contrast-more:text-current  contrast-more:dark:text-current',
                className,
                'pb-0 !text-sm pt-0',
                !href ? 'relative top-[2px]' : linkClassName,
              )}
              title={item.title}
              {...(href && ({href} as any))}
            >
              {item.title}
            </ComponentToUse>
          </Fragment>
        )
      })}
    </nav>
  )
}
