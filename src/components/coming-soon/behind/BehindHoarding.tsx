import type { Copy } from '../copy';
import styles from './behind.module.css';

interface Props {
  readonly copy: Copy;
  readonly id: string;
}

export default function BehindHoarding({ copy, id }: Props) {
  return (
    <section className={styles.behind} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <div id={id} tabIndex={-1} className={styles.intro}>
          <h2 id={`${id}-heading`} className={styles.heading}>
            {copy.behindHeading}
          </h2>
          <p className={styles.sub}>{copy.behindSub}</p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{copy.whatWeDo}</h3>
          <ul className={styles.tags}>
            {copy.services.map((service) => (
              <li key={service} className={styles.tag}>
                <span className={styles.tagHole} aria-hidden="true" />
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{copy.howWeWork}</h3>
          <ol className={styles.steps}>
            {copy.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{copy.mallsHeading}</h3>
          <ul className={styles.malls}>
            {copy.malls.map((mall) => (
              <li key={mall}>{mall}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
