// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {Kopfzeile} from '@open-cloud-initiative/kernux-react'
import {ReactElement} from 'react'
import {useThemeConfig} from '../contexts'

export function UmbrellaHeader(): ReactElement | null {
  const {umbrellaHeader} = useThemeConfig()
  if (!umbrellaHeader) {
    return null
  }

  return <Kopfzeile />
}
