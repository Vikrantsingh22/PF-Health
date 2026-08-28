import styles from "./synthetic-notice.module.css";

export function SyntheticNotice() {
  return <div className={styles.ribbon} role="note"><div className={styles.content}>
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 10.8v5.4M12 7.7h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2"/></svg>
    <span>Synthetic records only · No EPFO connection</span>
  </div></div>;
}
