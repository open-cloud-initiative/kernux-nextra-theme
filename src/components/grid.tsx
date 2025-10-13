// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react";

export const Grid = (props: PropsWithChildren) => {
  return <div className="grid gap-4 md:grid-cols-2">{props.children}</div>;
};
