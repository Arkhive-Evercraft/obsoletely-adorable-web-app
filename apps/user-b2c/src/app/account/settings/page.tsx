"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import Link from 'next/link';
import styles from '../account.module.css';

interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  memberSince: string;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
            const defaultData = {
              id: 0,
              name: session.user.name || 'User',
              email: session.user.email,
              memberSince: new Date().toISOString()
            };
            setCustomerData(defaultData);
            setFormData({
              name: defaultData.name,
              phone: '',
              address: ''
            });
          } else {
            throw new Error(`Failed to fetch customer data: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setCustomerData(data);
          setFormData({
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear success/error messages when user starts typing
    if (success) setSuccess(null);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.email) {
      setError('You must be signed in to update your profile');
      return;
    }

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch('/api/customer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setCustomerData(updatedData);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <AppLayout>
        <Main pageHeading="Account Settings">
          <div className={styles.accountContainer}>
            <div className={styles.accountCard}>
              <h1 className={styles.accountTitle}>Account Settings</h1>
              <p>Please sign in to manage your account settings.</p>
              <Link href="/auth/signin" className={styles.signInButton}>
                Sign In
              </Link>
            </div>
          </div>
        </Main>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <Main pageHeading="Account Settings">
          <div className={styles.accountContainer}>
            <div className={styles.accountCard}>
              <div className={styles.loadingSpinner}>Loading...</div>
            </div>
          </div>
        </Main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Main pageHeading="Account Settings">
        <div className={styles.accountContainer}>
          <nav className={styles.breadcrumb}>
            <Link href="/account" className={styles.breadcrumbLink}>
              Account
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Settings</span>
          </nav>

          <div className={styles.accountCard}>
            <div className={styles.settingsHeader}>
              <h1 className={styles.accountTitle}>Account Settings</h1>
              <p className={styles.settingsDescription}>
                Update your personal information and contact details.
              </p>
            </div>

            {error && (
              <div className={styles.alert + ' ' + styles.alertError}>
                {error}
              </div>
            )}

            {success && (
              <div className={styles.alert + ' ' + styles.alertSuccess}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.settingsForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={customerData?.email || ''}
                  className={styles.formInput + ' ' + styles.formInputDisabled}
                  disabled
                />
                <p className={styles.formHelp}>
                  Email address cannot be changed. Contact support if you need to update this.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.formLabel}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="e.g., +1-555-0123"
                  disabled={saving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.formLabel}>
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows={3}
                  placeholder="Enter your full address"
                  disabled={saving}
                />
              </div>

              <div className={styles.formActions}>
                <Link 
                  href="/account" 
                  className={styles.button + ' ' + styles.buttonSecondary}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className={styles.button + ' ' + styles.buttonPrimary}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Main>
    </AppLayout>
  );
}
