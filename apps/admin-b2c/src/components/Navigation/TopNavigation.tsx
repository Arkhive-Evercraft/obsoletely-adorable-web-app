import Link from 'next/link';
import styles from './TopNavigation.module.css';

export function TopNavigation() {
    return (
      <nav className={styles.nav}>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/orders">Orders</Link></li>
          <li><Link href="/settings">Settings</Link></li>
        </ul>
      </nav>
    );
  }