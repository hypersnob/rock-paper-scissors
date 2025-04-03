import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-center h-screen text-base-light">
      <h2 className="text-2xl font-bold">Seems like you&apos;re lost</h2>
      <p>The page you are looking for does not exist.</p>
      <Button href="/">Return Home</Button>
    </div>
  );
}
