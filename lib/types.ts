export const EVENT_CATEGORIES = [
  "Clubs",
  "Sports",
  "Meetings",
  "Arts",
  "Volunteer",
  "Academic",
  "Other",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type SchoolEvent = {
  id: string;
  title: string;
  organization: string;
  organizationSlug: string | null;
  date: string;
  time: string;
  location: string;
  description: string;
  details?: string;
  category: EventCategory;
  verified: boolean;
  attendees: number;
  ownerId: string | null;
  source: "sample" | "database";
  dbId?: number;
};

export const CLUB_CATEGORIES = [
  "Sports",
  "Academic",
  "Arts",
  "Service",
  "Leadership",
  "Cultural",
] as const;

export type ClubCategory = (typeof CLUB_CATEGORIES)[number];

export type Club = {
  slug: string;
  name: string;
  category: ClubCategory;
  tagline: string;
  about: string;
  meetingSchedule: string;
  location: string;
  advisor: string;
  members: number;
  verified: boolean;
  founded: number;
  contactEmail: string;
};

export type PendingEvent = {
  id: string;
  title: string;
  organization: string;
  submittedBy: string;
  date: string;
  category: EventCategory;
  submittedAt: string;
};

export type ClubRequest = {
  id: string;
  name: string;
  category: ClubCategory;
  requestedBy: string;
  advisor: string;
  members: number;
};
