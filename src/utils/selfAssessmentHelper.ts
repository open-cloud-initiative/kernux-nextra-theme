// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { Answers, QuestionFS, Questionnaire } from "../types/selfAssessment";

export const combineAnswers = (
  data: Answers,
  questionnaire: QuestionFS,
): Questionnaire => {
  return {
    ...data,
    questions: questionnaire.questions.map((q, i) => {
      return {
        ...q,
        elements: q.elements.map((e, j) => {
          return {
            ...e,
            subQuestions: e.subQuestions.map((sq, k) => {
              // if the user did not view all of the questions, those answers are never pushed to the array.
              // the data is not complete and contains undefined values and we need to handle this case
              if (
                !data.questions ||
                data.questions[i] === null ||
                data.questions[i] === undefined
              ) {
                return {
                  ...sq,
                  answer: null,
                  message: "",
                };
              }

              return {
                ...sq,
                answer: data.questions[i].elements[j]?.subQuestions[k]?.answer,
                message:
                  data.questions[i].elements[j]?.subQuestions[k]?.message,
              } as any;
            }),
          };
        }),
      };
    }),
  };
};
