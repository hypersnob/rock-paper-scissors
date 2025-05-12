"use client";

import { Gif } from "@giphy/react-components";
import { GifCase, getRandomGifForCase } from "@/lib/utils";
import React, { useEffect, useState } from "react";

type GifType = React.ComponentProps<typeof Gif>["gif"];

const ResultGif: React.FC<{ gifCase: GifCase }> = ({ gifCase }) => {
  const [gifData, setGifData] = useState<GifType | null>(null);

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const gifId = getRandomGifForCase(gifCase);
        const response = await fetch(`/api/giphy/${gifId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch GIF");
        }

        const data = await response.json();
        setGifData(data);
      } catch (error) {
        console.error("Failed to fetch GIF:", error);
        setGifData(null);
      }
    };

    fetchGif();
  }, [gifCase]);

  if (!gifData) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-4 max-w-full [&>a]:max-w-full">
      <Gif gif={gifData} width={460} noLink={true} />
    </div>
  );
};

export default ResultGif;
