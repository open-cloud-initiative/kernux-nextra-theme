// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { FunctionComponent, useState } from "react";
import { QuestionFS } from "../../../types/selfAssessment";
import { QuestionCmp } from "./question";
import { Button, H4 } from "@open-cloud-initiative/kernux-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";

export const QuestionGroup: FunctionComponent<{
  path: string;
  index: number;
  maxIndex: number;
  question: QuestionFS["questions"][number]["elements"][number];
}> = (props) => {
  const currentQuestion = props.question;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div key={currentQuestion.parentQuestion} className="rounded-md border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="p-6 flex flex-row justify-between w-full items-center gap-xl text-left">
          <H4>{currentQuestion.parentQuestion}</H4>
          <div>
            <Button
              variant="secondary"
              type="button"
              className="whitespace-nowrap shrink-0"
            >
              Beantworten
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 px-6 pb-6">
          {currentQuestion.subQuestions.map((q: any, i: number) => {
            return (
              <div className="p-4  bg-background rounded-md" key={q.question}>
                <QuestionCmp
                  path={props.path + ".subQuestions[" + i + "]"}
                  question={q}
                />
              </div>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
