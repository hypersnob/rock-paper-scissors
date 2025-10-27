import React from "react";
import { Metadata } from "next";

const title = "Let's play Rock Paper Scissors!";
const description = "It's your turn to make a move";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://hardrockpaperscissors.app"),
  openGraph: {
    title,
    description,
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image.png"],
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
