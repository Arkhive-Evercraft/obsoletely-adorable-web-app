import type { ReactNode } from "react";
import React from "react";
import styles from "./Main.module.css";

interface MainProps {
  children?: React.ReactNode;
  className?: string;
  pageHeading: string;
}

export const Main = React.memo(function Main({ 
  children, 
  className, 
  pageHeading, 
}: MainProps) {
  return (
    <main className={`${styles.main} ${className || ''}`}>
      <h1 className={styles.pageHeading}>{pageHeading}</h1>
      {children}
    </main>
  );
});