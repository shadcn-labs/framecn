import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export interface PurchaseEmailInput {
  plan: "annual" | "lifetime" | "team";
  recipientEmail: string;
  customerName?: string;
  seats?: number | null;
  origin: string;
}

export const SIGN_IN_CODE_EXPIRY_MINUTES = 10;

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const COLOR = {
  background: "#f5f4ef",
  border: "#e2e1db",
  ink: "#111111",
  muted: "#64635d",
  pink: "#f06292",
  surface: "#fcfcfa",
} as const;

const escapeHtml = (value: string) =>
  value.replaceAll(/[&<>"']/gu, (character) => {
    switch (character) {
      case "&": {
        return "&amp;";
      }
      case "<": {
        return "&lt;";
      }
      case ">": {
        return "&gt;";
      }
      case '"': {
        return "&quot;";
      }
      default: {
        return "&#39;";
      }
    }
  });

const paragraph = (html: string) =>
  `<p style="margin:0 0 18px;color:${COLOR.muted};font-size:16px;line-height:1.65;">${html}</p>`;

const inlineLink = (url: string, label: string) =>
  `<a href="${escapeHtml(url)}" style="color:${COLOR.ink};text-decoration:underline;">${escapeHtml(label)}</a>`;

// Only internally composed, escaped markup is passed as bodyHtml.
const renderLayout = ({
  origin,
  heading,
  preview,
  bodyHtml,
  reason,
}: {
  origin: string;
  heading: string;
  preview: string;
  bodyHtml: string;
  reason: string;
}) => {
  const siteUrl = new URL(ROUTES.HOME, origin).href;
  const siteLabel = new URL(siteUrl).host;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${COLOR.background};font-family:${FONT};color:${COLOR.ink};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;font-size:1px;line-height:1px;color:${COLOR.background};max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preview)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.background}">
    <tr><td align="center" style="padding:48px 24px;">
      <!--[if mso]><table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;margin:0 auto;">
        <tr><td style="padding:0 0 40px;">
          <a href="${escapeHtml(LINK.SHADCN_LABS)}" style="color:${COLOR.muted};font-size:12px;font-weight:600;letter-spacing:1.5px;line-height:20px;text-decoration:none;">SHADCN LABS</a>
          <div style="margin-top:4px;"><a href="${escapeHtml(siteUrl)}" style="color:${COLOR.ink};font-size:25px;font-weight:600;letter-spacing:-1px;line-height:32px;text-decoration:none;">framecn<span style="color:${COLOR.pink};">.</span></a></div>
        </td></tr>
        <tr><td>
          <h1 style="margin:0 0 20px;color:${COLOR.ink};font-size:32px;font-weight:600;letter-spacing:-1px;line-height:1.2;">${escapeHtml(heading)}</h1>
          ${bodyHtml}
          <p style="margin:28px 0 0;color:${COLOR.ink};font-size:15px;line-height:1.6;">Aniket<br /><span style="color:${COLOR.muted};">Shadcn Labs</span></p>
        </td></tr>
        <tr><td style="padding-top:36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="border-top:1px solid ${COLOR.border};padding-top:22px;color:${COLOR.muted};font-size:13px;line-height:1.65;">
              <p style="margin:0 0 10px;">${escapeHtml(reason)}</p>
              <p style="margin:0;">Need a hand? ${inlineLink(`mailto:${LINK.EMAIL}`, LINK.EMAIL)}<br />${inlineLink(siteUrl, siteLabel)}</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`;
};

const textFooter = (origin: string, reason: string) =>
  `Aniket\nShadcn Labs\n\n${reason}\nNeed a hand? ${LINK.EMAIL}\n${new URL(ROUTES.HOME, origin).href}`;

export const renderSignInEmail = ({
  code,
  origin,
}: {
  code: string;
  origin: string;
}): EmailContent => {
  const heading = "Sign in to framecn";
  const preview = `Your login code expires in ${SIGN_IN_CODE_EXPIRY_MINUTES} minutes.`;
  const instructions = `Enter this code on framecn to sign in. It expires in ${SIGN_IN_CODE_EXPIRY_MINUTES} minutes.`;
  const safety =
    "If you didn’t ask to sign in, you can ignore this email. Don’t share this code with anyone.";
  const reason =
    "You received this email because this address was used to request a framecn login code.";

  return {
    html: renderLayout({
      bodyHtml: `${paragraph(instructions)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
          <tr><td align="center" bgcolor="${COLOR.surface}" style="padding:24px 12px;border:1px solid ${COLOR.border};border-top:3px solid ${COLOR.pink};border-radius:12px;">
            <p style="margin:0 0 10px;color:${COLOR.muted};font-size:12px;font-weight:600;letter-spacing:1px;line-height:18px;">YOUR LOGIN CODE</p>
            <p style="margin:0;color:${COLOR.ink};font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace;font-size:36px;font-weight:600;letter-spacing:6px;line-height:1.4;">${escapeHtml(code)}</p>
          </td></tr>
        </table>
        ${paragraph(safety)}`,
      heading,
      origin,
      preview,
      reason,
    }),
    subject: `${code} is your framecn login code`,
    text: `${heading}\n\n${instructions}\n\n${code}\n\n${safety}\n\n${textFooter(origin, reason)}`,
  };
};

export const renderPurchaseEmail = ({
  plan,
  recipientEmail,
  customerName,
  seats,
  origin,
}: PurchaseEmailInput): EmailContent => {
  const details = {
    annual: {
      description:
        "Your framecn Pro purchase is confirmed. This is a yearly subscription, with access to Pro components while your subscription is active.",
      heading: "Welcome to framecn Pro",
      name: "Pro",
    },
    lifetime: {
      description:
        "Your framecn Lifetime purchase is confirmed. Your Pro access never expires, with no yearly subscription to renew.",
      heading: "framecn Pro, yours for life",
      name: "Lifetime",
    },
    team: {
      description: `Your framecn Team purchase is confirmed. ${typeof seats === "number" ? `Your license covers ${seats} ${seats === 1 ? "seat" : "seats"}` : "Your license covers the seats purchased at checkout"} and never expires.`,
      heading: "Welcome to framecn Team",
      name: "Team",
    },
  }[plan];
  const greeting = customerName?.trim()
    ? `Hi ${customerName.trim()},`
    : "Hi there,";
  const dashboardUrl = new URL(ROUTES.DASHBOARD, origin).href;
  const registryUrl = new URL(`${ROUTES.DOCS_REGISTRY}#framecn-pro`, origin)
    .href;
  const reason =
    "You received this email because this address was used to purchase framecn.";
  const keyGuidance =
    plan === "team"
      ? "Generate one shared team API key in your dashboard. Store it in your team’s environment variables or CI secrets, and use it for the seats on your license. Keep it out of public source code."
      : "Generate your API key in the dashboard, then follow the registry guide to install Pro components. Keep your key in environment variables, not in public source code.";

  return {
    html: renderLayout({
      bodyHtml: `${paragraph(escapeHtml(greeting))}
        ${paragraph(escapeHtml(details.description))}
        ${paragraph(`Sign in with your checkout email, <strong style="color:${COLOR.ink};overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(recipientEmail)}</strong>, to access your purchase.`)}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">
          <tr><td bgcolor="${COLOR.ink}" style="border:1px solid ${COLOR.ink};border-radius:8px;text-align:center;mso-padding-alt:14px 22px;">
            <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;padding:14px 22px;color:${COLOR.background};font-size:16px;font-weight:600;line-height:22px;text-decoration:none;">Open your dashboard</a>
          </td></tr>
        </table>
        ${paragraph(escapeHtml(keyGuidance))}
        ${paragraph(inlineLink(registryUrl, "Read the registry installation guide"))}
        ${paragraph("Thanks for supporting framecn. If you need a hand getting set up, I’m just an email away.")}`,
      heading: details.heading,
      origin,
      preview: `Your framecn ${details.name} purchase is confirmed. Here’s how to get started.`,
      reason,
    }),
    subject: `Welcome to framecn ${details.name}`,
    text: `${details.heading}\n\n${greeting}\n\n${details.description}\n\nSign in with your checkout email, ${recipientEmail}, to access your purchase.\n\nOpen your dashboard: ${dashboardUrl}\n\n${keyGuidance}\n\nRead the registry installation guide: ${registryUrl}\n\nThanks for supporting framecn. If you need a hand getting set up, I’m just an email away.\n\n${textFooter(origin, reason)}`,
  };
};
