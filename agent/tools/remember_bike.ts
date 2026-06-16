import { defineTool } from "eve/tools";
import { z } from "zod";
import { garage } from "../lib/garage.js";

export default defineTool({
  description:
    "Save a customer's bike so the shop remembers it across visits " +
    "(make, model, wheel size, and any standing notes).",
  inputSchema: z.object({
    label: z.string().describe("A short name for the bike, e.g. 'the commuter'."),
    make: z.string(),
    model: z.string(),
    wheelSize: z.string().optional(),
    notes: z.string().optional(),
  }),
  async execute({ label, make, model, wheelSize, notes }) {
    garage.update((g) => ({
      bikes: { ...g.bikes, [label]: { make, model, wheelSize, notes } },
    }));
    return garage.get();
  },
});
