import { eveChannel } from "eve/channels/eve";
import { localDev, vercelOidc, type AuthFn } from "eve/channels/auth";
import { getCustomer } from "../lib/auth.js";

// Route auth: who is allowed to reach the agent's HTTP routes, and who they are.
// Eve walks this list in order. An entry returns a SessionAuthContext to accept
// (and stop the walk), or null to fall through to the next entry. App auth goes
// first; the dev/OIDC catch-alls go last.
const appAuth: AuthFn<Request> = async (request) => {
  const customer = getCustomer(request);
  if (!customer) return null; // not one of our customers → fall through

  // The tier comes from the customer's record, not from the request. The
  // per-tier playbook (agent/skills/shop-playbook.ts) reads it from here.
  const attributes: Record<string, string> = {};
  if (customer.tier) attributes.tier = customer.tier;

  return {
    principalId: customer.id,
    principalType: "user",
    authenticator: "app",
    issuer: "spoke-and-mirror",
    attributes,
  };
};

export default eveChannel({
  auth: [appAuth, localDev(), vercelOidc()],
});
