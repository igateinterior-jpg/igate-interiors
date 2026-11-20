import { SERVICES } from './shared-fields';
import type { PathDef } from './types';

export const QUICK_PATH: PathDef = {
  id: 'quick',
  title: { en: 'Quick enquiry', ar: 'استفسار سريع' },
  line: { en: 'Any service, a few details.', ar: 'أي خدمة، ببعض التفاصيل.' },
  emailLabel: 'Quick enquiry',
  steps: [
    {
      id: 'enquiry',
      title: { en: 'Your enquiry', ar: 'استفسارك' },
      fields: [
        { id: 'fullName', type: 'text', label: { en: 'Full name', ar: 'الاسم الكامل' }, required: true },
        { id: 'company', type: 'text', label: { en: 'Company or brand', ar: 'الشركة أو العلامة التجارية' }, required: false },
        { id: 'phone', type: 'phone', label: { en: 'Phone', ar: 'رقم الهاتف' }, required: true },
        { id: 'email', type: 'email', label: { en: 'Email', ar: 'البريد الإلكتروني' }, required: false },
        {
          id: 'services',
          type: 'chips',
          mode: 'multi',
          label: { en: 'Service needed', ar: 'الخدمة المطلوبة' },
          required: true,
          options: SERVICES,
        },
        { id: 'location', type: 'text', label: { en: 'Mall or location', ar: 'المجمع أو الموقع' }, required: false },
        { id: 'details', type: 'textarea', label: { en: 'Project details', ar: 'تفاصيل المشروع' }, required: true },
        {
          id: 'contact',
          type: 'chips',
          mode: 'single',
          label: { en: 'Preferred contact', ar: 'طريقة التواصل المفضلة' },
          required: false,
          options: [
            { id: 'call', label: { en: 'Call', ar: 'اتصال' } },
            { id: 'whatsapp', label: { en: 'WhatsApp', ar: 'واتساب' } },
            { id: 'email', label: { en: 'Email', ar: 'بريد إلكتروني' } },
          ],
        },
        { id: 'files', type: 'upload', label: { en: 'Photos or drawings', ar: 'صور أو مخططات' }, required: false },
      ],
    },
  ],
};
