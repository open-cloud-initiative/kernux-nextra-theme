// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

export function gitUrlParse(url: string) {
  const {href, origin, pathname} = new URL(url)

  const [, owner, name] = pathname.split('/')

  return {
    href,
    origin,
    owner,
    name,
  }
}
