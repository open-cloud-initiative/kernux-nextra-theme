import { H3, P, Button } from "@open-cloud-initiative/kernux-react";
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";

interface Props {
  items: Array<{
    title: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
  }>;
}

export const Steps = (props: Props) => {
  return (
    <div className="relative steps">
      {props.items.map((el, i) => (
        <div key={i} className="flex gap-4 mb-8 relative">
          {
            // if its the last element, add a gradient
            i === props.items.length - 1 ? (
              <div
                aria-hidden="true"
                className="absolute top-8 h-full left-7 -ml-px w-0.5 bg-gradient-to-b from-kern-action-default to-transparent"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute top-8 h-full left-7 -ml-px w-0.5 bg-kern-action-default"
              />
            )
          }

          <div className="relative z-10 w-14 h-14 border-2 rounded-full flex items-center justify-center text-xl font-medium bg-white">
            {i + 1}
          </div>
          <div className="flex flex-col flex-1">
            <div className="pt-3">
              <H3>{el.title}</H3>
            </div>
            {el.description && (
              <P
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(el.description),
                }}
                className={clsx("text-sm mt-2")}
              />
            )}
            {el.buttonText && el.buttonLink && (
              <Button
                className="mt-2 w-fit"
                variant="secondary"
                onClick={() => {
                  if (el.buttonLink) {
                    window.location.href = el.buttonLink;
                  }
                }}
              >
                {el.buttonText}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
