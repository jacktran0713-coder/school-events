import Link from "next/link";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { deleteEvent } from "./actions";

export const dynamic = "force-dynamic"; // always fetch fresh events

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  host: string;
  description: string;
  owner_id: string | null;
};

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function Home() {
  const { userId } = await auth();

  const events = (await sql`
    SELECT id, title, to_char(date, 'YYYY-MM-DD') AS date,
           time, location, host, description, owner_id
    FROM events
    WHERE date >= CURRENT_DATE
    ORDER BY date ASC
  `) as Event[];

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>
      <p className="mt-1 text-gray-500">
        Everything happening on the Avenue, in one place.
      </p>
      <Link href="/submit" className="mt-3 inline-block text-blue-500 underline">
        + Add an event
      </Link>

      <div className="mt-6 space-y-4">
        {events.length === 0 && <p>No upcoming events yet.</p>}
        {events.map((event) => (
          <article key={event.id} className="rounded-xl border p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <span className="whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                {event.host}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              📅 {formatDate(event.date)} · 🕒 {event.time} · 📍 {event.location}
            </p>
            <p className="mt-2">{event.description}</p>

            {userId && event.owner_id === userId && (
              <form action={deleteEvent} className="mt-3">
                <input type="hidden" name="id" value={event.id} />
                <button
                  type="submit"
                  className="text-sm text-red-500 underline hover:text-red-400"
                >
                  Delete
                </button>
              </form>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}