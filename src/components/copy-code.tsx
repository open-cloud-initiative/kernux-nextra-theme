// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import dynamic from "next/dynamic";
import React, { FunctionComponent } from "react";
import { toast } from "sonner";
const Highlighter = dynamic(() => import("./highlighter"), { ssr: false });

interface Props {
  codeString: string;
  language: "yaml" | "shell" | "markdown" | "json";
  children: React.ReactNode;
  transparentBackground?: boolean;
  fileName?: string;
}
const CopyCode: FunctionComponent<Props> = (props) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(props.codeString);
    toast("Copied to clipboard", {
      description: "The code has been copied to your clipboard.",
    });
  };
  return (
    <div
      style={{
        height: "auto", // Use dynamic height
      }}
      className="relative overflow-hidden my-4 bg-gray-100 border"
    >
      {props.fileName && (
        <div className="bg-gray-200 p-1 px-2 text-sm text-gray-700">
          {props.fileName}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-1 top-1 z-10 bg-gray-700 p-1 px-2 text-xs text-white transition-all hover:bg-gray-500"
      >
        Copy
      </button>
      <div className="relative">
        <Highlighter
          codeString={props.codeString}
          language={props.language}
          customStyle={
            props.transparentBackground
              ? { backgroundColor: "transparent" }
              : { backgroundColor: "#F2F4F6" }
          }
        />
      </div>
    </div>
  );
};

export default CopyCode;
