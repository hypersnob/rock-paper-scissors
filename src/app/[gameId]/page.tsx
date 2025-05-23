import React, { Suspense } from "react";
import GameLoader from "@/components/GameLoader";
import Loader from "@/components/Loader";
import { Game } from "@/types";

type GamePageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export type GameResponse =
  | { game?: Game; error?: never }
  | { game?: never; error?: string; status?: number };

const fetchGame = async (gameId: string): Promise<GameResponse> => {
  const baseUrl = process.env.API_URL;
  const response = await fetch(`${baseUrl}/game/${gameId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
    },
  }).catch((e) => {
    console.error(e);
  });

  if (!response || response.status !== 200) {
    return { error: "Game not found", status: response?.status };
  }

  const data = await response.json();
  return data;
};

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;

  const gamePromise = fetchGame(gameId);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <Loader size="big" />
        </div>
      }
    >
      <GameLoader gamePromise={gamePromise} />
    </Suspense>
  );
}
