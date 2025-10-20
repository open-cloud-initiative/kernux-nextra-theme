// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {Button} from '../ui/button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '../ui/dropdown-menu'

export interface DropdownOption {
  id: number
  name: string
  latest: boolean
}

interface VersionSelectProps {
  versionsTarget: DropdownOption[]
  versionsSource: DropdownOption[]
  selectedTarget: DropdownOption
  selectedSource: DropdownOption
  setSelectedTarget: (version: DropdownOption) => void
  setSelectedSource: (version: DropdownOption) => void
  titleTarget: string
  titleSource: string
}

export default function VersionSelect(props: VersionSelectProps) {
  return (
    <div className="">
      <div className="grid grid-cols-10 grid-rows-1 py-8">
        <div className="col-start-1 col-end-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full" variant={'outline'}>
                {props.selectedSource.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {props.versionsSource.map(v => (
                <DropdownMenuItem className="w-56" onClick={() => props.setSelectedSource(v)} key={v.id}>
                  {v.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="col-start-9 col-end-11">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full" variant={'outline'}>
                {props.selectedTarget.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {props.versionsSource.map(v => (
                <DropdownMenuItem className="w-56" onClick={() => props.setSelectedTarget(v)} key={v.id}>
                  {v.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
