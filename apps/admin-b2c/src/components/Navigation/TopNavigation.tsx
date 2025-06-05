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
          <li><Link href="/account">Account</Link></li>
          <li><Link href="/auth">Login/Logout</Link></li>
        </ul>
      </nav>
    );
  }