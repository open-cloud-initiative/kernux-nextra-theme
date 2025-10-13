import { useEffect, useRef } from "react";
import { handleCallback } from "../svc/oauth2";

export const Callback = ({ previewPath }: { previewPath: string }) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async function () {
      const url = new URL(window.location.href);

      // Check if we already have tokens to avoid double processing
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        console.log("Access token already exists, redirecting...");
        window.location.replace(previewPath);
        return;
      }

      try {
        await handleCallback(url);
        // redirect back to the "preview" page
        window.location.replace(previewPath);
      } catch (err) {
        console.error("Error handling OAuth2 callback:", err);
        // You might want to redirect to an error page or show an error message
        // For now, we'll redirect to the preview path anyway
        window.location.replace(previewPath);
      }
    })();
  }, [previewPath]);

  return <div>Processing OAuth2 callback...</div>;
};
