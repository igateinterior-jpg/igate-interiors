import type { FieldDef, Lang } from '@/lib/project-request/types';
import type { Copy } from '../../copy';
import type { Wizard } from '../useRequestWizard';

export interface FieldProps {
  readonly field: FieldDef;
  readonly lang: Lang;
  readonly copy: Copy;
  readonly wizard: Wizard;
}
