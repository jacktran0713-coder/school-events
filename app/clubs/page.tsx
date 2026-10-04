import type { Metadata } from "next";
import { ClubBrowser } from "@/components/club-browser";
import { PageHeader } from "@/components/page-header";
import { getAllClubs } from "@/lib/events";

export const metadata: Metadata = {
  title: "Clubs",
  description: "Explore every club, team, and student organization at school.",
};

export default function ClubsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Clubs"
        title="Find your people"
        description="Teams, clubs, and student organizations. Follow the ones you care about to never miss an event."
      />
      <ClubBrowser clubs={getAllClubs()} />
    </main>
  );
}
