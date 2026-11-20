import type { Lang } from '@/lib/project-request/types';
import type { ErrorCode, FileErrorCode } from '@/lib/project-request/validate';

import { whatsappReferenceMessage } from '@/lib/contact';

export { CONTACT, whatsappLink } from '@/lib/contact';

interface Step {
  readonly title: string;
  readonly text: string;
}

export interface Copy {
  readonly pageTitle: string;
  readonly switchTo: string;
  readonly switchLabel: string;
  readonly skipToForm: string;
  readonly toLight: string;
  readonly toDark: string;
  readonly location: string;
  readonly heading: string;
  readonly subheading: string;
  readonly doorLabel: string;
  readonly doorSign: string;
  readonly doorHintTouch: string;
  readonly doorHintPointer: string;
  readonly safetySign: string;
  readonly contractorPlate: string;
  readonly permitTitle: string;
  readonly permitStamp: string;
  readonly whatsapp: string;
  readonly behindHeading: string;
  readonly behindSub: string;
  readonly whatWeDo: string;
  readonly services: readonly string[];
  readonly howWeWork: string;
  readonly steps: readonly Step[];
  readonly mallsHeading: string;
  readonly malls: readonly string[];
  readonly formHeading: string;
  readonly formSub: string;
  readonly choosePath: string;
  readonly stepOf: (current: number, total: number) => string;
  readonly stepOnly: (current: number) => string;
  readonly back: string;
  readonly next: string;
  readonly backToReview: string;
  readonly requiredSr: string;
  readonly optional: string;
  readonly chooseOne: string;
  readonly selectAll: string;
  readonly chooseMall: string;
  readonly draftSaved: string;
  readonly clearForm: string;
  readonly clearConfirm: string;
  readonly uploadTouch: string;
  readonly uploadPointer: string;
  readonly uploadHint: string;
  readonly largerDrawings: string;
  readonly removeFile: (name: string) => string;
  readonly summaryTitle: string;
  readonly reviewTitle: string;
  readonly edit: string;
  readonly editStep: (title: string) => string;
  readonly notAnswered: string;
  readonly noFiles: string;
  readonly confirmLabel: string;
  readonly send: string;
  readonly sending: string;
  readonly thankYou: string;
  readonly referenceLabel: string;
  readonly whatsappReference: (reference: string) => string;
  readonly failed: string;
  readonly rateLimited: string;
  readonly fixErrors: string;
  readonly errors: Readonly<Record<ErrorCode, string>>;
  readonly fileErrors: Readonly<Record<FileErrorCode, string>>;
  readonly kuwait: string;
  readonly rights: string;
}

const en: Copy = {
  pageTitle: 'iGate Interiors | Fit-out contractor in Kuwait',
  switchTo: 'عربي',
  switchLabel: 'View this page in Arabic',
  skipToForm: 'Skip to request form',
  toLight: 'Light mode',
  toDark: 'Dark mode',
  location: 'KUWAIT',
  heading: 'Something new is being built.',
  subheading:
    'Our new website is on the way. Fit-outs, mall hoardings, demolition and Core & Shell restoration across Kuwait.',
  doorLabel: 'Enter the site',
  doorSign: 'Authorised entry',
  doorHintTouch: 'Tap the door to step inside',
  doorHintPointer: 'Click the door to step inside',
  safetySign: 'Works in progress',
  contractorPlate: 'Fit-out by iGate Interiors',
  permitTitle: 'Work permit',
  permitStamp: 'Approved',
  whatsapp: 'WhatsApp us',
  behindHeading: 'Behind the hoarding',
  behindSub: 'See what’s cooking.',
  whatWeDo: 'What we do',
  services: [
    'Mall hoardings',
    'Demolition and strip-out',
    'Core & Shell restoration',
    'Interior fit-out',
    'MEP works',
    'Joinery',
    'Maintenance',
  ],
  howWeWork: 'How we work',
  steps: [
    { title: 'Site visit', text: 'We visit the unit, check levels and take measurements.' },
    { title: 'Quotation', text: 'A clear scope and price, usually within 24 hours of the visit.' },
    { title: 'Works', text: 'Permits, hoarding and works during the hours the mall allows.' },
    { title: 'Handover', text: 'Snag clearance and formal handover to the mall.' },
  ],
  mallsHeading: 'Malls we work in',
  malls: ['The Avenues', '360 Mall', 'Al Kout Mall', 'Al Khiran Mall', 'The Warehouse Mall', 'Marina Mall'],
  formHeading: 'Project request',
  formSub: 'Tell us what you need and we will get back to you within 24 hours.',
  choosePath: 'What do you need?',
  stepOf: (current, total) => `Step ${current} of ${total}`,
  stepOnly: (current) => `Step ${current}`,
  back: 'Back',
  next: 'Next',
  backToReview: 'Back to review',
  requiredSr: 'required',
  optional: 'Optional',
  chooseOne: 'Choose one',
  selectAll: 'Select all that apply',
  chooseMall: 'Choose a mall',
  draftSaved: 'Draft saved',
  clearForm: 'Clear form',
  clearConfirm: 'Clear every answer and start again?',
  uploadTouch: 'Tap to upload',
  uploadPointer: 'Click to upload',
  uploadHint: 'Images or PDF, up to 6 files and 4 MB in total.',
  largerDrawings: 'Larger drawings? Send them on WhatsApp.',
  removeFile: (name) => `Remove ${name}`,
  summaryTitle: 'Your request',
  reviewTitle: 'Review your request',
  edit: 'Edit',
  editStep: (title) => `Edit ${title}`,
  notAnswered: 'Not answered',
  noFiles: 'None',
  confirmLabel: 'I confirm the details above are correct.',
  send: 'Send request',
  sending: 'Sending...',
  thankYou: 'Thank you. We have your request and will contact you within 24 hours.',
  referenceLabel: 'Your reference',
  whatsappReference: (ref) => whatsappReferenceMessage('en', ref),
  failed: 'Your request could not be sent. Try again or send the details on WhatsApp.',
  rateLimited: 'Too many requests from this connection. Try again in an hour or send the details on WhatsApp.',
  fixErrors: 'Some answers need attention. Check the fields marked below.',
  errors: {
    required: 'This field is required.',
    chooseOption: 'Choose at least one option.',
    invalidPhone: 'Enter a valid Kuwait number (8 digits).',
    invalidEmail: 'Enter a valid email address.',
    invalidNumber: 'Enter a number greater than 0.',
    invalidDate: 'Enter a valid date that is not in the past.',
    tooLong: 'This answer is too long.',
    invalidOption: 'Choose from the options shown.',
    confirm: 'Tick the box to confirm.',
  },
  fileErrors: {
    tooMany: 'Upload up to 6 files.',
    tooLarge: 'Files are too large. Total limit is 4 MB.',
    badType: 'Only images and PDF files can be uploaded.',
  },
  kuwait: 'Kuwait',
  rights: '© 2026 iGate Interiors. All rights reserved.',
};

const ar: Copy = {
  pageTitle: 'iGate Interiors | مقاول تجهيز داخلي في الكويت',
  switchTo: 'English',
  switchLabel: 'View this page in English',
  skipToForm: 'انتقل إلى نموذج الطلب',
  toLight: 'الوضع الفاتح',
  toDark: 'الوضع الداكن',
  location: 'الكويت',
  heading: 'نبني شيئاً جديداً.',
  subheading:
    'موقعنا الجديد قادم قريباً. تجهيز داخلي وحواجز مؤقتة في المجمعات وهدم وترميم الهيكل والأساس في جميع أنحاء الكويت.',
  doorLabel: 'ادخل إلى الموقع',
  doorSign: 'دخول مصرّح به',
  doorHintTouch: 'اضغط على الباب للدخول',
  doorHintPointer: 'انقر على الباب للدخول',
  safetySign: 'أعمال قيد التنفيذ',
  contractorPlate: 'التنفيذ بواسطة آي غيت للتصميم الداخلي',
  permitTitle: 'تصريح عمل',
  permitStamp: 'معتمد',
  whatsapp: 'تواصل عبر واتساب',
  behindHeading: 'خلف الحاجز',
  behindSub: 'شاهد ما نعمل عليه.',
  whatWeDo: 'ما نقدمه',
  services: [
    'الحواجز المؤقتة في المجمعات',
    'الهدم والتفريغ',
    'ترميم الهيكل والأساس',
    'التجهيز الداخلي',
    'أعمال الكهرباء والميكانيك والسباكة',
    'أعمال النجارة',
    'الصيانة',
  ],
  howWeWork: 'كيف نعمل',
  steps: [
    { title: 'الزيارة الميدانية', text: 'نزور الوحدة ونتحقق من المناسيب ونأخذ القياسات.' },
    { title: 'عرض السعر', text: 'نطاق عمل وسعر واضحان، غالباً خلال 24 ساعة من الزيارة.' },
    { title: 'التنفيذ', text: 'التصاريح والحاجز المؤقت والأعمال خلال الأوقات التي يسمح بها المجمع.' },
    { title: 'التسليم', text: 'معالجة الملاحظات والتسليم الرسمي للمجمع.' },
  ],
  mallsHeading: 'المجمعات التي نعمل فيها',
  malls: ['الأفنيوز', 'مجمع 360', 'مجمع الكوت', 'مجمع الخيران', 'ذا ويرهاوس مول', 'مارينا مول'],
  formHeading: 'طلب مشروع',
  formSub: 'أخبرنا بما تحتاجه وسنتواصل معك خلال 24 ساعة.',
  choosePath: 'ما الذي تحتاجه؟',
  stepOf: (current, total) => `الخطوة ${current} من ${total}`,
  stepOnly: (current) => `الخطوة ${current}`,
  back: 'السابق',
  next: 'التالي',
  backToReview: 'العودة إلى المراجعة',
  requiredSr: 'مطلوب',
  optional: 'اختياري',
  chooseOne: 'اختر واحداً',
  selectAll: 'اختر كل ما ينطبق',
  chooseMall: 'اختر المجمع',
  draftSaved: 'تم حفظ المسودة',
  clearForm: 'مسح النموذج',
  clearConfirm: 'هل تريد مسح جميع الإجابات والبدء من جديد؟',
  uploadTouch: 'اضغط لرفع الملفات',
  uploadPointer: 'انقر لرفع الملفات',
  uploadHint: 'صور أو ملفات PDF، حتى 6 ملفات وبحجم إجمالي 4 ميغابايت.',
  largerDrawings: 'مخططات بحجم أكبر؟ أرسلها عبر واتساب.',
  removeFile: (name) => `إزالة ${name}`,
  summaryTitle: 'طلبك',
  reviewTitle: 'راجع طلبك',
  edit: 'تعديل',
  editStep: (title) => `تعديل ${title}`,
  notAnswered: 'لم تتم الإجابة',
  noFiles: 'لا يوجد',
  confirmLabel: 'أؤكد أن المعلومات أعلاه صحيحة.',
  send: 'إرسال الطلب',
  sending: 'جارٍ الإرسال...',
  thankYou: 'شكراً لك. استلمنا طلبك وسنتواصل معك خلال 24 ساعة.',
  referenceLabel: 'الرقم المرجعي لطلبك',
  whatsappReference: (ref) => whatsappReferenceMessage('ar', ref),
  failed: 'تعذّر إرسال طلبك. حاول مرة أخرى أو أرسل التفاصيل عبر واتساب.',
  rateLimited: 'طلبات كثيرة من هذا الاتصال. حاول بعد ساعة أو أرسل التفاصيل عبر واتساب.',
  fixErrors: 'بعض الإجابات تحتاج إلى مراجعة. تحقق من الحقول المحددة أدناه.',
  errors: {
    required: 'هذا الحقل مطلوب.',
    chooseOption: 'اختر خياراً واحداً على الأقل.',
    invalidPhone: 'أدخل رقماً كويتياً صحيحاً (8 أرقام).',
    invalidEmail: 'أدخل بريداً إلكترونياً صحيحاً.',
    invalidNumber: 'أدخل رقماً أكبر من 0.',
    invalidDate: 'أدخل تاريخاً صحيحاً لا يسبق اليوم.',
    tooLong: 'هذه الإجابة طويلة جداً.',
    invalidOption: 'اختر من الخيارات المعروضة.',
    confirm: 'ضع علامة في المربع للتأكيد.',
  },
  fileErrors: {
    tooMany: 'يمكنك تحميل 6 ملفات كحد أقصى.',
    tooLarge: 'حجم الملفات كبير جداً. الحد الأقصى 4 ميغابايت.',
    badType: 'يمكن تحميل الصور وملفات PDF فقط.',
  },
  kuwait: 'الكويت',
  rights: '© 2026 آي غيت للتصميم الداخلي. جميع الحقوق محفوظة.',
};

export const COPY: Readonly<Record<Lang, Copy>> = { en, ar };
