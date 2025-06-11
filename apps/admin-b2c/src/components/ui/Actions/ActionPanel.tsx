"use client";

import React from 'react';
import styles from './ActionPanel.module.css';

export interface ActionButtonConfig {
  key: string;
  element: React.ReactElement;
  group?: 'primary' | 'secondary';
}

interface ActionPanelProps {
  backButton?: React.ReactElement;
  primaryActions?: React.ReactElement[];
  secondaryActions?: React.ReactElement[];
  buttons?: ActionButtonConfig[]; // For backward compatibility
  className?: string;
}

export function ActionPanel({ 
  backButton,
  primaryActions = [],
  secondaryActions = [],
  buttons = [], // Legacy support
  className = '' 
}: ActionPanelProps) {
  // Handle legacy buttons prop
  const legacyPrimary = buttons.filter(btn => !btn.group || btn.group === 'primary').map(btn => btn.element);
  const legacySecondary = buttons.filter(btn => btn.group === 'secondary').map(btn => btn.element);
  
  const allPrimaryActions = [...primaryActions, ...legacyPrimary];
  const allSecondaryActions = [...secondaryActions, ...legacySecondary];

  return (
    <div className={`${styles.actionsPanel} ${className}`}>
      {/* Back button */}
      {backButton && (
        <div className={styles.backButtonSection}>
          {backButton}
        </div>
      )}

      {/* Primary actions */}
      {allPrimaryActions.length > 0 && (
        <div className={styles.primaryActions}>
          {allPrimaryActions.map((action, index) => (
            <div key={index} className={styles.buttonWrapper}>
              {action}
            </div>
          ))}
        </div>
      )}

      {/* Secondary actions with separator */}
      {allSecondaryActions.length > 0 && (
        <div className={styles.secondaryActions}>
          {allSecondaryActions.map((action, index) => (
            <div key={index} className={styles.buttonWrapper}>
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
