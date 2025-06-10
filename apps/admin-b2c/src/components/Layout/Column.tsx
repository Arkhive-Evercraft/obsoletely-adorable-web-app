import type { PropsWithChildren } from "react";
import styles from "./Column.module.css";

interface ColumnProps {
  className?: string;
  title?: string;
}

export function Column({ 
  children, 
  className = "",
  title
}: PropsWithChildren<ColumnProps>) {
  return (
    <div className={`${styles.column} ${className}`}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}