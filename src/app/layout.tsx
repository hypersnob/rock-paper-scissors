import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const title = "Rock Paper Scissors";
const description = "Make a move and send a link to your friends to play";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen">
      <body className={cn(geistSans.variable, "bg-base-dark h-screen")}>
        <Header />
        <main className="max-w-5xl mx-auto h-full flex flex-col justify-center py-10 px-8">
          {children}
        </main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
