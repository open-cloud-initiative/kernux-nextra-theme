// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { Answers, DecisionEnum, QuestionFS } from "@/types/selfAssessment";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { Button, Textarea } from "@open-cloud-initiative/kernux-react";
import { Select } from "@open-cloud-initiative/kernux-react";
import ResultChart from "./elements/result-chart";

export interface SelfAssessmentRestrictionProps {
  form: UseFormReturn<Answers, any, Answers>;
  setActiveStepIndex: (index: number) => void;
  specs: {
    specTitle: string;
    specId: string;
    specPreview: string;
  }[];
  questionFs: QuestionFS;
}

export default function SelfAssessmentResult({
  form,
  questionFs,
  specs,
  setActiveStepIndex,
}: SelfAssessmentRestrictionProps) {
  return (
    <div className="w-full flex-1">
      <div>
        <ResultChart form={form} questionFs={questionFs} specs={specs} />
        <FormProvider {...form}>
          <form>
            <div className="grid grid-cols-6 gap-xl mt-8">
              <div className="col-span-6">
                <Textarea
                  label="Entscheidung im Prüfkontext"
                  placeholder="Bitte geben Sie hier die Entscheidung der Prüfung an (Votum). Die Entscheidung kann aus maximal 500 Zeichen bestehen."
                  {...form.register("examinationContext", { required: true })}
                  errorMessage={
                    form.formState.errors["examinationContext"]?.message
                  }
                />
              </div>

              <div className="col-span-6">
                <Select
                  label="Status der Architekturentscheidung"
                  placeholder="Antwort auswählen"
                  options={Object.values(DecisionEnum).map((value) => ({
                    value,
                    label: value,
                  }))}
                  {...form.register("statusArchitecturalDecision", {
                    required: true,
                  })}
                  errorMessage={
                    form.formState.errors["statusArchitecturalDecision"]
                      ?.message
                  }
                />
              </div>
            </div>

            <div className="mt-8 flex flex-row justify-end">
              <div>
                <Button
                  onClick={(ev) => {
                    ev.preventDefault();
                    setActiveStepIndex(5);
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
