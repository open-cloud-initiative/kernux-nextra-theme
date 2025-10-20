// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import path from 'path'
import {config as dotenv} from 'dotenv'

dotenv()

export const diffPath = process.env.DIFF_PATH || path.resolve(process.cwd(), './public/diffs')

export const combinedDiffPath = process.env.COMBINED_DIFF_PATH || path.resolve(process.cwd(), './public/diff-combined')

export const config = {
  gitlab: {
    token: process.env.GITLAB_TOKEN,
    api: process.env.GITLAB_API,
    projectId: process.env.GITLAB_PROJECT_ID,
  },
  oryKratosUrl: process.env.ORY_KRATOS_URL,
}
