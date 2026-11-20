import { CONTACT, type Copy } from './copy';
import styles from './page.module.css';

export default function SiteFooter({ copy }: { copy: Copy }) {
  return (
    <footer className={styles.footer}>
      <ul className={styles.contactList}>
        {CONTACT.phones.map((phone) => (
          <li key={phone.href}>
            <a href={phone.href} dir="ltr">
              {phone.display}
            </a>
          </li>
        ))}
        <li>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </li>
        <li>{copy.kuwait}</li>
      </ul>
      <p className={styles.rights}>{copy.rights}</p>
    </footer>
  );
}
