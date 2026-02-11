import { notFound } from "next/navigation";
import {
  adminNotificationTemplate,
  clientAutoResponseTemplate,
  followUpDay1Template,
  followUpDay3Template,
  followUpDay7Template,
  invoiceReceiptTemplate,
  newsletterTemplate,
  passwordResetTemplate,
  statusUpdateTemplate,
  ticketAdminNotificationTemplate,
  ticketCommentNotificationTemplate,
  ticketCreatedTemplate,
  ticketStatusUpdateTemplate,
  welcomeTemplate,
} from "@/lib/email-templates";

interface EmailPreviewPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const sampleQuote = {
  id: "quote-123",
  fullName: "Jamie Lee",
  email: "jamie@example.com",
  company: "Acme Inc",
  projectType: "ecommerce",
  services: ["design", "development", "seo"],
  budgetRange: "$10,000 - $25,000",
  timeline: "1-3 months",
  description: "We need a full ecommerce storefront with custom checkout.",
  leadScore: 82,
  leadQuality: "hot",
};

const sampleTicket = {
  id: "ticket-456",
  title: "Unable to access dashboard",
  clientName: "Jamie Lee",
  clientEmail: "jamie@example.com",
  status: "IN_PROGRESS",
  priority: "High",
  category: "Access",
};

const templates = {
  welcome: {
    label: "Welcome email",
    render: () =>
      welcomeTemplate({
        fullName: "Jamie Lee",
        email: "jamie@example.com",
        loginUrl: "https://pinkbeam.io/dashboard",
      }),
  },
  "password-reset": {
    label: "Password reset",
    render: () =>
      passwordResetTemplate({
        fullName: "Jamie Lee",
        resetUrl: "https://pinkbeam.io/reset-password?token=abc123",
        expiresInMinutes: 30,
      }),
  },
  invoice: {
    label: "Invoice / receipt",
    render: () =>
      invoiceReceiptTemplate({
        invoiceNumber: "INV-1001",
        clientName: "Jamie Lee",
        amount: "$1,200.00",
        status: "due",
        dueDate: "March 1, 2026",
        invoiceUrl: "https://pinkbeam.io/invoices/INV-1001",
      }),
  },
  newsletter: {
    label: "Newsletter",
    render: () =>
      newsletterTemplate({
        title: "February Updates",
        intro: "Here is what is new at Pink Beam.",
        items: [
          {
            title: "New onboarding flow",
            description: "A faster start for new clients.",
            url: "https://pinkbeam.io/blog/onboarding",
          },
          {
            title: "SEO launch checklist",
            description: "Make sure your next launch ships fast and ranks well.",
            url: "https://pinkbeam.io/blog/seo-launch",
          },
        ],
        ctaText: "Read the full update",
        ctaUrl: "https://pinkbeam.io/blog",
      }),
  },
  "quote-admin": {
    label: "Quote admin notification",
    render: () => adminNotificationTemplate(sampleQuote),
  },
  "quote-client": {
    label: "Quote client auto-response",
    render: () => clientAutoResponseTemplate(sampleQuote),
  },
  "quote-followup-1": {
    label: "Quote follow-up day 1",
    render: () => followUpDay1Template(sampleQuote),
  },
  "quote-followup-3": {
    label: "Quote follow-up day 3",
    render: () => followUpDay3Template(sampleQuote),
  },
  "quote-followup-7": {
    label: "Quote follow-up day 7",
    render: () => followUpDay7Template(sampleQuote),
  },
  "quote-status": {
    label: "Quote status update",
    render: () => statusUpdateTemplate(sampleQuote, "PROPOSAL"),
  },
  "ticket-client": {
    label: "Ticket created (client)",
    render: () => ticketCreatedTemplate(sampleTicket),
  },
  "ticket-admin": {
    label: "Ticket created (admin)",
    render: () => ticketAdminNotificationTemplate(sampleTicket),
  },
  "ticket-status": {
    label: "Ticket status update",
    render: () => ticketStatusUpdateTemplate(sampleTicket, "IN_PROGRESS"),
  },
  "ticket-comment": {
    label: "Ticket comment notification",
    render: () =>
      ticketCommentNotificationTemplate(
        sampleTicket,
        "Thanks for the details. We are investigating now and will update you shortly.",
        "Alex (Support)"
      ),
  },
} satisfies Record<
  string,
  {
    label: string;
    render: () => { subject: string; html: string };
  }
>;

export default async function EmailPreviewPage({
  searchParams,
}: EmailPreviewPageProps) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const templateKey =
    typeof resolvedSearchParams?.template === "string" &&
    resolvedSearchParams.template in templates
      ? (resolvedSearchParams.template as keyof typeof templates)
      : "welcome";
  const selected = templates[templateKey];
  const { subject, html } = selected.render();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Email Preview</h1>
            <p className="text-muted-foreground">
              Select a template to preview email content and subject lines.
            </p>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Template
              <select
                name="template"
                defaultValue={templateKey}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-xs"
              >
                {Object.entries(templates).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs"
            >
              Load preview
            </button>
          </form>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Subject</p>
            <p className="font-medium">{subject}</p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  );
}
