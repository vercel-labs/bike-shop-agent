import { defineDynamic, defineSkill } from "eve/skills";

// Standing conventions per membership tier. Decided at runtime from the
// caller's authenticated `tier` claim, not from anything the user types, so one
// customer can't borrow the pro playbook by asking nicely.
const PLAYBOOKS: Record<string, { title: string; markdown: string }> = {
  pro: {
    title: "Pro / shop-mechanic playbook",
    markdown:
      "This caller is a pro mechanic. Talk torque specs and part numbers freely, " +
      "skip the absolute basics, and recommend a Full Overhaul when the symptoms " +
      "justify it. Reference /workspace/torque-specs.md for fastener values.",
  },
  member: {
    title: "Member playbook",
    markdown:
      "This caller is a shop member. Mention the 10% labor discount on bookings, " +
      "and offer a free loaner bike whenever a job will keep their bike overnight.",
  },
};

export default defineDynamic({
  events: {
    "session.started": async (_event, ctx) => {
      const tier = ctx.session.auth.current?.attributes.tier;
      const key = Array.isArray(tier) ? tier[0] : tier;
      const playbook = key ? PLAYBOOKS[key] : undefined;
      if (!playbook) return null; // no tier → no playbook, just the standard desk
      return defineSkill({
        description:
          `Use when serving a ${key}-tier customer. ` +
          `Contains that tier's standing conventions.`,
        markdown: `# ${playbook.title}\n\n${playbook.markdown}`,
      });
    },
  },
});
