'use client';

import { useRef } from 'react';
import { whatsappLink, type Copy } from '../copy';
import page from '../page.module.css';
import Door from './Door';
import { ContractorPlate, SafetySign } from './Signs';
import TopBar from './TopBar';
import { useDoor } from './useDoor';
import styles from './hoarding.module.css';

const HINT_ID = 'door-hint';

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.6 2.33A7.85 7.85 0 0 0 8 0C3.63 0 .07 3.56.06 7.93c0 1.4.37 2.76 1.06 3.96L0 16l4.2-1.1a7.93 7.93 0 0 0 3.8.96c4.37 0 7.93-3.56 7.93-7.93 0-2.12-.82-4.11-2.33-5.6ZM8 14.52a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.57 6.57 0 0 1-1-3.5c0-3.63 2.96-6.59 6.6-6.59a6.58 6.58 0 0 1 6.58 6.6c0 3.63-2.96 6.58-6.6 6.58Zm3.61-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.45.1-.13.2-.51.64-.63.78-.11.13-.23.15-.43.05a5.4 5.4 0 0 1-1.59-.98 5.97 5.97 0 0 1-1.1-1.37c-.11-.2 0-.3.09-.4l.3-.35c.1-.12.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.45-1.08-.61-1.47-.16-.39-.33-.33-.45-.34h-.38a.73.73 0 0 0-.53.25c-.18.2-.7.68-.7 1.66 0 .98.72 1.93.82 2.06.1.13 1.4 2.14 3.4 3 .47.2.84.33 1.13.42.48.15.91.13 1.25.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.08-.18-.13-.38-.23Z" />
    </svg>
  );
}

interface Props {
  readonly copy: Copy;
  readonly behindId: string;
  readonly formId: string;
  readonly onToggleLang: () => void;
}

export default function Hoarding({ copy, behindId, formId, onToggleLang }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const doorRef = useRef<HTMLButtonElement>(null);
  const door = useDoor(sceneRef, doorRef, behindId);

  return (
    <header className={styles.hoarding} data-door={door.state} data-phase={door.phase}>
      <TopBar copy={copy} formId={formId} onToggleLang={onToggleLang} />

      <div ref={sceneRef} className={styles.scene}>
        <div className={styles.stage}>
          <div className={styles.print}>
            <img src="/brand/igate-logo-dark.svg" alt="iGate Interiors" width={340} height={158} className={`${styles.logoPrint} ${styles.showInDark}`} />
            <img src="/brand/igate-logo-light.svg" alt="iGate Interiors" width={340} height={158} className={`${styles.logoPrint} ${styles.showInLight}`} />
            <p className={styles.location}>
              <span className={styles.locationMark} aria-hidden="true" />
              {copy.location}
            </p>
            <h1 className={styles.heading}>{copy.heading}</h1>
            <p className={styles.subheading}>{copy.subheading}</p>
            <a href={whatsappLink()} className={`${page.button} ${page.secondary} ${styles.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {copy.whatsapp}
            </a>
          </div>

          <SafetySign copy={copy} />
          <Door ref={doorRef} copy={copy} onEnter={door.enter} hintId={HINT_ID} />
          <ContractorPlate copy={copy} />
        </div>
        <div className={styles.band} aria-hidden="true" />
      </div>

      <div className={styles.floor}>
        <p id={HINT_ID} className={styles.hint}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 12V2M2.5 6.5 7 2l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span className={page.touchOnly}>{copy.doorHintTouch}</span>
          <span className={page.pointerOnly}>{copy.doorHintPointer}</span>
        </p>
      </div>
    </header>
  );
}
