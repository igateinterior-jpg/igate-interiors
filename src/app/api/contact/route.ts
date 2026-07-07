import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// ─── RATE LIMITER (in-memory, resets on deploy) ───

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) return true;

  entry.count++;
  return false;
}

// ─── HANDLER ───

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const { name, phone, email, service, location, message } = body as {
    name?: string;
    phone?: string;
    email?: string;
    service?: string;
    location?: string;
    message?: string;
  };

  // Validate required fields
  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: 'Name is required.' },
      { status: 400 }
    );
  }

  if (!phone || !phone.trim()) {
    return NextResponse.json(
      { error: 'Phone number is required.' },
      { status: 400 }
    );
  }

  // Check Resend API key
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json(
      { error: 'Email service is not configured.' },
      { status: 500 }
    );
  }

  // Build email content
  const resend = new Resend(apiKey);

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #E5332A; border-bottom: 2px solid #E5332A; padding-bottom: 10px;">
        New Project Inquiry
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #333; width: 140px;">Name</td>
          <td style="padding: 10px 0; color: #555;">${escapeHtml(name.trim())}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; color: #333;">Phone</td>
          <td style="padding: 10px; color: #555;">${escapeHtml(phone.trim())}</td>
        </tr>
        ${email ? `<tr>
          <td style="padding: 10px 0; font-weight: bold; color: #333;">Email</td>
          <td style="padding: 10px 0; color: #555;">${escapeHtml(email.trim())}</td>
        </tr>` : ''}
        ${service ? `<tr style="background: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; color: #333;">Service</td>
          <td style="padding: 10px; color: #555;">${escapeHtml(service)}</td>
        </tr>` : ''}
        ${location ? `<tr>
          <td style="padding: 10px 0; font-weight: bold; color: #333;">Location</td>
          <td style="padding: 10px 0; color: #555;">${escapeHtml(location.trim())}</td>
        </tr>` : ''}
      </table>
      ${message ? `
        <h3 style="color: #333; margin-top: 20px;">Project Details</h3>
        <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message.trim())}</p>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">Sent from igateinteriors.com contact form</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'iGate Interiors <onboarding@resend.dev>',
      to: 'info@igateinteriors.com',
      subject: `New Inquiry from ${name.trim()}${service ? ` — ${service}` : ''}`,
      html: htmlBody,
      replyTo: email?.trim() || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
