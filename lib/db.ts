import { neon } from "@neondatabase/serverless";

// Null when DATABASE_URL is missing (e.g. preview without the database connected),
// so the UI can still render with sample data instead of crashing on import.
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
