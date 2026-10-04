import type { Metadata } from "next";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { isClerkConfigured } from "@/lib/clerk-config";
import { SignInButton } from "@clerk/nextjs";
import { Plus, Trash2 } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { ClubCard } from "@/components/club-card";
import { PageHeader } from "@/components/page-header";
import { deleteEvent } from "@/app/actions";
import { getAllEvents, getClubBySlug, getEventsByOwner } from "@/lib/events";
import { sampleFollowedClubSlugs, sampleRsvpEventIds } from "@/lib/sample-data";
import type { Club } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Events",
  description: "Events you're going to, events you've posted, and clubs you follow.",
};

function SectionHeading({ title, count }: { title: string; count?: number }) {
  return (
    <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
      {title}
      {count !== undefined && (
        <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-sm font-medium text-muted">
          {count}
        </span>
      )}
    </h2>
  );
}

export default async function MyEventsPage() {
  const userId = await getUserId();
  const allEvents = await getAllEvents();
  const going = allEvents.filter((e) => sampleRsvpEventIds.includes(e.id));
  const posted = userId ? await getEventsByOwner(userId) : [];
  const followedClubs = sampleFollowedClubSlugs
    .map(getClubBySlug)
    .filter((c): c is Club => c !== null);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="My Events"
        title="Your schedule"
        description="Everything you're going to, everything you've posted, and the clubs you follow."
      />

      <section>
        <SectionHeading title="Going" count={going.length} />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {going.map((e) => (
            <li key={e.id}>
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between gap-4">
          <SectionHeading title="Posted by you" count={userId ? posted.length : undefined} />
          {userId && (
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-accent/60 hover:text-accent-hover"
            >
              <Plus className="size-4" aria-hidden="true" />
              New
            </Link>
          )}
        </div>

        {!userId ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
            <p className="font-medium">Sign in to manage your club&apos;s events</p>
            <p className="mt-1 text-sm text-muted">Club leaders can post and edit events after signing in.</p>
            {isClerkConfigured ? (
              <SignInButton>
                <button
                  type="button"
                  className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                >
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <p className="mt-5 text-sm text-muted">Sign-in is temporarily unavailable.</p>
            )}
          </div>
        ) : posted.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
            <p className="font-medium">You haven&apos;t posted any events yet</p>
            <p className="mt-1 text-sm text-muted">Share your next meeting, game, or fundraiser.</p>
            <Link
              href="/submit"
              className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Add an event
            </Link>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posted.map((e) => (
              <li key={e.id} className="flex flex-col gap-2">
                <EventCard event={e} />
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={e.dbId} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <SectionHeading title="Clubs you follow" count={followedClubs.length} />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {followedClubs.map((club) => (
            <li key={club.slug}>
              <ClubCard club={club} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
