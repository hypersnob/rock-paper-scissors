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
    return { message: "We have a tie", emoji: "🤷‍♂️" };
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

const gifMapping: Record<string, string[]> = {
  "not-found": [
    "gKsJUddjnpPG0",
    "3oz8xZvvOZRmKay4xy",
    "xT0BKmtQGLbumr5RCM",
    "3EiNpweH34XGoQcq9Q",
    "xhN4C2vEuapCo",
  ],
  failure: [
    "8J1QwMjshEm2s",
    "l2JedQUmobbFahlD2",
    "ji6zzUZwNIuLS",
    "RHEGP4TpkhrQTFCZE4",
    "BPUFuLhIZ82bGvwcEQ",
  ],
  success: [
    "o75ajIFH0QnQC3nCeD",
    "a0h7sAqON67nO",
    "Qadbv0ccmSrJL9Vlwj",
    "gDBYGgwKmgDnUkFv7h",
    "xT5LMPfLKfJlvvVjnq",
  ],
  draw: [
    "wdcHXC8pZ350mm7Ipn",
    "YCZRWgckA5xhSTtEeK",
    "xT3i0VNrc6Ny7bxfJm",
    "L8XIaJgJakpgLPsyO0",
    "3orifeagG1UwX4DeO4",
  ],
};

export type GifCase = keyof typeof gifMapping;

export function getRandomGifForCase(gifCase: GifCase) {
  const gifs = gifMapping[gifCase];
  return gifs[Math.floor(Math.random() * gifs.length)];
}
