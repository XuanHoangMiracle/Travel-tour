export function toDateKey(input) {
  const d = new Date(input);
  if (isNaN(d)) throw new Error("Invalid date");
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}