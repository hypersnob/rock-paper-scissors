"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Move } from "@/types";
import MoveSelector from "@/components/MoveSelector";
import { useRouter } from "next/navigation";
import { useAccount } from "jazz-tools/react";
import { co } from "jazz-tools";
import { Game } from "@/jazz/schema";

export default function Home() {
  const router = useRouter();
  const { me } = useAccount();
  const [localValue, setLocalValue] = useState("");
  const editableRef = useRef<HTMLSpanElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(me?.profile?.name ?? "");
  }, [me?.profile?.name]);

  // Restore cursor position after re-renders
  useEffect(() => {
    if (cursorPosition !== null && editableRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();

      // Make sure the content is up to date
      editableRef.current.textContent = localValue || "friend";

      // Set cursor position
      const textNode = editableRef.current.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        const pos = Math.min(cursorPosition, textNode.textContent?.length || 0);
        range.setStart(textNode, pos);
        range.setEnd(textNode, pos);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [localValue, cursorPosition]);

  const createGame = useCallback(
    async (move: Move) => {
      if (!me) return;

      // Create a public group for the game to make it accessible to everyone
      const Group = co.group();
      const group = Group.create();
      group.makePublic("writer");

      // Create the game in the public group
      const game = Game.create(
        {
          hostMove: move,
          playerMove: null,
          winner: null,
          dateCreated: new Date().toISOString(),
          dateCompleted: null,
          hostAccountId: me.$jazz.id,
        },
        group,
      );

      const gameId = game.$jazz.id;
      router.push(`/${gameId}`);
    },
    [router, me],
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-accent lg:max-w-4/5 mb-[1em] text-center">
        Hey{" "}
        <span
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            const selection = window.getSelection();
            const value = e.currentTarget.textContent || "";

            // Save cursor position
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const preCaretRange = range.cloneRange();
              preCaretRange.selectNodeContents(e.currentTarget);
              preCaretRange.setEnd(range.endContainer, range.endOffset);
              setCursorPosition(preCaretRange.toString().length);
            }

            setLocalValue(value);
            if (!me?.profile) return;
            me.profile.$jazz.set("name", value);
          }}
          className="outline-none min-w-[100px] text-white inline-block editable"
        >
          {localValue}
        </span>
        , Make your choice!
      </h1>
      <MoveSelector updateMove={(move) => createGame(move)} />
    </div>
  );
}
