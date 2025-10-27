"use client";

import React, { useEffect } from "react";
import { useCoState, useAccount } from "jazz-tools/react";
import { Move } from "@/types";
import Loader from "./Loader";
import { getGameResult, GifCase } from "@/lib/utils";
import Button from "./Button";
import CopyIcon from "@/icons/Copy.svg";
import MoveSelector from "./MoveSelector";
import { toast } from "sonner";
import ShareIcon from "@/icons/share.svg";
import ResultGif from "./ResultGif";
import { Game } from "@/jazz/schema";

type GameLoaderProps = {
  gameId: string;
};

function calculateWinner(
  hostMove: Move,
  playerMove: Move,
): "HOST" | "PLAYER" | "DRAW" {
  if (hostMove === playerMove) return "DRAW";

  const rules: Record<Move, Move> = {
    ROCK: "SCISSORS",
    PAPER: "ROCK",
    SCISSORS: "PAPER",
  };

  return rules[hostMove] === playerMove ? "HOST" : "PLAYER";
}

const GameLoader: React.FC<GameLoaderProps> = ({ gameId }) => {
  const game = useCoState(Game, gameId);
  const { me } = useAccount();

  // Determine if current user is the host
  const isHost = !!(
    game?.hostAccountId &&
    me &&
    game.hostAccountId === me.$jazz.id
  );

  const view = !game ? "PLAYER" : isHost ? "HOST" : "PLAYER";

  // Calculate winner when both moves are present
  useEffect(() => {
    if (game?.hostMove && game?.playerMove && !game.winner) {
      const winner = calculateWinner(game.hostMove, game.playerMove);
      game.$jazz.set("winner", winner);
      game.$jazz.set("dateCompleted", new Date().toISOString());
    }
  }, [game]);

  const handlePlay = (selectedMove: Move) => {
    if (!game) return;
    game.$jazz.set("playerMove", selectedMove);
  };

  if (!game) {
    return (
      <div className="flex justify-center">
        <Loader size="big" />
      </div>
    );
  }

  if (game.winner) {
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
                navigator.clipboard
                  .writeText(url)
                  .then(() => {
                    toast.success("Link copied to clipboard");
                  })
                  .catch(() => {
                    toast.error("Failed to copy link");
                  });
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
        <div className="flex justify-center">
          <Button href="/">New game</Button>
        </div>
      </div>
    );
  }

  // Ensure view is PLAYER before rendering player UI
  if (view === "PLAYER") {
    const playerMove = game.playerMove;

    return (
      <div className="text-base-light text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          Let&apos;s play!
        </h1>
        <p className="text-xl mb-4">Make your choice and get game result.</p>
        <MoveSelector
          updateMove={(newMove) => {
            if (!playerMove) {
              handlePlay(newMove);
            }
          }}
          disabled={!!playerMove}
        />
        {playerMove && (
          <div className="mt-6 md:mt-8">
            <p className="text-base-light text-xl mb-4">
              Waiting for opponent...
            </p>
          </div>
        )}
      </div>
    );
  }

  // Fallback or should not happen if view logic is correct
  return null;
};

export default GameLoader;
