import React, { Suspense } from "react";
import GameLoader from "@/components/GameLoader";
import Loader from "@/components/Loader";

type GamePageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

const fetchGame = async (gameId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/game/${gameId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_BEARER_TOKEN}`,
      },
    }
  ).catch((e) => {
    console.error(e);
  });

  if (!response || response.status !== 200) {
    return { error: "Game not found" };
  }

  const data = await response.json();
  return data;
};

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <Loader size="big" />
        </div>
      }
    >
      <GameLoader gamePromise={fetchGame(gameId)} />
    </Suspense>
  );
}
