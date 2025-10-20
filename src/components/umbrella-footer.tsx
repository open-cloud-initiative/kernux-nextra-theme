// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {ReactElement} from 'react'
import {useThemeConfig} from '../contexts'
import {Logo} from './logo'

export function UmbrellaFooter(): ReactElement | null {
  const {umbrellaFooter} = useThemeConfig()
  if (!umbrellaFooter) {
    return null
  }
  return (
    <div className="border-t border-solid border-border">
      <div className="py-10 container">
        <div className="flex flex-row gap-6 items-end">
          <Logo width={150} height={75} />
          <span className="text-sm">
            Das Digitalwappen kennzeichnet digitale Angebote von Bund, Ländern und Kommunen als staatliche Leistungen
          </span>
        </div>
      </div>
    </div>
  )
}
