// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { FunctionComponent } from "react";
import { cleanHtml } from "../common";
import { A, H2, P } from "@open-cloud-initiative/kernux-react";

interface Props {
  href: string;
  index: number;
  title: string;
  description: string;
}
export const BigListItem: FunctionComponent<Props> = (props) => {
  return (
    <div>
      <H2>
        <span className="w-16 h-16 bg-kern-feedback-info-background rounded-full flex flex-row text-center text-3xl md:text-2xl items-center justify-center font-medium">
          {props.index}
        </span>
        <A className="!text-xl !font-bold !mt-sm" href={props.href}>
          {cleanHtml(props.title)}
        </A>
      </H2>
      <P>{cleanHtml(props.description)}</P>
    </div>
  );
};
