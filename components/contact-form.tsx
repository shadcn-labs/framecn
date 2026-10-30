import { CornerDownLeftIcon, SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LINK } from "@/constants/links";
import { SITE } from "@/constants/site";

const INQUIRY_TYPES = [
  { label: "General", value: "general" },
  { label: "Sales (25+ seats, invoices)", value: "sales" },
  { label: "Support", value: "support" },
  { label: "Feature request", value: "feature-request" },
  { label: "Bug report", value: "bug-report" },
  { label: "Partnership", value: "partnership" },
  { label: "Sponsorship", value: "sponsorship" },
  { label: "Press", value: "press" },
  { label: "Other", value: "other" },
] as const;

export const ContactForm = ({ inquiry }: { inquiry?: string }) => {
  const selectedInquiry =
    INQUIRY_TYPES.find(({ value }) => value === inquiry)?.value ?? "general";

  return (
    <form
      action={`https://formsubmit.co/${LINK.EMAIL}`}
      method="POST"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          placeholder="John Doe"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="john@doe.com"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-inquiry">Inquiry type</Label>
        <Select
          name="inquiry_type"
          items={INQUIRY_TYPES}
          defaultValue={selectedInquiry}
        >
          <SelectTrigger id="contact-inquiry" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {INQUIRY_TYPES.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          name="subject"
          placeholder="General: Brief description of your inquiry"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Hi, this is my message"
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 min-h-36 w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="contact-no-emails"
          name="no_emails"
          type="checkbox"
          value="yes"
          className="accent-primary focus-visible:ring-ring/50 size-4 shrink-0 rounded-sm focus-visible:ring-[3px] focus-visible:outline-none"
        />
        <Label
          htmlFor="contact-no-emails"
          className="text-muted-foreground font-normal"
        >
          Don&apos;t send me emails about {SITE.NAME}
        </Label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button type="submit">
          <SendIcon aria-hidden />
          Send message
        </Button>
        <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
          or
          <Kbd>
            <CornerDownLeftIcon aria-hidden />
            Enter
          </Kbd>
          to send
        </span>
      </div>
    </form>
  );
};
