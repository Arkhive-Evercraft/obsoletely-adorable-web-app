import { TopNavigation } from "../Navigation/TopNavigation";
import styles from './Layout.module.css';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={`${styles.header} ${className || ''}`}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>StyleStore Admin</h1>
          <TopNavigation />
        </div>
    </header>
  );
}