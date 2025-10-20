// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {Answers, Questionnaire} from '../types/selfAssessment'
import jszip from 'jszip'
import yaml from 'js-yaml'

/**
 * Converts answer values to German text
 */
const answerToText = (answer: string | number | number[] | null): string => {
  if (answer === 'yes') return 'Ja'
  if (answer === 'no') return 'Nein'
  return 'Keine Antwort'
}

/**
 * PDF Generation Service
 * Handles markdown generation and PDF API integration for self-assessment reports
 */
export const pdfGenerationSvc = {
  /**
   * Fetches template files from the public folder
   */
  fetchTemplateFiles: async (baseUrl: string = '/pdf-template'): Promise<Record<string, Blob>> => {
    const templateFiles: Record<string, Blob> = {}

    try {
      // List of template files to fetch
      const filesToFetch = [
        'template.tex',
        'assets/background.png',
        'assets/letzte-seite-qr.png',
        'assets/fonts/BundesSerifOffice-Regular.ttf',
        'assets/fonts/BundesSerifOffice-Bold.ttf',
        'assets/fonts/BundesSerifOffice-Italic.ttf',
        'assets/fonts/BundesSerifOffice-BoldItalic.ttf',
      ]

      // Fetch all template files
      const fetchPromises = filesToFetch.map(async filePath => {
        try {
          const response = await fetch(`${baseUrl}/${filePath}`)
          if (response.ok) {
            const blob = await response.blob()
            templateFiles[filePath] = blob
          } else {
            console.warn(`Failed to fetch template file: ${filePath}`)
          }
        } catch (error) {
          console.warn(`Error fetching template file ${filePath}:`, error)
        }
      })

      await Promise.all(fetchPromises)
      return templateFiles
    } catch (error) {
      console.warn('Error fetching template files:', error)
      return {}
    }
  },
  /**
   * Generates markdown content for the self-assessment report
   */
  generateMarkdownContent: (
    values: Answers,

    answers: Questionnaire,
  ): string => {
    console.log(answers)
    const activeSpecs = (values.specifications || [])
      .map(specId => {
        return answers.questions.find(q => q.specId === specId)
      })
      .filter((e): e is Questionnaire['questions'][number] => Boolean(e))

    // Calculate statistics
    const totalQuestions = activeSpecs.reduce(
      (sum, spec) => sum + (spec?.elements.reduce((elemSum, elem) => elemSum + elem.subQuestions.length, 0) || 0),
      0,
    )

    console.log(activeSpecs)

    const answeredYes = activeSpecs.reduce(
      (sum, spec) =>
        sum +
        (spec?.elements.reduce(
          (elemSum, elem) => elemSum + elem.subQuestions.filter(sq => sq.answer === 'yes').length,
          0,
        ) || 0),
      0,
    )

    const answeredNo = activeSpecs.reduce(
      (sum, spec) =>
        sum +
        (spec?.elements.reduce(
          (elemSum, elem) => elemSum + elem.subQuestions.filter(sq => sq.answer === 'no').length,
          0,
        ) || 0),
      0,
    )

    const skipped = activeSpecs.reduce(
      (sum, spec) =>
        sum +
        (spec?.elements.reduce(
          (elemSum, elem) => elemSum + elem.subQuestions.filter(sq => sq.answer === 'skipped' || !sq.answer).length,
          0,
        ) || 0),
      0,
    )

    return `

# Architekturentscheidung ${values.subject}

> **Architekturentscheidungsprotokoll**  
> Version ${values.version} • ${new Date(values.date).toLocaleDateString()}


# Zusammenfassung der Bewertung

| Metrik | Wert | Anteil |
|--------|------|--------|
| **Gesamtfragen** | ${totalQuestions} | 100% |
| **Erfüllt** | ${answeredYes} | ${Math.round((answeredYes / totalQuestions) * 100)}% |
| **Nicht erfüllt** | ${answeredNo} | ${Math.round((answeredNo / totalQuestions) * 100)}% |
| **Übersprungen** | ${skipped} | ${Math.round((skipped / totalQuestions) * 100)}% |


# Projektinformationen

| Attribut | Wert |
|----------|------|
| **Name des Prüfobjekts/Projekts** | ${values.subject} |
| **Prüfversion** | ${values.version} |
| **Prüfdatum** | ${new Date(values.date).toLocaleDateString()} |
| **Ansprechperson** | ${values.contact} |
| **Rolle** | ${values.role} |
| **Prüfanwendungsfall** | ${values.useCase} |
| **Prüfkontext** | ${values.context} |



# Entscheidung im Prüfkontext

${values.examinationContext || '_Keine Angabe_'}


# Status der Architekturentscheidung

${values.statusArchitecturalDecision || '_Keine Angabe_'}


# Implikationen

${
  activeSpecs.length > 0
    ? activeSpecs
        .map(spec => {
          const standardImplications = [...(spec?.specImplications || [])].map(q => q.replace(/^\d+\./, '').trim())

          // Find the corresponding answer spec to get custom implications
          const answerSpec = values.questions?.find(q => q.specId === spec?.specId)
          const customImplications = answerSpec?.customSpecImplications || []

          // Combine standard and custom implications
          const allImplications = [...standardImplications, ...customImplications]

          return `## ${spec?.specTitle}

${
  allImplications.length > 0
    ? allImplications.map((impl, i) => `${i + 1}. ${impl}`).join('\n')
    : '_Keine Implikationen definiert_'
}`
        })
        .join('\n\n---\n\n')
    : '_Keine Spezifikationen ausgewählt_'
}

# Prüffragen und Antworten

${
  activeSpecs.length > 0
    ? activeSpecs
        .map(spec => {
          return `## ${spec?.specTitle} 
${spec.specId}

${spec.specPreview}

${spec?.elements
  .map(q => {
    return `### ${q.parentQuestion}

${q.subQuestions
  .map(sq => {
    return `\\begin{tcolorbox}[colback=white,colframe=gray!50!black,title={${sq.question}},fonttitle=\\bfseries\\color{black},sharp corners,toptitle=3mm,bottomtitle=3mm,colbacktitle=gray!10!white]

${answerToText(sq.answer)}${
      sq.message
        ? `

\\textit{${sq.message}}`
        : ''
    }

\\end{tcolorbox}`
  })
  .join('\n\n')}`
  })
  .join('\n\n')}`
        })
        .join('\n\n---\n\n')
    : '_Keine Spezifikationen ausgewählt_'
}


# Zusammenfassung

Diese Architekturentscheidung wurde am **${new Date(values.date).toLocaleDateString()}** für das Projekt **${values.subject}** (Version ${values.version}) durchgeführt.

**Key Findings:**
- **${totalQuestions}** Fragen wurden bewertet
- **${answeredYes}** Anforderungen sind erfüllt (${Math.round((answeredYes / totalQuestions) * 100)}%)
- **${answeredNo}** Anforderungen sind nicht erfüllt (${Math.round((answeredNo / totalQuestions) * 100)}%)
- **${skipped}** Fragen wurden übersprungen (${Math.round((skipped / totalQuestions) * 100)}%)


---

*Bericht generiert am ${new Date().toLocaleString('de-DE')} durch das Document Writing Tools System*`
  },

  /**
   * Creates a zip file with markdown and template folders
   * Returns the zip blob ready for upload
   */
  createReportZip: async (
    values: Answers,
    answers: Questionnaire,
    metadata: Record<string, any> = {},
    templateBaseUrl?: string,
  ): Promise<Blob> => {
    try {
      const markdownContent = pdfGenerationSvc.generateMarkdownContent(values, answers)
      const zip = jszip()

      // Create the folder structure
      const markdownFolder = zip.folder('markdown')
      const templateFolder = zip.folder('template')

      if (!markdownFolder || !templateFolder) {
        throw new Error('Failed to create zip folder structure')
      }

      templateFolder.file('metadata.yaml', yaml.dump(metadata))

      // Add the markdown content
      markdownFolder.file('report.md', markdownContent)

      // Fetch and add template files
      const templateFiles = await pdfGenerationSvc.fetchTemplateFiles(templateBaseUrl)

      // Add template files to the template folder
      for (const [filePath, blob] of Object.entries(templateFiles)) {
        templateFolder.file(filePath, blob)
      }

      // If no template files were fetched, add a placeholder
      if (Object.keys(templateFiles).length === 0) {
        templateFolder.file('.gitkeep', '')
        console.warn('No template files found, using placeholder')
      }

      // Generate the zip file
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {level: 6},
      })

      return zipBlob
    } catch (error) {
      console.error('Zip creation error:', error)
      throw new Error('Failed to create report zip file')
    }
  },

  /**
   * Uploads zip file to PDF generation API and returns PDF blob
   */
  uploadZipAndGeneratePDF: async (
    zipBlob: Blob,
    apiEndpoint: string = 'https://dwt-api.dev-l3montree.cloud/pdf',
  ): Promise<Blob> => {
    try {
      const formData = new FormData()
      formData.append('file', zipBlob, 'self-assessment-report.zip')

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`PDF generation failed (${response.status}): ${errorText}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/pdf')) {
        console.warn('Response is not a PDF, got:', contentType)
      }

      return response.blob()
    } catch (error) {
      console.error('PDF API upload error:', error)
      throw error
    }
  },

  /**
   * Complete workflow: Creates zip and uploads to API to generate PDF
   */
  generatePDFViaAPI: async (
    values: Answers,
    answers: Questionnaire,
    apiEndpoint?: string,
    templateBaseUrl?: string,
  ): Promise<Blob> => {
    try {
      // create the metadata
      const metadata = {
        metadata_vars: {
          document_title: values.subject,
          version: values.version,
          primary_color: '36, 60, 164', // rgb
        },
      }

      const zipBlob = await pdfGenerationSvc.createReportZip(values, answers, metadata, templateBaseUrl)

      return await pdfGenerationSvc.uploadZipAndGeneratePDF(zipBlob, apiEndpoint)
    } catch (error) {
      console.error('PDF generation workflow error:', error)
      throw error
    }
  },
}
