// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {useFormContext} from 'react-hook-form'
import {QuestionType, QuestionWithoutAnswer} from '../../../types/selfAssessment'
import {Textarea, RadioGroup} from '@open-cloud-initiative/kernux-react'

interface QuestionProps {
  question: QuestionWithoutAnswer
  path: string
}

export const QuestionCmp = ({question: q, path}: QuestionProps) => {
  const {register, getValues, setValue} = useFormContext()

  const selectedAnswer = getValues(`${path}.answer`)

  const radioOptions = [
    {value: 'yes', label: 'Ja'},
    {value: 'no', label: 'Nein'},
    {value: 'open', label: 'Offen'},
    {value: 'skipped', label: 'Keine Antwort'},
  ]

  switch (q.type) {
    case QuestionType.YesNo:
    default:
      return (
        <>
          <div>
            <RadioGroup
              label={q.question}
              name={`${path}.answer`}
              options={radioOptions}
              value={selectedAnswer}
              onChange={value => setValue(`${path}.answer`, value)}
            />

            <div className="mt-4">
              {selectedAnswer === 'yes' && (
                <div className="flex flex-col gap-4">
                  <Textarea label="In welcher Form?" {...register(`${path}.message`)} />
                </div>
              )}
              {selectedAnswer === 'no' && (
                <div className="flex flex-col gap-4">
                  <Textarea label="Wie wird dies begründet?" {...register(`${path}.message`)} />
                </div>
              )}
              {selectedAnswer === 'open' && (
                <div className="flex flex-col gap-4">
                  <Textarea label="Welche offenen Punkte bestehen?" {...register(`${path}.message`)} />
                </div>
              )}
            </div>
          </div>
        </>
      )
  }
}
