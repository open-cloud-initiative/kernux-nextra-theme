// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import cn, {clsx} from 'clsx'
import type {NextraMDXContent} from 'nextra'

import type {MDXComponents} from 'nextra/mdx'
import type {DetailedHTMLProps, HTMLAttributes, ReactElement, ReactNode} from 'react'
import React, {useId, useRef} from 'react'

import {Breadcrumb, SkipNavContent, TOC} from './components'

import {AnchorProps, H1, H2, H3, H4, H5, H6, A as KernUXA, P} from '@open-cloud-initiative/kernux-react'
import {CopyIcon} from 'lucide-react'
import {toast} from 'sonner'
import {useConfig, useThemeConfig} from './contexts'
import {KernuxThemeConfig} from './schemas'
import {renderComponent} from './utils'
import {Tooltip, TooltipContent, TooltipTrigger} from './components/ui/tooltip'

const EXTERNAL_HREF_REGEX = /https?:\/\//

export const Link = ({href = '', className, ...props}: AnchorProps) => (
  <A href={href} newWindow={EXTERNAL_HREF_REGEX.test(href)} className={className} {...props} />
)

const A = ({href = '', ...props}) => <KernUXA href={href} newWindow={EXTERNAL_HREF_REGEX.test(href)} {...props} />

export function Body({children}: {children: ReactNode}): ReactElement {
  const config = useConfig()

  const {
    activeThemeContext: themeContext,
    activeType,
    //  activeIndex,
    //  flatDocsDirectories,
    activePath,
  } = config.normalizePagesResult

  if (themeContext.layout === 'raw') {
    return <div className="w-full">{children}</div>
  }

  const content = (
    <>
      {renderComponent(themeContext.topContent)}
      {children}
      {renderComponent(themeContext.bottomContent)}
      {/*activeType !== "page" && themeContext.pagination && (
        <NavLinks
          flatDocsDirectories={flatDocsDirectories}
          currentIndex={activeIndex}
        />
      )*/}
    </>
  )

  if (themeContext.layout === 'full') {
    return <article className="flex-1">{content}</article>
  }

  return (
    <article className="flex-1">
      <main className="max-w-[1400px]">
        {activeType !== 'page' &&
          themeContext.breadcrumb &&
          !config.frontMatter.title &&
          !config.frontMatter.description &&
          activePath.length > 1 && <Breadcrumb activePath={activePath} />}
        {content}
      </main>
    </article>
  )
}
const processHeadingProps = (props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => {
  let children = props.children
  let id = props.id

  if (children && children.toString().includes('[notInToc]')) {
    children = children.toString().replace('[notInToc]', '')
    id = id?.replace('-notintoc', '')
  }

  return {...props, children, id}
}
export const DEFAULT_COMPONENTS: MDXComponents = {
  em: props => <em className="font-medium" {...props} />,
  h1: props => {
    const processed = processHeadingProps(props)
    return <H1 {...processed} />
  },
  h2: props => {
    const processed = processHeadingProps(props)
    return <H2 className="!mt-6" {...processed} />
  },
  h3: props => {
    const processed = processHeadingProps(props)
    return <H3 className="!mt-4" {...processed} />
  },
  h4: props => {
    const processed = processHeadingProps(props)
    return <H4 className="!mt-3" {...processed} />
  },
  h5: props => {
    const processed = processHeadingProps(props)
    return <H5 className="!mt-2" {...processed} />
  },
  h6: props => {
    const processed = processHeadingProps(props)
    return <H6 className="!mt-2" {...processed} />
  },

  ul: props => <ul className="my-lg list-disc ml-6" {...props} />,
  ol: props => <ol className="my-lg list-decimal ml-6" {...props} />,
  li: ({children, ...props}) => {
    // Check if the first child is a checkbox
    if (Array.isArray(children) && children[0]?.props?.type === 'checkbox') {
      const checkbox = children[0]
      const labelText = children.slice(1)

      return (
        <li {...props}>
          {React.cloneElement(checkbox, {
            'aria-label': String(labelText.map(c => c.props?.children || c)),
          })}
          <span>{labelText}</span>
        </li>
      )
    }
    return <li {...props}>{children}</li>
  },
  blockquote: props => <blockquote className={cn('text-muted-foreground border-l-2 pl-lg')} {...props} />,
  hr: props => (
    <hr
      className="my-8 border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400"
      {...props}
    />
  ),
  a: Link,
  table: props => <table className="kern-table _my-xl" {...props} />,
  p: props => <P {...props} />,
  tr: ({className, ...props}) => <tr className={cn('kern-table__row', className)} {...props} />,
  th: ({className, ...props}) => <th className={cn('kern-table__header', className)} {...props} />,
  thead: ({className, ...props}) => <thead className={cn('kern-table__head', className)} {...props} />,
  td: ({className, ...props}) => <td className={cn('kern-table__cell', className)} {...props} />,
  tbody: ({className, ...props}) => <tbody className={cn('kern-table__body', className)} {...props} />,
  summary: props => <summary {...props} />,
  details: props => <details {...props} />,
  pre: ({className, ...properties}) => {
    const preRef = useRef<HTMLPreElement>(null)
    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const codeElement = preRef.current
      if (codeElement) {
        const codeText = codeElement.textContent || ''
        navigator.clipboard
          .writeText(codeText)
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
    }

    return (
      <div className="relative">
        <div>
          <button
            aria-label="Copy code to clipboard"
            className="absolute hover:opacity-50 transition-all right-sm top-sm"
            onClick={handleCopy}
          >
            <CopyIcon className="h-4 w-4" />
          </button>
        </div>

        <pre
          ref={preRef}
          className={clsx(
            className,
            'bg-kern-layout-background-hued my-lg font-mono rounded-md pl-lg p-md overflow-x-auto',
          )}
          {...properties}
        />
      </div>
    )
  },
  code: ({className, ...properties}) => {
    return <code className={className} {...properties} />
  },
  abbr: ({title, ...properties}) => {
    // create a custom tooltip for abbreviations
    const id = useId()
    const themeConfig = useThemeConfig()
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            aria-describedby={id}
            href={`${themeConfig.glossaryPage}#${properties.children}`}
            className="!text-kern-layout-text inline underline underline-offset-2 decoration-2 hover:!decoration-2 !decoration-dotted"
          >
            {properties.children}
          </a>
        </TooltipTrigger>
        <TooltipContent role="tooltip" id={id}>
          {title}
        </TooltipContent>
      </Tooltip>
    )
  },
  wrapper: function NextraWrapper({toc, children}) {
    const config = useConfig()

    return (
      <>
        <div className="flex-1 flex flex-row">
          <div
            className={clsx(
              'flex-1 flex md:flex-row flex-col pb-xl min-w-0',
              config.normalizePagesResult.activeThemeContext.layout === 'raw' ? '' : 'gap-xl pt-xl',
              {
                'lg:px-xl ': config.normalizePagesResult.activeThemeContext.layout !== 'raw',
              },
            )}
          >
            <Body>
              <SkipNavContent />
              {children}
            </Body>
            {!config.frontMatter.disableToc && (
              <div className="order-first md:order-last">
                <TOC filePath={config.filePath} toc={toc} />
              </div>
            )}
          </div>
        </div>
      </>
    )
  } satisfies NextraMDXContent,
}

export function getComponents({
  components,
}: {
  isRawLayout?: boolean
  components?: KernuxThemeConfig['components']
}): MDXComponents {
  return {
    ...DEFAULT_COMPONENTS,
    ...components,
  }
}
