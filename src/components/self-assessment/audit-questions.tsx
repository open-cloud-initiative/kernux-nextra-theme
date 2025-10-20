// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {Answers, QuestionFS} from '@/types/selfAssessment'
import clsx from 'clsx'
import {useMemo, useState} from 'react'
import {FormProvider, UseFormReturn} from 'react-hook-form'
import Markdown from 'react-markdown'

import {Button, H3, P} from '@open-cloud-initiative/kernux-react'
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '../ui/sidebar'
import {QuestionGroup} from './elements/question-group'

interface SAAuditQuestionsProps {
  questionFs: QuestionFS
  form: UseFormReturn<Answers, any, Answers>
  setActiveStepIndex: (index: number) => void
}

export default function SelfAssessmentAuditQuestions({form, setActiveStepIndex, questionFs}: SAAuditQuestionsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const specs = form.watch('specifications', []) as string[]
  const [realIndex, activeQuestions] = useMemo(() => {
    // get the active questions
    if (specs.length === 0) {
      return [
        0,
        {
          elements: [],
        },
      ]
    }

    // find the active questions and determine the real index inside the questions array
    for (let i = 0; i < questionFs.questions.length; i++) {
      if (specs[activeIndex] === questionFs.questions[i].specId) {
        return [i, questionFs.questions[i]]
      }
    }
    return [
      0,
      {
        elements: [],
      },
    ]
  }, [specs, questionFs.questions, activeIndex])

  // build a spec map
  const specMap = useMemo(() => {
    return questionFs.questions.reduce(
      (acc, q) => {
        acc[q.specId] = {
          title: q.specTitle,
          preview: q.specPreview,
        }
        return acc
      },
      {} as Record<
        string,
        {
          title: string
          preview: string
        }
      >,
    )
  }, [questionFs.questions])

  return (
    <SidebarProvider className="w-full">
      <div className="flex w-full flex-row">
        <Sidebar className="rounded-lg" collapsible="none">
          <SidebarContent className="-m-6 p-2 lg:m-0">
            <SidebarMenu>
              {form.watch('specifications', [])?.map((q, i) => (
                <SidebarMenuItem key={specMap[q].title}>
                  <SidebarMenuButton
                    className={clsx({
                      'bg-kern-action-state-indicator-tint-active': i === activeIndex,
                    })}
                    onClick={() => setActiveIndex(i)}
                  >
                    <span>{specMap[q].title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="w-full flex-1 pl-xl">
            <div>
              {specMap[specs[activeIndex]] ? (
                <FormProvider {...form}>
                  <form>
                    <H3>{specMap[specs[activeIndex]].title}</H3>
                    <P>ID: {specs[activeIndex]}</P>
                    <div className="mb-8">
                      <Markdown>{specMap[specs[activeIndex]].preview}</Markdown>
                    </div>
                    <div className="flex flex-col gap-6">
                      {activeQuestions.elements.map((activeQuestion, i) => (
                        <QuestionGroup
                          maxIndex={activeQuestions.elements.length - 1}
                          path={`questions[${realIndex}].elements[${i}]`}
                          index={i}
                          question={activeQuestion}
                          key={activeQuestion.parentQuestion}
                        />
                      ))}
                    </div>
                    <div className="mt-8 flex flex-row justify-end">
                      <div>
                        <Button
                          onClick={ev => {
                            ev.preventDefault()
                            if (activeIndex === specs.length - 1) {
                              setActiveStepIndex(4)
                              return
                            }
                            // go to the next category
                            setActiveIndex(prev => prev + 1)
                            return
                          }}
                          variant={'primary'}
                          type="submit"
                        >
                          {activeIndex === specs.length - 1 ? 'Fertigstellen' : 'Zur nächsten Vorgabe'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              ) : (
                <div>
                  <H3>Sie haben keine Eingrenzung auf Vorgaben vorgenommen</H3>
                  <P>Bitte wählen Sie mindestens eine Vorgabe im Schritt Eingrenzung aus.</P>
                  <div className="mt-8">
                    <Button
                      onClick={() => {
                        window.location.href = '/self-assessment?step=1'
                      }}
                      variant="secondary"
                    >
                      Zur Eingrenzung
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
