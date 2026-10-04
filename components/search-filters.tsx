"use client";

import { Search, X } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  size?: "md" | "lg";
  label: string;
};

export function SearchBar({ value, onChange, placeholder, size = "md", label }: SearchBarProps) {
  const isLarge = size === "lg";
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        {label}
      </label>
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${isLarge ? "left-5 size-5" : "left-4 size-4"}`}
        aria-hidden="true"
      />
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full rounded-2xl border border-border bg-surface text-foreground shadow-lg shadow-black/30 outline-none transition placeholder:text-muted/70 hover:border-foreground/20 focus:border-accent focus:ring-4 focus:ring-accent/15 [&::-webkit-search-cancel-button]:hidden ${isLarge ? "h-16 pl-14 pr-14 text-lg" : "h-12 pl-11 pr-11 text-base"}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className={`absolute top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition hover:bg-surface-hover hover:text-foreground ${isLarge ? "right-4" : "right-3"}`}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}

type CategoryFilterProps = {
  categories: readonly string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
};

export function CategoryFilter({ categories, value, onChange, label }: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {["All", ...categories].map((category) => {
        const active = value === category;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-accent bg-accent text-white shadow-md shadow-accent/20"
                : "border-border bg-surface text-muted hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
