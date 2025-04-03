"use client";

import LogoIcon from "@/icons/Logo.svg";
import ThemeSwitcherIcon from "@/icons/ThemeSwitcher.svg";
import MenuIcon from "@/icons/Menu.svg";
import { useState } from "react";
import CloseIcon from "@/icons/Close.svg";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-10 bg-base-dark/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-6 px-8">
          <button type="button" className="text-accent invisible">
            <ThemeSwitcherIcon className="w-6 h-6" />
          </button>
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
      <div
        className="fixed inset-0 z-12 bg-base-light px-6 py-18 text-base-dark"
        style={{
          display: isMenuOpen ? "block" : "none",
        }}
      >
        <button
          type="button"
          className="text-base-dark absolute top-6 right-6 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Rock Paper Scissors
          </h1>
          <p>Interactive version of the classic game</p>
        </div>
      </div>
    </>
  );
}
