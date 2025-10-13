// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

export enum QuestionType {
  YesNo = "YesNo",
  FreeText = "FreeText",
  MultipleChoice = "MultipleChoice",
  Radio = "Radio",
}

export enum RoleEnum {
  Architect = "Architekturschaffende",
  DecisionMaker = "Entscheidungstragende",
  Contract = "Auftraggebende und Auftragnehmende",
  Procurement = "Beschaffungsstellen",
  Consulting = "Beratungsstellen und Kompetenzzentren",
  Project = "Projekt- und Programmverantwortliche",
  Planning = "Planende und Controllende",
  Service = "Service und Produkt Management",
  ServiceProviders = "Dienstleistende inklusive Entwicklung und Betrieb",
  Suppliers = "Liefernde, Anbietende und Herstellende",
}

export enum useCaseEnum {
  adc = "Architekturentscheidung (Architecture Decision Record)",
}

export enum DecisionEnum {
  Suggested = "vorgeschlagen",
  Accepted = "akzeptiert",
  Discarded = "verworfen",
  Obsoleted = "veraltet",
  Replaced = "ersetzt",
  Rejected = "abgelehnt",
}

export enum FeedbackEnum {
  needsMoreExplanation = "es braucht mehr Erkärung und Hinweise",
  needsMoreFields = "es braucht mehr Datenfelder",
  fitsAsIs = "es passt so wie es ist",
  tooMuchInformation = "viel zu viel Information",
  needsOtherStructure = "es braucht andere Information und Struktur",
  fieldsNotUnderstandable = "die Felder und Hinweise sind nicht verständlich",
}

export interface MainData {
  subject: string; // one line
  version: string; // one line
  date: Date;
  context: string; // multi line
  contact: string; // one line
  role: RoleEnum;

  useCase: string; // radio
}

export interface Result {
  examinationContext: string; // multi line
  statusArchitecturalDecision: DecisionEnum;
}

export interface Feedback {
  mainDataFeedback: FeedbackEnum;
  mainDataSuggestions: string; // multi line

  resultsFeedback: FeedbackEnum;
  resultsSuggestions: string; // multi line

  implementationFeedback: FeedbackEnum;
  implementationSuggestions: string; // multi line

  generalSuggestions: string; // multi line
}

export interface Restriction {
  specifications?: string[];
  topic: string;
  case: string;
}

export type Question =
  | {
      question: string;
      message: string;
      type: QuestionType.YesNo;
      answer: "yes" | "no" | "skipped" | null; // it is possible to not answer - skipped is different that not answered at all.
    }
  | {
      question: string;
      message: string;
      type: QuestionType.FreeText;
      answer: string | null;
    }
  | {
      question: string;
      message: string;
      type: QuestionType.MultipleChoice;
      answer: number[] | null; // indices of the answer in the options array - answer will be null, if the user does not answer
      options: string[];
    }
  | {
      question: string;
      message: string;
      type: QuestionType.Radio;
      answer: number | null; // index of the answer in the options array
      options: string[]; // the options to choose from
    };

export type QuestionWithoutAnswer = Omit<Question, "answer" | "message">;

export interface Questionnaire {
  questions: Array<{
    title: string;
    specTitle: string;
    specId: string;
    specPreview: string;
    order: number;
    specImplications: string[];
    elements: Array<{
      order: number;
      parentQuestion: string;
      subQuestions: Array<Question>;
    }>;
  }>;
}

export interface Answers extends Restriction, MainData, Result {
  questions: Array<{
    title: string;
    specTitle: string;
    specId: string;
    specPreview: string;
    specImplications: string[];
    customSpecImplications?: string[];
    order: number;
    elements: Array<{
      parentQuestion: string;
      subQuestions: Array<{
        message: string | null;
        answer: any;
        question: string;
        type: QuestionType;
      }>;
    }>;
  }>;
}
// json format for the questionnaire
// pretty much the same of the questionnaire interface
// it just differs, that all answers are set to null
export interface QuestionFS {
  questions: Array<{
    title: string;
    specTitle: string;
    specId: string;
    specPreview: string;
    specImplications: string[];
    order: number;
    elements: Array<{
      order: number;
      parentQuestion: string;
      subQuestions: Array<QuestionWithoutAnswer>;
    }>;
  }>;
}
