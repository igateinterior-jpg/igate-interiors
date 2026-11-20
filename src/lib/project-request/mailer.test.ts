import { describe, expect, it } from 'vitest';
import { deliverRequest, type EmailClient, type OutgoingEmail } from './mailer';
import type { CleanRequest } from './validate';

const config = {
  teamFrom: 'iGate Interiors <website@igateinteriors.com>',
  teamTo: ['info@igateinteriors.com', 'saif@igateinteriors.com', 'sabiullah@igateinteriors.com'],
  confirmationFrom: 'iGate Interiors <requests@igateinteriors.com>',
  confirmationReplyTo: 'info@igateinteriors.com',
  logoUrl: 'https://igateinteriors.com/brand/igate-logo-email.png',
};

const attachment = { filename: 'plan.pdf', content: Buffer.from('%PDF-1.7'), contentType: 'application/pdf' };

const request = (email?: string): CleanRequest => ({
  path: 'quick',
  values: { fullName: 'Sara', phone: '97234117', services: ['mep'], details: 'Hi', ...(email ? { email } : {}) },
  details: {},
});

/** Fake client that records every email and fails on the calls you choose. */
const fakeClient = (fail: (email: OutgoingEmail, index: number) => 'error' | 'throw' | null = () => null) => {
  const sent: OutgoingEmail[] = [];
  const client: EmailClient = {
    async send(email) {
      const outcome = fail(email, sent.length);
      sent.push(email);
      if (outcome === 'throw') throw new Error('network down');
      return { error: outcome === 'error' ? { message: 'rejected' } : null };
    },
  };
  return { client, sent };
};

const input = (req: CleanRequest, lang: 'en' | 'ar' = 'en') => ({
  request: req,
  reference: 'IG-REQ-201126-1342-K7',
  lang,
  attachments: [attachment],
  submittedAt: new Date('2026-11-20T10:42:00Z'),
});

describe('deliverRequest', () => {
  it('sends the team email to all three inboxes with Reply-To set to the client', async () => {
    const { client, sent } = fakeClient();
    await deliverRequest(client, config, input(request('sara@example.com')));
    const team = sent[0];
    expect(team.from).toBe(config.teamFrom);
    expect(team.to).toEqual(config.teamTo);
    expect(team.replyTo).toBe('sara@example.com');
    expect(team.subject).toContain('IG-REQ-201126-1342-K7');
    expect(team.attachments).toEqual([attachment]);
  });

  it('sends the client a confirmation without their files', async () => {
    const { client, sent } = fakeClient();
    const result = await deliverRequest(client, config, input(request('sara@example.com'), 'ar'));
    expect(result).toEqual({ team: 'sent', confirmation: 'sent' });
    const confirmation = sent[1];
    expect(confirmation.from).toBe(config.confirmationFrom);
    expect(confirmation.to).toEqual(['sara@example.com']);
    expect(confirmation.replyTo).toBe('info@igateinteriors.com');
    expect(confirmation.subject).toBe('استلمنا طلبك (IG-REQ-201126-1342-K7)');
    expect(confirmation.attachments ?? []).toHaveLength(0);
  });

  it('skips the confirmation and Reply-To when the client gave no email', async () => {
    const { client, sent } = fakeClient();
    const result = await deliverRequest(client, config, input(request()));
    expect(result).toEqual({ team: 'sent', confirmation: 'skipped' });
    expect(sent).toHaveLength(1);
    expect(sent[0].replyTo).toBeUndefined();
  });

  it.each(['error', 'throw'] as const)('still reports the team email as sent when the confirmation fails (%s)', async (mode) => {
    const { client, sent } = fakeClient((_, i) => (i === 1 ? mode : null));
    const result = await deliverRequest(client, config, input(request('sara@example.com')));
    expect(result).toEqual({ team: 'sent', confirmation: 'failed' });
    expect(sent).toHaveLength(2);
  });

  it.each(['error', 'throw'] as const)('reports a failed team email and does not confirm to the client (%s)', async (mode) => {
    const { client, sent } = fakeClient((_, i) => (i === 0 ? mode : null));
    const result = await deliverRequest(client, config, input(request('sara@example.com')));
    expect(result).toEqual({ team: 'failed', confirmation: 'skipped' });
    expect(sent).toHaveLength(1);
  });

  it('skips the confirmation when the address has had too many today', async () => {
    const { client, sent } = fakeClient();
    const limited = { ...config, canConfirm: (address: string) => address !== 'sara@example.com' };
    const result = await deliverRequest(client, limited, input(request('sara@example.com')));
    expect(result).toEqual({ team: 'sent', confirmation: 'skipped' });
    expect(sent).toHaveLength(1);
  });
});
