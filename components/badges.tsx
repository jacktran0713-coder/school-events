import { BadgeCheck } from "lucide-react";

export function VerifiedBadge({ showLabel = false }: { showLabel?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-accent"
      title="Verified organization"
    >
      <BadgeCheck className="size-4 shrink-0" aria-hidden="true" />
      {showLabel ? (
        <span className="text-xs font-medium">Verified</span>
      ) : (
        <span className="sr-only">Verified organization</span>
      )}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted">
      {category}
    </span>
  );
}
