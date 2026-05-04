import { SITE_AGENT_SKILL_MD } from "@/lib/agent-discovery/site-agent-skill";

export const GET = () =>
  new Response(SITE_AGENT_SKILL_MD, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
