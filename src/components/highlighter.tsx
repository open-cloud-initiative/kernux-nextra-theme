// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import ShikiHighlighter from 'react-shiki'
import {CopyIcon} from 'lucide-react'
import {toast} from 'sonner'

interface HighlighterProps {
  language: string
  theme?: 'dark' | 'light'
  codeString: string
}

export function CustomHighlighter({language, theme, codeString}: HighlighterProps) {
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    navigator.clipboard
      .writeText(codeString)
      .then(() => {
        toast('In die Zwischenablage kopiert', {
          description: 'Der Code wurde erfolgreich kopiert.',
          duration: 2000,
        })
      })
      .catch(err => {
        console.error('Failed to copy code: ', err)
      })
  }

  const shikiTheme = theme === 'dark' ? 'github-dark' : 'github-light'

  return (
    <div className="relative">
      <div>
        <button
          aria-label="Copy code to clipboard"
          className="absolute hover:opacity-50 transition-all right-sm top-sm z-10 pt-6"
          onClick={handleCopy}
        >
          <CopyIcon className="h-4 w-4" />
        </button>
      </div>

      <ShikiHighlighter language={language} theme={shikiTheme}>
        {codeString}
      </ShikiHighlighter>
    </div>
  )
}
