import {Button, Card, H2} from '@open-cloud-initiative/kernux-react'

interface TeaserImage {
  imgSrc: string
  imgAlt: string
}

interface PageData {
  title: string
  filepath: string
  teaserDescription?: string
  teaserTopic?: string
  teaserImage?: TeaserImage
}

interface SectionData {
  [key: string]: PageData | SectionData
}

interface Indices {
  [sectionKey: string]: SectionData
}

export interface DynamicTeaserProps {
  indices: Indices
  teaserTarget: string // which section to target, e.g. "anleitungen", is folder from indices
  title?: string // optional title, defaults to capitalized teaserTarget
  manualSelectionByFilename?: string[] // optional array of filenames to manually select specific pages
  disableButton?: boolean
}

export function DynamicTeaser({
  indices,
  teaserTarget,
  title,
  manualSelectionByFilename,
  disableButton,
}: DynamicTeaserProps) {
  const selectedSection = indices[teaserTarget]
  const pages = Object.values(selectedSection).filter((item): item is PageData => 'title' in item)
  let selected: PageData[] = []
  // if manual selection is provided, filter pages accordingly
  if (manualSelectionByFilename && manualSelectionByFilename.length > 0) {
    const filenameSet = new Set(manualSelectionByFilename)
    selected = pages.filter(page => filenameSet.has(page.filepath))
  } else {
    // shuffle
    for (let i = pages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pages[i], pages[j]] = [pages[j], pages[i]]
    }
    // take max 3, if less, take all
    selected = pages.slice(0, Math.min(3, pages.length))
  }

  return (
    <div className="py-8">
      <H2 className="!mb-2">{title ? title : teaserTarget.charAt(0).toUpperCase() + teaserTarget.slice(1)}</H2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {selected.map(page => (
          <Card
            key={page.filepath}
            title={page.title}
            href={`/${teaserTarget}/${page.filepath}`}
            vorzeile={page.teaserTopic}
            body={page.teaserDescription}
            imgSrc={page.teaserImage?.imgSrc}
            imgAlt={page.teaserImage?.imgAlt}
          />
        ))}
      </div>
      {!disableButton && (
        <div className="flex justify-center mt-8">
          <Button variant="secondary" href={`/${teaserTarget}`} icon="arrow-forward" iconPosition="right">
            Alle {title ? title : teaserTarget.charAt(0).toUpperCase() + teaserTarget.slice(1)}
          </Button>
        </div>
      )}
    </div>
  )
}
