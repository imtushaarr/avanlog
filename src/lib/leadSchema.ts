import { z } from "zod";

// Single source of truth for the shape of a contact-form submission.
// The API route (src/app/api/leads/route.ts) validates every incoming
// request against this before forwarding anything to OryCMS, so a
// malformed or malicious payload never reaches the external endpoint.
export const leadSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(200),
  email: z.string().trim().email("Enter a valid email address.").max(320),
  company: z.string().trim().min(1, "Enter your company name.").max(200),
  cloudProvider: z.enum(["AWS", "Azure", "Google Cloud", "Multiple", "Other / none"]),
  interest: z.enum([
    "Infrastructure Audit",
    "Deployment Engineering",
    "Cloud Migration and Modernization",
    "Managed DevOps and Production Operations",
    "Not sure yet",
  ]),
  description: z.string().trim().min(20, "Add a few more details (at least 20 characters).").max(4000),
  // Honeypot — real submissions always leave this empty; bots that fill
  // every field tend to fill this one too. Deliberately NOT constrained
  // to empty here: the API route checks it after parsing and silently
  // no-ops on a filled value, rather than returning a validation error
  // that would tell a scripted bot exactly what tripped it.
  "company-website": z.string().max(2000).optional().default(""),
});

export type LeadPayload = z.infer<typeof leadSchema>;

// What gets forwarded to OryCMS — the raw payload plus request metadata
// the admin endpoint needs for provenance, without the honeypot field.
export type LeadForwardPayload = Omit<LeadPayload, "company-website"> & {
  source: "avanlog.com";
  submittedAt: string;
};
