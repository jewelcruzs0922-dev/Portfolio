import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validate";
import { CONTACT } from "@/lib/site";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
const REQUEST_TIMEOUT_MS = 10_000;

interface UpstreamBody {
  success?: boolean;
  message?: string;
}

function parseUpstream(raw: string): UpstreamBody {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as UpstreamBody;
  } catch {
    // Not JSON — e.g. a Cloudflare challenge page or a gateway error.
  }
  return {};
}

function failureMessage(status: number, data: UpstreamBody): string {
  if (status === 429) {
    return "Too many messages right now. Please try again in a little while.";
  }
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message.trim();
  }
  return "Could not send your message right now. Please try again later.";
}

export async function POST(request: Request) {
  if (!ACCESS_KEY) {
    return NextResponse.json(
      { success: false, message: "Email service not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const form = body as { name?: string; email?: string; message?: string };
  const errors = validateContact({
    name: form.name ?? "",
    email: form.email ?? "",
    message: form.message ?? "",
  });

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors },
      { status: 422 },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        name: form.name!.trim(),
        email: form.email!.trim(),
        message: form.message!.trim(),
        subject: `Portfolio Contact — ${form.name!.trim()}`,
        from_name: "Jewel Cruz Portfolio",
        replyto: form.email!.trim(),
        to: CONTACT.email,
      }),
    });

    const data = parseUpstream(await res.text());

    if (!res.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: failureMessage(res.status, data) },
        { status: res.status === 429 ? 429 : 502 },
      );
    }

    return NextResponse.json({ success: true, message: "Message sent!" });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      {
        success: false,
        message: timedOut
          ? "The email service took too long to respond. Please try again."
          : "Could not reach the email service. Please try again.",
      },
      { status: 503 },
    );
  } finally {
    clearTimeout(timer);
  }
}
