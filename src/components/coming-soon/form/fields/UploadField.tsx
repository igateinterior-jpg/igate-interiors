import type { ChangeEvent } from 'react';
import { UPLOAD_LIMITS } from '@/lib/project-request/paths';
import { whatsappLink } from '../../copy';
import page from '../../page.module.css';
import type { FieldProps } from './types';
import FieldLabel, { FieldError } from './FieldLabel';
import styles from './fields.module.css';

const formatSize = (bytes: number): string =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export default function UploadField({ field, lang, copy, wizard }: FieldProps) {
  const { state, dispatch, fileError } = wizard;
  const labelId = `field-${field.id}-label`;
  const hintId = `field-${field.id}-hint`;
  const errorId = `field-${field.id}-error`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    if (picked.length > 0) dispatch({ type: 'addFiles', files: picked });
    // Reset so the same file can be picked again after removing it.
    event.target.value = '';
  };

  return (
    <div className={styles.field} data-wide>
      <span id={labelId}>
        <FieldLabel text={field.label[lang]} required={false} copy={copy} as="span" />
      </span>
      <label className={styles.dropZone} data-invalid={fileError ? true : undefined}>
        <input
          type="file"
          multiple
          accept={UPLOAD_LIMITS.acceptedTypes.join(',')}
          onChange={handleChange}
          aria-labelledby={labelId}
          aria-describedby={[hintId, fileError ? errorId : ''].filter(Boolean).join(' ')}
          aria-invalid={fileError ? true : undefined}
          className={styles.fileInput}
        />
        <span className={styles.dropAction}>
          <span className={page.touchOnly}>{copy.uploadTouch}</span>
          <span className={page.pointerOnly}>{copy.uploadPointer}</span>
        </span>
        <span id={hintId} className={styles.hint}>
          {copy.uploadHint}
        </span>
      </label>
      {field.note === 'whatsapp' && (
        <a className={styles.uploadNote} href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          {copy.largerDrawings}
        </a>
      )}
      {state.files.length > 0 && (
        <ul className={styles.fileList}>
          {state.files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${index}`} className={styles.fileItem}>
              <span className={styles.fileName} dir="ltr">{file.name}</span>
              <span className={styles.fileSize} dir="ltr">{formatSize(file.size)}</span>
              <button
                type="button"
                className={styles.fileRemove}
                onClick={() => dispatch({ type: 'removeFile', index })}
                aria-label={copy.removeFile(file.name)}
              >
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      <FieldError id={errorId} message={fileError ? copy.fileErrors[fileError] : undefined} />
    </div>
  );
}
