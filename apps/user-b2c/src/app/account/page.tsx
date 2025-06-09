"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import Link from 'next/link';
import styles from './account.module.css';

interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  memberSince: string;
}

export default function AccountPage() {
  const { data: session } = useSession();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/customer');
        
        if (!response.ok) {
          if (response.status === 404) {
            // Customer not found in database, use session data
            setCustomerData({
              id: 0,
              name: session.user.name || 'User',
              email: session.user.email,
              memberSince: new Date().toISOString()
            });
          } else {
            throw new Error(`Failed to fetch customer data: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setCustomerData(data);
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setError('Failed to load account information');
        // Fallback to session data
        setCustomerData({
          id: 0,
          name: session.user.name || 'User',
          email: session.user.email,
          memberSince: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [session]);

  if (!session?.user) {
    return (
      <AppLayout requireAuth={true}>
        <Main pageHeading="Account">
          <div className={styles.notAuthenticated}>
            <h2>Please sign in to view your account</h2>
            <Link href="/auth/signin" className={styles.signInButton}>
              Sign In
            </Link>
          </div>
        </Main>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout requireAuth={true}>
        <Main pageHeading="My Account">
          <div className={styles.accountContainer}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading account information...</p>
            </div>
          </div>
        </Main>
      </AppLayout>
    );
  }

  const displayData = customerData || {
    id: 0,
    name: session.user.name || 'User',
    email: session.user.email,
    memberSince: new Date().toISOString()
  };

  return (
    <AppLayout requireAuth={true}>
      <Main pageHeading="My Account">
        <div className={styles.accountContainer}>
          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}
          
          <div className={styles.accountCard}>
            <div className={styles.profileSection}>
              <div className={styles.avatar}>
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={displayData.name || 'User'} 
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <svg width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>
                  {displayData.name}
                </h2>
                <p className={styles.userEmail}>
                  {displayData.email}
                </p>
              </div>
            </div>

            <div className={styles.accountActions}>
              <Link href="/account/orders" className={styles.actionButton}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span>Order History</span>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={styles.chevron}>
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </Link>

              <div className={styles.actionButton} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                </svg>
                <span>Settings</span>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={styles.chevron}>
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </div>
            </div>

            <div className={styles.accountStats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Member Since</span>
                <span className={styles.statValue}>
                  {new Date(displayData.memberSince).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </AppLayout>
  );
}
