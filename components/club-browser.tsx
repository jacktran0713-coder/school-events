"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { ClubCard } from "./club-card";
import { CategoryFilter, SearchBar } from "./search-filters";
import { CLUB_CATEGORIES, type Club } from "@/lib/types";

export function ClubBrowser({ clubs }: { clubs: Club[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clubs.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (!q) return true;
      return [c.name, c.tagline, c.category, c.advisor].join(" ").toLowerCase().includes(q);
    });
  }, [clubs, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          label="Search clubs"
          placeholder="Search clubs, teams, or organizations..."
        />
        <CategoryFilter
          categories={CLUB_CATEGORIES}
          value={category}
          onChange={setCategory}
          label="Filter clubs by category"
        />
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "organization" : "organizations"}
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => (
            <li key={club.slug}>
              <ClubCard club={club} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <SearchX className="size-8 text-muted" aria-hidden="true" />
          <p className="mt-4 font-medium">No clubs found</p>
          <p className="mt-1 text-sm text-muted">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
