import { defineTool } from "eve/tools";
import { z } from "zod";
import { garage } from "../lib/garage.js";

export default defineTool({
  description: "Read the bikes the shop has on file for this customer.",
  inputSchema: z.object({}),
  async execute() {
    return garage.get();
  },
});
