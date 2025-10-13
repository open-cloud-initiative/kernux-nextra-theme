// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { Answers, RoleEnum, useCaseEnum } from "@/types/selfAssessment";
import { FormProvider, UseFormReturn } from "react-hook-form";

import {
  DatePicker,
  Select,
  Button,
  Input,
  Textarea,
} from "@open-cloud-initiative/kernux-react";

interface SAAuditQuestionsProps {
  form: UseFormReturn<Answers, any, Answers>;
  setActiveStepIndex: (index: number) => void;
}

export default function SelfAssessmentMainData({
  form,
  setActiveStepIndex,
}: SAAuditQuestionsProps) {
  const requiredFieldsAnswered =
    form.watch("subject") &&
    form.watch("version") &&
    form.watch("date") &&
    form.watch("contact") &&
    form.watch("role") &&
    form.watch("useCase") &&
    form.watch("context");

  return (
    <div className="w-full flex-1">
      <div>
        <FormProvider {...form}>
          <form>
            <div className="grid grid-cols-6 gap-xl">
              <div className="col-span-3">
                <Input
                  label="Name des Prüfobjekts/Projekts"
                  errorMessage={form.formState.errors["subject"]?.message}
                  placeholder="Name des Prüfobjektes"
                  required
                  {...form.register("subject", {
                    required: "Das Prüfobjekt ist ein Pflichtfeld.",
                  })}
                />
              </div>
              <div className="col-span-3">
                <Input
                  label="Prüfversion"
                  errorMessage={form.formState.errors["version"]?.message}
                  placeholder="1.0.0"
                  required
                  {...form.register("version", {
                    required: "Die Prüfversion ist ein Pflichtfeld.",
                  })}
                />
              </div>
              <div className="col-span-3">
                <Input
                  label="Ansprechperson"
                  required
                  placeholder="Maria Musterfrau"
                  errorMessage={form.formState.errors["contact"]?.message}
                  {...form.register("contact", {
                    required: "Die Ansprechperson ist ein Pflichtfeld.",
                  })}
                />
              </div>
              <div className="col-span-3">
                <DatePicker
                  onChange={(date) => {
                    form.setValue("date", date as Date);
                  }}
                  value={form.watch("date") as Date}
                  label="Prüfdatum"
                  hint="Bitte geben Sie hier das Datum der Prüfung ein."
                />
              </div>
              <div className="col-span-3">
                <Select
                  label="Rolle"
                  errorMessage={form.formState.errors["role"]?.message}
                  placeholder="Rolle auswählen"
                  hint='Bitte geben Sie hier Ihre Rolle in der Prüfung an. Die Rollen
                  ergeben sich aus dem Abschnitt "Zielgruppe" der
                  aktuellen Architekturrichtlinie.'
                  required
                  options={Object.values(RoleEnum).map((role) => ({
                    value: role,
                    label: role,
                  }))}
                  {...form.register("role", {
                    required: "Die Rolle ist ein Pflichtfeld.",
                  })}
                />
              </div>

              <div className="col-span-3">
                <Select
                  label="Prüfanwendungsfall"
                  errorMessage={form.formState.errors["useCase"]?.message}
                  {...form.register("useCase", {
                    required: "Der Anwendungsfall ist ein Pflichtfeld.",
                  })}
                  placeholder="Prüfanwendungsfall auswählen"
                  hint="Bitte wählen Sie den Anwendungsfall für das Self-Assessment
                  aus. Das finale Self-Assessment wird weitere Anwendungfälle
                  beinhalten."
                  required
                  options={Object.values(useCaseEnum).map((useCase) => ({
                    value: useCase,
                    label: useCase,
                  }))}
                />
              </div>

              <div className="col-span-6">
                <Textarea
                  label="Prüfkontext"
                  required
                  hint="Bitte geben Sie hier den Kontext der Prüfung an. Der Kontext kann aus maximal 500 Zeichen bestehen."
                  errorMessage={form.formState.errors["context"]?.message}
                  {...form.register("context", {
                    required: "Der Kontext ist ein Pflichtfeld.",
                    maxLength: {
                      value: 500,
                      message:
                        "Der Kontext darf maximal 500 Zeichen lang sein.",
                    },
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-end">
              <div>
                <Button
                  onClick={(ev) => {
                    ev.preventDefault();
                    setActiveStepIndex(1);
                  }}
                  variant="primary"
                  disabled={!requiredFieldsAnswered}
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
