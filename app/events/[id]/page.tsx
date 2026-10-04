import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserId } from "@/lib/auth";
import { ArrowLeft, CalendarDays, Clock, MapPin, Trash2 } from "lucide-react";
import { CategoryBadge, VerifiedBadge } from "@/components/badges";
import { ClubAvatar } from "@/components/club-card";
import { EventCard } from "@/components/event-card";
import { CopyLinkButton, RsvpButton } from "@/components/action-buttons";
import { deleteEvent } from "@/app/actions";
import { getAllEvents, getEventById } from "@/lib/events";
import { formatLongDate } from "@/lib/format";
import { sampleRsvpEventIds } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/events/[id]">): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  return event ? { title: event.title, description: event.description } : { title: "Event not found" };
}

export default async function EventDetailsPage({ params }: PageProps<"/events/[id]">) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const userId = await getUserId();
  const isOwner = Boolean(userId && event.source === "database" && event.ownerId === userId);

  const related = (await getAllEvents())
    .filter((e) => e.id !== event.id && (e.organization === event.organization || e.category === event.category))
    .slice(0, 3);

  const details = [
    { icon: CalendarDays, label: "Date", value: formatLongDate(event.date) },
    { icon: Clock, label: "Time", value: event.time },
    { icon: MapPin, label: "Location", value: event.location },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <Link
        href="/events"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All events
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <CategoryBadge category={event.category} />
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {event.title}
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <ClubAvatar name={event.organization} />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Hosted by</p>
              <p className="flex items-center gap-1.5 font-medium">
                {event.organizationSlug ? (
                  <Link href={`/clubs/${event.organizationSlug}`} className="transition hover:text-accent-hover">
                    {event.organization}
                  </Link>
                ) : (
                  event.organization
                )}
                {event.verified && <VerifiedBadge showLabel />}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold">About this event</h2>
            <p className="mt-3 text-pretty leading-relaxed text-foreground/90">{event.description}</p>
            {event.details && <p className="mt-4 text-pretty leading-relaxed text-muted">{event.details}</p>}
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/30">
            <dl className="flex flex-col gap-5">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
                    <dd className="mt-0.5 font-medium">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
              <RsvpButton attendees={event.attendees} initialGoing={sampleRsvpEventIds.includes(event.id)} />
              <CopyLinkButton />
            </div>

            {isOwner && (
              <form action={deleteEvent} className="mt-4 border-t border-border pt-4">
                <input type="hidden" name="id" value={event.dbId} />
                <input type="hidden" name="redirectTo" value="/my-events" />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete event
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight">You might also like</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e) => (
              <li key={e.id}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
