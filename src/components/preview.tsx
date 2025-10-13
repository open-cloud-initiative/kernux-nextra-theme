import { evaluate } from "@mdx-js/mdx";
import clsx from "clsx";
// import matter from "gray-matter";
import { Alert, Button } from "@open-cloud-initiative/kernux-react";
import yaml from "js-yaml";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { Fragment, useEffect } from "react";
import { ResizableBox } from "react-resizable";
import { jsx, jsxs } from "react/jsx-runtime";
import { useThemeConfig } from "../contexts";
import Layout from "../layout";
import { DEFAULT_COMPONENTS } from "../mdx-components";
import { fetchFile, saveFile } from "../svc/git";
import Oauth2, { useUserInfo } from "./oauth2";
const MarkdownEditor = dynamic(() => import("./markdown-editor"), {
  ssr: false,
});

class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    tries: number;
  },
  {
    hasError: boolean;
    tries: number;
  }
> {
  constructor(props: { children: React.ReactNode; tries: number }) {
    super(props);
    this.state = { hasError: false, tries: props.tries };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch() {
    // You can also log the error to an error reporting service
  }

  componentDidUpdate(
    prevProps: Readonly<{
      children: React.ReactNode;
      tries: number;
    }>,
  ): void {
    // check if the user tried again - if so, we try to reset the error state
    if (this.props.tries !== prevProps.tries) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="_container h-[50vh] flex flex-col items-center justify-center">
          <Alert
            type="danger"
            title="Fehler beim Rendern der Vorschau"
            content="Bitte überprüfen Sie das Markdown-Dokument auf Syntaktische Fehler."
          >
            Vorschau konnte nicht gerendert werden. Bitte überprüfen Sie das
            Markdown-Dokument auf Syntaktische Fehler.
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

function useWindowSize() {
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return size;
}

const LiveEditor = () => {
  const [code, setCode] = React.useState<string>("");
  const [result, setResult] = React.useState<any>(null);
  const [tries, setTries] = React.useState(0);
  const [frontMatter, setFrontMatter] = React.useState<any>({});
  const size = useWindowSize();
  const [isResizing, setIsResizing] = React.useState(false);
  const userInfo = useUserInfo();
  const router = useRouter();
  const [initMarkdown, setInitMarkdown] = React.useState<string>("");

  const config = useThemeConfig();

  useEffect(() => {
    try {
      // extract frontmatter header
      const match = /^---\n([\s\S]+?)\n---/.exec(code);
      let content = code;
      let data = {};
      if (match) {
        const yamlContent = match[1];
        data = yaml.load(yamlContent) as object;
        content = code.slice(match[0].length);
      }

      evaluate(content, {
        Fragment,
        jsx,
        jsxs,
        useMDXComponents: () => ({
          ...DEFAULT_COMPONENTS,
          ...config.components,
        }),
      }).then((md) => {
        setResult(md);
        setFrontMatter(data);
        setTries((prev) => prev + 1);
      });
    } catch (error) {
      console.log(error);
      //
    }
  }, [code]);

  useEffect(() => {
    // read the file from the query parameter
    const { file } = router.query;
    if (file) {
      // fetch the file content from the git service
      fetchFile(file as string).then((content) => {
        setCode(content);
        setInitMarkdown(content);
      });
    }
  }, [router.query]);

  const handleSave = async () => {
    const { file } = router.query;
    if (!file) {
      return;
    }
    const msg = prompt(
      "Bitte geben Sie einen Commit Kommentar ein",
      "Update Markdown",
    );
    // save the file to the git service
    if (!msg) {
      alert("Commit Kommentar ist erforderlich!");
      return;
    }

    try {
      await saveFile(file as string, code, msg);
      alert("Datei erfolgreich gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern der Datei:", error);
    }
  };

  return (
    <div className="flex flex-row">
      <ResizableBox
        axis="x"
        width={400}
        onResizeStart={() => {
          // make the cursor resize col everywhere
          document.body.style.cursor = "col-resize";
          setIsResizing(true);
        }}
        onResizeStop={() => {
          // reset the cursor
          document.body.style.cursor = "default";
          setIsResizing(false);
        }}
        className="relative"
        handle={
          <span
            className={clsx(
              {
                "opacity-100": isResizing,
              },
              "w-0.5 transition-all hover:opacity-100 opacity-0 cursor-col-resize right-0 top-0 bottom-0 absolute block _bg-kern-action-default",
            )}
          />
        }
        height={size.height}
        minConstraints={[400, size.height]}
        maxConstraints={[size.width, size.height]}
      >
        <div className="border-r-2 h-screen overflow-auto relative border-primary border-solid">
          <div className="pb-20 min-h-screen">
            <MarkdownEditor
              initMarkdown={initMarkdown}
              markdown={code}
              onChange={(markdown) => {
                setCode(markdown);
              }}
            />
          </div>
          <div className="sticky border-t border-solid border-red justify-between flex flex-row _bg-kern-form-inputs-background bottom-0 w-full p-2 text-xs text-neutral-500">
            <div className="pb-2">
              <span className="font-semibold">Autor:</span> {userInfo.name} (
              {userInfo.email})
            </div>
            <div className="flex flex-row justify-center">
              <div>
                <Button
                  className="whitespace-nowrap"
                  onClick={handleSave}
                  variant="primary"
                >
                  Speichern
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ResizableBox>
      <div id="mdx-preview" className="overflow-y-scroll flex-1 h-screen">
        <Layout
          themeConfig={{
            toc: [],
          }}
          pageProps={{
            toc: [],
          }}
          pageOpts={{
            pageMap: [],
            frontMatter,
            filePath: "",
            title: frontMatter.title || "Vorschau",
          }}
        >
          <ErrorBoundary tries={tries}>{result?.default({})}</ErrorBoundary>
        </Layout>
      </div>
    </div>
  );
};

export const Preview = () => {
  return (
    <Oauth2>
      <LiveEditor />
    </Oauth2>
  );
};
