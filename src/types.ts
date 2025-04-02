export type Move = "ROCK" | "PAPER" | "SCISSORS";

export type Game = {
  id: string;
  winner: "HOST" | "PLAYER" | null;
  date_created: string;
  date_completed: string | null;
};

export type GameRequest = {
  host_move: Move;
};
