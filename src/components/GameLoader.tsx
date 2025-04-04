"use client";

import React, { useCallback, useState, useTransition, useEffect } from "react";
import { Game, Move } from "@/types";
import Loader from "./Loader";
import { getGameIdWithExpiry, getGameResult } from "@/lib/utils";
import Button from "./Button";
import CopyIcon from "@/icons/Copy.svg";
import MoveSelector from "./MoveSelector";
import ArrowIcon from "@/icons/Arrow.svg";
import { toast } from "sonner";
import ShareIcon from "@/icons/share.svg";
import ResultVideoPlayer from "./ResultVideoPlayer";
type GameLoaderProps = {
  gameId: string;
};

async function getGameData(
  gameId: string
): Promise<{ game?: Game; error?: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/game/${gameId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_BEARER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return { error: "Game not found" };
  }

  const data = await response.json();
  return data;
}

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
    return { error: "Game not found" };
  }

  const data = await response.json();
  return { game: data };
}

const GameLoader: React.FC<GameLoaderProps> = ({ gameId }) => {
  const [isPending, startTransition] = useTransition();
  const [game, setGame] = useState<Game>();
  const [error, setError] = useState<string | null>(null);
  const [move, setMove] = useState<Move>();
  const [view, setView] = useState<"HOST" | "PLAYER" | null>(null);

  useEffect(() => {
    // Determine view only on the client-side after mount
    const hostExpiry = getGameIdWithExpiry(gameId);
    setView(hostExpiry ? "HOST" : "PLAYER");
  }, [gameId]);

  const getGameDataCallback = useCallback(async () => {
    return await getGameData(gameId);
  }, [gameId]);

  React.useEffect(() => {
    startTransition(async () => {
      const data = await getGameDataCallback();

      if (data.error) {
        console.error(data.error);
        setError(data.error);
        return;
      }

      if (data.game) {
        setGame(data.game);
      }
    });
  }, [gameId, getGameDataCallback]);

  const handlePlay = () => {
    if (!move) {
      return;
    }
    startTransition(async () => {
      playGame(gameId, move).then((data) => {
        if (data.game) {
          setGame(data.game);
        }
      });
    });
  };

  // Show loader while determining view or fetching game data
  if (isPending || view === null) {
    return (
      <div className="flex justify-center">
        <Loader size="big" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-base-light text-center">
        <h1 className="text-5xl font-bold mb-6 md:mb-8">Game not found</h1>
        <p className="text-xl mb-4">Try one more time.</p>
        <Button href="/">New game</Button>
      </div>
    );
  }

  if (game && game.winner) {
    const { message, emoji } = getGameResult(game.winner, view);

    return (
      <div className="text-base-light text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          {emoji} {message}
        </h1>
        <ResultVideoPlayer winner={game.winner} view={view} />
        <p className="text-xl my-4">Try one more time.</p>
        <Button href="/">New game</Button>
      </div>
    );
  }

  if (view === "HOST") {
    const url = `${window.location.origin}/${gameId}`;

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
          <Button
            variant="secondary"
            onClick={() =>
              getGameDataCallback()
                .then((data) => {
                  if (data.game) {
                    setGame(data.game);
                  }
                })
                .catch((error) => {
                  console.error(error);
                  toast.error("Failed to refresh game");
                })
            }
          >
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
