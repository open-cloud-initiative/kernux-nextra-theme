// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {KernuxThemeConfig} from '../schemas'
import {Button, H4, Input, P, Textarea} from '@open-cloud-initiative/kernux-react'
import {sendFeedback} from '../svc/feedback'

type FormData = {
  description: string
  email?: string
}

type FeedbackState = {
  error: boolean
  loading: boolean
  webUrl: string | null
}

export const Feedback = (props: NonNullable<KernuxThemeConfig['feedback']>) => {
  const [formData, setFormData] = useState<FormData>({
    description: '',
    email: '',
  })
  const [requestState, setRequestState] = useState<FeedbackState>({
    error: false,
    loading: false,
    webUrl: null,
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {description, email} = formData

    if (!description) {
      return
    }

    setRequestState(prev => ({...prev, loading: true}))

    try {
      const response = await sendFeedback(props.feedbackServerUrl, props.gitlabProjectId, [], description, email)
      setRequestState(prev => ({
        ...prev,
        webUrl: response.issueUrl,
        loading: false,
      }))
    } catch (error) {
      console.error('Failed to send feedback', error)
      setRequestState(prev => ({
        ...prev,
        error: true,
        loading: false,
      }))
      return
    }
  }

  // reset feedback on route change
  useEffect(() => {
    setFormData({
      description: '',
      email: '',
    })
    setRequestState({
      error: false,
      loading: false,
      webUrl: null,
    })
  }, [router.pathname])

  return (
    <div className="max-w-2xl">
      <H4>{props.title}</H4>
      <div>
        {props.description}
        <div>
          {!requestState.webUrl && (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <Textarea
                label="Feedback"
                value={formData.description}
                required
                onChange={e => {
                  setRequestState(prev => ({
                    ...prev,
                    error: false,
                  }))
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }}
              />
              <Input
                label="E‑Mail für Rückfragen"
                type="email"
                value={formData.email}
                onChange={e => {
                  setFormData(prev => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }}
              />
              <div>
                <Button iconPosition="right" variant="primary" type="submit" disabled={requestState.loading}>
                  {requestState.loading ? 'Ein Moment...' : 'Feedback auf openCode veröffentlichen'}
                </Button>
              </div>
            </form>
          )}
          {requestState.webUrl && (
            <div className="bg-kern-feedback-success-background mt-lg p-4 rounded-md">
              <P className="pb-4">Vielen Dank für Ihr Feedback! Ihr Feedback wurde auf openCode veröffentlicht.</P>
              <Button
                className="bg-white hover:bg-white/20 mt-lg hover:bg-slate-100 border border-black text-black"
                iconPosition="right"
                onClick={() => {
                  window.open(requestState.webUrl ?? '', 'blank')
                }}
              >
                Feedback auf openCode öffnen
              </Button>
            </div>
          )}
          {requestState.error && (
            <div className="bg-kern-feedback-warning-background rounded-md inline-block p-4 mt-4">
              <P className="!m-0">Es gab einen Fehler. Bitte versuchen Sie es nochmal.</P>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
