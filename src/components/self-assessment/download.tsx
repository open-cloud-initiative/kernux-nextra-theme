// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { FunctionComponent, useState } from "react";
import { Answers, Questionnaire } from "../../types/selfAssessment";

import { Button } from "@open-cloud-initiative/kernux-react";
import { pdfGenerationSvc } from "../../svc/pdfGenerationSvc";
import { UseFormReturn } from "react-hook-form";
import { combineAnswers } from "../../utils/selfAssessmentHelper";

const SelfAssessmentDownload: FunctionComponent<{
  form: UseFormReturn<Answers, any, Answers>;
  questionFs: Questionnaire;
  apiEndpoint?: string;
}> = ({ form, questionFs }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);

    // calculate the result
    // get the specs and tell the amount of nulls, trues and falses
    const values = form.getValues();

    try {
      const pdfBlob = await pdfGenerationSvc.generatePDFViaAPI(
        values,
        combineAnswers(values, questionFs),
      );

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `self-assessment-report-${values.subject}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
      console.error("PDF generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleDownload}
        variant="primary"
        disabled={isGenerating}
      >
        {isGenerating ? "PDF wird erstellt..." : "PDF-Bericht herunterladen*"}
      </Button>
      {error && (
        <p className="text-sm text-red-600">
          Fehler beim Erstellen des PDFs: {error}
        </p>
      )}
    </div>
  );
};

export default SelfAssessmentDownload;
