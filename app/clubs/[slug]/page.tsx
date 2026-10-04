import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, GraduationCap, Mail, MapPin, Users } from "lucide-react";
import { CategoryBadge, VerifiedBadge } from "@/components/badges";
import { ClubAvatar } from "@/components/club-card";
import { EventCard } from "@/components/event-card";
import { FollowButton } from "@/components/action-buttons";
import { getClubBySlug, getEventsByOrganization } from "@/lib/events";
import { sampleFollowedClubSlugs } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/clubs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const club = getClubBySlug(slug);
  return club ? { title: club.name, description: club.tagline } : { title: "Club not found" };
}

export default async function ClubProfilePage({ params }: PageProps<"/clubs/[slug]">) {
  const { slug } = await params;
  const club = getClubBySlug(slug);
  if (!club) notFound();

  const events = await getEventsByOrganization(slug);

  const info = [
    { icon: Clock, label: "Meets", value: club.meetingSchedule },
    { icon: MapPin, label: "Where", value: club.location },
    { icon: GraduationCap, label: "Advisor", value: club.advisor },
    { icon: Users, label: "Members", value: `${club.members} students` },
    { icon: CalendarDays, label: "Founded", value: String(club.founded) },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <Link
        href="/clubs"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All clubs
      </Link>

      <section className="relative mt-8 overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <ClubAvatar name={club.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <CategoryBadge category={club.category} />
                {club.verified ? (
                  <VerifiedBadge showLabel />
                ) : (
                  <span className="text-xs font-medium text-muted">Pending verification</span>
                )}
              </div>
              <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{club.name}</h1>
              <p className="mt-1 text-muted">{club.tagline}</p>
            </div>
          </div>
          <FollowButton initialFollowing={sampleFollowedClubSlugs.includes(club.slug)} />
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted">{club.about}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">Upcoming events</h2>
            {events.length > 0 ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {events.map((e) => (
                  <li key={e.id}>
                    <EventCard event={e} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted">
                No upcoming events yet. Check back soon.
              </p>
            )}
          </section>
        </div>

        <aside className="lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Details</h2>
            <dl className="mt-5 flex flex-col gap-4">
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  <dt className="w-20 shrink-0 text-sm text-muted">{label}</dt>
                  <dd className="text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={`mailto:${club.contactEmail}`}
              className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:border-accent/60 hover:text-accent-hover"
            >
              <Mail className="size-4" aria-hidden="true" />
              Contact club
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
