"use server";

import { sql } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteEvent(formData: FormData) {
  const userId = await getUserId();
  if (!userId || !sql) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  // Only deletes the row if it belongs to the signed-in user
  await sql`DELETE FROM events WHERE id = ${id} AND owner_id = ${userId}`;

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/my-events");

  const redirectTo = formData.get("redirectTo");
  if (typeof redirectTo === "string" && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }
}
