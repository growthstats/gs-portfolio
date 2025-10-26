import moduleProps from "@/lib/moduleProps";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FALLBACK_ICON: LucideIcon = LucideIcons.Sparkles;

type SectionProps = {
  data: Sanity.SectionModule;
  dataSanity?: string;
  renderModule?: (module: Sanity.SectionModule["module"]) => ReactNode;
};

export default function Section({
  data,
  dataSanity,
  renderModule,
}: Readonly<SectionProps>) {
  const { headingBadge, icon, module } = data;

  const badge = sanitizeString(headingBadge);
  const iconName = sanitizeString(icon);
  const IconComponent = iconName ? getIcon(iconName) : null;
  const pretitle = sanitizeString(data.pretitle);
  const title = sanitizeString(data.title) ?? "";
  const subtitle = sanitizeString(data.subtitle);

  const childModule = module && renderModule ? renderModule(module) : null;

  return (
    <section {...moduleProps(data)} data-sanity={dataSanity}>
      <div className="section space-y-8">
        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          {(IconComponent || badge) && (
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
              {IconComponent && (
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-current/20 bg-current/10 text-current">
                  <IconComponent aria-hidden className="size-5" />
                </span>
              )}

              {badge && (
                <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 tracking-[0.2em] text-accent">
                  {badge}
                </span>
              )}
            </div>
          )}

          <h2 className="flex flex-col gap-2 text-balance leading-tight">
            {pretitle && (
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-accent">
                {pretitle}
              </span>
            )}

            <span className="text-h2 leading-h2">{title}</span>
          </h2>

          {subtitle && (
            <p className="max-w-prose text-sm text-ink/70">{subtitle}</p>
          )}
        </header>

        {childModule && <div className="w-full">{childModule}</div>}
      </div>
    </section>
  );
}

function sanitizeString(value?: string | null) {
  if (!value) return undefined;
  const cleaned = stegaClean(value);
  return typeof cleaned === "string" ? cleaned.trim() : value.trim();
}

function getIcon(name: string): LucideIcon {
  if (name in LucideIcons) {
    const Icon = LucideIcons[name as keyof typeof LucideIcons];
    if (isLucideIcon(Icon)) return Icon;
  }

  return FALLBACK_ICON;
}

function isLucideIcon(icon: unknown): icon is LucideIcon {
  return typeof icon === "function" && "displayName" in icon;
}
