import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validate";
import { CONTACT } from "@/lib/site";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

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

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    const data = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message ?? "Failed to send message." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, message: "Message sent!" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Network error. Please try again." },
      { status: 503 },
    );
  }
}
