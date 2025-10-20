// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {useThemeConfig} from '../contexts'

export function Banner() {
  const {banner: Banner} = useThemeConfig()
  if (!Banner) {
    return null
  }

  return <Banner />
}
