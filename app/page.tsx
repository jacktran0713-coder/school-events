import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { EventBrowser } from "@/components/event-browser";
import { ClubCard } from "@/components/club-card";
import { getAllClubs, getAllEvents } from "@/lib/events";

export const dynamic = "force-dynamic"; // always fetch fresh events

export default async function Home() {
  const events = await getAllEvents();
  const featuredClubs = getAllClubs()
    .filter((c) => c.verified)
    .sort((a, b) => b.members - a.members)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="relative pb-10 pt-16 text-center sm:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-accent/15 blur-3xl"
        />
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          {events.length} events this month
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Everything happening at school, in one place.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted">
          Find clubs, sports, meetings, fundraisers, and other events happening around your school.
        </p>
      </section>

      <section aria-label="Find events">
        <EventBrowser
          events={events}
          heading="Upcoming Events"
          limit={6}
          viewAllHref="/events"
          searchSize="lg"
        />
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Popular clubs</h2>
            <p className="mt-1 text-sm text-muted">Find your people.</p>
          </div>
          <Link
            href="/clubs"
            className="group inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover"
          >
            All clubs
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredClubs.map((club) => (
            <li key={club.slug}>
              <ClubCard club={club} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 flex flex-col items-start gap-6 rounded-3xl border border-border bg-surface p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Megaphone className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Run a club or team?</h2>
            <p className="mt-1 text-muted">Post your meetings, games, and fundraisers so everyone sees them.</p>
          </div>
        </div>
        <Link
          href="/submit"
          className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover"
        >
          Add an event
        </Link>
      </section>
    </main>
  );
}
