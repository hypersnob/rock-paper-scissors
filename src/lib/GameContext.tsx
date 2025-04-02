"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GameContextType {
  gameId: string | null;
  setGameId: (id: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameId, setGameId] = useState<string | null>(null);

  return (
    <GameContext.Provider value={{ gameId, setGameId }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
