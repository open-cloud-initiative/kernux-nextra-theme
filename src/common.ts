// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

export const cleanHtml = (str?: string): string => {
  return (str || "")
    ?.replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&[^;]+;/g, ""); // Remove HTML entities
};
