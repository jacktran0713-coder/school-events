import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isClerkConfigured } from "./clerk-config";

export async function getUserId(): Promise<string | null> {
  if (!isClerkConfigured) return null;
  const { userId } = await auth();
  return userId;
}

export async function requireSignIn() {
  if (!isClerkConfigured) redirect("/my-events");
  await auth.protect();
}

export async function getCurrentUser() {
  if (!isClerkConfigured) return null;
  return currentUser();
}
