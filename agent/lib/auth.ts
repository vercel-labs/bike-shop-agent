// Stand-in for your real auth provider (Clerk, Auth.js, your own OIDC/JWT).
// In a real shop this verifies a signed session and returns the customer on
// file. The important property: a customer's `tier` is the SHOP's record of
// who they are, looked up server-side, never a value the caller sets on the
// request. That's what keeps a walk-in from claiming the pro discount.

export interface Customer {
  readonly id: string;
  readonly tier?: "member" | "pro";
}

// A toy "customer database" keyed by session token. Swap for a real lookup.
const SESSIONS: Record<string, Customer> = {
  "demo-walk-in": { id: "cust_001" },
  "demo-member": { id: "cust_002", tier: "member" },
  "demo-pro": { id: "cust_003", tier: "pro" },
};

/** Resolve the signed-in customer from the request's session cookie, or null. */
export function getCustomer(request: Request): Customer | null {
  const token = request.headers.get("cookie")?.match(/shop_session=([^;]+)/)?.[1];
  return token ? (SESSIONS[token] ?? null) : null;
}
