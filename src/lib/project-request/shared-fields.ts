import type { Bilingual, ChipOption, FieldDef, StepDef } from './types';

export const YES: ChipOption = { id: 'yes', label: { en: 'Yes', ar: 'نعم' } };
export const NO: ChipOption = { id: 'no', label: { en: 'No', ar: 'لا' } };
export const NOT_SURE: ChipOption = { id: 'notSure', label: { en: 'Not sure', ar: 'غير متأكد' } };

export const otherOption = (detailLabel: Bilingual = { en: 'Please specify', ar: 'يرجى التحديد' }): ChipOption => ({
  id: 'other',
  label: { en: 'Other', ar: 'أخرى' },
  detail: 'text',
  detailLabel,
});

export const MALLS: readonly ChipOption[] = [
  { id: 'avenues', label: { en: 'The Avenues', ar: 'الأفنيوز' } },
  { id: '360', label: { en: '360 Mall', ar: 'مجمع 360' } },
  { id: 'kout', label: { en: 'Al Kout Mall', ar: 'مجمع الكوت' } },
  { id: 'khiran', label: { en: 'Al Khiran Mall', ar: 'مجمع الخيران' } },
  { id: 'warehouse', label: { en: 'The Warehouse Mall', ar: 'ذا ويرهاوس مول' } },
  { id: 'marina', label: { en: 'Marina Mall', ar: 'مارينا مول' } },
  { id: 'gate', label: { en: 'Gate Mall', ar: 'ذا غيت مول' } },
  { id: 'assima', label: { en: 'Assima Mall', ar: 'العاصمة مول' } },
  { id: 'hamra', label: { en: 'Al Hamra Mall', ar: 'مجمع الحمراء' } },
  { id: 'sharq', label: { en: 'Souq Sharq', ar: 'سوق شرق' } },
  otherOption({ en: 'Mall name and location', ar: 'اسم المجمع والموقع' }),
];

export const SERVICES: readonly ChipOption[] = [
  { id: 'fitout', label: { en: 'Interior fit-out', ar: 'التجهيز الداخلي' } },
  { id: 'hoarding', label: { en: 'Mall hoarding', ar: 'الحواجز المؤقتة في المجمعات' } },
  { id: 'demolition', label: { en: 'Demolition and strip-out', ar: 'الهدم والتفريغ' } },
  { id: 'coreShell', label: { en: 'Core & Shell restoration', ar: 'ترميم الهيكل والأساس' } },
  { id: 'mep', label: { en: 'MEP works', ar: 'أعمال الكهرباء والميكانيك والسباكة' } },
  { id: 'joinery', label: { en: 'Joinery', ar: 'أعمال النجارة' } },
  { id: 'maintenance', label: { en: 'Maintenance', ar: 'الصيانة' } },
  { id: 'other', label: { en: 'Other', ar: 'أخرى' } },
];

const text = (id: string, label: Bilingual, required: boolean): FieldDef => ({ id, type: 'text', label, required });

/** Project details asked by both the hoarding and the Core & Shell paths. */
export const PROJECT_DETAILS_STEP: StepDef = {
  id: 'project',
  title: { en: 'Project details', ar: 'تفاصيل المشروع' },
  fields: [
    text('projectCode', { en: 'Reference number / project code', ar: 'الرقم المرجعي / رمز المشروع' }, false),
    text('company', { en: 'Client / tenant company name', ar: 'اسم الشركة العميل / المستأجر' }, true),
    text('brand', { en: 'Brand / trading name', ar: 'الاسم التجاري / العلامة التجارية' }, true),
    {
      id: 'mall',
      type: 'mall',
      label: { en: 'Mall name and location', ar: 'اسم المجمع والموقع' },
      required: true,
      options: MALLS,
    },
    text('shop', { en: 'Shop number and floor level', ar: 'رقم المحل والطابق' }, true),
    { id: 'area', type: 'number', label: { en: 'Unit area (m²)', ar: 'مساحة الوحدة (م²)' }, required: false, max: 100000 },
    text('coordinator', {
      en: 'Mall operations coordinator / RDM name',
      ar: 'اسم منسق عمليات المجمع / مدير التصميم العقاري (RDM)',
    }, false),
    text('manager', { en: 'Tenant project manager', ar: 'مدير مشروع المستأجر' }, true),
    { id: 'phone', type: 'phone', label: { en: 'Contact number', ar: 'رقم التواصل' }, required: true },
    { id: 'email', type: 'email', label: { en: 'Email', ar: 'البريد الإلكتروني' }, required: false },
    text('representative', { en: 'Client representative’s name', ar: 'اسم ممثل العميل' }, true),
  ],
};
