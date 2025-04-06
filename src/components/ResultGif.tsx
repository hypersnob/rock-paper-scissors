"use client";

import { Gif } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { GifCase, getRandomGifForCase } from "@/lib/utils";
import React, { useEffect, useState } from "react";

type GifType = React.ComponentProps<typeof Gif>["gif"];

const giphyFetch = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY!);

const ResultGif: React.FC<{ gifCase: GifCase }> = ({ gifCase }) => {
  const [gifData, setGifData] = useState<GifType | null>(null);

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const gifId = getRandomGifForCase(gifCase);
        const { data } = await giphyFetch.gif(gifId);
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
