export const GITHUB = {
  branch: "main",
  repo: "framecn",
  user: "shadcn-labs",
} as const;

const githubUrl = `https://github.com/${GITHUB.user}/${GITHUB.repo}`;

export const LINK = {
  DISCORD: "https://discord.gg/N6G36KhYK4",
  EDITFRAME: "https://editframe.com",
  GITHUB: githubUrl,
  KAPISH_DIMA: "https://github.com/kapishdima",
  LICENSE: `${githubUrl}/blob/${GITHUB.branch}/LICENSE`,
  PORTFOLIO: "https://aniketpawar.com",
  REMOCN: "https://github.com/kapishdima/remocn",
  SHADCN_MCP_DOCS: "https://ui.shadcn.com/docs/mcp",
  SPONSOR: `https://github.com/sponsors/Aniket-508`,
  X: "https://x.com/alaymanguy",
  X_SHADCN_LABS: "https://x.com/shadcnlabs",
} as const;
