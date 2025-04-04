import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

interface ResultVideoPlayerProps {
  winner: "HOST" | "PLAYER" | "DRAW";
  view: "HOST" | "PLAYER";
}

const videoMapping = {
  success: "92cwKCU8Z5c",
  failure: "YgSPaXgAdzE",
  draw: "dQw4w9WgXcQ",
};

const startMapping = {
  success: 60 + 5,
  failure: 60 + 12,
  draw: 43,
};

const ResultVideoPlayer: React.FC<ResultVideoPlayerProps> = ({
  winner,
  view,
}) => {
  const result: keyof typeof videoMapping =
    winner === "DRAW"
      ? "draw"
      : winner === "HOST"
      ? view === "HOST"
        ? "success"
        : "failure"
      : view === "PLAYER"
      ? "success"
      : "failure";

  const opts: YouTubeProps["opts"] = {
    width: "640",
    height: "390",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      start: startMapping[result],
    },
  };

  const videoId = videoMapping[result];

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      iframeClassName="min-w-full min-h-full w-full h-full aspect-video"
    />
  );
};

export default ResultVideoPlayer;
