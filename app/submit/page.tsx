import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Converts "17:00" from the time picker into "5:00 PM"
function to12Hour(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

async function addEvent(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const host = String(formData.get("host") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !date || !time || !location || !host) return;

  await sql`
    INSERT INTO events (title, date, time, location, host, description)
    VALUES (${title}, ${date}, ${to12Hour(time)}, ${location}, ${host}, ${description})
  `;

  revalidatePath("/");
  redirect("/");
}

const inputClass = "mt-1 w-full rounded-lg border bg-transparent p-2";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-bold">Add an Event</h1>
      <p className="mt-1 text-gray-500">Post something for the whole school to see.</p>

      <form action={addEvent} className="mt-6 space-y-4">
        <label className="block">
          Event name
          <input name="title" required className={inputClass} />
        </label>

        <label className="block">
          Club / team hosting
          <input name="host" required className={inputClass} />
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