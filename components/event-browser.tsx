"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarX } from "lucide-react";
import { EventCard } from "./event-card";
import { CategoryFilter, SearchBar } from "./search-filters";
import { EVENT_CATEGORIES, type SchoolEvent } from "@/lib/types";

type EventBrowserProps = {
  events: SchoolEvent[];
  heading: string;
  initialQuery?: string;
  initialCategory?: string;
  limit?: number;
  viewAllHref?: string;
  searchSize?: "md" | "lg";
};

export function EventBrowser({
  events,
  heading,
  initialQuery = "",
  initialCategory = "All",
  limit,
  viewAllHref,
  searchSize = "md",
}: EventBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    (EVENT_CATEGORIES as readonly string[]).includes(initialCategory) ? initialCategory : "All",
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (category !== "All" && e.category !== category) return false;
      if (!q) return true;
      return [e.title, e.organization, e.location, e.description, e.category]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [events, query, category]);

  const visible = limit ? filtered.slice(0, limit) : filtered;
  const isFiltering = query.trim() !== "" || category !== "All";

  return (
    <div>
      <div className="flex flex-col gap-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          size={searchSize}
          label="Search events"
          placeholder="Search events, clubs, or organizations..."
        />
        <CategoryFilter
          categories={EVENT_CATEGORIES}
          value={category}
          onChange={setCategory}
          label="Filter events by category"
        />
      </div>

      <div className="mt-12 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "event" : "events"}
            {isFiltering ? " match your filters" : " coming up"}
          </p>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent transition hover:text-accent-hover"
          >
            View all
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        )}
      </div>

      {visible.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <CalendarX className="size-8 text-muted" aria-hidden="true" />
          <p className="mt-4 font-medium">No events found</p>
          <p className="mt-1 text-sm text-muted">Try a different search or category.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-5 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent-hover"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
