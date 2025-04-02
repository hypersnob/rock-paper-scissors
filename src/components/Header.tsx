import LogoIcon from "@/icons/Logo.svg";
import ThemeSwitcherIcon from "@/icons/ThemeSwitcher.svg";
import MenuIcon from "@/icons/Menu.svg";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-10 bg-base-dark/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-6 px-8">
        <button type="button" className="text-accent">
          <ThemeSwitcherIcon className="w-6 h-6" />
        </button>
        <button type="button" className="text-accent">
          <LogoIcon className="w-10 h-10" />
        </button>
        <button type="button" className="text-accent">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
