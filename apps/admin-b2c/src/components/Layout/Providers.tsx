"use client";

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { ThemeProvider, ThemeToggleButton } from '@repo/ui/components';
import { Navigation } from '@/components/Navigation';
import styles from './AdminLayout.module.css';

// Create a context for managing sidebar state
interface AdminContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider>
      <AdminContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
        <div className={styles.adminLayout}>
          <Navigation isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          
          <main className={`${styles.mainContent} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
            <header className={styles.header}>
              <div className={styles.headerLeft}>               
                <div className={styles.breadcrumbs}>
                  <span>Admin</span>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span>Dashboard</span>
                </div>
              </div>
              
              <div className={styles.headerRight}>
                <ThemeToggleButton className={styles.themeToggle} size="md" />
                
                <button className={styles.notificationButton} aria-label="Notifications">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                  </svg>
                  <span className={styles.notificationBadge}>3</span>
                </button>
                
                <div className={styles.userMenu}>
                  <img 
                    src="https://randomuser.me/api/portraits/women/85.jpg" 
                    alt="Admin user" 
                    className={styles.userAvatar} 
                  />
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>Admin User</span>
                    <span className={styles.userRole}>Administrator</span>
                  </div>
                </div>
              </div>
            </header>
            
            <div className={styles.pageContent}>
              {children}
            </div>
          </main>
        </div>
      </AdminContext.Provider>
    </ThemeProvider>
  );
}
