// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {useRouter} from 'nextra/hooks'
import {createContext, FunctionComponent, PropsWithChildren, useState, useEffect, useContext} from 'react'

export const ActiveHeadlineContext = createContext<string | null>(null)

export const HeadingTracker: FunctionComponent<PropsWithChildren> = ({children}) => {
  const router = useRouter()
  const [activeHeadline, setActiveHeadline] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: number | null = null

    const onScroll = () => {
      if (timeoutId !== null) return
      timeoutId = window.setTimeout(() => {
        const centerY = window.innerHeight / 2
        let closestId: string | null = null
        let minDistance = Infinity
        const headings = Array.from(
          document.querySelectorAll<HTMLElement>('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'),
        )

        for (const el of headings) {
          const rect = el.getBoundingClientRect()
          const elCenter = rect.top + rect.height / 2
          const distance = Math.abs(centerY - elCenter)

          if (distance < minDistance && rect.bottom > 0 && rect.top < window.innerHeight) {
            minDistance = distance
            closestId = el.id
          }
        }

        if (closestId) {
          // maybe send this to plausible
          // history.replaceState(null, "", `#${closestId}`);
          setActiveHeadline(closestId)
        }

        timeoutId = null
      }, 100) // debounce duration
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [router.basePath])

  return <ActiveHeadlineContext.Provider value={activeHeadline}>{children}</ActiveHeadlineContext.Provider>
}

export const useActiveHeadline = () => {
  return useContext(ActiveHeadlineContext)
}
