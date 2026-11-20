import { randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { attachmentName, detectFileType } from '@/lib/project-request/file-type';
import { deliverRequest, type EmailClient, type MailerConfig } from '@/lib/project-request/mailer';
import { getPath, isPathId } from '@/lib/project-request/paths';
import { kuwaitDate, makeReference } from '@/lib/project-request/reference';
import type { Lang } from '@/lib/project-request/types';
import { validateFiles, validateRequest, type Errors, type FileErrorCode } from '@/lib/project-request/validate';
import { clientIp, createRateLimiter } from '@/lib/rate-limit';
import { SITE_URL } from '@/lib/seo';

export const runtime = 'nodejs';

const DEFAULT_INBOXES = ['info@igateinteriors.com', 'saif@igateinteriors.com', 'sabiullah@igateinteriors.com'];
const DEFAULT_FROM = 'iGate Interiors <onboarding@resend.dev>';
const CONFIRMATION_FROM = 'iGate Interiors <requests@igateinteriors.com>';
const CONFIRMATION_REPLY_TO = 'info@igateinteriors.com';
const EMAIL_LOGO_URL = `${SITE_URL}/brand/igate-logo-email.png`;
const HONEYPOT_FIELD = 'website';
const RANDOM_SPACE = 1_000_000;
const cryptoRandom = () => randomInt(RANDOM_SPACE) / RANDOM_SPACE;

const limiter = createRateLimiter({ max: 5, windowMs: 60 * 60 * 1000 });
// Confirmations go to unverified addresses: cap how many one address can receive.
const confirmationLimiter = createRateLimiter({ max: 3, windowMs: 24 * 60 * 60 * 1000 });

type ErrorCode = 'rateLimited' | 'badRequest' | 'notConfigured' | 'sendFailed' | 'invalid';

interface ApiResponse {
  readonly success: boolean;
  readonly reference?: string;
  readonly error?: ErrorCode;
  readonly fieldErrors?: Errors;
  readonly fileError?: FileErrorCode;
}

const respond = (body: ApiResponse, status = 200) => NextResponse.json(body, { status });

const inboxes = (): string[] => {
  const configured = process.env.PROJECT_REQUEST_INBOX?.split(',').map((s) => s.trim()).filter(Boolean);
  return configured && configured.length > 0 ? configured : DEFAULT_INBOXES;
};

const mailerConfig = (): MailerConfig => ({
  teamFrom: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
  teamTo: inboxes(),
  confirmationFrom: process.env.CONFIRMATION_FROM_EMAIL || CONFIRMATION_FROM,
  confirmationReplyTo: CONFIRMATION_REPLY_TO,
  logoUrl: EMAIL_LOGO_URL,
  canConfirm: (address) => !confirmationLimiter.isLimited(address.trim().toLowerCase()),
});

const resendClient = (apiKey: string): EmailClient => {
  const resend = new Resend(apiKey);
  return {
    send: ({ to, attachments, ...email }) =>
      resend.emails.send({ ...email, to: [...to], attachments: attachments?.map((a) => ({ ...a })) }),
  };
};

const readFiles = (form: FormData): File[] =>
  form.getAll('files').filter((v): v is File => v instanceof File && v.size > 0);

interface Attachment {
  readonly filename: string;
  readonly content: Buffer;
  readonly contentType: string;
}

/**
 * Identifies each upload by its contents, not the sender's MIME type or name,
 * and renames it to match. Returns null if any file is not a real PDF or image.
 */
const verifyAttachments = async (files: readonly File[]): Promise<Attachment[] | null> => {
  const checked = await Promise.all(
    files.map(async (file): Promise<Attachment | null> => {
      const content = Buffer.from(await file.arrayBuffer());
      const type = detectFileType(content);
      return type ? { filename: attachmentName(file.name, type.extension), content, contentType: type.mime } : null;
    }),
  );
  return checked.every((a): a is Attachment => a !== null) ? checked : null;
};

const readAnswers = (form: FormData, pathId: Parameters<typeof getPath>[0]) => {
  const fields = getPath(pathId).steps.flatMap((s) => s.fields);
  const values = Object.fromEntries(
    fields.map((f) => {
      const all = form.getAll(`f.${f.id}`).filter((v): v is string => typeof v === 'string');
      return [f.id, f.type === 'chips' ? all : (all[0] ?? '')];
    }),
  );
  const details = Object.fromEntries(fields.map((f) => [f.id, form.get(`d.${f.id}`) ?? '']));
  return { values, details };
};

export async function POST(request: NextRequest) {
  if (limiter.isLimited(clientIp(request.headers))) {
    return respond({ success: false, error: 'rateLimited' }, 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch (err) {
    console.error('[project-request] could not parse form data', err);
    return respond({ success: false, error: 'badRequest' }, 400);
  }

  const now = new Date();
  const reference = makeReference(now, cryptoRandom);

  // Bots fill every input; people never see this one. Pretend it worked.
  const honeypot = form.get(HONEYPOT_FIELD);
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return respond({ success: true, reference });
  }

  const pathId = form.get('path');
  if (!isPathId(pathId)) return respond({ success: false, error: 'badRequest' }, 400);

  const result = validateRequest(pathId, readAnswers(form, pathId), {
    today: kuwaitDate(now),
    confirmed: form.get('confirm') === 'yes',
  });
  const files = readFiles(form);
  const metaError = validateFiles(files.map((f) => ({ name: f.name, size: f.size, type: f.type })));
  const attachments = metaError ? null : await verifyAttachments(files);
  const fileError = metaError ?? (attachments ? null : 'badType');

  if (!result.success || fileError || !attachments) {
    return respond(
      {
        success: false,
        error: 'invalid',
        fieldErrors: result.success ? undefined : result.errors,
        fileError: fileError ?? undefined,
      },
      400,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[project-request] RESEND_API_KEY is not configured');
    return respond({ success: false, error: 'notConfigured' }, 500);
  }

  const lang: Lang = form.get('lang') === 'ar' ? 'ar' : 'en';
  const delivery = await deliverRequest(resendClient(apiKey), mailerConfig(), {
    request: result.data,
    reference,
    lang,
    attachments,
    submittedAt: now,
  });

  // A failed client confirmation is logged inside deliverRequest; the request itself still counts.
  return delivery.team === 'sent'
    ? respond({ success: true, reference })
    : respond({ success: false, error: 'sendFailed' }, 502);
}
