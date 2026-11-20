import { buildConfirmationEmail } from './confirmation';
import { buildRequestEmail } from './email';
import type { Lang } from './types';
import type { CleanRequest } from './validate';

export interface OutgoingAttachment {
  readonly filename: string;
  readonly content: Buffer;
  readonly contentType: string;
}

export interface OutgoingEmail {
  readonly from: string;
  readonly to: readonly string[];
  readonly replyTo?: string;
  readonly subject: string;
  readonly html: string;
  readonly text: string;
  readonly attachments?: readonly OutgoingAttachment[];
}

/** The one thing the mailer needs from Resend, so it can be tested with a fake. */
export interface EmailClient {
  send(email: OutgoingEmail): Promise<{ readonly error: unknown }>;
}

export interface MailerConfig {
  readonly teamFrom: string;
  readonly teamTo: readonly string[];
  readonly confirmationFrom: string;
  readonly confirmationReplyTo: string;
  readonly logoUrl: string;
}

export interface DeliveryInput {
  readonly request: CleanRequest;
  readonly reference: string;
  readonly lang: Lang;
  readonly attachments: readonly OutgoingAttachment[];
  readonly submittedAt: Date;
}

export interface DeliveryResult {
  readonly team: 'sent' | 'failed';
  readonly confirmation: 'sent' | 'failed' | 'skipped';
}

const trySend = async (client: EmailClient, email: OutgoingEmail, label: string, reference: string): Promise<boolean> => {
  try {
    const { error } = await client.send(email);
    if (error) {
      console.error(`[project-request] ${label} email rejected`, { reference, error });
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[project-request] ${label} email failed`, { reference, err });
    return false;
  }
};

/**
 * Sends the team email first. Only if it goes through is the client sent a
 * confirmation, and a failed confirmation never undoes a delivered request.
 */
export async function deliverRequest(client: EmailClient, config: MailerConfig, input: DeliveryInput): Promise<DeliveryResult> {
  const { request, reference, lang, attachments, submittedAt } = input;
  const clientEmail = typeof request.values.email === 'string' && request.values.email ? request.values.email : undefined;

  const team = buildRequestEmail(request, { reference, lang, fileNames: attachments.map((a) => a.filename), submittedAt });
  const teamSent = await trySend(
    client,
    { from: config.teamFrom, to: config.teamTo, replyTo: clientEmail, ...team, attachments },
    'team',
    reference,
  );
  if (!teamSent) return { team: 'failed', confirmation: 'skipped' };
  if (!clientEmail) return { team: 'sent', confirmation: 'skipped' };

  const confirmation = buildConfirmationEmail(request, { reference, lang, logoUrl: config.logoUrl });
  const confirmed = await trySend(
    client,
    { from: config.confirmationFrom, to: [clientEmail], replyTo: config.confirmationReplyTo, ...confirmation },
    'confirmation',
    reference,
  );
  return { team: 'sent', confirmation: confirmed ? 'sent' : 'failed' };
}
