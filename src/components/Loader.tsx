import LoaderIcon from "@/icons/Loader.svg";
import { cn } from "@/lib/utils";

const Loader: React.FC<{ size?: "default" | "big" }> = ({
  size = "default",
}) => (
  <LoaderIcon
    className={cn(
      "animate-spin",
      size === "big" ? "w-12 h-12 text-base-light" : "w-6 h-6 text-base-dark"
    )}
  />
);

export default Loader;
