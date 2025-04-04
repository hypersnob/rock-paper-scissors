import { Metadata } from "next";

const title = "Let's play Rock Paper Scissors!";
const description = "It's your turn to make a move";

export const metadata: Metadata = {
  title,
  description,
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
