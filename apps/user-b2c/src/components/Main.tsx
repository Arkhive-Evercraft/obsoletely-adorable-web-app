import type { ReactNode } from "react";
import React from "react";
import { Breadcrumbs } from "./Layout/Breadcrumbs";
import styles from "./Main.module.css"

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface MainProps {
  children?: React.ReactNode;
  className?: string;
  pageHeading: string;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
}

export const Main = React.memo(function Main({ 
  children, 
  className, 
  pageHeading,
  breadcrumbs,
  showBreadcrumbs = true,
}: MainProps) {
  return (
    <main className={`${styles.main} ${className || ''}`}>
      <div className={styles.headerSection}>
        {showBreadcrumbs && <Breadcrumbs customItems={breadcrumbs} />}
        <h1 className={styles.pageHeading}>{pageHeading}</h1>
        <div className={styles.spacer}></div>
      </div>
      {children}
    </main>
  );
});