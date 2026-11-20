/** iGate contact details, shared by the page and the emails. */
export const CONTACT = {
  whatsappNumber: '96597234117',
  phones: [
    { display: '(+965) 9723 4117', href: 'tel:+96597234117' },
    { display: '(+965) 6998 9934', href: 'tel:+96569989934' },
  ],
  email: 'info@igateinteriors.com',
} as const;

export const whatsappLink = (message?: string): string =>
  `https://wa.me/${CONTACT.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

const WHATSAPP_REFERENCE: Record<'en' | 'ar', (ref: string) => string> = {
  en: (ref) => `Hi, my request reference is ${ref}`,
  ar: (ref) => `مرحباً، الرقم المرجعي لطلبي هو ${ref}`,
};

/** Message prefilled in WhatsApp after a request, on the page and in the confirmation email. */
export const whatsappReferenceMessage = (lang: 'en' | 'ar', reference: string): string => WHATSAPP_REFERENCE[lang](reference);
