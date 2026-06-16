import { defineTool } from "eve/tools";
import { z } from "zod";
import { listServices, formatUsd } from "../lib/shop.js";

export default defineTool({
  description:
    "Look up the repair services the shop offers, with prices and time estimates. " +
    "Pass a query to filter (e.g. 'brake', 'wheel'); omit it to list everything.",
  inputSchema: z.object({
    query: z.string().optional().describe("Optional keyword to filter services."),
  }),
  async execute({ query }) {
    return listServices(query).map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: formatUsd(s.priceCents),
      estMinutes: s.estMinutes,
    }));
  },
});
