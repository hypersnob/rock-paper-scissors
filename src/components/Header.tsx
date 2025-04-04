"use client";

import LogoIcon from "@/icons/Logo.svg";
import MenuIcon from "@/icons/Menu.svg";
import { useState } from "react";
import CloseIcon from "@/icons/Close.svg";
import GithubIcon from "@/icons/Github.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-10 bg-base-dark/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-6 px-8">
          <button type="button" className="text-accent">
            <LogoIcon className="w-10 h-10" />
          </button>
          <button
            type="button"
            className="text-accent cursor-pointer"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-0 z-12 bg-base-light px-6 py-18 text-base-dark">
          <button
            type="button"
            className="text-base-dark absolute top-6 right-6 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
          <div className="max-w-5xl mx-auto text-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Rock Paper Scissors
            </h1>
            <div className="space-y-2">
              <p>
                Interactive version of the classic game you can play with your
                friends.
              </p>
              <p>
                Make a move and send a link to your friends to play with them.
              </p>
              <p>
                The created game will be automatically deleted after 30 days.
              </p>
              <p>
                Made for fun by{" "}
                <a
                  href="https://github.com/hypersnob"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="w-5 h-5 inline-block mr-1" />
                  hypersnob
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
