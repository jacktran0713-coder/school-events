import type { Metadata } from "next";
import { Info } from "lucide-react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { PageHeader } from "@/components/page-header";
import { getAllClubs, getAllEvents } from "@/lib/events";
import { sampleClubRequests, samplePendingEvents } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false },
};

export default async function AdminPage() {
  const events = await getAllEvents();
  const clubs = getAllClubs().filter((c) => c.verified);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Admin"
        title="Dashboard"
        description="Review event submissions and verify student organizations."
      />
      <p className="mb-8 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
        Preview mode — moderation uses sample data and will connect to admin roles and the database later.
      </p>
      <AdminDashboard
        pendingEvents={samplePendingEvents}
        clubRequests={sampleClubRequests}
        totalEvents={events.length}
        totalClubs={clubs.length}
      />
    </main>
  );
}
