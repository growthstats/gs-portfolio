import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import CTA from "./CTA"

export default function CTAList({
	ctas,
	className,
}: {
	ctas?: Sanity.CTA[]
} & ComponentProps<"div">) {
	if (!ctas?.length) return null

	return (
		<div className={cn("flex flex-wrap items-center gap-[.5em]", className)}>
			{ctas.map((cta) => (
				<CTA className="max-sm:w-full" {...cta} key={cta?._key} />
			))}
		</div>
	)
}
