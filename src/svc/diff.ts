// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {Marked} from 'marked'
import fs from 'fs'
import {GetServerSidePropsContext} from 'next'

import {gfmHeadingId} from 'marked-gfm-heading-id'
import {combinedDiffPath, diffPath} from '../config'

import {ParsedDiff} from '@/components/legacy-unmigrated/Diff'
import {DropdownOption} from '@/components/legacy-unmigrated/VersionSelect'
import {getAvailableDiffsFromFS} from './versions'

function parseVersion(versions: string[]): string {
  return `${versions[0]}__${versions[1]}`
}

const options = {
  prefix: 'heading-',
}

async function getDiffFromFS(versions: string[], path: string): Promise<string> {
  const availableDiffs = await getAvailableDiffsFromFS(path)
  const versionToFind = parseVersion(versions)
  const diff = availableDiffs.find(d => d.includes(versionToFind))
  if (diff) {
    return diff
  }
  throw new Error(`Diff not found: ${versionToFind}`)
}

async function getDiffContentFromFS(diff: string, path: string): Promise<string> {
  const content = await fs.promises.readFile(`${path}/${diff}`, 'utf-8')
  return content
}

const markdownInterpreter = new Marked()

markdownInterpreter.use(gfmHeadingId(options))

const replacementMap: {[key in string]: string} = {
  Einfuehrung: 'Einführung',
}

const beautifyFilename = (filename: string): string => {
  // remove all numbers from the filename
  // 1_Einfuerung/1_1_Kontext/1_1_Kontext.md
  // should become
  // Einfuerung/Kontext/Kontext.md
  return (
    filename
      .replace(/[\d_]+/g, '')
      // remove duplicates
      // Einfuerung/Kontext/Kontext.md
      // should become
      // Einfuerung/Kontext.md
      .split('/')
      .map(path => path.replace('.md', ''))
      .map(el => replacementMap[el] || el)
      // remove any path part starting with tmp
      .filter(el => !el.startsWith('tmp'))
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(' > ')
  )
}

const parseTableRow = (line: string) => {
  return line
    .split('|')
    .filter(cell => cell)
    .map(cell => {
      return `<td>${markdownInterpreter.parse(cell, {async: false})}</td>`
    })
    .join('')
}

const containsOnlyPipeAndDash = (str: string) => {
  return /^[|-]+$/.test(str)
}

const parseLists = (input: string) => {
  let isInList = false

  let currentBlock = ''
  let finalOutput = ''
  const listItemRegex = /^\s*(\{\+|\[-)?\s*([*+-]|\d+[.)])\s+.*(\+\}|-\])?\s*$/gm

  const lines = input.split('\n')
  let listType
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const isListRow = line.match(listItemRegex)

    if (isListRow) {
      const isDeletedLine = line.startsWith('[-')
      const parsedLine = line.replaceAll('[-', '').replaceAll('{+', '').replaceAll('+}', '').replaceAll('-]', '')

      if (!isInList) {
        // check if number or bullet list
        const isNumberedList = /^\d+[.)]/.test(parsedLine)
        listType = isNumberedList ? 'ol' : 'ul'
        // it is the first row of the table
        // it HAS to be the header row.
        // Start of a new block (list or table)
        currentBlock += `<${listType}>\n`
        isInList = true
      }

      // Continue the current block
      currentBlock += `<li class="${isDeletedLine ? 'deleted-row' : 'added-row'}">${markdownInterpreter.parse(
        parsedLine.replace(/^\s*([*+-]|\d+[.)])\s+/, ''),
        {async: false},
      )}</li>\n`
    } else {
      if (isInList) {
        // End of the block, wrap it
        const wrappedBlock = `<div>${currentBlock}</${listType}></div>`
        finalOutput += `${wrappedBlock}\n`
        currentBlock = '' // Reset for next block
        isInList = false
      } else {
        finalOutput += `${line}\n` // Process normal lines
      }
    }
  }

  // Handle the last block if there’s any leftover
  if (currentBlock && isInList) {
    const wrappedBlock = `<div>${currentBlock}</${listType}></div>`
    finalOutput += `${wrappedBlock}\n`
  }

  return finalOutput
}
// Function to group list and table blocks
const parseTables = (input: string) => {
  let isInTable = false
  let currentBlock = ''
  let finalOutput = ''

  const tableRegex = /\[-\|\s*(.+\s*\|)+\s*-\]|\{\+\|\s*(.+\s*\|)+\s*\+\}/gm

  const lines = input.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const isTableRow = line.match(tableRegex)

    if (isTableRow) {
      const isDeletedLine = line.startsWith('[-')
      const parsedLine = line.replaceAll('[-', '').replaceAll('{+', '').replaceAll('+}', '').replaceAll('-]', '')
      if (containsOnlyPipeAndDash(parsedLine)) {
        continue
      }

      if (!isInTable) {
        // it is the first row of the table
        // it HAS to be the header row.
        // Start of a new block (list or table)
        currentBlock += '<table>\n'
        isInTable = true
      }
      // Continue the current block
      currentBlock += `<tr class="${isDeletedLine ? 'deleted-row' : 'added-row'}">${parseTableRow(parsedLine)}</tr>\n`
    } else {
      if (isInTable) {
        // End of the block, wrap it
        const wrappedBlock = `<div>${currentBlock}</table></div>`
        finalOutput += `${wrappedBlock}\n`
        currentBlock = '' // Reset for next block
        isInTable = false
      } else {
        finalOutput += `${line}\n` // Process normal lines
      }
    }
  }

  // Handle the last block if there’s any leftover
  if (currentBlock && isInTable) {
    const wrappedBlock = `<div>${currentBlock}</table></div>`
    finalOutput += `${wrappedBlock}\n`
  }

  return finalOutput
}

export const parseDiffContent = async (content: string): Promise<ParsedDiff[]> => {
  const parsed = await Promise.all(
    parseLists(parseTables(content))
      .split('diff --git')
      .map(async (diff): Promise<ParsedDiff | null> => {
        const lines = diff.split('\n')
        if (lines.length < 2) {
          return null
        }

        // first line is the file path of the two files
        const filename = lines[0].replace('diff --git ', '').split(' ')[1].replace('a/', '')

        if (filename.includes('.gitkeep')) {
          return null
        }

        // if the next line starts with "index" it is a regular file comparison
        // if it starts with "new file mode" it is a new file
        // if it starts with "deleted file mode" it is a deleted file
        // if it starts with "similarity index" it is a renamed file
        let action: 'add' | 'delete' | 'rename' | 'change' = 'change'
        if (lines[1].startsWith('new file mode')) {
          action = 'add'
        } else if (lines[1].startsWith('deleted file mode')) {
          action = 'delete'
        } else if (lines[1].startsWith('similarity index')) {
          action = 'rename'
        }

        // deleted -> start at 6
        // added -> start at 6
        // change -> start at 5
        // rename -> start at 8
        // we can search for the line starting with @@ to find the start of the content (the first after @@)
        const contentStartsAtIndex = lines.findIndex(line => line.startsWith('@@')) + 1
        // The regex to match both {+ ... +} and [- ... -] with capturing groups
        const diffRegex = /\{\+([\s\S]*?)\+\}|\[-([\s\S]*?)-\]/g

        // regex matches footnotes like [^1]
        const footnoteRegex = /\[\^([^\]]+)\]/g
        const commentRegex = /<!--[\s\S]*?-->/g

        // now we have a diff of a single file.
        // lets split each line
        const content = await markdownInterpreter.parse(
          lines
            .slice(contentStartsAtIndex)
            .join('\n')

            .replace(diffRegex, (match, ins, del) => {
              if (ins) {
                // edge case
                // check if ins is a headline
                if (ins.startsWith('#')) {
                  return `<div><ins>${markdownInterpreter.parse(ins, {async: false})}</ins></div>`
                }
                if (ins && ins.includes('*')) {
                  return `<ins>${markdownInterpreter.parse(ins)}</ins>`
                }
                return `<ins>${ins}</ins>`
              } else if (del) {
                if (del.startsWith('#')) {
                  return `<div><del>${markdownInterpreter.parse(del, {async: false})}</del></div>`
                }
                if (del && del.includes('*')) {
                  return `<del>${markdownInterpreter.parse(del)}</del>`
                }
                return `<del>${del}</del>`
              }
              return match
            })
            .replace(footnoteRegex, (match, footnoteNumber) => {
              return `<sup>${footnoteNumber}</sup>`
            })
            .replaceAll(/\{.+\}/g, '')
            .replace(commentRegex, ''),
        )

        return {
          title: beautifyFilename(filename),
          action,
          content,
        }
      }),
  )

  return parsed.filter((diff): diff is ParsedDiff => diff !== null)
}

export async function getDiffData(
  ctx: GetServerSidePropsContext,
  versions: Array<{
    id: number
    name: string
    latest: boolean
  }>,
) {
  try {
    const source = (ctx.query.source as string) ?? versions[1].name
    const target = (ctx.query.target as string) ?? versions[0].name

    const type = ctx.query.type as string

    const path = type === 'combined' ? combinedDiffPath : diffPath
    const diff = await getDiffFromFS([source, target], path)
    const diffContent = await getDiffContentFromFS(diff, path)
    const parsedDiff = await parseDiffContent(diffContent)
    const extractedHeadlines = extractHeadlinesWithState(parsedDiff)

    return {diff: parsedDiff, headings: extractedHeadlines}
  } catch (e) {
    console.error(e)
    return {diff: [], headings: []}
  }
}

interface semVer {
  major: number
  minor: number
  patch: number
}

export interface ParsedDiffHeadings {
  id: string
  title: string
  type: 'deleted' | 'inserted' | 'replaced' | 'normal'
  level: number // To represent heading level (h1, h2, h3, h4)
  children?: ParsedDiffHeadings[]
}

function parseIntoMajorMinorAndPatchVersion(version: string): semVer {
  // Remove 'v' prefix if it exists
  const cleanVersion = version.startsWith('v') ? version.substring(1) : version

  // Split the version into parts and parse the numbers
  const parts = cleanVersion.split('.')
  const major = parseInt(parts[0], 10)
  const minor = parseInt(parts[1], 10)
  const patch = parts.length > 2 ? parseInt(parts[2], 10) : 0 // Default patch to 0 if missing

  return {major, minor, patch}
}

function isGreaterVersion(v1: semVer, v2: semVer): boolean {
  // Compare major, then minor, then patch
  if (v1.major !== v2.major) {
    return v1.major > v2.major
  } else if (v1.minor !== v2.minor) {
    return v1.minor > v2.minor
  } else {
    return v1.patch > v2.patch
  }
}

function isEqualVersion(v1: semVer, v2: semVer): boolean {
  return v1.major === v2.major && v1.minor === v2.minor && v1.patch === v2.patch
}

export function calculateAllowedDiffOptions(
  selectedSource: DropdownOption,
  selectedTarget: DropdownOption,
  available: DropdownOption[],
): DropdownOption[][] {
  const selectedSourceVersion = parseIntoMajorMinorAndPatchVersion(selectedSource.name)
  const selectedTargetVersion = parseIntoMajorMinorAndPatchVersion(selectedTarget.name)

  // Filter options less than or equal to selectedTarget
  const allowedSource = available.filter(option => {
    const optionVersion = parseIntoMajorMinorAndPatchVersion(option.name)
    return (
      isGreaterVersion(selectedTargetVersion, optionVersion) || isEqualVersion(optionVersion, selectedTargetVersion)
    )
  })

  // Filter options greater than or equal to selectedSource
  const allowedTarget = available.filter(option => {
    const optionVersion = parseIntoMajorMinorAndPatchVersion(option.name)
    return (
      isGreaterVersion(optionVersion, selectedSourceVersion) || isEqualVersion(optionVersion, selectedSourceVersion)
    )
  })

  return [allowedSource, allowedTarget]
}

export function extractHeadlinesWithState(parsedDiffs: ParsedDiff[]): ParsedDiffHeadings[] {
  const headlines: ParsedDiffHeadings[] = []

  parsedDiffs.forEach(diff => {
    // Updated regex to match headings optionally wrapped in <ins> or <del> tags
    const headingRegex = /<(ins|del)?\s*>(<(h[1-4])[^>]*id="([^"]+)"[^>]*>)(.*?)<\/\3>\s*<\/\1?>/g
    const stack: ParsedDiffHeadings[] = [] // Stack to manage hierarchical nesting
    let match = headingRegex.exec(diff.content) // Initial match for headings in the content

    // Loop through all matches of headings within the content
    while (match !== null) {
      const wrapperTag = match[1] // Optional <ins> or <del> wrapper tag
      const level = parseInt(match[3].replace('h', ''), 10) // Convert heading level (e.g., 'h1' -> 1)
      const id = match[4] // Extract id attribute from heading
      let title = match[5].trim() // Extract and trim the content between tags as the heading title

      const type = wrapperTag === 'ins' ? 'inserted' : wrapperTag === 'del' ? 'deleted' : determineHeadingType(title)

      // Clean up the title by removing any <del> or <ins> tags within the heading
      title = cleanTitle(title, type)

      // Create a heading object with extracted information
      const heading: ParsedDiffHeadings = {
        id,
        title,
        type,
        level,
        children: [], // Placeholder for nested headings
      }

      // Add the heading to the correct hierarchy level (nested or top-level)
      addToHierarchy(headlines, stack, heading)

      // Get the next match in the string to continue the loop
      match = headingRegex.exec(diff.content)
    }
  })

  return headlines
}

// Helper function to determine if a heading contains deletion or insertion tags
function determineHeadingType(title: string): 'deleted' | 'inserted' | 'normal' | 'replaced' {
  // Check if the title has both <del> and <ins> tags, indicating replacement
  if (/<del>.*?<\/del>.*?<ins>.*?<\/ins>/.test(title)) return 'replaced'
  // Check if the title only has <del> tags
  if (/<del>/.test(title)) return 'deleted'
  // Check if the title only has <ins> tags
  if (/<ins>/.test(title)) return 'inserted'
  // Default to 'normal' if no tags are found
  return 'normal'
}

// Helper function to remove <del> and <ins> tags from title and adjust for replacements
function cleanTitle(title: string, type: 'deleted' | 'inserted' | 'normal' | 'replaced'): string {
  if (type === 'replaced') {
    // Extract deleted and inserted texts and format with an arrow to indicate replacement
    const deletedText = title.match(/<del>(.*?)<\/del>/)?.[1]?.trim() || ''
    const insertedText = title.match(/<ins>(.*?)<\/ins>/)?.[1]?.trim() || ''
    return `${deletedText} → ${insertedText}`
  }
  // Remove <del> tags if the type is deleted
  if (type === 'deleted') return title.replace(/<\/?del>/g, '').trim()
  // Remove <ins> tags if the type is inserted
  if (type === 'inserted') return title.replace(/<\/?ins>/g, '').trim()
  // Return the title as-is if it's normal
  return title
}

// Helper function to add a heading to the correct position in the hierarchy
function addToHierarchy(headlines: ParsedDiffHeadings[], stack: ParsedDiffHeadings[], heading: ParsedDiffHeadings) {
  // Adjust the stack to find the correct nesting position
  // Remove stack items that are higher or equal to the current heading's level
  while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
    stack.pop()
  }

  if (stack.length === 0) {
    // If stack is empty, this is a top-level heading
    headlines.push(heading)
  } else {
    // Otherwise, add as a child to the last heading in the stack (nested)
    stack[stack.length - 1].children?.push(heading)
  }

  // Push the current heading onto the stack to set up nesting for the next heading
  stack.push(heading)
}
