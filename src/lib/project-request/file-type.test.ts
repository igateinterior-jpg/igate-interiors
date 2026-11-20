import { describe, expect, it } from 'vitest';
import { attachmentName, detectFileType } from './file-type';

const bytes = (...values: (number | string)[]): Uint8Array =>
  Uint8Array.from(values.flatMap((v) => (typeof v === 'string' ? [...v].map((c) => c.charCodeAt(0)) : [v])));

const PDF = bytes('%PDF-1.7', 0x0a);
const JPEG = bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 'JFIF');
const PNG = bytes(0x89, 'PNG', 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d);
const WEBP = bytes('RIFF', 0x24, 0, 0, 0, 'WEBPVP8 ');
const HEIC = bytes(0, 0, 0, 0x18, 'ftypheic', 0, 0, 0, 0, 'mif1');

describe('detectFileType', () => {
  it.each([
    ['PDF', PDF, 'pdf'],
    ['JPEG', JPEG, 'jpg'],
    ['PNG', PNG, 'png'],
    ['WebP', WEBP, 'webp'],
    ['HEIC', HEIC, 'heic'],
  ] as const)('recognises %s by its contents', (_, data, expected) => {
    expect(detectFileType(data)?.extension).toBe(expected);
  });

  it.each([
    ['a Windows program', bytes('MZ', 0x90, 0, 3, 0, 0, 0)],
    ['an HTML page', bytes('<!doctype html><script>')],
    ['an SVG image', bytes('<svg xmlns="http://www.w3.org/2000/svg">')],
    ['a ZIP archive', bytes('PK', 3, 4, 20, 0)],
    ['a RIFF file that is not WebP', bytes('RIFF', 0x24, 0, 0, 0, 'WAVEfmt ')],
    ['an empty file', bytes()],
  ])('rejects %s', (_, data) => {
    expect(detectFileType(data)).toBeNull();
  });
});

describe('attachmentName', () => {
  it('replaces the extension with the one matching the real contents', () => {
    expect(attachmentName('invoice.exe', 'pdf')).toBe('invoice.pdf');
    expect(attachmentName('shop front.JPG', 'jpg')).toBe('shop front.jpg');
    expect(attachmentName('plan.pdf.html', 'pdf')).toBe('plan.pdf');
  });

  it('strips unsafe characters and falls back to a default name', () => {
    expect(attachmentName('../../etc/passwd', 'png')).toBe('etc_passwd.png');
    expect(attachmentName('', 'pdf')).toBe('attachment.pdf');
    expect(attachmentName('مخطط.pdf', 'pdf')).toBe('مخطط.pdf');
    expect(attachmentName('<>.pdf', 'pdf')).toBe('attachment.pdf');
  });

  it('keeps names to a sensible length', () => {
    expect(attachmentName(`${'a'.repeat(300)}.pdf`, 'pdf')).toHaveLength(124);
  });
});
