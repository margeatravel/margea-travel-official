import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-inter font-normal text-[13px] tracking-[0.08em] transition-all duration-[250ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#1d2839] text-white rounded-[50px] hover:scale-[1.02] hover:shadow-btn-hover",
        destructive: "bg-destructive text-destructive-foreground rounded-[50px] hover:bg-destructive/90",
        outline: "border-[1.5px] border-[#1d2839] bg-transparent text-[#1d2839] rounded-[50px] hover:bg-[#1d2839] hover:text-white",
        secondary: "bg-secondary text-secondary-foreground rounded-[50px] hover:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-[50px]",
        link: "text-[#1d2839] underline-offset-4 hover:underline",
        hero: "bg-[#1d2839] text-white rounded-[50px] hover:scale-[1.02] hover:shadow-btn-hover font-normal",
        navy: "bg-[#1d2839] text-white rounded-[50px] hover:scale-[1.02] hover:shadow-btn-hover",
        glass: "glass text-white rounded-[50px] hover:bg-[rgba(255,255,255,0.18)]",
      },
      size: {
        default: "h-11 px-8 py-[14px]",
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
