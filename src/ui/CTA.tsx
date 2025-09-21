import Link from "next/link";
import resolveUrl from "@/lib/resolveUrl";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";

const allowedVariants = new Set<VariantProps<typeof buttonVariants>["variant"]>(
  ["default", "ghost", "link", "outline", "secondary", "destructive"]
);

export default function CTA({
  link,
  style,
  className,
  children,
  ...rest
}: Sanity.CTA & ComponentProps<"a">) {
  const cleanedStyle =
    typeof style === "string" ? (stegaClean(style) ?? undefined) : undefined;
  const variant =
    cleanedStyle &&
    allowedVariants.has(
      cleanedStyle as VariantProps<typeof buttonVariants>["variant"]
    )
      ? (cleanedStyle as VariantProps<typeof buttonVariants>["variant"])
      : undefined;
  const buttonClassName = cn(className) || undefined;
  const content =
    children || link?.label || link?.internal?.title || link?.external;
  const buttonProps = {
    variant: variant ?? "default",
    className: buttonClassName,
  };

  if (link?.type === "internal" && link.internal)
    return (
      <Button asChild {...buttonProps}>
        <Link
          href={resolveUrl(link.internal, {
            base: false,
            params: link.params,
          })}
          {...rest}
        >
          {content}
        </Link>
      </Button>
    );

  if (link?.type === "external" && link.external)
    return (
      <Button asChild {...buttonProps}>
        <a href={stegaClean(link.external)} {...rest}>
          {content}
        </a>
      </Button>
    );

  return (
    <Button {...buttonProps} {...(rest as unknown as ComponentProps<"button">)}>
      {content}
    </Button>
  );
}
