import React from 'react';
import { useTheme } from '../Theme';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={`${styles.card} ${isDark ? styles.dark : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={`${styles.cardHeader} ${isDark ? styles.dark : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={`${styles.cardBody} ${isDark ? styles.dark : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: CardProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={`${styles.cardFooter} ${isDark ? styles.dark : ''} ${className}`}>
      {children}
    </div>
  );
}
