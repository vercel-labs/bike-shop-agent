import { defineSandbox, defaultBackend } from "eve/sandbox";

// defaultBackend() picks the right sandbox for the environment on its own:
// Vercel Sandbox on hosted builds, a local backend during `eve dev`. One
// definition, both environments. The workspace/ seed (torque-specs.md) mounts
// either way. To pin Vercel explicitly instead, use vercel() from
// "eve/sandbox/vercel".
export default defineSandbox({
  backend: defaultBackend(),
});
