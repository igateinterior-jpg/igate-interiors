const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/**
 * The mailbox an address actually delivers to, used as a rate-limit key so
 * "sara+1@" or Gmail dot variants cannot dodge the per-address limit.
 */
export function mailboxKey(address: string): string {
  const [rawLocal = '', rawDomain = ''] = address.trim().toLowerCase().split('@');
  const local = rawLocal.split('+')[0];
  if (GMAIL_DOMAINS.has(rawDomain)) return `${local.replace(/\./g, '')}@gmail.com`;
  return `${local}@${rawDomain}`;
}
