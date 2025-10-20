// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {combineAnswers} from '@/utils/selfAssessmentHelper'
import {debounce} from 'lodash'
import {useRouter} from 'next/router'
import {useEffect, useMemo} from 'react'
import {useForm} from 'react-hook-form'
import {Answers, Feedback, QuestionFS} from '../../types/selfAssessment'

import clsx from 'clsx'
import SelfAssessmentAuditQuestions from './audit-questions'
import SelfAssessmentFeedback from './feedback'
import SelfAssessmentImplications from './implications'
import SelfAssessmentMainData from './main-data'
import SelfAssessmentManualSelection from './manual-selection'
import SelfAssessmentRestriction from './restriction'
import SelfAssessmentResult from './result'

import {Button, H2} from '@open-cloud-initiative/kernux-react'

const steps = [
  'Kopfdaten',
  'Eingrenzung',
  'Manuelle Auswahl',
  'Prüffragen',
  'Prüfergebnis',
  'Implikationen',
  'Abschluss',
]

// debounce to only save after the user stopped typing
const saveInLocalStorage = debounce((data: Answers) => {
  localStorage.setItem('self-assessment', JSON.stringify(data))
}, 500)

export const SelfAssessment = (props: {questionnaire: QuestionFS}) => {
  const feedbackForm = useForm<Feedback>({
    defaultValues: {
      mainDataFeedback: undefined,
      mainDataSuggestions: '',
      resultsFeedback: undefined,
      resultsSuggestions: '',
      implementationFeedback: undefined,
      implementationSuggestions: '',
      generalSuggestions: '',
    },
  })

  const form = useForm<Answers>({
    mode: 'onBlur',
    defaultValues: {
      date: new Date(),
      questions: props.questionnaire.questions.map(q => ({
        title: q.title,
        specTitle: q.specTitle,
        specId: q.specId,
        specPreview: q.specPreview,
        specImplications: [],
        order: q.order,
        elements: q.elements.map(e => ({
          parentQuestion: e.parentQuestion,
          subQuestions: e.subQuestions.map(sq => ({
            message: '',
            answer: 'skipped',
            question: sq.question,
          })),
        })),
      })),
    },
  })

  const router = useRouter()

  const values = form.watch()
  // persist in local storage for page reload
  useEffect(() => {
    if (values) {
      saveInLocalStorage(values)
    }
  }, [values])

  // read the data from local storage
  useEffect(() => {
    const data = localStorage.getItem('self-assessment')
    if (data) {
      form.reset(JSON.parse(data))
    }
  }, [])

  const handleDownload = (data: Answers) => {
    // combine the data and the questionnaire
    const combined = combineAnswers(data, props.questionnaire)
    // download
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(combined)], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = 'self-assessment.json'
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
    // clear the form and the local storage
    form.reset()
    localStorage.removeItem('self-assessment')
  }

  const setActiveStepIndex = (index: number) => {
    router.push({
      query: {
        step: index.toString(),
      },
    })
  }

  const specs = useMemo(() => {
    return props.questionnaire.questions.map(q => ({
      specTitle: q.specTitle,
      specId: q.specId,
      specPreview: q.specPreview,
    }))
  }, [props])

  const activeStepIndex = +(router.query.step ?? '0')

  return (
    <div className="w-full container">
      <div className="flex flex-row items-center justify-between">
        <H2>Self-Assessment (Beta)</H2>
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-2">
            <Button className="relative" variant={'secondary'}>
              <input
                onChange={ev => {
                  if (!ev.target.files || ev.target.files.length === 0) {
                    return
                  }

                  // read the file
                  const reader = new FileReader()
                  reader.onload = e => {
                    const content = e.target?.result as string
                    const data = JSON.parse(content)

                    form.reset(data)

                    // clear the input
                    const input = ev.target as HTMLInputElement
                    if (input) {
                      input.value = ''
                    }
                  }

                  reader.readAsText(ev.target.files[0])
                }}
                className="absolute bottom-0 left-0 right-0 top-0 h-full cursor-pointer opacity-0"
                type="file"
              ></input>
              Arbeitsstand importieren
            </Button>
            <Button onClick={form.handleSubmit(handleDownload)} variant={'secondary'}>
              Arbeitsstand speichern
            </Button>
          </div>
        </div>
      </div>
      <div className="relative -mx-4 mb-xl mt-4 flex flex-row justify-between">
        <div className="absolute top-1/2 w-full border-t" />
        {steps.map((step, i) => (
          <button
            key={step}
            onClick={() =>
              router.push({
                query: {
                  step: i.toString(),
                },
              })
            }
          >
            <div
              className={clsx(
                'relative flex flex-row items-center gap-2 bg-background px-4 text-sm font-medium',
                i === activeStepIndex ? 'text-bund' : 'text-dunkelgrau-100',
              )}
            >
              <div
                className={clsx(
                  'flex h-7 w-7 flex-row items-center justify-center rounded-md',
                  i === activeStepIndex
                    ? 'bg-kern-action-default text-kern-action-on-default'
                    : 'bg-kern-action-state-indicator-tint-hover',
                )}
              >
                {i + 1}
              </div>{' '}
              <span>{step}</span>
            </div>
          </button>
        ))}
      </div>

      {activeStepIndex === 0 ? (
        <SelfAssessmentMainData form={form} setActiveStepIndex={setActiveStepIndex} />
      ) : activeStepIndex === 1 ? (
        <SelfAssessmentRestriction form={form} specs={specs} setActiveStepIndex={setActiveStepIndex} />
      ) : activeStepIndex === 2 ? (
        <SelfAssessmentManualSelection setActiveStepIndex={setActiveStepIndex} />
      ) : activeStepIndex === 3 ? (
        <SelfAssessmentAuditQuestions
          form={form}
          questionFs={props.questionnaire}
          setActiveStepIndex={setActiveStepIndex}
        />
      ) : activeStepIndex === 4 ? (
        <SelfAssessmentResult
          setActiveStepIndex={setActiveStepIndex}
          questionFs={props.questionnaire}
          form={form}
          specs={specs}
        />
      ) : activeStepIndex === 5 ? (
        <SelfAssessmentImplications
          setActiveStepIndex={setActiveStepIndex}
          form={form}
          questionFs={props.questionnaire}
          handleDownload={() => {}}
        />
      ) : (
        <SelfAssessmentFeedback
          questionFs={props.questionnaire}
          handleDownload={handleDownload}
          form={form}
          feedbackForm={feedbackForm}
        />
      )}
    </div>
  )
}
