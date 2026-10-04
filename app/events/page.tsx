import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { EventBrowser } from "@/components/event-browser";
import { PageHeader } from "@/components/page-header";
import { getAllEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse every club meeting, game, fundraiser, and performance at school.",
};

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const { q, category } = await searchParams;
  const events = await getAllEvents();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Events"
        title="What's happening"
        description="Games, meetings, performances, fundraisers, and volunteer opportunities — all in one feed."
        action={
          <Link
            href="/submit"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover sm:self-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add Event
          </Link>
        }
      />
      <EventBrowser
        events={events}
        heading="All events"
        initialQuery={typeof q === "string" ? q : ""}
        initialCategory={typeof category === "string" ? category : "All"}
      />
    </main>
  );
}
