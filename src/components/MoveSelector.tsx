import React from "react";
import { Move } from "@/types";
import { cn, MOVES } from "@/lib/utils";
import RockImage from "@/icons/Rock.svg";
import PaperImage from "@/icons/Paper.svg";
import ScissorsImage from "@/icons/Scissors.svg";
import Squircle from "@/icons/Squircle.svg";
import ShuffleIcon from "@/icons/Shuffle.svg";

type MoveButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  isHighlight?: boolean;
};

const MoveButton: React.FC<React.PropsWithChildren<MoveButtonProps>> = ({
  onClick,
  isActive,
  isHighlight,
  children,
}) => (
  <button
    type="button"
    className={cn(
      "flex items-center justify-center aspect-square relative transition-colors w-full cursor-pointer",
      isHighlight
        ? "text-accent hover:text-accent-light"
        : "text-base hover:text-base-light",
      isActive && "text-base-light"
    )}
    onClick={onClick}
  >
    <Squircle className="absolute inset-0" />
    <div className="relative">{children}</div>
  </button>
);

interface MoveSelectorProps {
  move?: Move;
  updateMove: (move: Move) => void;
}

const MoveSelector: React.FC<MoveSelectorProps> = ({ updateMove, move }) => {
  const handleShuffle = () => {
    const startIndex = Math.floor(Math.random() * MOVES.length);
    const totalSteps = 10 + Math.floor(Math.random() * 5); // Random number of steps between 10-15
    let currentStep = 0;

    const animate = () => {
      if (currentStep >= totalSteps) {
        // Stop at a random position
        const finalIndex = Math.floor(Math.random() * MOVES.length);
        updateMove(MOVES[finalIndex]);
        return;
      }

      // Calculate the current index, wrapping around the array
      const currentIndex = (startIndex + currentStep) % MOVES.length;
      updateMove(MOVES[currentIndex]);
      currentStep++;

      // Schedule next step with constant delay
      setTimeout(animate, 100);
    };

    animate();
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-6 w-full">
      <MoveButton onClick={() => updateMove("ROCK")} isActive={move === "ROCK"}>
        <RockImage className="w-20 h-20 md:w-40 md:h-40 text-base-dark  " />
      </MoveButton>
      <MoveButton
        onClick={() => updateMove("PAPER")}
        isActive={move === "PAPER"}
      >
        <PaperImage className="w-20 h-20 md:w-40 md:h-40 text-base-dark" />
      </MoveButton>
      <MoveButton
        onClick={() => updateMove("SCISSORS")}
        isActive={move === "SCISSORS"}
      >
        <ScissorsImage className="w-20 h-20 md:w-40 md:h-40 text-base-dark" />
      </MoveButton>
      <MoveButton onClick={handleShuffle} isHighlight>
        <ShuffleIcon className="w-20 h-20 md:w-40 md:h-40 text-base-dark" />
      </MoveButton>
    </div>
  );
};

export default MoveSelector;
