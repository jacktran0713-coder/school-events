import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { CategoryBadge, VerifiedBadge } from "./badges";
import { formatLongDate, getDateParts } from "@/lib/format";
import type { SchoolEvent } from "@/lib/types";

export function EventCard({ event }: { event: SchoolEvent }) {
  const { month, day } = getDateParts(event.date);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/30 transition duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex w-14 shrink-0 flex-col items-center rounded-xl border border-border bg-background py-2"
          aria-hidden="true"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            {month}
          </span>
          <span className="text-2xl font-semibold leading-none">{day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <CategoryBadge category={event.category} />
          <h3 className="mt-2 text-pretty text-lg font-semibold leading-snug transition-colors group-hover:text-accent-hover">
            {event.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <span className="truncate">{event.organization}</span>
            {event.verified && <VerifiedBadge />}
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">
        {event.description}
      </p>

      <dl className="mt-auto grid gap-1.5 border-t border-border pt-4 text-sm text-muted [&>div]:flex [&>div]:items-center [&>div]:gap-2">
        <div className="mt-4">
          <dt className="sr-only">Date</dt>
          <CalendarDays className="size-4 shrink-0 text-foreground/60" aria-hidden="true" />
          <dd>{formatLongDate(event.date)}</dd>
        </div>
        <div>
          <dt className="sr-only">Time</dt>
          <Clock className="size-4 shrink-0 text-foreground/60" aria-hidden="true" />
          <dd>{event.time}</dd>
        </div>
        <div>
          <dt className="sr-only">Location</dt>
          <MapPin className="size-4 shrink-0 text-foreground/60" aria-hidden="true" />
          <dd className="truncate">{event.location}</dd>
        </div>
      </dl>
    </Link>
  );
}
