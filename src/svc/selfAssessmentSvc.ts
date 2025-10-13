// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { Questionnaire } from "../types/selfAssessment";

export const selfAssessmentSvc = {
  prepareQuestionnaire: (questionnaire: Questionnaire): Questionnaire => {
    // order the questions by order index.
    questionnaire.questions.sort((a, b) => a.order - b.order);
    // order the parent questions by order index.
    questionnaire.questions.forEach((category) => {
      category.elements.sort((a, b) => a.order - b.order);
    });

    return questionnaire;
  },
};
