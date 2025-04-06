"use client";

import React, { useState, useTransition, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Move } from "@/types";
import Loader from "./Loader";
import { getGameIdWithExpiry, getGameResult, GifCase } from "@/lib/utils";
import Button from "./Button";
import CopyIcon from "@/icons/Copy.svg";
import MoveSelector from "./MoveSelector";
import ArrowIcon from "@/icons/Arrow.svg";
import { toast } from "sonner";
import ShareIcon from "@/icons/share.svg";
import { notFound } from "next/navigation";
import ResultGif from "./ResultGif";
import { GameResponse } from "@/app/[gameId]/page";

type GameLoaderProps = {
  gamePromise: Promise<GameResponse>;
};

async function playGame(gameId: string, move: Move) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/play/${gameId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_BEARER_TOKEN}`,
      },
      body: JSON.stringify({ move }),
    }
  );

  if (!response.ok) {
    return notFound();
  }

  const data = await response.json();
  return { game: data };
}

const GameLoader: React.FC<GameLoaderProps> = ({ gamePromise }) => {
  const [isPending, startTransition] = useTransition();
  const [move, setMove] = useState<Move>();
  const router = useRouter();

  const { game, error } = use(gamePromise);

  const view = useMemo(() => {
    if (error || !game) {
      return "PLAYER";
    }
    const hostExpiry = getGameIdWithExpiry(game.id);
    return hostExpiry ? "HOST" : "PLAYER";
  }, [game, error]);

  const handlePlay = () => {
    if (!move || !game) {
      return;
    }

    startTransition(async () => {
      playGame(game.id, move).then((data) => {
        if (data.game) {
          router.refresh();
        }
      });
    });
  };

  if (error) {
    notFound();
  }

  if (game && game.winner) {
    const { message, emoji } = getGameResult(game.winner, view);
    const result: GifCase =
      game.winner === "DRAW"
        ? "draw"
        : game.winner === "HOST"
        ? view === "HOST"
          ? "success"
          : "failure"
        : view === "PLAYER"
        ? "success"
        : "failure";

    return (
      <div className="text-base-light text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          {emoji} {message}
        </h1>
        <p className="text-xl my-4">Try one more time.</p>
        <Button href="/">New game</Button>
        <ResultGif gifCase={result} />
      </div>
    );
  }

  if (view === "HOST") {
    const url = `${window.location.origin}/${game?.id}`;

    return (
      <div className="text-base-light text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          Very good!
        </h1>
        <p className="text-xl mb-6">
          Copy the link and send to person you want to play with.
        </p>
        <div className="flex items-center gap-4 text-base-dark bg-white rounded-full px-6 py-4 leading-none mb-10">
          <p className="text-base-dark truncate flex-1 w-full">{url}</p>
          {navigator.clipboard && (
            <button
              className="text-base-dark"
              onClick={() => {
                if (navigator.canShare()) {
                  navigator.share({ url }).catch(() => {
                    toast.error("Failed to share link");
                  });
                } else {
                  navigator.clipboard
                    .writeText(url)
                    .then(() => {
                      toast.success("Link copied to clipboard");
                    })
                    .catch(() => {
                      toast.error("Failed to copy link");
                    });
                }
              }}
            >
              {navigator.canShare() ? (
                <ShareIcon className="w-6 h-6" />
              ) : (
                <CopyIcon className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
        <p className="text-base-light text-xl mb-4">Allready sent?</p>
        <div className="flex justify-center mb-6">
          <Button variant="secondary" onClick={() => router.refresh()}>
            Refresh
          </Button>
        </div>
        <div className="flex justify-center">
          <Button href="/">New game</Button>
        </div>
      </div>
    );
  }

  // Ensure view is PLAYER before rendering player UI
  if (view === "PLAYER") {
    return (
      <div className="text-base-light text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          Let&apos;s play!
        </h1>
        <p className="text-xl mb-4">Make your choice and get game result.</p>
        <MoveSelector move={move} updateMove={setMove} />
        <div className="mt-6 md:mt-8">
          <Button disabled={!move} onClick={handlePlay}>
            <span className="flex items-center gap-2">Play</span>
            {isPending ? <Loader /> : <ArrowIcon className="w-6 h-6" />}
          </Button>
        </div>
      </div>
    );
  }

  // Fallback or should not happen if view logic is correct
  return null;
};

export default GameLoader;
