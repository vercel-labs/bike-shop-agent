import { connectSlackCredentials } from "@vercel/connect/eve";
import { defaultSlackAuth, slackChannel } from "eve/channels/slack";

// The same dispatcher, now answering in Slack. No tool, skill, or state code
// changes to get here: a channel only normalizes input, owns the conversation's
// resume handle, and decides delivery. Everything the agent *does* is unchanged.
//
// Credentials run through Vercel Connect, so there's no SLACK_BOT_TOKEN or
// signing secret in your code. Register the Connect client first:
//   export FF_CONNECT_ENABLED=1
//   vercel connect create slack --triggers
//   vercel connect detach <uid> --yes
//   vercel connect attach <uid> --triggers --trigger-path /eve/v1/slack --yes
// then pass that client's UID below.
export default slackChannel({
  credentials: connectSlackCredentials("slack/spoke-and-mirror"),

  // Answer @mentions from a real user; ignore bot chatter. defaultSlackAuth
  // stamps workspace-scoped auth, which is what the per-tier shop playbook reads.
  onAppMention: (ctx, message) =>
    message.author ? { auth: defaultSlackAuth(message, ctx) } : null,

  events: {
    // Post the final reply back to the thread. Skip interim tool-call narration
    // so the channel only shows the service writer's actual answer.
    "message.completed"(eventData, channel, ctx) {
      if (eventData.finishReason === "tool-calls") return;
      if (eventData.message) channel.thread.post(eventData.message);
    },
  },
});
