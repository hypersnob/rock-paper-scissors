"use client";

import React, { useCallback, useState } from "react";
import { GameRequest, Move } from "@/types";
import MoveSelector from "@/components/MoveSelector";
import Button from "@/components/Button";
import ArrowIcon from "@/icons/Arrow.svg";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { setGameIdWithExpiry } from "@/lib/utils";

export default function Home() {
  const [move, setMove] = useState<Move>();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const fetchGameId = useCallback(async () => {
    if (!move) {
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host_move: move,
        } as GameRequest),
      });

      if (!response.ok) {
        return null;
      }

      const { gameId } = await response.json();
      setGameIdWithExpiry(gameId);
      router.push(`/${gameId}`);
      return gameId;
    });
  }, [move, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl md:text-5xl font-bold text-base-light mb-6 md:mb-8">
        Make your choice
      </h1>
      <MoveSelector move={move} updateMove={setMove} />
      <div className="mt-6 md:mt-8 ">
        <Button onClick={fetchGameId} disabled={!move}>
          <span className="text-base-dark">Get link</span>
          {isPending ? <Loader /> : <ArrowIcon className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  );
}
