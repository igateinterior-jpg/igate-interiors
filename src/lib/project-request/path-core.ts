import { NO, NOT_SURE, PROJECT_DETAILS_STEP, YES, otherOption } from './shared-fields';
import type { PathDef, StepDef } from './types';

const UNIT_STEP: StepDef = {
  id: 'unit',
  title: { en: 'Unit', ar: 'الوحدة' },
  fields: [
    {
      id: 'unitType',
      type: 'chips',
      mode: 'single',
      label: { en: 'Original unit typology', ar: 'نوع الوحدة الأصلي' },
      required: true,
      options: [
        { id: 'fnb', label: { en: 'F&B (restaurant / cafe / heavy cooking)', ar: 'الأغذية والمشروبات (مطعم / مقهى / طهي ثقيل)' } },
        { id: 'retail', label: { en: 'Retail (standard retail / fashion / cosmetics)', ar: 'تجزئة (تجزئة قياسية / أزياء / مستحضرات تجميل)' } },
        { id: 'anchor', label: { en: 'Anchor / large format unit', ar: 'وحدة رئيسية / وحدة ذات مساحة كبيرة' } },
      ],
    },
    {
      id: 'assets',
      type: 'chips',
      mode: 'multi',
      label: { en: 'Asset salvage and warehouse transfer', ar: 'استرداد الأصول والنقل إلى المستودع' },
      question: { en: 'Items to save and send to your warehouse.', ar: 'المواد المراد حفظها وإرسالها إلى مستودعكم.' },
      required: true,
      options: [
        { id: 'lighting', label: { en: 'Lighting fixtures removal and packaging', ar: 'إزالة وحدات الإضاءة وتغليفها' } },
        { id: 'sound', label: { en: 'Sound / music systems dismantle and packing', ar: 'فك وتغليف أنظمة الصوت / الموسيقى' } },
        { id: 'cctv', label: { en: 'CCTV removal and packing', ar: 'فك وتغليف كاميرات المراقبة' } },
        { id: 'chillers', label: { en: 'Walk-in chillers / freezers dismantle and transfer', ar: 'فك ونقل غرف التبريد / التجميد' } },
        { id: 'hvac', label: { en: 'HVAC / AC units', ar: 'وحدات التكييف والتهوية' } },
        { id: 'demolishAll', label: { en: 'Everything can be demolished', ar: 'يمكن هدم كل شيء' }, exclusive: true },
        { id: 'none', label: { en: 'None', ar: 'لا يوجد' }, exclusive: true },
      ],
    },
  ],
};

const CIVIL_STEP: StepDef = {
  id: 'civil',
  title: { en: 'Civil and structural', ar: 'الأعمال المدنية والإنشائية' },
  fields: [
    {
      id: 'demolition',
      type: 'chips',
      mode: 'multi',
      label: { en: 'Civil and structural demolition requirements', ar: 'متطلبات الهدم المدني والإنشائي' },
      required: true,
      options: [
        { id: 'screed', label: { en: 'Floor screed removal', ar: 'إزالة صبة الأرضية' } },
        { id: 'deepSlab', label: { en: 'Deep slab removal back to structural slab level', ar: 'إزالة عميقة وصولاً إلى مستوى البلاطة الإنشائية' } },
        { id: 'tiles', label: { en: 'Tile / finishes stripping only (keep existing concrete screed)', ar: 'قشط البلاط / التشطيبات فقط (الإبقاء على صبة السكريد الخرسانية الحالية)' } },
        { id: 'walls', label: { en: 'Demolish all internal walls and strip perimeter blocks to bare state', ar: 'هدم جميع الجدران الداخلية وتقشير البلوكات المحيطية حتى الحالة الأساسية' } },
        { id: 'ceilings', label: { en: 'Remove all false ceilings and expose upper concrete slab', ar: 'إزالة جميع الأسقف المستعارة وكشف البلاطة الخرسانية العلوية' } },
        { id: 'shopfront', label: { en: 'Remove shopfront and reinstate original mall boundary portal', ar: 'إزالة واجهة المحل وإعادة بناء بوابة حدود المجمع الأصلية' } },
        { id: 'mezzanine', label: { en: 'Complete removal of internal mezzanine floor', ar: 'إزالة كاملة لطابق الميزانين الداخلي' } },
      ],
    },
    {
      id: 'screedDepth',
      type: 'chips',
      mode: 'single',
      label: { en: 'Target screed depressed depth', ar: 'عمق انخفاض صبة السكريد المستهدف' },
      question: { en: 'Asked because deep slab removal is selected.', ar: 'يظهر هذا السؤال لأنك اخترت الإزالة العميقة.' },
      required: true,
      showIf: { field: 'demolition', includes: 'deepSlab' },
      options: [
        { id: 'ffl10', label: { en: 'FFL 10 cm below mall', ar: 'مستوى الأرضية المشطبة (FFL) أقل بـ 10 سم من المجمع' } },
        { id: 'ffl12', label: { en: 'FFL 12 cm below mall', ar: 'مستوى الأرضية المشطبة (FFL) أقل بـ 12 سم من المجمع' } },
        { id: 'ffl15', label: { en: 'FFL 15 cm below mall', ar: 'مستوى الأرضية المشطبة (FFL) أقل بـ 15 سم من المجمع' } },
        { id: 'ffl20', label: { en: 'FFL 20 cm below mall', ar: 'مستوى الأرضية المشطبة (FFL) أقل بـ 20 سم من المجمع' } },
        { id: 'na', label: { en: 'Not applicable', ar: 'لا ينطبق' } },
      ],
    },
  ],
};

const MEP_STEP: StepDef = {
  id: 'mep',
  title: { en: 'MEP', ar: 'الخدمات' },
  fields: [
    {
      id: 'mep',
      type: 'chips',
      mode: 'multi',
      label: { en: 'MEP and services disconnection boundaries', ar: 'حدود فصل الخدمات والأعمال الميكانيكية والكهربائية والسباكة (MEP)' },
      question: { en: 'Mark as required.', ar: 'يرجى تحديد المطلوب.' },
      required: true,
      options: [
        { id: 'hvac', label: { en: 'HVAC: isolate chilled water lines and cap at lease line boundary', ar: 'التكييف والتهوية (HVAC): عزل خطوط المياه المبردة وسدها عند حدود خط الإيجار' } },
        { id: 'plumbing', label: { en: 'Plumbing: strip internal lines and cap main kitchen waste stacks / gullies', ar: 'السباكة: تفكيك الخطوط الداخلية وسد أنابيب الصرف الرئيسية للمطبخ / البالوعات' } },
        { id: 'electrical', label: { en: 'Electrical: strip sub-circuit wiring / trays, keep main incoming armoured cable in DB', ar: 'الكهرباء: تفكيك تمديدات الدوائر الفرعية / حاملات الكابلات، والإبقاء على كابل التغذية الرئيسي المدرّع داخل لوحة التوزيع (DB)' } },
        { id: 'fire', label: { en: 'Fire safety: disconnect and revert sprinklers / alarms to mall base grid layout', ar: 'السلامة من الحرائق: فصل رشاشات المياه / إنذارات الحريق وإعادتها إلى مخطط الشبكة الأساسي للمجمع' } },
      ],
    },
    {
      id: 'fnbExtras',
      type: 'chips',
      mode: 'multi',
      label: { en: 'F&B extras', ar: 'إضافات المطاعم' },
      question: { en: 'Asked because the unit is F&B.', ar: 'يظهر هذا السؤال لأن الوحدة مطعم أو مقهى.' },
      required: false,
      showIf: { field: 'unitType', includes: 'fnb' },
      options: [
        { id: 'exhaust', label: { en: 'Kitchen exhaust duct and hood removal', ar: 'إزالة مداخن وشفاطات المطبخ' } },
        { id: 'gas', label: { en: 'Gas line disconnection and capping by a certified party', ar: 'فصل خطوط الغاز وإغلاقها بواسطة جهة معتمدة' } },
        { id: 'grease', label: { en: 'Grease trap removal or cleaning', ar: 'إزالة أو تنظيف مصيدة الدهون' } },
      ],
    },
    {
      id: 'mepExtent',
      type: 'chips',
      mode: 'single',
      label: { en: 'Extent of MEP demolition', ar: 'مدى هدم الأعمال الميكانيكية والكهربائية والسباكة (MEP)' },
      question: { en: 'Mark as required.', ar: 'يرجى تحديد المطلوب.' },
      required: true,
      options: [
        { id: 'stubOut', label: { en: 'Remove networks all the way back to main stub-out point', ar: 'إزالة الشبكات بالكامل وصولاً إلى نقطة التوصيل الرئيسية (stub-out)' } },
        { id: 'capped', label: { en: 'Leave existing disconnected network safely capped at ceiling level', ar: 'ترك الشبكة الحالية المفصولة مسدودة بشكل آمن عند مستوى السقف' } },
      ],
    },
  ],
};

const TIMING_STEP: StepDef = {
  id: 'timing',
  title: { en: 'Timing and site', ar: 'المدة والموقع' },
  fields: [
    {
      id: 'workingHours',
      type: 'chips',
      mode: 'single',
      label: { en: 'Working hour restrictions', ar: 'قيود ساعات العمل' },
      question: {
        en: 'Are there any working hour restrictions for heavy machinery or high-impact tools that may disturb the mall during the Core & Shell works?',
        ar: 'هل توجد قيود على ساعات العمل بخصوص استخدام المعدات الثقيلة أو الأدوات عالية التأثير التي قد تسبب إزعاجاً للمجمع أثناء أعمال ترميم الهيكل والأساس؟',
      },
      required: true,
      options: [
        { id: 'night', label: { en: 'Night works only', ar: 'الأعمال ليلاً فقط' } },
        { id: 'dayNight', label: { en: 'Day and night allowed', ar: 'مسموح نهاراً وليلاً' } },
        { id: 'none', label: { en: 'No restrictions', ar: 'لا توجد قيود' } },
        { id: 'check', label: { en: 'Not sure, please check with the mall', ar: 'غير متأكد، يرجى التأكد مع إدارة المجمع' } },
        otherOption(),
      ],
    },
    {
      id: 'duration',
      type: 'chips',
      mode: 'single',
      label: { en: 'Duration for Core & Shell project', ar: 'مدة مشروع ترميم الهيكل والأساس' },
      required: true,
      options: [
        { id: 'd10', label: { en: '10 days', ar: '10 أيام' } },
        { id: 'd15', label: { en: '15 days', ar: '15 يوماً' } },
        { id: 'd20', label: { en: '20 days', ar: '20 يوماً' } },
        { id: 'd30', label: { en: '30 days', ar: '30 يوماً' } },
      ],
    },
    { id: 'handoverDate', type: 'date', label: { en: 'Handover deadline to the mall', ar: 'الموعد النهائي للتسليم إلى المجمع' }, required: false, futureOnly: true },
    { id: 'startDate', type: 'date', label: { en: 'Preferred start date', ar: 'تاريخ البدء المفضل' }, required: false, futureOnly: true },
    {
      id: 'hoarding',
      type: 'chips',
      mode: 'single',
      label: { en: 'Who is responsible for installing the dust-proof temporary hoarding?', ar: 'من المسؤول عن تركيب الحواجز المؤقتة المقاومة للغبار؟' },
      required: true,
      options: [
        { id: 'igate', label: { en: 'Contractor (iGATE to supply and install)', ar: 'المقاول (آي غيت تتولى التوريد والتركيب)' } },
        { id: 'mall', label: { en: 'Mall management', ar: 'إدارة المجمع' } },
        { id: 'exists', label: { en: 'Already exists', ar: 'موجود بالفعل' } },
      ],
    },
    {
      id: 'permits',
      type: 'chips',
      mode: 'single',
      label: { en: 'Permits and NOCs handled by', ar: 'تصاريح العمل وشهادات عدم الممانعة يتولاها' },
      required: false,
      options: [
        { id: 'igate', label: { en: 'iGATE', ar: 'آي غيت' } },
        { id: 'tenant', label: { en: 'Tenant', ar: 'المستأجر' } },
        NOT_SURE,
      ],
    },
    {
      id: 'insurance',
      type: 'chips',
      mode: 'single',
      label: { en: 'Insurance required by the mall (CAR / TPL)?', ar: 'هل يشترط المجمع تأميناً (CAR / TPL)؟' },
      required: false,
      options: [YES, NO, NOT_SURE],
    },
    {
      id: 'drawings',
      type: 'chips',
      mode: 'single',
      label: {
        en: 'Are original as-built / handover drawings from the mall available?',
        ar: 'هل المخططات الأصلية المنفذة على أرض الواقع (As-Built) / مخططات التسليم الخاصة بالمجمع متوفرة؟',
      },
      required: true,
      options: [
        { id: 'yes', label: { en: 'Yes (will email / WhatsApp drawings to iGATE)', ar: 'نعم (سيتم إرسال المخططات عبر البريد الإلكتروني / الواتساب إلى آي غيت)' } },
        { id: 'no', label: { en: 'No (requires a preliminary site survey to verify levels)', ar: 'لا (يتطلب إجراء معاينة ميدانية أولية للموقع للتحقق من المستويات)' } },
        otherOption(),
      ],
    },
    { id: 'visit', type: 'datetime', label: { en: 'Preferred site visit date and time', ar: 'الموعد المفضل للمعاينة الميدانية' }, required: false, futureOnly: true },
    {
      id: 'files',
      type: 'upload',
      label: { en: 'If you have any site photos or PDF, share with us', ar: 'إذا كانت لديك صور أو ملفات PDF لتفاصيل الموقع، شاركها معنا' },
      required: false,
      note: 'whatsapp',
    },
  ],
};

const PAYMENT_STEP: StepDef = {
  id: 'payment',
  title: { en: 'Payment', ar: 'الدفع' },
  fields: [
    {
      id: 'payment',
      type: 'chips',
      mode: 'multi',
      label: { en: 'Payment terms', ar: 'شروط الدفع' },
      required: true,
      options: [
        { id: 'cash', label: { en: 'Cash', ar: 'نقداً' } },
        { id: 'wamd', label: { en: 'WAMD', ar: 'ومض' } },
        { id: 'link', label: { en: 'Payment link', ar: 'رابط دفع' } },
        { id: 'transfer', label: { en: 'Bank transfer', ar: 'تحويل بنكي' } },
        { id: 'cheque', label: { en: 'Bank cheque', ar: 'شيك بنكي' } },
        { id: 'guarantee', label: { en: 'Bank guarantee', ar: 'خطاب ضمان بنكي' } },
        otherOption(),
      ],
    },
    { id: 'notes', type: 'textarea', label: { en: 'Notes', ar: 'ملاحظات إضافية' }, required: false },
  ],
};

export const CORE_PATH: PathDef = {
  id: 'core',
  title: { en: 'Core & Shell restoration', ar: 'ترميم الهيكل والأساس' },
  line: { en: 'Strip-out and handover back to the mall.', ar: 'تفريغ الوحدة وتسليمها للمجمع.' },
  emailLabel: 'Core & Shell restoration',
  heading: {
    en: 'iGATE Interiors: Core & Shell Restoration Request Form',
    ar: 'آي غيت للتصاميم الداخلية: نموذج طلب ترميم الهيكل والأساس',
  },
  description: {
    en: 'Please complete this form to confirm your site requirements. Accurate details ensure compliance with mall management requirements and a precise quotation.',
    ar: 'يرجى تعبئة هذا النموذج لتأكيد متطلبات الموقع الخاص بك. تضمن التفاصيل الدقيقة الالتزام بمتطلبات إدارة المجمع والحصول على عرض سعر دقيق.',
  },
  steps: [PROJECT_DETAILS_STEP, UNIT_STEP, CIVIL_STEP, MEP_STEP, TIMING_STEP, PAYMENT_STEP],
};
