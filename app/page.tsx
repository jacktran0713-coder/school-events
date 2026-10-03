type Event = {
  id: number;
  title: string;
  date: string;      // YYYY-MM-DD
  time: string;
  location: string;
  host: string;
  description: string;
};

const events: Event[] = [
  {
    id: 1,
    title: "Varsity Basketball vs. Lincoln High",
    date: "2026-10-09",
    time: "7:00 PM",
    location: "Main Gym",
    host: "Basketball Team",
    description: "Home opener. Come support the team!",
  },
  {
    id: 2,
    title: "Robotics Club Open House",
    date: "2026-10-12",
    time: "3:30 PM",
    location: "Room 214",
    host: "Robotics Club",
    description: "See our robots and learn how to join.",
  },
  {
    id: 3,
    title: "Fall Play Auditions",
    date: "2026-10-15",
    time: "4:00 PM",
    location: "Auditorium",
    host: "Drama Club",
    description: "No experience needed. Bring a short monologue.",
  },
];

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>
      <p className="mt-1 text-gray-500">Everything happening at school, in one place.</p>

      <div className="mt-6 space-y-4">
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
          </article>
        ))}
      </div>
    </main>
  );
}