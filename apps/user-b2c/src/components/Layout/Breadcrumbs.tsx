"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

export function Breadcrumbs({ customItems }: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbRef = useRef<HTMLElement>(null);

  // Set CSS custom property with breadcrumb width for spacer
  useEffect(() => {
    if (breadcrumbRef.current) {
      const width = breadcrumbRef.current.offsetWidth;
      document.documentElement.style.setProperty('--breadcrumb-width', `${width}px`);
    }
  });

  // Generate breadcrumbs from pathname if no custom items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) {
      return [{ label: 'Home', href: '/' }, ...customItems];
    }

    // For home page, just show "Home"
    if (pathname === '/') {
      return [{ label: 'Home' }];
    }

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format segment name
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle special cases
      if (segment === 'products') {
        label = 'Products';
      } else if (segment === 'cart') {
        label = 'Cart';
      } else if (segment === 'checkout') {
        label = 'Checkout';
      } else if (segment === 'account') {
        label = 'Account';
      }
      
      // If it's the last segment, don't add href (current page)
      const isLast = index === segments.length - 1;
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav ref={breadcrumbRef} className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {breadcrumbs.map((item, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {item.href ? (
              <Link href={item.href} className={styles.breadcrumbLink}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {item.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
