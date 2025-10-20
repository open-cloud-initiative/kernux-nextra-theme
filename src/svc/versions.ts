// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import fs from 'fs'

const diffPath = process.env.NEXT_PUBLIC_DIFF_PATH || 'diffs'

export async function getAvailableDiffsFromFS(dir: string): Promise<string[]> {
  const paths = await fs.promises.readdir(dir, {withFileTypes: true})
  return paths.map(p => p.name)
}

function getVersionsFromFileList(fileList: string[]): string[] {
  const versions = fileList.map(f => f.split('__')[0])
  return Array.from(new Set(versions))
}

export async function getDiffVersions() {
  const fileList = await getAvailableDiffsFromFS(diffPath)

  const versionsFromFiles = getVersionsFromFileList(fileList)
  const latest = process.env.NEXT_PUBLIC_DOCUMENT_VERSION_STRING
  const versions = versionsFromFiles.reverse().map((v, i) => ({
    id: i,
    name: v,
    latest: v === latest,
  }))
  return versions
}
