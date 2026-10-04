"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteEvent(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  // Only deletes the row if it belongs to the signed-in user
  await sql`DELETE FROM events WHERE id = ${id} AND owner_id = ${userId}`;

  revalidatePath("/");
}