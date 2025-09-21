import CTA from "./CTA";
import { cn } from "@/lib/utils";

export default function CTAList({
  ctas,
  className,
}: {
  ctas?: Sanity.CTA[];
} & React.ComponentProps<"div">) {
  if (!ctas?.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-[.5em]", className)}>
      {ctas?.map((cta) => (
        <CTA
          className="max-sm:w-full"
          {...cta}
          style={cta?.style ?? "default"}
          key={cta?._key}
        />
      ))}
    </div>
  );
}
