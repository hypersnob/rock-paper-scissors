import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type WinnerType = "HOST" | "PLAYER" | "DRAW";

export const MOVES = ["ROCK", "PAPER", "SCISSORS"] as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGameResult(
  winner: WinnerType,
  view: "HOST" | "PLAYER"
): { message: string; emoji: string } {
  if (winner === "DRAW") {
    return { message: "It's a draw", emoji: "🤷‍♂️" };
  }

  if (
    (winner === "HOST" && view === "PLAYER") ||
    (winner === "PLAYER" && view === "HOST")
  ) {
    return { message: "You have lost", emoji: "😔" };
  }

  return { message: "You have won!", emoji: "🥳" };
}

export function setGameIdWithExpiry(gameId: string) {
  if (typeof window === "undefined") {
    return; // Don't run on server
  }
  const gameIds = JSON.parse(localStorage.getItem("gameIds") || "{}");
  gameIds[gameId] = Date.now() + 1000 * 60 * 60 * 24 * 30;
  localStorage.setItem("gameIds", JSON.stringify(gameIds));
}

export function getGameIdWithExpiry(gameId: string): number | null {
  if (typeof window === "undefined") {
    return null; // Don't run on server
  }
  const gameIds = JSON.parse(localStorage.getItem("gameIds") || "{}");
  const now = Date.now();

  // Remove expired items
  Object.entries(gameIds).forEach(([id, expiry]) => {
    if ((expiry as number) < now) {
      delete gameIds[id];
    }
  });
  localStorage.setItem("gameIds", JSON.stringify(gameIds));

  return gameIds[gameId] ?? null;
}
