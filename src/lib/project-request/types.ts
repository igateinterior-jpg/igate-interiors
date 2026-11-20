export type Lang = 'en' | 'ar';
export type Bilingual = Readonly<Record<Lang, string>>;

export type PathId = 'quick' | 'hoarding' | 'core';

export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'textarea'
  | 'date'
  | 'datetime'
  | 'mall'
  | 'chips'
  | 'upload';

export interface ChipOption {
  readonly id: string;
  readonly label: Bilingual;
  /** Choosing this option clears every other option in the field, and the reverse. */
  readonly exclusive?: boolean;
  /** Choosing this option reveals a follow-up box that must be filled in. */
  readonly detail?: 'text' | 'number';
  readonly detailLabel?: Bilingual;
}

export interface Condition {
  readonly field: string;
  readonly includes: string;
}

export interface FieldDef {
  readonly id: string;
  readonly type: FieldType;
  readonly label: Bilingual;
  readonly required: boolean;
  /** Longer wording shown under the label. */
  readonly question?: Bilingual;
  readonly placeholder?: Bilingual;
  readonly mode?: 'single' | 'multi';
  readonly options?: readonly ChipOption[];
  /** Field is only asked, validated and sent when the condition holds. */
  readonly showIf?: Condition;
  readonly max?: number;
  /** Dates that cannot be in the past. */
  readonly futureOnly?: boolean;
  /** Extra line under an upload box. */
  readonly note?: 'whatsapp';
}

export interface StepDef {
  readonly id: string;
  readonly title: Bilingual;
  readonly fields: readonly FieldDef[];
}

export interface PathDef {
  readonly id: PathId;
  readonly title: Bilingual;
  readonly line: Bilingual;
  /** English label used in the email subject. */
  readonly emailLabel: string;
  readonly heading?: Bilingual;
  readonly description?: Bilingual;
  readonly steps: readonly StepDef[];
}

export type FieldValue = string | readonly string[];
export type Values = Readonly<Record<string, FieldValue>>;
export type Details = Readonly<Record<string, string>>;
