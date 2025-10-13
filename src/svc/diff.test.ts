// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import { DropdownOption } from "@/components/legacy-unmigrated/VersionSelect";
import { calculateAllowedDiffOptions, parseDiffContent } from "./diff";

describe("calculateAllowedDiffOptions", () => {
  it("should", () => {
    const selectedSource: DropdownOption = {
      id: 2,
      name: "v6.2.0",
      latest: false,
    };
    const selectedTarget: DropdownOption = {
      id: 3,
      name: "v6.5",
      latest: false,
    };
    const versions: DropdownOption[] = [
      { id: 1, name: "v6.1", latest: false },
      { id: 2, name: "v6.2.0", latest: false },
      { id: 3, name: "v6.5", latest: false },
    ];

    const result = calculateAllowedDiffOptions(
      selectedSource,
      selectedTarget,
      versions,
    );

    // Rule is that allowedSource must be less equal than selectedTarget
    const expectedAllowedVersionSource: DropdownOption[] = [
      { id: 1, name: "v6.1", latest: false },
      { id: 2, name: "v6.2.0", latest: false },
      { id: 3, name: "v6.5", latest: false },
    ];
    // Rule is that allowedTarget must be greater equal than selectedSource
    const expectedAllowedVersionTarget: DropdownOption[] = [
      { id: 2, name: "v6.2.0", latest: false },
      { id: 3, name: "v6.5", latest: false },
    ];

    expect(result).toEqual([
      expectedAllowedVersionSource,
      expectedAllowedVersionTarget,
    ]);
  });
});

describe("parseDiffContent", () => {
  it("parses diff content correctly in the rename case", async () => {
    const mockDiffContent = `diff --git a/tmp/tmpc_06mp58/1_Einfuehrung/1_3_Geltungsbereich/1_3_Geltungsbereich.md b/tmp/tmpaeh5u8ty/1_Einfuehrung/1_2_Geltungsbereich 1_2_Geltungsbereich.md
similarity index 49%
rename from /tmp/tmpc_06mp58/1_Einfuehrung/1_3_Geltungsbereich/1_3_Geltungsbereich.md
rename to /tmp/tmpaeh5u8ty/1_Einfuehrung/1_2_Geltungsbereich/1_2_Geltungsbereich.md
index 868b8e8..3621cfa 100644
--- a/tmp/tmpc 06mp58/Einfuehrung/Geltungsbereich/Geltungsbereich
+++ b/tmp/tmpaeh5u8ty/Einfuehrung/Geltungsbereich/Geltungsbereich
@@ -1,23 +1,26 @@
## Geltungsbereich

Die Architekturrichtlinie[-für die IT des Bundes-] ist [-über den Maßgabebeschluss des Haushaltsausschusses des Deutschen Bundestages (ADrs. 18(8)2134 Abs. II Ziffer 4) vom 17. Juni 2015 hinaus für alle Projekte, Programme-]{+in allen Projekten, Programmen+} und Organisationen der[-unmittelbaren und mittelbaren IT des Bundes inklusive der Verwaltungsdigitalisierung vom Beauftragten der Bundesregierung für die-] Informationstechnik [-zur Anwendung vorgegeben. Das Voranschreiten der-]{+und+} Digitalisierung [-im Bund erfordert diese Erweiterung des Geltungsbereichs.-]{+anzuwenden (siehe AV-01 Konformität).+}

[-Für bereits konsolidierte Dienste fungiert die noch zu etablierende Nachfragemanagementorganisation (NMO), im Geltungsbereich des BMI und entsprechend ihres Organisationskonzeptes, als Verstetigung der Dienstekonsolidierung. Sie sorgt unter Anwendung des vorliegenden Dokuments für die Harmonisierung der Facharchitekturen von BQI-Diensten sowie für die bedarfsgerechte Fortentwicklung der IT des Bundes.-]{+**Geltungsbereich Bund**+}`;

    const result = await parseDiffContent(mockDiffContent);

    const expectedOutput = [
      {
        action: "rename",
        title: "Einführung > Geltungsbereich",
        content:
          '<h2 id="heading-geltungsbereich">Geltungsbereich</h2>\n' +
          "<p>Die Architekturrichtlinie<del>für die IT des Bundes</del> ist <del>über den Maßgabebeschluss des Haushaltsausschusses des Deutschen Bundestages (ADrs. 18(8)2134 Abs. II Ziffer 4) vom 17. Juni 2015 hinaus für alle Projekte, Programme</del><ins>in allen Projekten, Programmen</ins> und Organisationen der<del>unmittelbaren und mittelbaren IT des Bundes inklusive der Verwaltungsdigitalisierung vom Beauftragten der Bundesregierung für die</del> Informationstechnik <del>zur Anwendung vorgegeben. Das Voranschreiten der</del><ins>und</ins> Digitalisierung <del>im Bund erfordert diese Erweiterung des Geltungsbereichs.</del><ins>anzuwenden (siehe AV-01 Konformität).</ins></p>\n" +
          "<p><del>Für bereits konsolidierte Dienste fungiert die noch zu etablierende Nachfragemanagementorganisation (NMO), im Geltungsbereich des BMI und entsprechend ihres Organisationskonzeptes, als Verstetigung der Dienstekonsolidierung. Sie sorgt unter Anwendung des vorliegenden Dokuments für die Harmonisierung der Facharchitekturen von BQI-Diensten sowie für die bedarfsgerechte Fortentwicklung der IT des Bundes.</del><ins><p><strong>Geltungsbereich Bund</strong></p>\n" +
          "</ins></p>\n",
      },
    ];
    expect(result).toEqual(expectedOutput);
  });
});
