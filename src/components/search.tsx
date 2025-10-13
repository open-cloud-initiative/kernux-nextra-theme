// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import cn from "clsx";

import NextLink from "next/link";
import { useRouter } from "next/router";
import { InformationCircleIcon, SpinnerIcon } from "nextra/icons";
import type { FocusEventHandler, ReactElement, SyntheticEvent } from "react";
import { Fragment, useCallback, useEffect, useRef } from "react";
import { useMenu, useThemeConfig } from "../contexts";
import type { SearchResult } from "../types/search";
import { renderComponent, renderString } from "../utils";

type SearchProps = {
  className?: string;
  value: string;
  onChange: (newValue: string) => void;
  onActive?: () => void;
  loading?: boolean;
  error?: boolean;
  results: SearchResult[];
};

const INPUTS = new Set(["input", "select", "button", "textarea"]);

export function Search({
  className,
  value,
  onChange,
  onActive,
  loading,
  error,
  results,
}: SearchProps): ReactElement {
  const themeConfig = useThemeConfig();
  const { setMenu } = useMenu();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function down(event: globalThis.KeyboardEvent) {
      const input = inputRef.current;
      const activeElement = document.activeElement as HTMLElement;
      const tagName = activeElement?.tagName.toLowerCase();
      if (
        !input ||
        !tagName ||
        INPUTS.has(tagName) ||
        activeElement?.isContentEditable
      )
        return;
      if (
        event.key === "/" ||
        (event.key === "k" &&
          (event.metaKey /* for Mac */ || /* for non-Mac */ event.ctrlKey))
      ) {
        event.preventDefault();
        // prevent to scroll to top
        input.focus({ preventScroll: true });
      }
    }

    window.addEventListener("keydown", down);
    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);

  const handleFocus = useCallback<FocusEventHandler>(
    (event) => {
      const isFocus = event.type === "focus";
      if (isFocus) onActive?.();
    },
    [onActive],
  );

  const handleChange = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      onChange(value);
    },
    [onChange],
  );

  const handleSelect = useCallback(
    async (searchResult: SearchResult | null) => {
      if (!searchResult) return;
      // Calling before navigation so selector `html:not(:has(*:focus))` in styles.css will work,
      // and we'll have padding top since input is not focused
      inputRef.current?.blur();
      await router.push(searchResult.route);
      // Clear input after navigation completes
      setMenu(false);
      onChange("");
    },
    [router, setMenu, onChange],
  );

  // const [selected, setSelected] = useState<SearchResult | null>(null)
  //
  // useEffect(() => {
  //   setSelected(results[0] || null)
  // }, [results])

  return (
    <Combobox onChange={handleSelect}>
      <div
        className={cn(
          "kern-form-input flex flex-col justify-center",
          className,
        )}
      >
        <ComboboxInput
          className={"kern-form-input__input text-sm h-10 w-[260px]"}
          ref={inputRef}
          spellCheck={false}
          aria-label="Suche"
          autoComplete="off"
          type="search"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          value={value}
          placeholder={renderString(themeConfig.search.placeholder)}
        />
      </div>
      <ComboboxOptions
        transition
        anchor={{ to: "top end", gap: 10, padding: 16 }}
        className={({ open }) =>
          cn(
            "max-md:h-full border border-border z-20 rounded-md py-2.5 shadow-xl bg-background",
            "transition-opacity",
            open ? "opacity-100" : "opacity-0",
            error || loading || !results.length
              ? "md:h-[100px]"
              : // headlessui adds max-height as style, use !important to override
                "md:!max-h-[min(calc(100vh-5rem),400px)]",
            "w-full md:w-[576px]",
            "empty:invisible",
          )
        }
      >
        {error ? (
          <span className="flex select-none justify-center gap-2 p-8 text-center text-sm text-red-500">
            <InformationCircleIcon className="size-5" />
            {renderString(themeConfig.search.error)}
          </span>
        ) : loading ? (
          <span className="flex select-none justify-center gap-2 p-8 text-center text-sm text-gray-400">
            <SpinnerIcon className="size-5 animate-spin" />
            {renderComponent(themeConfig.search.loading)}
          </span>
        ) : results.length ? (
          results.map((searchResult) => (
            <Fragment key={searchResult.id}>
              {searchResult.prefix}
              <ComboboxOption
                as={NextLink}
                value={searchResult}
                href={searchResult.route}
                className={(props) =>
                  cn(
                    "mx-2.5 break-words rounded-md block scroll-m-12 px-2.5 py-2 hover:bg-kern-action-state-indicator-tint-hover-opacity",
                    (props.selected || props.focus) &&
                      "bg-kern-action-state-indicator-tint-hover-opacity",
                  )
                }
              >
                {searchResult.children}
              </ComboboxOption>
            </Fragment>
          ))
        ) : (
          value && renderComponent(themeConfig.search.emptyResult)
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
