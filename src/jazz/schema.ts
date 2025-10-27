import { co, z } from "jazz-tools";

/**
 * Jazz schema for Rock Paper Scissors game
 */

const MoveSchema = z.enum(["ROCK", "PAPER", "SCISSORS"]);
const WinnerSchema = z.enum(["HOST", "PLAYER", "DRAW"]);

export const GameAccount = co.account({
  root: co.map({}),
  profile: co.profile(),
});

export const Game = co.map({
  hostMove: MoveSchema.nullable(),
  playerMove: MoveSchema.nullable(),
  winner: WinnerSchema.nullable(),
  dateCreated: z.string(),
  dateCompleted: z.string().nullable(),
  hostAccountId: z.string(),
});
