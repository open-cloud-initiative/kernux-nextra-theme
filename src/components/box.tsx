// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import DOMPurify from 'isomorphic-dompurify'
import {H4, P} from '@open-cloud-initiative/kernux-react'
interface BoxProps {
  title: string
  description: string
}
export const Box = (props: BoxProps) => {
  return (
    <div className="rounded-md border border-solid p-3 px-5">
      <H4>{props.title}</H4>
      <P
        className="!mt-0"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(props.description),
        }}
      />
    </div>
  )
}
