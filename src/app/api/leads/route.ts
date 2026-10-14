import { NextResponse } from "next/server";
import { leadSchema, type LeadForwardPayload } from "@/lib/leadSchema";

// Where OryCMS's admin receives Avanlog leads. Overridable per
// environment via LEADS_FORWARD_URL — see .env.example. Server-only
// (not NEXT_PUBLIC_*), so the real destination and the secret below
// never reach the browser bundle.
const FORWARD_URL = process.env.LEADS_FORWARD_URL ?? "https://orynticlabs.com/admin/api/avanlog-leads";
const FORWARD_SECRET = process.env.LEADS_API_SECRET;

// Basic in-memory rate limit: a handful of submissions per IP per
// window is enough to blunt a scripted flood without needing a store.
// Resets on deploy/restart — fine for this traffic volume; swap for a
// shared store (Redis, etc.) if this ever runs across multiple instances.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // A filled honeypot means a bot — accept silently so it doesn't learn
  // to adapt, but never forward it anywhere.
  if (parsed.data["company-website"]) {
    return NextResponse.json({ ok: true });
  }

  const forwardPayload: LeadForwardPayload = {
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company,
    cloudProvider: parsed.data.cloudProvider,
    interest: parsed.data.interest,
    description: parsed.data.description,
    source: "avanlog.com",
    submittedAt: new Date().toISOString(),
  };

  if (!FORWARD_SECRET) {
    // Not configured yet — this is expected until OryCMS's endpoint and
    // a shared secret are confirmed. Fail honestly rather than pretend
    // the lead was delivered somewhere.
    console.warn("[leads] LEADS_API_SECRET is not set — lead was validated but not forwarded to OryCMS.");
    return NextResponse.json(
      { ok: false, error: "Lead intake isn't connected to OryCMS yet." },
      { status: 503 }
    );
  }

  try {
    const forwardResponse = await fetch(FORWARD_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-avanlog-api-key": FORWARD_SECRET,
      },
      body: JSON.stringify(forwardPayload),
    });

    if (!forwardResponse.ok) {
      console.error(`[leads] OryCMS rejected the lead: ${forwardResponse.status}`);
      return NextResponse.json({ ok: false, error: "OryCMS rejected the submission." }, { status: 502 });
    }
  } catch (error) {
    console.error("[leads] Failed to reach OryCMS:", error);
    return NextResponse.json({ ok: false, error: "Could not reach OryCMS." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
