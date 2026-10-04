import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser, requireSignIn } from "@/lib/auth";
import { ArrowLeft, Clock3 } from "lucide-react";
import { VerifiedBadge } from "@/components/badges";
import { ClubAvatar } from "@/components/club-card";

export const metadata: Metadata = {
  title: "Add Event",
  description: "Post a club meeting, game, fundraiser, or performance.",
};

// Converts "17:00" from the time picker into "5:00 PM"
function to12Hour(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Returns the signed-in user's club, or null if they don't have one yet
async function getClub() {
  const user = await getCurrentUser();
  const club = user?.publicMetadata?.club;
  if (!user || typeof club !== "string" || !club) return null;
  return { userId: user.id, club };
}

async function addEvent(formData: FormData) {
  "use server";
  await requireSignIn();

  const me = await getClub();
  if (!me || !sql) return; // not linked to a club, so no posting

  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !date || !time || !location) return;

  await sql`
    INSERT INTO events (title, date, time, location, host, description, owner_id)
    VALUES (${title}, ${date}, ${to12Hour(time)}, ${location}, ${me.club}, ${description}, ${me.userId})
  `;

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/my-events");
  redirect("/");
}

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted/60 hover:border-foreground/20 focus:border-accent focus:ring-4 focus:ring-accent/15 [color-scheme:dark]";
const labelClass = "block text-sm font-medium";

function BackLink() {
  return (
    <Link
      href="/events"
      className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back to events
    </Link>
  );
}

export default async function SubmitPage() {
  await requireSignIn();
  const me = await getClub();

  if (!me) {
    return (
      <main className="mx-auto max-w-2xl px-4 sm:px-6">
        <BackLink />
        <div className="mt-8 rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Clock3 className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">Almost there</h1>
          <p className="mt-3 text-pretty text-muted">
            Your account isn&apos;t linked to a club or team yet. Ask the site admin
            to approve your club, then come back.
          </p>
          <Link
            href="/clubs"
            className="mt-6 inline-block rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-accent/60 hover:text-accent-hover"
          >
            Browse clubs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6">
      <BackLink />
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">Add an Event</h1>
      <p className="mt-2 text-muted">Share what&apos;s happening so students can find it.</p>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <ClubAvatar name={me.club} />
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Posting as</p>
          <p className="flex items-center gap-1.5 font-semibold">
            {me.club}
            <VerifiedBadge />
          </p>
        </div>
      </div>

      <form
        action={addEvent}
        className="mt-6 space-y-6 rounded-3xl border border-border bg-surface p-6 shadow-lg shadow-black/30 sm:p-8"
      >
        <label className={labelClass}>
          Event name
          <input name="title" required placeholder="e.g. Robotics Club Open House" className={inputClass} />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={labelClass}>
            Date
            <input type="date" name="date" required className={inputClass} />
          </label>
          <label className={labelClass}>
            Time
            <input type="time" name="time" required className={inputClass} />
          </label>
        </div>

        <label className={labelClass}>
          Location
          <input name="location" required placeholder="e.g. Room 214" className={inputClass} />
        </label>

        <label className={labelClass}>
          Description
          <textarea
            name="description"
            rows={4}
            placeholder="What should students know? Who is it for?"
            className={inputClass}
          />
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/events"
            className="rounded-full px-5 py-2.5 text-center text-sm font-medium text-muted transition hover:text-foreground"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover"
          >
            Post Event
          </button>
        </div>
      </form>
    </main>
  );
}
