import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { DesktopNav, MobileNav } from "./nav-links";
import { isClerkConfigured } from "@/lib/clerk-config";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
      <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-white shadow-md shadow-accent/30">
        <CalendarDays className="size-4" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight">1635Funcs</span>
    </Link>
  );
}

function AuthButtons() {
  if (!isClerkConfigured) return null;
  return (
    <>
      <Show when="signed-out">
        <SignInButton>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground"
          >
            Sign In
          </button>
        </SignInButton>
        <SignUpButton>
          <button
            type="button"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-md shadow-accent/20 transition hover:bg-accent-hover"
          >
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <DesktopNav />
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-accent/60 hover:text-accent-hover"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add Event
          </Link>
          <AuthButtons />
        </div>
        <MobileNav>
          <AuthButtons />
        </MobileNav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">Everything happening at school, in one place.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <Link href="/events" className="transition hover:text-foreground">Events</Link>
          <Link href="/clubs" className="transition hover:text-foreground">Clubs</Link>
          <Link href="/my-events" className="transition hover:text-foreground">My Events</Link>
          <Link href="/submit" className="transition hover:text-foreground">Add Event</Link>
          <Link href="/admin" className="transition hover:text-foreground">Admin</Link>
        </nav>
      </div>
    </footer>
  );
}
