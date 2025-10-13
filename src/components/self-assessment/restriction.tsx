// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { Answers } from "@/types/selfAssessment";
import { useMemo, useState } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { Button, Input } from "@open-cloud-initiative/kernux-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import clsx from "clsx";

export interface SelfAssessmentRestrictionProps {
  form: UseFormReturn<Answers, any, Answers>;
  setActiveStepIndex: (index: number) => void;
  specs: {
    specTitle: string;
    specId: string;
    specPreview: string;
  }[];
}

export default function SelfAssessmentRestriction({
  form,
  setActiveStepIndex,
  specs,
}: SelfAssessmentRestrictionProps) {
  const sortedSpecs = specs.sort((a, b) =>
    a.specTitle.localeCompare(b.specTitle),
  );

  const specMap = useMemo(() => {
    return specs.reduce(
      (acc, spec) => {
        acc[spec.specId] = spec;
        return acc;
      },
      {} as Record<
        string,
        { specTitle: string; specId: string; specPreview: string }
      >,
    );
  }, [specs]);

  const [open, setOpen] = useState(false);

  const selectedSpecIds = form.watch("specifications");

  return (
    <div className="w-full flex-1">
      <div>
        <FormProvider {...form}>
          <form>
            <div className="grid grid-cols-6 gap-xl">
              <div className="col-span-3">
                <Input label="Prüfthema" {...form.register("topic")} />
              </div>
              <div className="col-span-3">
                <Input
                  label="Prüfanwendungsfall"
                  {...form.register("case")}
                  placeholder="Architekturentscheidung"
                />
              </div>
              <div className="col-span-6" key={"restriction"}>
                <span className="inline-block w-full text-lg font-medium">
                  Vorgaben
                </span>
                <div className="mt-4">
                  <div>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="secondary"
                          className="justify-start"
                          type="button"
                        >
                          + Vorgabe hinzufügen
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 !p-0"
                        side="right"
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Suche..." />
                          <CommandList>
                            <CommandEmpty>Keine Vorgabe gefunden.</CommandEmpty>
                            <CommandGroup>
                              {sortedSpecs.map((spec) => (
                                <CommandItem
                                  key={spec.specId}
                                  className={clsx(
                                    selectedSpecIds?.includes(spec.specId) &&
                                      "bg-kern-action-state-indicator-tint-hover-opacity  ",
                                    "cursor-pointer",
                                  )}
                                  value={spec.specTitle}
                                  onSelect={() => {
                                    // get the current specifications
                                    let currentSpecs =
                                      form.getValues("specifications") || [];

                                    // check if the selected spec is already in the list
                                    if (currentSpecs.includes(spec.specId)) {
                                      // remove it
                                      currentSpecs = currentSpecs.filter(
                                        (specId) => specId !== spec.specId,
                                      );
                                    } else {
                                      // add it
                                      currentSpecs.push(spec.specId);
                                    }

                                    form.setValue("specifications", [
                                      ...currentSpecs,
                                    ]);
                                  }}
                                >
                                  <span>{spec.specTitle}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {selectedSpecIds?.map((specId) => (
                    <div key={specId} className="mt-4">
                      <div className="flex flex-row border p-4 items-center rounded-md justify-between gap-2">
                        <span className="font-medium">
                          {specMap[specId].specTitle}
                        </span>
                        <div>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              form.setValue(
                                "specifications",
                                selectedSpecIds.filter((id) => id !== specId),
                              );
                            }}
                          >
                            Löschen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-end">
              <div>
                <Button
                  onClick={(ev) => {
                    ev.preventDefault();
                    setActiveStepIndex(2);
                  }}
                  variant="primary"
                  type="submit"
                >
                  Weiter
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
