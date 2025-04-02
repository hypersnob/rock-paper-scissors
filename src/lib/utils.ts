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
    return { message: "You lose", emoji: "😔" };
  }

  return { message: "You win!", emoji: "🥳" };
}
