// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import type {ReactNode} from 'react'

export type SearchResult = {
  children: ReactNode
  id: string
  prefix?: ReactNode
  route: string
  content: string
  search: string
}
