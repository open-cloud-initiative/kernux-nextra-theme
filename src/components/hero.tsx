// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { Item } from "nextra/normalize-pages";
import { FunctionComponent, ReactNode } from "react";
import { Breadcrumb } from "./breadcrumb";

interface Props {
  Title: ReactNode;
  Description: ReactNode;
  Image?: ReactNode;
  Buttons?: ReactNode;
  activePath?: Item[];
}
export const Hero: FunctionComponent<Props> = ({
  Title,
  Description,
  Buttons,
  activePath,
  Image,
}) => {
  return (
    <div className="bg-kern-action-default md:mb-10">
      <div className="mx-auto container md:flex-nowrap flex-wrap items-center justify-between gap-10 flex ">
        <div className="md:py-14 pt-5 pb-10 w-full">
          {activePath && (
            <Breadcrumb
              activePath={activePath}
              className="text-kern-action-on-default"
            />
          )}
          <div className="text-kern-action-on-default mt-4">{Title}</div>
          <div className="!text-kern-action-on-default text-lg">
            {Description}
          </div>
          {Buttons && <div className="mt-8 flex gap-4">{Buttons}</div>}
        </div>
        {Boolean(Image) && <div className="hidden md:block">{Image}</div>}
      </div>
    </div>
  );
};
