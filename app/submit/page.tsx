import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

// Converts "17:00" from the time picker into "5:00 PM"
function to12Hour(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Returns the signed-in user's club, or null if they don't have one yet
async function getClub() {
  const user = await currentUser();
  const club = user?.publicMetadata?.club;
  if (!user || typeof club !== "string" || !club) return null;
  return { userId: user.id, club };
}

async function addEvent(formData: FormData) {
  "use server";
  await auth.protect();

  const me = await getClub();
  if (!me) return; // not linked to a club, so no posting

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
  redirect("/");
}

const inputClass = "mt-1 w-full rounded-lg border bg-transparent p-2";

export default async function SubmitPage() {
  await auth.protect();
  const me = await getClub();

  if (!me) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <h1 className="text-3xl font-bold">Almost there</h1>
        <p className="mt-2 text-gray-500">
          Your account isn&apos;t linked to a club or team yet. Ask the site admin
          to approve your club, then come back.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-bold">Add an Event</h1>
      <p className="mt-1 text-gray-500">
        Posting as <span className="font-semibold">{me.club}</span>
      </p>

      <form action={addEvent} className="mt-6 space-y-4">
        <label className="block">
          Event name
          <input name="title" required className={inputClass} />
        </label>

        <div className="flex gap-4">
          <label className="block flex-1">
            Date
            <input type="date" name="date" required className={inputClass} />
          </label>
          <label className="block flex-1">
            Time
            <input type="time" name="time" required className={inputClass} />
          </label>
        </div>

        <label className="block">
          Location
          <input name="location" required className={inputClass} />
        </label>

        <label className="block">
          Description
          <textarea name="description" rows={3} className={inputClass} />
        </label>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          Post Event
        </button>
      </form>
    </main>
  );
}