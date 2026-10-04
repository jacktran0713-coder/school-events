function parseDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

export function formatLongDate(date: string) {
  return parseDate(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getDateParts(date: string) {
  const d = parseDate(date);
  return {
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    day: d.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" }),
    weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
  };
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
