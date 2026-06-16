// A toy in-memory shop. Swap for your real booking system / warehouse later.
// This is throwaway scaffolding so the first booking works with zero setup.

export interface Service {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  estMinutes: number;
}

export const SERVICES: Service[] = [
  {
    id: "flat-fix",
    name: "Flat Repair",
    description: "Patch or replace a tube and inspect the tire for whatever ended its life.",
    priceCents: 2000,
    estMinutes: 20,
  },
  {
    id: "wheel-true",
    name: "Wheel Truing",
    description: "Straighten a wobbly wheel so it stops rubbing the brake pad.",
    priceCents: 3000,
    estMinutes: 30,
  },
  {
    id: "drivetrain",
    name: "Drivetrain Deep Clean",
    description: "Degrease and relube the chain, cassette, and chainrings.",
    priceCents: 4500,
    estMinutes: 45,
  },
  {
    id: "brake-bleed",
    name: "Hydraulic Brake Bleed",
    description: "Flush the old fluid and bleed the brakes back to a firm lever.",
    priceCents: 5500,
    estMinutes: 40,
  },
  {
    id: "tune-up-basic",
    name: "Basic Tune-Up",
    description: "Adjust brakes and gears, lube the chain, set tire pressure.",
    priceCents: 6500,
    estMinutes: 60,
  },
  {
    id: "suspension-service",
    name: "Suspension Lower Service",
    description: "Strip the fork lowers, clean, and replace the seals and oil.",
    priceCents: 14000,
    estMinutes: 90,
  },
  {
    id: "tune-up-full",
    name: "Full Overhaul",
    description:
      "Complete teardown: regrease every bearing, replace all cables and housing, true both wheels.",
    priceCents: 18000,
    estMinutes: 180,
  },
];

export function listServices(query?: string): Service[] {
  if (!query) return SERVICES;
  const q = query.toLowerCase();
  return SERVICES.filter(
    (s) =>
      s.id.includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q),
  );
}

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

/** Total price for a set of services, in cents. Unknown ids contribute nothing. */
export function quoteCents(serviceIds: string[]): number {
  return serviceIds.reduce((sum, id) => sum + (getService(id)?.priceCents ?? 0), 0);
}

export interface Slot {
  id: string;
  label: string;
  booked: boolean;
  summary?: string;
}

const SLOTS: Slot[] = [
  { id: "tue-10", label: "Tue 10:00am", booked: false },
  { id: "tue-14", label: "Tue 2:00pm", booked: false },
  { id: "wed-09", label: "Wed 9:00am", booked: false },
  { id: "wed-16", label: "Wed 4:00pm", booked: true, summary: "Existing: tandem brake adjust" },
  { id: "thu-11", label: "Thu 11:00am", booked: false },
];

export function listOpenSlots(): Slot[] {
  return SLOTS.filter((s) => !s.booked);
}

export function bookSlot(slotId: string, summary: string): Slot {
  const slot = SLOTS.find((s) => s.id === slotId);
  if (!slot) throw new Error(`No such slot: ${slotId}`);
  if (slot.booked) throw new Error(`Slot ${slot.label} is already taken.`);
  slot.booked = true;
  slot.summary = summary;
  return slot;
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
