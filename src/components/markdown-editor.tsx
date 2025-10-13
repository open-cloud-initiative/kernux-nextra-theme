import {
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";

import clsx from "clsx";
import { useEffect, useRef } from "react";

interface MarkdownEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  initMarkdown?: string;
}

const MarkdownEditor = ({
  markdown,
  onChange,
  initMarkdown,
}: MarkdownEditorProps) => {
  const ref = useRef<MDXEditorMethods>(null);
  useEffect(() => {
    if (ref.current && initMarkdown) {
      ref.current.setMarkdown(initMarkdown);
    }
  }, [initMarkdown]);
  return (
    <MDXEditor
      className={clsx("prose mdxeditor mdx-editor")}
      ref={ref}
      plugins={[
        diffSourcePlugin({
          diffMarkdown: "An older version",
          viewMode: "source",
        }),
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        frontmatterPlugin(),
        markdownShortcutPlugin(),
      ]}
      markdown={markdown}
      onChange={onChange}
      contentEditableClassName="mdx-editor-content prose"
    />
  );
};

export default MarkdownEditor;
