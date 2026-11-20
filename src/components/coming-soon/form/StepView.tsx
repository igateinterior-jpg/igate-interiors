import { visibleFields } from '@/lib/project-request/paths';
import type { FieldDef, Lang, StepDef } from '@/lib/project-request/types';
import type { Copy } from '../copy';
import ChipField from './fields/ChipField';
import InputField from './fields/InputField';
import MallField from './fields/MallField';
import PhoneField from './fields/PhoneField';
import UploadField from './fields/UploadField';
import type { Wizard } from './useRequestWizard';
import fields from './fields/fields.module.css';

const renderField = (field: FieldDef, lang: Lang, copy: Copy, wizard: Wizard) => {
  const props = { field, lang, copy, wizard };
  switch (field.type) {
    case 'chips':
      return <ChipField key={field.id} {...props} />;
    case 'mall':
      return <MallField key={field.id} {...props} />;
    case 'phone':
      return <PhoneField key={field.id} {...props} />;
    case 'upload':
      return <UploadField key={field.id} {...props} />;
    default:
      return <InputField key={field.id} {...props} />;
  }
};

export default function StepView({ step, lang, copy, wizard }: { step: StepDef; lang: Lang; copy: Copy; wizard: Wizard }) {
  return (
    <div className={fields.grid}>
      {visibleFields(step, wizard.state.values).map((field) => renderField(field, lang, copy, wizard))}
    </div>
  );
}
