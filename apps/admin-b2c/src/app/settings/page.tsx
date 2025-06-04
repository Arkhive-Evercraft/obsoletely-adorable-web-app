"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className={styles.settingsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
      </div>

      <div className={styles.settingsContainer}>
        <div className={styles.settingsTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'store' ? styles.active : ''}`}
            onClick={() => setActiveTab('store')}
          >
            Store
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'payments' ? styles.active : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'shipping' ? styles.active : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'taxes' ? styles.active : ''}`}
            onClick={() => setActiveTab('taxes')}
          >
            Taxes
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users & Permissions
          </button>
        </div>

        <div className={styles.settingsContent}>
          {activeTab === 'general' && (
            <div className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>General Settings</h2>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Store Name</label>
                <input type="text" className={styles.formInput} defaultValue="StyleStore" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admin Email</label>
                <input type="email" className={styles.formInput} defaultValue="admin@stylestore.com" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Currency</label>
                <select className={styles.formSelect}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button className={styles.saveButton}>Save Changes</button>
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className={styles.emptyState}>
              <p>This settings section is under development.</p>
              <p className={styles.note}>Configuration options for {activeTab} will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}