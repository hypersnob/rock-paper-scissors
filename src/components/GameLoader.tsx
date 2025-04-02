"use client";

import React, { useCallback, useState, useTransition } from "react";
import { Game, Move } from "@/types";
import Loader from "./Loader";
import { useGame } from "@/lib/GameContext";
import { getGameResult } from "@/lib/utils";
import { Button } from "./Button";
import CopyIcon from "@/icons/Copy.svg";
import MoveSelector from "./MoveSelector";
import ArrowIcon from "@/icons/Arrow.svg";
import { toast } from "sonner";

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

  const { gameId: gameIdFromContext, setGameId } = useGame();

  const view = gameIdFromContext === gameId ? "HOST" : "PLAYER";

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
      console.log(data);
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

  if (isPending) {
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
        <Button href="/" onClick={() => setGameId(null)}>
          New game
        </Button>
      </div>
    );
  }

  if (game && game.winner) {
    const { message, emoji } = getGameResult(game.winner, view);

    return (
      <div className="text-base-light text-center">
        <h1 className="md:text-5xl font-bold mb-6 md:mb-8">{emoji}</h1>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          {message}
        </h2>
        <p className="text-xl mb-4">Try one more time.</p>
        <Button href="/" onClick={() => setGameId(null)}>
          New game
        </Button>
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
              onClick={() =>
                navigator.clipboard
                  .writeText(url)
                  .then(() => {
                    toast.success("Link copied to clipboard");
                  })
                  .catch(() => {
                    toast.error("Failed to copy link");
                  })
              }
            >
              {navigator.canShare() ? (
                "share"
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
          <Button href="/" onClick={() => setGameId(null)}>
            New game
          </Button>
        </div>
      </div>
    );
  }

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
};

export default GameLoader;
