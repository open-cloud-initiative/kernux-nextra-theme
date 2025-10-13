// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import React from "react";
import { useMemo } from "react";
import { H3, P, Span } from "@open-cloud-initiative/kernux-react";
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

interface Props {
  items: Array<{
    date: string;
    title: string;
    description: string;
    version: string;
    imagePath?: string;
    imageWidth?: number;
    imageHeight?: number;
  }>;
  oldToNew?: boolean;
  gradient?: boolean;
}

const parseDate = (str: string): Date => {
  // check if only single "year" is given
  if (/^\d{4}$/.test(str)) {
    // it is only the year
    return new Date(Number(str), 0, 1); // January 1st of that year
  }

  const [day, month, year] = str.split(".").map(Number);
  return new Date(year, month - 1, day); // month is 0-based
};

export const Timeline = (props: Props) => {
  // order the items by date - desc
  const items = useMemo(() => {
    const sortedItems = props.items;
    // add a "firstOfYear" property to each, which is the first item of the year
    return sortedItems.map((item, index) => {
      const itemYear = new Date(item.date).getFullYear();

      if (props.oldToNew) {
        // check for the previous item
        const prevItemYear =
          index > 0
            ? parseDate(sortedItems[index - 1].date).getFullYear()
            : null;
        if (prevItemYear === null || prevItemYear !== itemYear) {
          return {
            ...item,
            firstOfYear: true,
          };
        }
        return {
          ...item,
          firstOfYear: false,
        };
      }
      // check the next item year, if exists
      const nextItemYear =
        index < sortedItems.length - 1
          ? parseDate(sortedItems[index + 1].date).getFullYear()
          : null;

      // if the next item year is null, this one is the first of the year
      if (nextItemYear !== itemYear) {
        return {
          ...item,
          firstOfYear: true,
        };
      }
      return {
        ...item,
        firstOfYear: false,
      };
    });
  }, [props.items]);
  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-2 md:left-8 w-0.5 bg-kern-action-default" />
      {items.map((el, i, arr) => (
        <div
          key={el.title}
          className={clsx("ml-6 md:ml-14 relative mb-12", {
            "mb-20": !props.oldToNew && el.firstOfYear,
            "pt-20": props.oldToNew && el.firstOfYear,
          })}
        >
          {props.gradient && i + 1 === arr.length && (
            <div className="absolute bg-gradient-to-t from-white to-transparent bottom-0 z-10 h-2/3 -left-10 w-10" />
          )}
          {el.imagePath && (
            <div className="mt-7">
              <Image
                src={el.imagePath}
                alt={el.title}
                width={el.imageWidth || 512}
                height={el.imageHeight || 256}
                className=" mb-2"
              />
            </div>
          )}

          <div
            className={clsx(
              "absolute rounded-full -left-[29px] md:-left-[2.3rem] bg-white p-1",
              {
                "top-3":
                  (!el.version && !el.firstOfYear) ||
                  (!el.version && el.firstOfYear && !props.oldToNew),
                "top-[6rem]": !el.version && el.firstOfYear && props.oldToNew,
              },
            )}
          >
            <div className="p-1 bg-kern-feedback-info-background rounded-full">
              <div className="bg-kern-action-default rounded-full w-2 h-2  md:w-3  md:h-3"></div>
            </div>
          </div>

          {Boolean(el.version) && <span className="text-sm">{el.version}</span>}

          <H3>{el.title}</H3>
          {el.date.length > 4 && (
            <Span className="font-bold text-sm">{el.date}</Span>
          )}
          <P
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(el.description),
            }}
            className={clsx("text-sm mt-2", {
              "pb-4": el.firstOfYear && !props.oldToNew,
              "!mb-0": el.firstOfYear && !props.oldToNew,
            })}
          />
          {el.firstOfYear && (
            <div
              className={clsx(
                "absolute -left-6 md:-left-[3.75rem] bg-white py-3",
                {
                  "top-0": props.oldToNew,
                },
              )}
            >
              <Span className="rounded-md font-semibold md:text pt-1.5 pb-1.5 bg-kern-layout-background-default border-solid px-4 border-kern-action-default border-2">
                {parseDate(el.date).getFullYear()}
              </Span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
