import {Button, H3, P} from '@open-cloud-initiative/kernux-react'
import clsx from 'clsx'
import React from 'react'
import DOMPurify from 'isomorphic-dompurify'

interface Props {
  children: React.ReactNode
}

interface StepElementProps {
  title: string
  buttonText?: string
  buttonLink?: string
  children?: React.ReactNode
  description?: string
}

const StepContext = React.createContext<{
  items: StepElementProps[]
}>({
  items: [],
})

export const StepElement = (el: StepElementProps) => {
  const context = React.useContext(StepContext)
  const i = context.items.findIndex(item => item.title === el.title)
  return (
    <div key={i} className="flex gap-4 mb-8 relative">
      {
        // add a gradient for the last element
        i === context.items.length - 1 ? (
          <div
            aria-hidden="true"
            className="absolute top-8 left-7 -ml-px h-full w-0.5 bg-gradient-to-b from-kern-action-default to-transparent"
          />
        ) : (
          <div aria-hidden="true" className="absolute top-8 left-7 -ml-px h-full w-0.5 bg-kern-action-default" />
        )
      }
      <div className="relative z-10 w-14 h-14 border-2 rounded-full flex items-center justify-center text-xl font-medium bg-white">
        {i + 1}
      </div>
      <div className="flex flex-col flex-1">
        <div className="pt-3">
          <H3>{el.title}</H3>
        </div>
        {el.description ? (
          <P
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(el.description),
            }}
            className={clsx('text-sm mt-2')}
          />
        ) : (
          <div className={clsx('text-sm mt-2')}>{el.children}</div>
        )}

        {el.buttonText && el.buttonLink && (
          <Button
            className="mt-2 w-fit"
            variant="secondary"
            onClick={() => {
              if (el.buttonLink) {
                window.location.href = el.buttonLink
              }
            }}
          >
            {el.buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}

export const AdvancedSteps = (props: Props) => {
  const items: StepElementProps[] =
    React.Children.toArray(props.children)
      .map(child => {
        if (React.isValidElement(child)) {
          return child.props as StepElementProps
        }
        return null
      })
      .filter((item): item is StepElementProps => item !== null) || []
  return (
    <StepContext.Provider value={{items}}>
      <div className="relative steps">
        {items.map(el => (
          <StepElement key={el.title} {...el} />
        ))}
      </div>
    </StepContext.Provider>
  )
}
