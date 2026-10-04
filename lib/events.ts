import { sql } from "./db";
import { findClubSlug, sampleClubs, sampleEvents } from "./sample-data";
import type { Club, SchoolEvent } from "./types";

type EventRow = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  host: string;
  description: string;
  owner_id: string | null;
};

function timeToMinutes(time: string) {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 0;
  const hours = Number(match[1]) % 12;
  const isPm = match[3].toUpperCase() === "PM";
  return (hours + (isPm ? 12 : 0)) * 60 + Number(match[2]);
}

function byDateThenTime(a: SchoolEvent, b: SchoolEvent) {
  return a.date.localeCompare(b.date) || timeToMinutes(a.time) - timeToMinutes(b.time);
}

function rowToEvent(row: EventRow): SchoolEvent {
  return {
    id: `db-${row.id}`,
    dbId: row.id,
    title: row.title,
    organization: row.host,
    organizationSlug: findClubSlug(row.host),
    date: row.date,
    time: row.time,
    location: row.location,
    description: row.description ?? "",
    category: "Other",
    // Only accounts linked to an approved club can post, so database events are verified.
    verified: true,
    attendees: 0,
    ownerId: row.owner_id,
    source: "database",
  };
}

async function getDatabaseEvents(): Promise<SchoolEvent[]> {
  if (!sql) return [];
  try {
    const rows = (await sql`
      SELECT id, title, to_char(date, 'YYYY-MM-DD') AS date,
             time, location, host, description, owner_id
      FROM events
      WHERE date >= CURRENT_DATE
      ORDER BY date ASC
    `) as EventRow[];
    return rows.map(rowToEvent);
  } catch (error) {
    console.error("Failed to load events from database:", error);
    return [];
  }
}

export async function getAllEvents() {
  const dbEvents = await getDatabaseEvents();
  return [...dbEvents, ...sampleEvents].sort(byDateThenTime);
}

export async function getEventById(id: string) {
  const events = await getAllEvents();
  return events.find((e) => e.id === id) ?? null;
}

export async function getEventsByOrganization(slug: string) {
  const events = await getAllEvents();
  return events.filter((e) => e.organizationSlug === slug);
}

export async function getEventsByOwner(userId: string) {
  const events = await getDatabaseEvents();
  return events.filter((e) => e.ownerId === userId).sort(byDateThenTime);
}

export function getAllClubs(): Club[] {
  return [...sampleClubs].sort((a, b) => a.name.localeCompare(b.name));
}

export function getClubBySlug(slug: string) {
  return sampleClubs.find((c) => c.slug === slug) ?? null;
}
