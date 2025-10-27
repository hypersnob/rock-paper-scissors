import React from "react";
import GameLoader from "@/components/GameLoader";

type GamePageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;

  return <GameLoader gameId={gameId} />;
}
