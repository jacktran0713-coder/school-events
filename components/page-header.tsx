import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-10 pt-12 sm:flex-row sm:items-end sm:justify-between sm:pt-16">
      <div>
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wider text-accent">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-pretty text-lg text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
