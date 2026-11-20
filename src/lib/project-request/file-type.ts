/**
 * Server-side file checks. The browser's reported MIME type and the file name
 * are both chosen by the sender, so uploads are identified by their first bytes
 * ("magic numbers") and renamed to match what they really are.
 */

export interface DetectedType {
  readonly extension: 'pdf' | 'jpg' | 'png' | 'webp' | 'heic';
  readonly mime: string;
}

const HEIC_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1']);
const MAX_NAME_LENGTH = 120;

const ascii = (bytes: Uint8Array, start: number, length: number): string =>
  String.fromCharCode(...bytes.subarray(start, start + length));

const startsWith = (bytes: Uint8Array, signature: readonly number[]): boolean =>
  bytes.length >= signature.length && signature.every((b, i) => bytes[i] === b);

export function detectFileType(bytes: Uint8Array): DetectedType | null {
  if (ascii(bytes, 0, 5) === '%PDF-') return { extension: 'pdf', mime: 'application/pdf' };
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { extension: 'jpg', mime: 'image/jpeg' };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { extension: 'png', mime: 'image/png' };
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return { extension: 'webp', mime: 'image/webp' };
  if (ascii(bytes, 4, 4) === 'ftyp' && HEIC_BRANDS.has(ascii(bytes, 8, 4))) return { extension: 'heic', mime: 'image/heic' };
  return null;
}

/** Safe attachment name: original name without its extensions, plus the extension of the real type. */
export function attachmentName(original: string, extension: DetectedType['extension']): string {
  const base = original
    .replace(/(\.[A-Za-z0-9]{1,5})+$/, '')
    .replace(/[^\p{L}\p{N} _-]+/gu, '_')
    .replace(/^[_ ]+|[_ ]+$/g, '')
    .slice(0, MAX_NAME_LENGTH);
  return `${base || 'attachment'}.${extension}`;
}
