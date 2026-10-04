import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { CategoryBadge, VerifiedBadge } from "./badges";
import { getInitials } from "@/lib/format";
import type { Club } from "@/lib/types";

export function ClubAvatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-semibold text-accent-hover ${
        size === "lg" ? "size-20 rounded-2xl text-2xl" : "size-12 text-base"
      }`}
    >
      {getInitials(name)}
    </div>
  );
}

export function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/30 transition duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex items-start gap-4">
        <ClubAvatar name={club.name} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-lg font-semibold transition-colors group-hover:text-accent-hover">
            <span className="truncate">{club.name}</span>
            {club.verified && <VerifiedBadge />}
          </h3>
          <div className="mt-1">
            <CategoryBadge category={club.category} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{club.tagline}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-4 text-sm text-muted">
        <span className="mt-4 flex items-center gap-1.5">
          <Users className="size-4 text-foreground/60" aria-hidden="true" />
          {club.members} members
        </span>
        <span className="mt-4 flex items-center gap-1.5">
          <Clock className="size-4 text-foreground/60" aria-hidden="true" />
          {club.meetingSchedule}
        </span>
      </div>
    </Link>
  );
}
