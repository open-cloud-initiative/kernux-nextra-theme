// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { FunctionComponent, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Answers, QuestionFS } from "../../../types/selfAssessment";
import { Checkbox, Button, Input } from "@open-cloud-initiative/kernux-react";

type implicationMap = {
  implication: string;
  id: string;
}[];

export const ImplicationGroup: FunctionComponent<{
  spec: QuestionFS["questions"][number];
  required?: boolean;
  maxLength?: number;
}> = (props) => {
  const form = useFormContext<Answers>();
  const implicationsMap: implicationMap = useMemo(
    () =>
      props.spec.specImplications.map((implication, i) => {
        return {
          implication: implication,
          id: props.spec.specId + "-" + i.toString(),
        };
      }),
    [props.spec.specImplications, props.spec.specId],
  );
  const questions = form.getValues("questions");

  const activeImplications = useMemo(
    () =>
      questions.find((q) => q.specId === props.spec.specId)?.specImplications,
    [questions, props.spec.specId],
  );

  const customImplications = useMemo(
    () =>
      questions.find((q) => q.specId === props.spec.specId)
        ?.customSpecImplications || [],
    [questions, props.spec.specId],
  );

  const handleImplicationToggle = (implication: string) => {
    // find the correct list in the subsections
    const values = form.getValues("questions");
    const currentSpecIndex = values.findIndex(
      (q) => q.specId === props.spec.specId,
    );

    // find the correct implication in the list
    const currentImplications = values[currentSpecIndex].specImplications;

    // check if the implication is already in the list
    const implicationIndex = currentImplications.findIndex(
      (imp) => imp === implication,
    );
    if (implicationIndex === -1) {
      // add the implication to the list
      values[currentSpecIndex].specImplications = [
        ...currentImplications,
        implication,
      ];

      // set the new values
      form.setValue("questions", values);
    } else {
      // remove the implication from the list
      values[currentSpecIndex].specImplications = currentImplications.filter(
        (imp) => imp !== implication,
      );

      // set the new values
      form.setValue("questions", values);
    }
  };

  const handleCustomImplicationBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    i: number,
  ) => {
    const value = e.target.value;
    // check if this is the last input
    if (i === customImplications.length) {
      if (value === "") {
        return;
      }

      // find the correct list in the subsections
      const values = form.getValues("questions");
      const currentSpecIndex = values.findIndex(
        (q) => q.specId === props.spec.specId,
      );

      // find the correct implication in the list
      const currentImplications =
        values[currentSpecIndex].customSpecImplications ?? [];

      // add the implication to the list
      values[currentSpecIndex].customSpecImplications = [
        ...currentImplications,
        value,
      ];

      // set the new values
      form.setValue("questions", values);
    } else {
      // find the correct list in the subsections
      const values = form.getValues("questions");
      const currentSpecIndex = values.findIndex(
        (q) => q.specId === props.spec.specId,
      );

      // find the correct implication in the list
      const currentImplications =
        values[currentSpecIndex].customSpecImplications ?? [];

      // add the implication to the list
      values[currentSpecIndex].customSpecImplications = currentImplications.map(
        (imp, index) => (index === i ? value : imp),
      );

      // set the new values
      form.setValue("questions", values);
    }
  };

  const handleCustomImplicationDelete = (i: number) => {
    // find the correct list in the subsections
    const values = form.getValues("questions");
    const currentSpecIndex = values.findIndex(
      (q) => q.specId === props.spec.specId,
    );

    // find the correct implication in the list
    const currentImplications =
      values[currentSpecIndex].customSpecImplications ?? [];

    // remove the implication from the list
    values[currentSpecIndex].customSpecImplications =
      currentImplications.filter((_, index) => index !== i);

    // set the new values
    form.setValue("questions", values);
  };

  return (
    <div className="space-y-lg">
      {implicationsMap.map(({ implication }, i) => {
        return (
          <div key={i} className="bg-background rounded-md">
            <Checkbox
              onClick={() => handleImplicationToggle(implication)}
              label={implication}
              checked={Boolean(
                activeImplications?.some(
                  (predicate) => predicate === implication,
                ),
              )}
            />
          </div>
        );
      })}
      <div className="bg-background rounded-md">
        <div className="space-y-4">
          {customImplications.concat("").map((implication, i) => {
            return (
              <div
                key={i + ":" + implication}
                className="flex flex-row items-end gap-sm"
              >
                <div className="flex-1">
                  <Input
                    label="Weitere Implikation"
                    onBlur={(e) => handleCustomImplicationBlur(e, i)}
                    placeholder="Ergänzen Sie weitere Implikationen"
                    name="specComments"
                    defaultValue={implication}
                  />
                </div>
                <div>
                  <Button
                    disabled={customImplications.length === i}
                    type="button"
                    icon="close"
                    onClick={() => handleCustomImplicationDelete(i)}
                    variant="secondary"
                    className="shrink-0"
                  />
                </div>
              </div>
            );
          })}
          <div className="flex flex-row justify-end">
            <div>
              <Button
                icon="add"
                onClick={() => {
                  const values = form.getValues("questions");
                  const currentSpecIndex = values.findIndex(
                    (q) => q.specId === props.spec.specId,
                  );

                  values[currentSpecIndex].customSpecImplications = [
                    ...customImplications,
                    "",
                  ];

                  form.setValue("questions", values);
                }}
                type="button"
                variant="secondary"
              >
                Implikation hinzufügen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
