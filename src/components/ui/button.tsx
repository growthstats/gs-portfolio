import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:glow-ring active:scale-[0.985] aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_2px_rgb(255_90_111/35%)]",
  {
    variants: {
      variant: {
        default:
          "action hover:brightness-[1.05] data-[state=open]:glow-ring",
        destructive:
          "bg-destructive text-primary-foreground shadow-[var(--shadow-ambient)] hover:bg-destructive/85 focus-visible:ring-destructive/40",
        outline: "action-outline",
        secondary:
          "neo-surface border-border/40 text-foreground shadow-[var(--shadow-ambient)] backdrop-blur-xl hover:glow-ring",
        ghost: "ghost border-transparent",
        glass:
          "frosted-glass border-border/20 text-foreground shadow-[var(--shadow-ambient)]",
        link:
          "text-primary underline-offset-4 transition-none hover:underline focus-visible:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
