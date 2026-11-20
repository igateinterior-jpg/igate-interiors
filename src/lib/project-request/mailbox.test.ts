import { describe, expect, it } from 'vitest';
import { mailboxKey } from './mailbox';

describe('mailboxKey', () => {
  it.each([
    ['Sara@Example.com ', 'sara@example.com'],
    ['sara+promo@example.com', 'sara@example.com'],
    ['s.a.r.a+1@gmail.com', 'sara@gmail.com'],
    ['Sara.Ahmed@googlemail.com', 'saraahmed@gmail.com'],
    ['sara.ahmed@outlook.com', 'sara.ahmed@outlook.com'],
  ])('treats %s as the mailbox %s', (input, expected) => {
    expect(mailboxKey(input)).toBe(expected);
  });
});
