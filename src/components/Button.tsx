import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

const buttonVariants = cva(
  "inline-flex gap-x-2 items-center justify-center rounded-full text-xl font-bold uppercase transition-colors disabled:pointer-events-none disabled:opacity-50 px-8 py-4 cursor-pointer leading-none text-base-dark",
  {
    variants: {
      variant: {
        primary: "bg-accent hover:bg-accent-light",
        secondary: "bg-base hover:bg-base-light",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  onClick?: () => void;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  href?: Url;
}

const Button = ({
  variant,
  onClick,
  disabled,
  children,
  ref,
  href,
  ...props
}: ButtonProps) => {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant }))}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant }))}
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
