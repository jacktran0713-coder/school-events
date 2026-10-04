"use client";

import { useState } from "react";
import { Check, Link2, Plus, Star } from "lucide-react";

// RSVP / follow state is local for now; swap these handlers for server actions once
// the attendance and follows tables exist.

export function RsvpButton({ attendees, initialGoing = false }: { attendees: number; initialGoing?: boolean }) {
  const [going, setGoing] = useState(initialGoing);
  const count = attendees + (going && !initialGoing ? 1 : 0) - (!going && initialGoing ? 1 : 0);

  return (
    <div>
      <button
        type="button"
        onClick={() => setGoing((g) => !g)}
        aria-pressed={going}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
          going
            ? "border border-accent/50 bg-accent/10 text-accent-hover hover:bg-accent/15"
            : "bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent-hover"
        }`}
      >
        {going ? <Check className="size-4" aria-hidden="true" /> : <Star className="size-4" aria-hidden="true" />}
        {going ? "You're going" : "I'm going"}
      </button>
      {count > 0 && (
        <p className="mt-2 text-center text-xs text-muted">
          {count} {count === 1 ? "student" : "students"} going
        </p>
      )}
    </div>
  );
}

export function FollowButton({ initialFollowing = false }: { initialFollowing?: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  return (
    <button
      type="button"
      onClick={() => setFollowing((f) => !f)}
      aria-pressed={following}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        following
          ? "border border-border bg-surface text-foreground hover:border-foreground/20"
          : "bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent-hover"
      }`}
    >
      {following ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
      {following ? "Following" : "Follow"}
    </button>
  );
}

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
    >
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
