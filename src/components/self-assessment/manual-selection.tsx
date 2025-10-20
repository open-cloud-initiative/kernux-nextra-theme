// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {Alert, Button} from '@open-cloud-initiative/kernux-react'

export interface SelfAssessmentManualSelectionProps {
  setActiveStepIndex: (index: number) => void
}

export default function SelfAssessmentManualSelection({setActiveStepIndex}: SelfAssessmentManualSelectionProps) {
  return (
    <div className="w-full flex-1">
      <Alert
        type="info"
        title="Noch nicht verfügbar"
        content="Hier können Sie bald die vorselektierten Prüffragen und die
              anzuwendenden Spezifikationen individuell anpassen."
      />
      <div>
        <div className="mt-8 flex flex-row justify-end">
          <div>
            <Button
              onClick={ev => {
                ev.preventDefault()
                setActiveStepIndex(3)
              }}
              variant="primary"
              type="submit"
            >
              Weiter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
