"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/events", label: "Events" },
  { href: "/clubs", label: "Clubs" },
  { href: "/my-events", label: "My Events" },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            isActive(item.href)
              ? "bg-surface-hover text-foreground"
              : "text-muted hover:bg-surface hover:text-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNav({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="rounded-full p-2 text-muted transition hover:bg-surface hover:text-foreground"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-16 border-b border-border bg-background/95 px-4 pb-6 pt-2 backdrop-blur-lg"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {[...NAV_ITEMS, { href: "/submit", label: "Add Event" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-xl px-3 py-3 text-base font-medium transition ${
                  isActive(item.href) ? "bg-surface text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}
