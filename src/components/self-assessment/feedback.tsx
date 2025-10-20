// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {Answers, Feedback, QuestionFS} from '@/types/selfAssessment'
import {UseFormReturn} from 'react-hook-form'

import {Button} from '@open-cloud-initiative/kernux-react'
import SelfAssessmentDownload from './download'

export interface SelfAssessmentFeedback {
  form: UseFormReturn<Answers, any, Answers>
  feedbackForm: UseFormReturn<Feedback, any, Feedback>
  handleDownload: (data: Answers) => void
  questionFs: QuestionFS
}

export default function SelfAssessmentFeedback({handleDownload, form, questionFs}: SelfAssessmentFeedback) {
  return (
    <div className="w-full">
      <div>
        <div className="border rounded-md p-6">
          <p>
            Nutzen Sie die Button um das Ergebnis das Self-Assessment in einem maschinenlesbaren Format (JSON) oder als
            PDF-Daten herunterzuladen.
          </p>
          <div className="flex flex-row gap-2 justify-end mt-2">
            <Button variant="secondary" onClick={form.handleSubmit(handleDownload)}>
              Exportieren
            </Button>
            <SelfAssessmentDownload questionFs={questionFs} form={form} />
          </div>
        </div>

        {/*<h3>Feedback</h3>
        <FormProvider {...form}>
          <form>
            <div className="grid grid-cols-1 gap-10">
              <div className="grid grid-cols-3 gap-5 border p-4">
                <span className="col-span-3 inline-block w-full text-lg font-medium">
                  Bewerten Sie bitte die Konfiguration der Prüfung
                  (&quot;Kopfdaten&quot;, &quot;Eingrenzung&quot;,
                  &quot;Manuelle Auswahl&quot;):
                </span>
                <div className="col-span-3 border p-4 shadow-sm">
                  <small className="block">
                    Bitte wählen Sie eine der folgenden Antworten:
                  </small>
                  <div className="mt-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full truncate" variant={'outline'}>
                          {feedbackForm.watch('mainDataFeedback') ||
                            'Antwort auswählen'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {Object.values(FeedbackEnum).map((mainDataFeedback) => (
                          <DropdownMenuItem
                            onClick={() =>
                              feedbackForm.setValue(
                                'mainDataFeedback',
                                mainDataFeedback,
                              )
                            }
                            className={
                              selectedMainDataFeedback === mainDataFeedback
                                ? 'bg-secondary text-white'
                                : 'hover:bg-hellgrau-20'
                            }
                            key={mainDataFeedback}
                          >
                            {mainDataFeedback}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="col-span-3 border p-4 shadow-sm">
                  <span className="inline-block w-full text-lg font-medium">
                    Hier können Sie Feedback, Anregungen und Hinweise zur
                    Struktur und den Mehrwert der Kopfdaten des Self-Assessments
                    geben.
                  </span>
                  <small className="block">
                    Bitte geben Sie Ihre Antwort hier ein:
                  </small>
                  <div className="mt-4">
                    <Textarea
                      {...feedbackForm.register('mainDataSuggestions', {
                        maxLength: 500,
                      })}
                      required
                      className="min-h-36"
                    />
                  </div>
                  <small className="text-muted-foreground block">
                    Das Feedback kann aus maximal 500 Zeichen bestehen.
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5 border p-4">
                <span className="col-span-3 inline-block w-full text-lg font-medium">
                  Bewerten Sie bitte die Durchführung der Prüfung
                  (&quot;Prüffragen&quot;, &quot;Prüfergebnis&quot;);
                </span>
                <div className="col-span-3 border p-4 shadow-sm">
                  <small className="block">
                    Bitte wählen Sie eine der folgenden Antworten:
                  </small>
                  <div className="mt-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full truncate" variant={'outline'}>
                          {feedbackForm.watch('resultsFeedback') ||
                            'Antwort auswählen'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {Object.values(FeedbackEnum).map((resultsFeedback) => (
                          <DropdownMenuItem
                            onClick={() =>
                              feedbackForm.setValue(
                                'resultsFeedback',
                                resultsFeedback,
                              )
                            }
                            className={
                              selectedResultsFeedback === resultsFeedback
                                ? 'bg-secondary text-white'
                                : 'hover:bg-hellgrau-20'
                            }
                            key={resultsFeedback}
                          >
                            {resultsFeedback}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="col-span-3 border p-4 shadow-sm">
                  <span className="inline-block w-full text-lg font-medium">
                    Hier können Sie Feedback, Anregungen und Hinweise zur
                    Struktur und den Mehrwert der Entscheidung im
                    Self-Assessments geben.
                  </span>
                  <small className="block">
                    Bitte geben Sie Ihre Antwort hier ein:
                  </small>
                  <div className="mt-4">
                    <Textarea
                      {...feedbackForm.register('resultsSuggestions', {
                        maxLength: 500,
                      })}
                      required
                      className="min-h-36"
                    />
                  </div>
                  <small className="text-muted-foreground block">
                    Das Feedback kann aus maximal 500 Zeichen bestehen.
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5 border p-4">
                <span className="col-span-3 inline-block w-full text-lg font-medium">
                  Bewerten Sie bitte allgemein das Self-Assessment
                </span>

                <div className="col-span-3 border p-4 shadow-sm">
                  <span className="inline-block w-full text-lg font-medium">
                    Hier können Sie Feedback, Anregungen und Hinweise zur
                    Struktur und den Mehrwert der Implikationen des
                    Self-Assessments geben.
                  </span>
                  <small className="block">
                    Bitte geben Sie Ihre Antwort hier ein:
                  </small>
                  <div className="mt-4">
                    <Textarea
                      {...feedbackForm.register('generalSuggestions', {
                        maxLength: 500,
                      })}
                      required
                      className="min-h-36"
                    />
                  </div>
                  <small className="text-muted-foreground block">
                    Das Feedback kann aus maximal 500 Zeichen bestehen.
                  </small>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-end">
              <Button onClick={feedbackForm.handleSubmit(handleFeedback)}>
                Feedback abschicken
              </Button>
            </div>
          </form>
        </FormProvider>*/}
      </div>
    </div>
  )
}
