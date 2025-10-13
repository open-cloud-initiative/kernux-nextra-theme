// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { FunctionComponent } from "react";
import VersionSelect, { DropdownOption } from "./VersionSelect";
import Alert from "./Alert";

import { ParsedDiffHeadings } from "@/svc/diff";
import { useRouter } from "next/router";
import { classNames } from "../utils/common";
import { DiffSidenav } from "./DiffSidebar";
import LoadingSpinner from "./LoadingSpinner";
import { Sidebar, SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Switch } from "./ui/switch";

export interface ParsedDiff {
  content: string;
  title: string;
  action: "add" | "delete" | "rename" | "change";
}

export interface DiffResponse {
  diff: ParsedDiff[];
  headings: ParsedDiffHeadings[];
}

const humanReadableActionName = {
  add: "hinzugefügt",
  delete: "gelöscht",
  rename: "umbenannt",
  change: "geändert",
};

interface Props {
  diffData: DiffResponse;
  versions: DropdownOption[];
  allowedVersions: DropdownOption[][];
}

const Diff: FunctionComponent<Props> = ({
  versions,
  diffData,
  allowedVersions,
}) => {
  const router = useRouter();

  const pushQueryParam = (value: boolean) => {
    router.push({
      query: {
        type: value ? "combined" : "standard",
      },
    });
  };
  const selectedSource =
    versions.find((v) => v.name === router.query.source) ?? versions[1];

  const selectedTarget =
    versions.find((v) => v.name === router.query.target) ?? versions[0];

  const allowedSource = allowedVersions[0];
  const allowedTarget = allowedVersions[1];

  const onSelectedTargetChange = (option: DropdownOption) => {
    router.push({
      query: {
        ...router.query,
        target: option.name,
      },
    });
  };

  const onSelectedSourceChange = (option: DropdownOption) => {
    router.push({
      query: {
        ...router.query,
        source: option.name,
      },
    });
  };

  return (
    <div className="flex min-h-screen justify-center px-32 pt-10 pb-20">
      <div className="">
        <div className="grid grid-cols-6 grid-rows-2">
          <div className="col-span-4">
            <h2 className="beauty-h mt-2 tracking-tight">Synopse</h2>
          </div>
          <div className="col-span-2">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <h5 className="text-base mt-2!">(Beta) Dokumentenansicht</h5>
                <p className="text-sm text-black/50">
                  Die Darstellung der kombinierten Daten aktivieren.
                </p>
              </div>
              <div>
                <Switch
                  checked={router.query.type === "combined"}
                  onCheckedChange={pushQueryParam}
                />
              </div>
            </div>
          </div>
          <div className="col-span-4 row-start-2">
            <p className="text-base text-gray-800 max-w-4xl">
              Vergleichen Sie zwei Versionen des Dokuments und sehen Sie die
              Unterschiede. Die aktuell veröffentlichte Version ist mit einem
              grünen Punkt in dem Auswahlmenü gekennzeichnet.
            </p>
          </div>
        </div>
        <div className="">
          {versions && (
            <VersionSelect
              versionsTarget={allowedTarget}
              selectedTarget={selectedTarget}
              setSelectedTarget={onSelectedTargetChange}
              titleTarget="Zielversion (neu)"
              versionsSource={allowedSource}
              selectedSource={selectedSource}
              setSelectedSource={onSelectedSourceChange}
              titleSource="Quellversion (alt)"
            />
          )}
        </div>
        <SidebarProvider>
          <div className="container flex flex-row">
            {router.query.type === "combined" &&
              diffData &&
              diffData.headings?.length > 0 && (
                <Sidebar variant="inset" collapsible="none">
                  <DiffSidenav items={diffData.headings} />
                </Sidebar>
              )}
            <SidebarInset>
              <div>
                {diffData && diffData.diff?.length > 0 ? (
                  diffData.diff.map((diff) => (
                    <div
                      id={diff.title}
                      className={classNames("relative border p-2")}
                      key={diff.title + diff.action}
                    >
                      <div className="mb-2 flex flex-row bg-hellgrau-20 p-1 px-2">
                        <span>
                          {diff.title} {humanReadableActionName[diff.action]}
                        </span>
                      </div>

                      <div
                        className={classNames("rich-text", diff.action)}
                        dangerouslySetInnerHTML={{
                          __html: diff.content,
                        }}
                      />
                    </div>
                  ))
                ) : Object.keys(selectedTarget).length > 0 &&
                  Object.keys(selectedSource).length > 0 &&
                  selectedTarget.name === selectedSource.name ? (
                  <Alert title="Sie müssen zwei verschiedene Versionen auswählen." />
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Diff;
