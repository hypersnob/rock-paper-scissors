import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { GameProvider } from "@/lib/GameContext";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rock Paper Scissors",
  description: "Interactive version of the classic game",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen">
      <body className={cn(geistSans.variable, "bg-base-dark h-screen")}>
        <Header />
        <main className="max-w-5xl mx-auto h-full flex flex-col justify-center py-10 px-8">
          <GameProvider>{children}</GameProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
