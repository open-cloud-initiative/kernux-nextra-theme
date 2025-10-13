// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { Answers, QuestionFS } from "@/types/selfAssessment";
import { useMemo, useState } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import Markdown from "react-markdown";
import { Button, H3, P } from "@open-cloud-initiative/kernux-react";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../ui/sidebar";
import { ImplicationGroup } from "./elements/implication-group";
import clsx from "clsx";

export interface SelfAssessmentImplicationsProps {
  setActiveStepIndex: (index: number) => void;
  form: UseFormReturn<Answers, any, Answers>;
  questionFs: QuestionFS;
  handleDownload: (data: Answers) => void;
}

export default function SelfAssessmentImplications({
  form,
  questionFs,
  setActiveStepIndex,
}: SelfAssessmentImplicationsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const specs = form.watch("specifications", []) as string[];

  const selectedSpecs = useMemo(() => {
    return (specs || [])
      .map((specId) => {
        return questionFs.questions.find((q) => q.specId === specId);
      })
      .filter((e): e is QuestionFS["questions"][number] => Boolean(e));
  }, [specs, questionFs.questions]);

  // build a spec map
  const specMap = useMemo(() => {
    return questionFs.questions.reduce(
      (acc, q) => {
        acc[q.specId] = {
          title: q.specTitle,
          preview: q.specPreview,
        };
        return acc;
      },
      {} as Record<
        string,
        {
          title: string;
          preview: string;
        }
      >,
    );
  }, [questionFs.questions]);

  return (
    <SidebarProvider className="w-full">
      <div className="flex w-full flex-row">
        <Sidebar className="rounded-lg" collapsible="none">
          <SidebarContent className="-m-6 p-2 lg:m-0">
            <SidebarMenu>
              {specs.map((specId, i) => (
                <SidebarMenuItem key={specMap[specId]?.title || specId}>
                  <SidebarMenuButton
                    className={clsx({
                      "bg-kern-action-state-indicator-tint-active":
                        i === activeIndex,
                    })}
                    onClick={() => setActiveIndex(i)}
                  >
                    <span>{specMap[specId]?.title || specId}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="w-full flex-1 pl-xl">
            <div>
              {specs.length > 0 && specMap[specs[activeIndex]] ? (
                <FormProvider {...form}>
                  <form>
                    <H3>{specMap[specs[activeIndex]].title}</H3>
                    <P>ID: {specs[activeIndex]}</P>
                    <div className="mb-8">
                      <Markdown>{specMap[specs[activeIndex]].preview}</Markdown>
                    </div>
                    <div className="flex flex-col gap-6">
                      {selectedSpecs
                        .filter((spec) => spec.specId === specs[activeIndex])
                        .map((spec) => (
                          <ImplicationGroup key={spec.specId} spec={spec} />
                        ))}
                    </div>
                    <div className="mt-8 flex flex-row justify-end">
                      <div>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            if (activeIndex === specs.length - 1) {
                              setActiveStepIndex(6);
                              return;
                            }
                            // go to the next category
                            setActiveIndex((prev) => prev + 1);
                            return;
                          }}
                          variant={"primary"}
                          type="submit"
                        >
                          {activeIndex === specs.length - 1
                            ? "Fertigstellen"
                            : "Zur nächsten Vorgabe"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              ) : (
                <div>
                  <H3>Sie haben keine Eingrenzung auf Vorgaben vorgenommen</H3>
                  <P>
                    Bitte wählen Sie mindestens eine Vorgabe im Schritt
                    Eingrenzung aus.
                  </P>
                  <div className="mt-8">
                    <Button
                      onClick={() => {
                        window.location.href = "/self-assessment?step=1";
                      }}
                      variant="secondary"
                    >
                      Zur Eingrenzung
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
