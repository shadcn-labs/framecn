import { LegalPage, LegalSection } from "@/components/legal-page";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
  description: `What ${SITE.NAME} collects, why, and who processes it.`,
  path: ROUTES.PRIVACY,
  title: "Privacy Policy",
});

const PrivacyPage = () => (
  <LegalPage
    path={ROUTES.PRIVACY}
    title="Privacy Policy"
    updated="Oct 30, 2026"
    intro={
      <p>
        {SITE.NAME} is operated by Aniket Pawar as Shadcn Labs. We collect as
        little as we can: browsing the site and installing free components needs
        no account. This page explains what we collect and which providers
        receive information when you use the site.
      </p>
    }
  >
    <LegalSection title="Analytics">
      <p>
        We use{" "}
        <a
          href="https://vercel.com/docs/analytics/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vercel Web Analytics
        </a>{" "}
        to count page views. It doesn&apos;t use cookies and doesn&apos;t
        identify you across sites; it records aggregated data such as the page,
        referrer, country, browser, and device type.
      </p>
    </LegalSection>

    <LegalSection title="Advertising">
      <p>
        The sidebar displays{" "}
        <a
          href="https://www.carbonads.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Carbon Ads
        </a>
        . Loading an ad connects your browser to Carbon&apos;s network, which
        receives request information such as your IP address and browser
        headers. We do not send your account information to Carbon.
      </p>
    </LegalSection>

    <LegalSection title="Hosting logs">
      <p>
        The site is hosted on Vercel. Like any web host, Vercel processes
        request data such as your IP address and user agent to serve pages and
        protect against abuse, and keeps short-lived logs of those requests.
      </p>
    </LegalSection>

    <LegalSection title="Contact form">
      <p>
        When you submit the contact form, your name, email, inquiry type,
        subject, message, and email preference are sent to Shadcn Labs through{" "}
        <a
          href="https://formsubmit.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          FormSubmit
        </a>
        . We use these details to respond to your inquiry and respect your email
        preference.
      </p>
    </LegalSection>

    <LegalSection title="Your account">
      <p>
        An account is only needed for framecn Pro. When you sign in we store
        your email address, name, and profile image (if your Google account
        provides one), plus session records that include the IP address and
        browser used to sign in. This lives in our database, hosted by
        Cloudflare (D1).
      </p>
      <ul>
        <li>
          <strong>Email codes</strong> are sent through Resend. We store only a
          hashed copy of the code, and it expires after 10 minutes.
        </li>
        <li>
          <strong>Google sign-in</strong> shares your basic profile with us
          under that provider&apos;s privacy policy. We don&apos;t get access to
          your repositories or contacts.
        </li>
        <li>
          <strong>Pro API keys</strong> are stored only as SHA-256 hashes with a
          short prefix for display. We can&apos;t recover a lost key; you can
          create a new one instead.
        </li>
        <li>
          Sign-in attempts are rate limited, which briefly stores request counts
          keyed to your IP address.
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="Payments">
      <p>
        Purchases are handled by Dodo Payments, our merchant of record. Dodo
        collects your payment details, billing address, and tax information
        directly under its own privacy policy; card details never reach us. In
        our Cloudflare D1 database we keep the email you paid with, your Dodo
        customer ID, and the status of your payments, subscriptions, refunds,
        and disputes. Pro access belongs to the email you paid with: signing in
        with that email unlocks it.
      </p>
    </LegalSection>

    <LegalSection title="Pro source delivery">
      <p>
        Pro compositions are fetched server-side from a private GitHub
        repository after your API key is verified. Your personal information
        isn&apos;t sent to GitHub as part of that request.
      </p>
    </LegalSection>

    <LegalSection title="Stored in your browser">
      <p>
        A few preferences are saved in your browser&apos;s local storage and
        never sent to us: your theme, sound and haptics settings, preferred
        package manager, and CLI-or-manual install choice. A small cookie
        remembers whether the sidebar is open. If you sign in, a session cookie
        keeps you signed in.
      </p>
    </LegalSection>

    <LegalSection title="Sharing and retention">
      <p>
        We don&apos;t sell your data or use it for advertising. We share it only
        with the providers named above, as needed to run {SITE.NAME}, or when
        the law requires it. Account and billing records are kept while your
        account exists and as long as needed for tax and accounting obligations.
      </p>
    </LegalSection>

    <LegalSection title="Your choices">
      <p>
        You can ask us to export or delete your account data at any time by
        emailing us. Deleting your account removes your sign-in records; we keep
        purchase records for your email as long as needed for Pro access and tax
        and accounting, and Dodo Payments retains what it must keep.
      </p>
    </LegalSection>

    <LegalSection title="Changes">
      <p>
        If we change how we handle data, we&apos;ll update this page and the
        date at the top.
      </p>
    </LegalSection>
  </LegalPage>
);
export default PrivacyPage;
