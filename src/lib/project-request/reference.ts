const KUWAIT_TZ = 'Asia/Kuwait';

type Part = 'year' | 'month' | 'day' | 'hour' | 'minute';

const kuwaitParts = (now: Date): Record<Part, string> => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: KUWAIT_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: Part) => parts.find((p) => p.type === type)?.value ?? '';
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') };
};

/** Kuwait calendar date as YYYY-MM-DD, used to stop dates in the past. */
export function kuwaitDate(now: Date): string {
  const { year, month, day } = kuwaitParts(now);
  return `${year}-${month}-${day}`;
}

const SUFFIX_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SUFFIX_LENGTH = 2;

export const REFERENCE_PATTERN = /^IG-REQ-\d{6}-\d{4}-[A-Z0-9]{2}$/;

/**
 * Reference like IG-REQ-201126-1342-K7: Kuwait date (DDMMYY), time (HHMM) and
 * two random characters so requests sent in the same minute stay distinct.
 * `random` returns a number in [0, 1); the API passes a crypto-backed source.
 */
export function makeReference(now: Date, random: () => number): string {
  const { year, month, day, hour, minute } = kuwaitParts(now);
  const suffix = Array.from({ length: SUFFIX_LENGTH }, () => {
    const index = Math.min(SUFFIX_ALPHABET.length - 1, Math.floor(random() * SUFFIX_ALPHABET.length));
    return SUFFIX_ALPHABET[index];
  }).join('');
  return `IG-REQ-${day}${month}${year.slice(-2)}-${hour}${minute}-${suffix}`;
}
