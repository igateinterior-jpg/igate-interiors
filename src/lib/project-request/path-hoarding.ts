import { NO, NOT_SURE, PROJECT_DETAILS_STEP, YES } from './shared-fields';
import type { PathDef } from './types';

export const HOARDING_PATH: PathDef = {
  id: 'hoarding',
  title: { en: 'Hoarding request', ar: 'طلب حاجز مؤقت' },
  line: { en: 'Hoarding for a mall unit.', ar: 'حاجز مؤقت لوحدة في مجمع.' },
  emailLabel: 'Hoarding request',
  steps: [
    PROJECT_DETAILS_STEP,
    {
      id: 'hoarding',
      title: { en: 'Hoarding details', ar: 'تفاصيل الحاجز' },
      fields: [
        { id: 'frontage', type: 'number', label: { en: 'Frontage width (m)', ar: 'عرض الواجهة (م)' }, required: true, max: 1000 },
        {
          id: 'height',
          type: 'chips',
          mode: 'single',
          label: { en: 'Height', ar: 'الارتفاع' },
          required: true,
          options: [
            { id: 'full', label: { en: 'Full height to the ceiling', ar: 'حتى السقف بالكامل' } },
            {
              id: 'set',
              label: { en: 'Set height', ar: 'تحديد ارتفاع معين' },
              detail: 'number',
              detailLabel: { en: 'Height (m)', ar: 'الارتفاع (م)' },
            },
          ],
        },
        {
          id: 'fireRated',
          type: 'chips',
          mode: 'single',
          label: { en: 'Fire-rated hoarding needed?', ar: 'هل يلزم حاجز مقاوم للحريق؟' },
          required: true,
          options: [YES, NO, { id: 'mall', label: { en: 'As the mall requires', ar: 'حسب متطلبات المجمع' } }],
        },
        {
          id: 'graphics',
          type: 'chips',
          mode: 'single',
          label: { en: 'Graphics on the hoarding', ar: 'الطباعة على الحاجز' },
          required: true,
          options: [
            { id: 'client', label: { en: 'Brand artwork supplied by client', ar: 'تصميم العلامة مقدم من العميل' } },
            { id: 'igate', label: { en: 'iGate to design to brand guidelines', ar: 'تصميم من iGate وفق هوية العلامة' } },
            { id: 'mall', label: { en: 'Mall standard graphics', ar: 'تصميم المجمع المعتمد' } },
            { id: 'plain', label: { en: 'Plain painted, no print', ar: 'دهان فقط بدون طباعة' } },
          ],
        },
        {
          id: 'accessDoor',
          type: 'chips',
          mode: 'single',
          label: { en: 'Access door needed?', ar: 'هل يلزم باب دخول؟' },
          required: true,
          options: [YES, NO],
        },
        {
          id: 'installDate',
          type: 'date',
          label: { en: 'Installation date needed', ar: 'تاريخ التركيب المطلوب' },
          required: true,
          futureOnly: true,
        },
        {
          id: 'timeOnSite',
          type: 'chips',
          mode: 'single',
          label: { en: 'Expected time on site', ar: 'مدة بقاء الحاجز المتوقعة' },
          required: false,
          options: [
            { id: 'under1', label: { en: 'Under 1 month', ar: 'أقل من شهر' } },
            { id: '1to3', label: { en: '1 to 3 months', ar: 'من شهر إلى 3 أشهر' } },
            { id: 'over3', label: { en: 'More than 3 months', ar: 'أكثر من 3 أشهر' } },
          ],
        },
        {
          id: 'removal',
          type: 'chips',
          mode: 'single',
          label: { en: 'Removal included?', ar: 'هل تشمل الأعمال إزالة الحاجز؟' },
          required: false,
          options: [YES, NO, NOT_SURE],
        },
        { id: 'files', type: 'upload', label: { en: 'Photos of the unit front', ar: 'صور واجهة الوحدة' }, required: false },
        { id: 'notes', type: 'textarea', label: { en: 'Notes', ar: 'ملاحظات' }, required: false },
      ],
    },
  ],
};
