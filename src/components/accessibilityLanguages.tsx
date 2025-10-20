// Copyright 2025 rafaeishikho.
// SPDX-License-Identifier: Apache-2.0
import {A} from '@open-cloud-initiative/kernux-react'

interface AccessibilityLanguagesProps {
  leichteSpracheHref?: string
  gebaerdenspracheHref?: string
}

export function AccessibilityLanguages(props: AccessibilityLanguagesProps) {
  return (
    <div>
      <div className="flex flex-col items-end">
        {props.leichteSpracheHref && (
          <A href={props.leichteSpracheHref}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M480-132q-67-52-145.5-82.5T172-253v-351q87 7 166 48t142 97q63-56 142-97t166-48v351q-84 8-162.5 38.5T480-132Zm1-494q-49 0-83.5-34T363-744q0-49 34.5-83.5T481-862q49 0 83.5 34.5T599-744q0 50-34.5 84T481-626Z" />
            </svg>
            Leichte Sprache
          </A>
        )}
        {props.gebaerdenspracheHref && (
          <A href={props.gebaerdenspracheHref}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M226-117q-6 0-10-4t-4-10q0-6 4-10t10-4h134v-80H146q-6 0-10-4t-4-10q0-6 4-10t10-4h214v-80H106q-6 0-10-4t-4-10q0-6 4-10t10-4h254v-80H186q-6 0-10-4t-4-10q0-6 4-10t10-4h278l-59-105q-5-9-4.5-19t8.5-16l19-16 234 175q18 14 28 33t10 42v164q0 39-27.5 66.5T606-117H226Zm77-432-23-17q-5-4-6-9.5t3-10.5q4-5 9.5-5.5T297-588l26 19 2 10q1 5 3 10h-25Zm-26-171q4-5 9.5-6t10.5 3l65 49-5 4q-5 4-8.5 7.5T342-654l-62-46q-5-4-6-9.5t3-10.5Zm537 230-44 59q-8-26-23.5-46T710-514L483-684 313-811q-5-4-6-9t3-10q4-5 9.5-6t10.5 3l203 152 48-65-140-104q-5-4-5.5-9t3.5-10q4-5 9-6t10 3l223 166 16-119q2-10 8-17.5t16-8.5l24-2 83 281q7 22 3.5 43T814-490Z" />
            </svg>
            Gebärdensprache
          </A>
        )}
      </div>
    </div>
  )
}
