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
  unitNumber: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    unitNumber: '',
    streetNumber: '',
    streetName: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Function to parse address string into components
  const parseAddress = (addressString: string) => {
    const parts = addressString.split(',').map(part => part.trim());
    if (parts.length >= 4) {
      // Try to parse format: "123 Main St, Suburb, State PostCode, Country" or "2/45 Main St, ..."
      const streetPart = parts[0] || '';
      
      // Try to match unit/street number format (e.g., "2/45 Main St")
      const unitStreetMatch = streetPart.match(/^(\d+)\/(\d+[a-zA-Z]?)\s+(.+)$/);
      if (unitStreetMatch) {
        return {
          unitNumber: unitStreetMatch[1],
          streetNumber: unitStreetMatch[2],
          streetName: unitStreetMatch[3],
          suburb: parts[1] || '',
          state: parts[2] ? parts[2].replace(/\s+\d+$/, '').trim() : '', // Remove postcode from state
          postcode: parts[2] ? (parts[2].match(/\d+$/) || [''])[0] : '',
          country: parts[3] || 'Australia'
        };
      }
      
      // Try to match just street number format (e.g., "123 Main St" or "5A Main St")
      const streetMatch = streetPart.match(/^(\d+[a-zA-Z]?)\s+(.+)$/);
      if (streetMatch) {
        return {
          unitNumber: '',
          streetNumber: streetMatch[1],
          streetName: streetMatch[2],
          suburb: parts[1] || '',
          state: parts[2] ? parts[2].replace(/\s+\d+$/, '').trim() : '', // Remove postcode from state
          postcode: parts[2] ? (parts[2].match(/\d+$/) || [''])[0] : '',
          country: parts[3] || 'Australia'
        };
      }
      
      // Fallback if no match
      return {
        unitNumber: '',
        streetNumber: '',
        streetName: streetPart,
        suburb: parts[1] || '',
        state: parts[2] ? parts[2].replace(/\s+\d+$/, '').trim() : '', // Remove postcode from state
        postcode: parts[2] ? (parts[2].match(/\d+$/) || [''])[0] : '',
        country: parts[3] || 'Australia'
      };
    }
    return {
      unitNumber: '',
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia'
    };
  };

  // Validation functions
  const validatePhone = (phone: string) => {
    if (!phone.trim()) return true; // Phone is optional
    
    // Remove spaces, dashes, and parentheses for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Australian phone number formats:
    // Mobile: +61412345678, 0412345678, 61412345678
    // Landline: +61812345678, 0812345678, 61812345678
    const mobileRegex = /^(\+?61|0)?4\d{8}$/;
    const landlineRegex = /^(\+?61|0)?[2378]\d{8}$/;
    
    return mobileRegex.test(cleanPhone) || landlineRegex.test(cleanPhone);
  };

  const validateAddress = () => {
    const errors: string[] = [];
    
    // Unit number is optional, but if provided, must be a number
    if (formData.unitNumber.trim() && !/^\d+$/.test(formData.unitNumber.trim())) {
      errors.push('Unit number must be a number (e.g., 2, 12, 305)');
    }
    
    if (!formData.streetNumber.trim()) {
      errors.push('Street number is required');
    } else if (!/^\d+[a-zA-Z]?$/.test(formData.streetNumber.trim())) {
      errors.push('Street number must be a number (e.g., 123, 5A)');
    }
    
    if (!formData.streetName.trim()) {
      errors.push('Street name is required');
    }
    
    if (!formData.suburb.trim()) {
      errors.push('Suburb/Town/City is required');
    }
    
    if (!formData.state.trim()) {
      errors.push('State is required');
    }
    
    if (!formData.postcode.trim()) {
      errors.push('Postcode is required');
    } else if (!/^\d{4}$/.test(formData.postcode.trim())) {
      errors.push('Postcode must be 4 digits');
    }
    
    if (!formData.country.trim()) {
      errors.push('Country is required');
    }
    
    return errors;
  };

  // Function to combine address fields into a single string
  const combineAddress = () => {
    // Combine unit number and street number if unit exists
    let streetPart = '';
    if (formData.unitNumber.trim()) {
      streetPart = `${formData.unitNumber.trim()}/${formData.streetNumber.trim()} ${formData.streetName.trim()}`.trim();
    } else {
      streetPart = `${formData.streetNumber.trim()} ${formData.streetName.trim()}`.trim();
    }
    
    const parts = [
      streetPart,
      formData.suburb.trim(),
      `${formData.state.trim()} ${formData.postcode.trim()}`.trim(),
      formData.country.trim()
    ].filter(part => part);
    
    return parts.join(', ');
  };

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
              unitNumber: '',
              streetNumber: '',
              streetName: '',
              suburb: '',
              state: '',
              postcode: '',
              country: 'Australia'
            });
          } else {
            throw new Error(`Failed to fetch customer data: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setCustomerData(data);
          const addressComponents = data.address ? parseAddress(data.address) : {
            unitNumber: '',
            streetNumber: '',
            streetName: '',
            suburb: '',
            state: '',
            postcode: '',
            country: 'Australia'
          };
          setFormData({
            name: data.name || '',
            phone: data.phone || '',
            unitNumber: addressComponents.unitNumber || '',
            streetNumber: addressComponents.streetNumber || '',
            streetName: addressComponents.streetName || '',
            suburb: addressComponents.suburb || '',
            state: addressComponents.state || '',
            postcode: addressComponents.postcode || '',
            country: addressComponents.country || 'Australia'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    // Validate phone number
    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Please enter a valid Australian phone number (e.g., 0412 345 678, +61 8 1234 5678)');
      return;
    }

    // Validate address if any address field is filled
    const hasAddressData = formData.unitNumber || formData.streetNumber || formData.streetName || formData.suburb || 
                          formData.state || formData.postcode || formData.country !== 'Australia';
    
    if (hasAddressData) {
      const addressErrors = validateAddress();
      if (addressErrors.length > 0) {
        setError(addressErrors[0] || 'Address validation error'); // Show first error
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      
      const combinedAddress = hasAddressData ? combineAddress() : undefined;
      
      const response = await fetch('/api/customer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined,
          address: combinedAddress,
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
                  placeholder="e.g., 0412 345 678 or (08) 9123 4567"
                  disabled={saving}
                />
              </div>

              <div className={styles.addressRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="unitNumber" className={styles.formLabel}>
                    Unit Number
                  </label>
                  <input
                    type="text"
                    id="unitNumber"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="e.g., 2, 12, 305"
                    disabled={saving}
                  />
                  <p className={styles.formHelp}>
                    Optional apartment or unit number
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="streetNumber" className={styles.formLabel}>
                    Street Number *
                  </label>
                  <input
                    type="text"
                    id="streetNumber"
                    name="streetNumber"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="e.g., 123, 5A"
                    disabled={saving}
                  />
                  <p className={styles.formHelp}>
                    Required street number (e.g., 123, 5A)
                  </p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="streetName" className={styles.formLabel}>
                  Street Name *
                </label>
                <input
                  type="text"
                  id="streetName"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="e.g., Main Street"
                  disabled={saving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="suburb" className={styles.formLabel}>
                  Suburb/Town/City *
                </label>
                <input
                  type="text"
                  id="suburb"
                  name="suburb"
                  value={formData.suburb}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="e.g., Perth"
                  disabled={saving}
                />
              </div>

              <div className={styles.statePostcodeRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="state" className={styles.formLabel}>
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    disabled={saving}
                  >
                    <option value="">Select a state</option>
                    <option value="NSW">New South Wales</option>
                    <option value="VIC">Victoria</option>
                    <option value="QLD">Queensland</option>
                    <option value="WA">Western Australia</option>
                    <option value="SA">South Australia</option>
                    <option value="TAS">Tasmania</option>
                    <option value="ACT">Australian Capital Territory</option>
                    <option value="NT">Northern Territory</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="postcode" className={styles.formLabel}>
                    Postcode *
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="e.g., 6000"
                    maxLength={4}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.formLabel}>
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="e.g., Australia"
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
