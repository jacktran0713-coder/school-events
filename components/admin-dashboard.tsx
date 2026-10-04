"use client";

import { useState } from "react";
import { BadgeCheck, CalendarDays, Check, Inbox, Users, X } from "lucide-react";
import { CategoryBadge } from "./badges";
import { formatLongDate } from "@/lib/format";
import type { ClubRequest, PendingEvent } from "@/lib/types";

type Decision = "approved" | "rejected";

// Approve/reject only updates local state for now; replace with server actions
// once moderation tables and admin roles exist.

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <Icon className="size-4 text-accent" aria-hidden="true" />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function DecisionButtons({
  label,
  decision,
  onDecide,
}: {
  label: string;
  decision?: Decision;
  onDecide: (d: Decision) => void;
}) {
  if (decision) {
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          decision === "approved" ? "bg-accent/10 text-accent-hover" : "bg-red-500/10 text-red-400"
        }`}
      >
        {decision === "approved" ? "Approved" : "Rejected"}
      </span>
    );
  }
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onDecide("rejected")}
        className="rounded-full border border-border p-2 text-muted transition hover:border-red-500/50 hover:text-red-400"
      >
        <X className="size-4" aria-hidden="true" />
        <span className="sr-only">Reject {label}</span>
      </button>
      <button
        type="button"
        onClick={() => onDecide("approved")}
        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent-hover"
      >
        <Check className="size-4" aria-hidden="true" />
        Approve<span className="sr-only"> {label}</span>
      </button>
    </div>
  );
}

export function AdminDashboard({
  pendingEvents,
  clubRequests,
  totalEvents,
  totalClubs,
}: {
  pendingEvents: PendingEvent[];
  clubRequests: ClubRequest[];
  totalEvents: number;
  totalClubs: number;
}) {
  const [eventDecisions, setEventDecisions] = useState<Record<string, Decision>>({});
  const [clubDecisions, setClubDecisions] = useState<Record<string, Decision>>({});

  const openEvents = pendingEvents.filter((e) => !eventDecisions[e.id]).length;
  const openClubs = clubRequests.filter((c) => !clubDecisions[c.id]).length;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Upcoming events" value={totalEvents} />
        <StatCard icon={Users} label="Active clubs" value={totalClubs} />
        <StatCard icon={Inbox} label="Events to review" value={openEvents} />
        <StatCard icon={BadgeCheck} label="Club requests" value={openClubs} />
      </div>

      <section className="rounded-2xl border border-border bg-surface">
        <div className="border-b border-border p-5 sm:px-6">
          <h2 className="text-lg font-semibold">Pending events</h2>
          <p className="mt-0.5 text-sm text-muted">Review submissions before they go live.</p>
        </div>
        <ul className="divide-y divide-border">
          {pendingEvents.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{event.title}</p>
                  <CategoryBadge category={event.category} />
                </div>
                <p className="mt-1 text-sm text-muted">
                  {event.organization} · {formatLongDate(event.date)} · by {event.submittedBy} ·{" "}
                  {event.submittedAt}
                </p>
              </div>
              <DecisionButtons
                label={event.title}
                decision={eventDecisions[event.id]}
                onDecide={(d) => setEventDecisions((s) => ({ ...s, [event.id]: d }))}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface">
        <div className="border-b border-border p-5 sm:px-6">
          <h2 className="text-lg font-semibold">Club verification requests</h2>
          <p className="mt-0.5 text-sm text-muted">Verified clubs can post events and get a badge.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted">
              <tr className="border-b border-border">
                <th scope="col" className="px-6 py-3 font-medium">Club</th>
                <th scope="col" className="px-6 py-3 font-medium">Requested by</th>
                <th scope="col" className="px-6 py-3 font-medium">Advisor</th>
                <th scope="col" className="px-6 py-3 font-medium">Members</th>
                <th scope="col" className="px-6 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clubRequests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium">{req.name}</p>
                    <p className="text-xs text-muted">{req.category}</p>
                  </td>
                  <td className="px-6 py-4 text-muted">{req.requestedBy}</td>
                  <td className="px-6 py-4 text-muted">{req.advisor}</td>
                  <td className="px-6 py-4 text-muted">{req.members}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <DecisionButtons
                        label={req.name}
                        decision={clubDecisions[req.id]}
                        onDecide={(d) => setClubDecisions((s) => ({ ...s, [req.id]: d }))}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
