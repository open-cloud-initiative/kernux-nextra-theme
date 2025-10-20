// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import {visit} from 'unist-util-visit'
import nextra from 'nextra'
import {NextConfig} from 'next'

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function markdownLinkSyntaxToHtmlLinkSyntax(string: string) {
  return string.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '$2')
}

const transformer = function (ast: any) {
  const abrreviationsPath = path.join(process.cwd(), '/abkuerzungen.yaml')
  const glossaryPath = path.join(process.cwd(), '/glossar.yaml')
  let acronyms: Record<string, string> = {}
  let glossary: Record<string, string> = {}

  try {
    const fileContents = fs.readFileSync(abrreviationsPath, 'utf8')
    acronyms = yaml.load(fileContents) as Record<string, string>
  } catch (error) {
    console.error('Error loading abkuerzungen.yaml file:', error)
  }
  try {
    const fileContents = fs.readFileSync(glossaryPath, 'utf8')
    glossary = yaml.load(fileContents) as Record<string, string>
  } catch (error) {
    console.error('Error loading abkuerzungen.yaml file:', error)
  }

  acronyms = {...acronyms, ...glossary}

  // write glossary.ts to the file system - will get imported later out if it exists so that we can display it dynamically on page.
  // file write
  const tsOutput = `export const glossary = ${JSON.stringify(acronyms, null, 2)};`
  console.log('Writing glossary.ts to the file system')
  fs.writeFileSync(path.join(process.cwd(), 'glossary.ts'), tsOutput)

  Object.keys(acronyms).forEach(function (key) {
    acronyms[key] = markdownLinkSyntaxToHtmlLinkSyntax(acronyms[key])
  })

  const acronymsRegExp = new RegExp('\\b('.concat(Object.keys(acronyms).map(escapeRegExp).join('|'), ')\\b'), 'g')

  const visitForAbbreviations = ['paragraph', 'strong', 'emphasis']

  for (const nodeType of visitForAbbreviations) {
    visit(ast, nodeType, function (node) {
      // Replace acronyms in text nodes
      node.children = node.children
        .map(function (child: any) {
          if (child.type === 'text') {
            // check if the text node contains an acronym
            // if so, we return multiple new abbrev and text nodes
            const newChildren = child.value.split(acronymsRegExp).map(function (part: any) {
              if (acronyms[part]) {
                return {
                  type: 'abbr',
                  data: {
                    hName: 'abbr',
                    hChildren: [
                      {
                        type: 'text',
                        value: part,
                      },
                    ],
                    hProperties: {
                      title: acronyms[part],
                    },
                  },
                }
              } else {
                return {
                  type: 'text',
                  value: part,
                }
              }
            })
            return newChildren
          }

          return [child]
        })
        .flat()
    })
  }

  return ast
}

export const remarkAbbrev = function () {
  return transformer
}

export const withMarkdownWebBook = (config: NextConfig): NextConfig => {
  const withNextra = nextra({
    mdxOptions: {
      remarkPlugins: [remarkAbbrev],
    },
  })

  buildIndexFiles()
  return withNextra(config as any) as any
}

const buildIndexFiles = () => {
  // build index.json files for each subdir. Just extract all front matter information
  // either pages or src/pages
  let dir: string
  if (!fs.existsSync('pages')) {
    dir = `${process.cwd()}/src/pages`
  } else {
    dir = `${process.cwd()}/pages`
  }

  // walk the directory tree
  const files = fs.readdirSync(dir, {withFileTypes: true, recursive: true})
  // for each directory, we create a index.json file in the public directory.
  const dirToFiles: {[dir: string]: {[filepath: string]: any}} = {}
  for (const file of files) {
    if (file.isDirectory()) {
      continue
    }
    if (!file.name.endsWith('.mdx') && !file.name.endsWith('.md')) {
      continue
    }
    const relativePath = path.join(file.parentPath.replace(dir, ''), file.name)

    const dirPath = path.dirname(relativePath)
    // remove leading /
    // if dirPath is just ".", we set it to empty string
    const dirPathCleaned = dirPath === '.' ? '' : dirPath.replace(/^\//, '').replace(/\/$/, '')
    // create the entry in dirToFiles if it doesn't exist

    if (!dirToFiles[dirPathCleaned]) {
      dirToFiles[dirPathCleaned] = {}
    }

    // read the file
    const fileContents = fs.readFileSync(path.join(file.parentPath, file.name), 'utf8')
    // split at "---"

    const matterContent = fileContents.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/m)
    if (!matterContent || matterContent === null) {
      continue
    }
    const yamlContent = yaml.load((matterContent as RegExpExecArray)[1]) as Record<string, any>

    const filepath = file.name.replace(/\.mdx?$/, '')
    // extract front matter
    dirToFiles[dirPathCleaned][filepath] = {
      ...yamlContent,
      // add filepath to the front matter
      filepath,
    }
  }

  // save the file as indices.ts in the root directory
  const filepath = path.join(process.cwd(), 'indices.ts')
  const tsOutput = `export const indices = ${JSON.stringify(dirToFiles, null, 2)};`
  console.log('Writing indices.ts to the file system')
  fs.writeFileSync(filepath, tsOutput)
}
