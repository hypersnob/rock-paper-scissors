import Button from "@/components/Button";
import ResultGif from "@/components/ResultGif";

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-base-light">
      <h1 className="text-4xl font-bold mb-4">Game Not Found</h1>
      <p className="text-lg mb-8">
        Sorry, the game you are looking for does not exist.
      </p>
      <Button href="/">Play new game</Button>
      <ResultGif gifCase="not-found" />
    </div>
  );
}
