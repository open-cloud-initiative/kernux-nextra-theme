// Copyright 2025 rafaeishikho.
// SPDX-License-Identifier: Apache-2.0

import Markdown from 'react-markdown'
import {useThemeConfig} from '../contexts'
import {useMemo} from 'react'

export function Glossary({data: glossary}: {data: Record<string, string>}) {
  //sort the keys of the data object
  const sortedKeys = useMemo(() => Object.keys(glossary).sort((a, b) => a.localeCompare(b)), [glossary])

  const keysLettersMap: Record<string, string[]> = useMemo(() => {
    return sortedKeys.reduce(
      (acc, key) => {
        const firstLetter = key.charAt(0).toLowerCase()
        if (!acc[firstLetter]) {
          acc[firstLetter] = []
        }
        acc[firstLetter].push(key)
        return acc
      },
      {} as Record<string, string[]>,
    )
  }, [sortedKeys])

  const themeConfig = useThemeConfig()
  return (
    <div className="flex flex-col items-center">
      <div>
        {'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
          <div
            key={letter}
            className={`${
              keysLettersMap[letter]
                ? 'hover:text-kern-feedback-info-background hover:bg-kern-feedback-info'
                : 'cursor-not-allowed opacity-50'
            } w-10 text-kern-feedback-info h-10 bg-kern-feedback-info-background text-center text-lg lg:text-xl lg:w-12 lg:h-12 font-bold inline-flex items-center justify-center m-2  `}
          >
            <a className="w-full h-full flex items-center justify-center p-2" href={`#${letter}`}>
              {letter.toUpperCase()}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-32">
        {Object.keys(keysLettersMap).map(letter => (
          <div className="flex flex-col mb-16" key={letter} id={letter}>
            <div className="w-16 h-16 bg-kern-feedback-info-background text-center !text-2xl lg:w-20 lg:h-20 font-bold  m-2 inline-flex items-center justify-center  mb-8">
              {letter.toUpperCase()}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ml-2">
              {keysLettersMap[letter].map(key => (
                <div key={key} className=" mb-2" id={key}>
                  <div>
                    <div className="font-bold text-lg mb-2">{key}</div>
                    <Markdown components={themeConfig.components}>{String(glossary[key])}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
