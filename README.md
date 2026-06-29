# Bike Maintenance Dispatcher

A sample [Eve](https://eve.dev) agent: the front desk at **Spoke & Mirror Cyclery**.
Customers describe what their bike is doing, the agent diagnoses, quotes from a real
catalog, and books a slot. It's a small app that exercises every core Eve primitive
without the private-beta Connect/warehouse pieces.

## What it demonstrates

| Primitive            | Where                                   | What it does                                              |
| -------------------- | --------------------------------------- | --------------------------------------------------------- |
| Agent + persona      | `agent/agent.ts`, `agent/instructions.md` | Model config and the standing front-desk identity.    |
| Tools                | `agent/tools/*.ts`                      | Look up services, check openings, book repairs.           |
| State                | `agent/lib/garage.ts`                   | Remembers the customer's bikes across turns.              |
| Human-in-the-loop    | `agent/tools/book_repair.ts`            | Parks for approval when the quote tops $150.              |
| Dynamic skill        | `agent/skills/shop-playbook.ts`         | Loads a member/pro playbook from the caller's `tier`.     |
| Channel auth         | `agent/channels/eve.ts`                 | Stamps the `tier` claim the skill reads.                  |
| Sandbox seed         | `agent/sandbox/workspace/torque-specs.md` | Reference file mounted into `/workspace`.               |

## Run it

```bash
pnpm install
eve dev
```

Then talk to it in the TUI.

## Things to try

**Plain Q&A → tool loop**

> My commuter's rear brake feels spongy. What do you recommend and what's it cost?

Watch it call `lookup_service`, land on the Hydraulic Brake Bleed, and quote a real price.

**Persistent state**

> It's a Surly Disc Trucker, 700c. Save it as "the commuter".
>
> *(new turn)* Book the brake bleed for it.

The second turn still knows the bike. State checkpoints at step boundaries.

**Human-in-the-loop**

> Book the Full Overhaul for Tue 10am.

The $180 quote trips `needsApproval`. The turn parks on an approve/deny prompt and
resumes from exactly that step once you answer.

**Dynamic skill (per tier)**

`eve dev` authenticates via `localDev()`, which sets no `tier`, so you get the plain
desk. To see the member/pro playbook, send the `x-shop-tier` header through the HTTP
channel — e.g. `x-shop-tier: member` — and the agent will start mentioning the labor
discount and loaner bikes.

## Ship it (optional)

This sample runs entirely in the TUI. To add a web dashboard, wrap a Next.js app with
`withEve` from `eve/next` and drop in a `useEveAgent` chat component (see the docs'
Step 9), then `vercel deploy`. Ask and I'll scaffold that next.
