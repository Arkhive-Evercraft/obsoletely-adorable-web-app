import type { ReactNode } from "react";
import React from "react";
import { Column } from "@/components/Layout";
import styles from "./Main.module.css";

interface MainProps {
  children?: React.ReactNode;
  className?: string;
  pageHeading: string;
  leftColumn?: ReactNode;
  rightColumn?: ReactNode;
  leftColumnTitle?: string;
  rightColumnTitle?: string;
}

export const Main = React.memo(function Main({ 
  children, 
  className, 
  pageHeading, 
  leftColumn, 
  rightColumn, 
  leftColumnTitle = "",
  rightColumnTitle = ""
}: MainProps) {
  return (
    <main className={`${styles.main} ${className || ''}`}>
      {/* Left Column */}
      <Column title={leftColumnTitle} className={styles.leftColumn}>
        {leftColumn || children}
      </Column>

      {/* Right Column */}
      <Column title={rightColumnTitle} className={styles.rightColumn}>
        {rightColumn}
      </Column>
    </main>
  );
});