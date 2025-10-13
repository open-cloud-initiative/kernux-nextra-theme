import React from "react";

interface VideoProps {
  videoSrc: string;
  subtitleSrc: string;
}
export const Video = (props: VideoProps) => {
  return (
    <video controls className="mb-10" preload="metadata">
      <source src={props.videoSrc} type="video/mp4" />
      <track
        label="Deutsch"
        kind="subtitles"
        srcLang="de"
        src={props.subtitleSrc}
      />
    </video>
  );
};
