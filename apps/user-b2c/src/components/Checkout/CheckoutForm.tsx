import React, { useState, useEffect } from 'react';
import styles from './CheckoutForm.module.css';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  [key: string]: string;
}

export function CheckoutForm() {
  const { cartItems, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const appId = "YOUR_APP_ID";
  const locationId = "YOUR_LOCATION_ID";

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = totalPrice * 0.1;
  const orderTotal = totalPrice + tax;

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Function to parse address string into components for checkout form
  const parseAddressForCheckout = (addressString: string) => {
    const parts = addressString.split(',').map(part => part.trim());
    
    if (parts.length >= 4) {
      // Handle format: "Unit/StreetNumber StreetName, Suburb, State PostCode, Country"
      // or: "StreetNumber StreetName, Suburb, State PostCode, Country"
      const streetPart = parts[0] || '';
      const suburb = parts[1] || '';
      const statePostcodePart = parts[2] || '';
      const country = parts[3] || '';
      
      // Extract state and postcode from "State PostCode" format
      const stateMatch = statePostcodePart.match(/^(.+?)\s+(\d{4})$/);
      const state = stateMatch ? stateMatch[1] : statePostcodePart;
      const zipCode = stateMatch ? stateMatch[2] : '';
      
      return {
        address: streetPart,
        city: suburb,
        state: state,
        zipCode: zipCode,
        country: country
      };
    } else if (parts.length === 3) {
      // Handle format: "StreetAddress, Suburb State PostCode, Country"
      const streetPart = parts[0] || '';
      const suburbStatePostcodePart = parts[1] || '';
      const country = parts[2] || '';
      
      // Try to extract suburb, state, and postcode
      const match = suburbStatePostcodePart.match(/^(.+?)\s+([A-Z]{2,3})\s+(\d{4})$/);
      if (match) {
        return {
          address: streetPart,
          city: match[1],
          state: match[2],
          zipCode: match[3],
          country: country
        };
      }
    }
    
    // Fallback: treat entire string as address
    return {
      address: addressString,
      city: '',
      state: '',
      zipCode: '',
      country: 'Australia'
    };
  };

  // Load user data when component mounts and user is signed in
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) {
        return;
      }

      try {
        setIsLoadingUserData(true);
        const response = await fetch('/api/customer');
        
        if (response.ok) {
          const customerData = await response.json();
          
          // Parse the name into first and last name
          const nameParts = customerData.name ? customerData.name.split(' ') : [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          // Parse address if available
          const addressComponents = customerData.address 
            ? parseAddressForCheckout(customerData.address)
            : { address: '', city: '', state: '', zipCode: '', country: 'Australia' };
          
          // Pre-fill the form with user data
          setFormData(prevData => ({
            ...prevData,
            firstName,
            lastName,
            email: customerData.email || session.user?.email || '',
            address: addressComponents.address || '',
            city: addressComponents.city || '',
            state: addressComponents.state || '',
            zipCode: addressComponents.zipCode || '',
            country: addressComponents.country || 'Australia',
          }));
        } else if (response.status === 404) {
          // Customer not found in database, use basic session data
          if (session.user?.name || session.user?.email) {
            const nameParts = session.user.name ? session.user.name.split(' ') : [];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            setFormData(prevData => ({
              ...prevData,
              firstName,
              lastName,
              email: session.user?.email || '',
              country: 'Australia',
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data for checkout:', error);
        // Fallback to basic session data on error
        if (session.user?.name || session.user?.email) {
          const nameParts = session.user.name ? session.user.name.split(' ') : [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setFormData(prevData => ({
            ...prevData,
            firstName,
            lastName,
            email: session.user?.email || '',
            country: 'Australia',
          }));
        }
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Shipping info validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Postcode is required';
    } else if (formData.country === 'Australia' && !/^\d{4}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Australian postcode must be 4 digits';
    } else if (formData.country !== 'Australia' && formData.zipCode.length < 3) {
      newErrors.zipCode = 'Please enter a valid postcode';
    }
    if (!formData.country.trim()) newErrors.country = 'Country is required';


    // // Payment info validation
    // if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    // if (!formData.cardNumber.trim()) {
    //   newErrors.cardNumber = 'Card number is required';
    // } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
    //   newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    // }
    // if (!formData.expiryDate.trim()) {
    //   newErrors.expiryDate = 'Expiry date is required';
    // } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
    //   newErrors.expiryDate = 'Please use MM/YY format';
    // }
    // if (!formData.cvv.trim()) {
    //   newErrors.cvv = 'CVV is required';
    // } else if (!/^\d{3,4}$/.test(formData.cvv)) {
    //   newErrors.cvv = 'CVV must be 3 or 4 digits';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call to process order
      setTimeout(() => {
        setIsSubmitting(false);

        // Instead of showing success content in the same component,
        // redirect to a dedicated success page
        router.push('/checkout/success');
      }, 1500);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.success}>
          <div className={styles.checkIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Order Placed Successfully!</h2>
          <p className={styles.successText}>
            Thank you for your purchase. Your order confirmation number is <strong>#{Math.floor(100000 + Math.random() * 900000)}</strong>.
          </p>
          <p className={styles.successText}>
            A confirmation email has been sent to <strong>{formData.email}</strong>.
          </p>
          <div className={styles.successButtons}>
            <Link href="/" className={styles.homeButton}>
              Return to Home
            </Link>
            <Link href="/products" className={styles.productsButton}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.title}>Checkout</h1>
      
      {isLoadingUserData && (
        <div className={styles.loadingMessage}>
          Loading your information...
        </div>
      )}

      <div className={styles.checkoutContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Information</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                />
                {errors.firstName && <div className={styles.errorText}>{errors.firstName}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                />
                {errors.lastName && <div className={styles.errorText}>{errors.lastName}</div>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
              />
              {errors.email && <div className={styles.errorText}>{errors.email}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.address ? styles.error : ''}`}
              />
              {errors.address && <div className={styles.errorText}>{errors.address}</div>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.city ? styles.error : ''}`}
                />
                {errors.city && <div className={styles.errorText}>{errors.city}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state" className={styles.label}>State</label>
                {formData.country === 'Australia' ? (
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.state ? styles.error : ''}`}
                  >
                    <option value="">Select State</option>
                    <option value="NSW">New South Wales</option>
                    <option value="VIC">Victoria</option>
                    <option value="QLD">Queensland</option>
                    <option value="WA">Western Australia</option>
                    <option value="SA">South Australia</option>
                    <option value="TAS">Tasmania</option>
                    <option value="ACT">Australian Capital Territory</option>
                    <option value="NT">Northern Territory</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State/Province"
                    className={`${styles.input} ${errors.state ? styles.error : ''}`}
                  />
                )}
                {errors.state && <div className={styles.errorText}>{errors.state}</div>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode" className={styles.label}>Postcode</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder={formData.country === 'Australia' ? '4000' : 'Postcode'}
                  className={`${styles.input} ${errors.zipCode ? styles.error : ''}`}
                />
                {errors.zipCode && <div className={styles.errorText}>{errors.zipCode}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.label}>Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.country ? styles.error : ''}`}
                >
                  <option value="">Select Country</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  {/* Add more countries as needed */}
                </select>
                {errors.country && <div className={styles.errorText}>{errors.country}</div>}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Information</h2>

            {/* <div className={styles.formGroup}>
              <label htmlFor="cardName" className={styles.label}>Name on Card</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.cardName ? styles.error : ''}`}
              />
              {errors.cardName && <div className={styles.errorText}>{errors.cardName}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber" className={styles.label}>Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
                className={`${styles.input} ${errors.cardNumber ? styles.error : ''}`}
              />
              {errors.cardNumber && <div className={styles.errorText}>{errors.cardNumber}</div>}
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate" className={styles.label}>Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`${styles.input} ${errors.expiryDate ? styles.error : ''}`}
                />
                {errors.expiryDate && <div className={styles.errorText}>{errors.expiryDate}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="cvv" className={styles.label}>CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="XXX"
                  maxLength={4}
                  className={`${styles.input} ${errors.cvv ? styles.error : ''}`}
                />
                {errors.cvv && <div className={styles.errorText}>{errors.cvv}</div>}
              </div>
            </div> */}

            <PaymentForm
              applicationId={appId}
              locationId={locationId}
              cardTokenizeResponseReceived={async (token) => {
                // we’ll come back to this soon
                console.log(token);
              }}
            >
              <CreditCard />
            </PaymentForm>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || cartItems.length === 0}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              `Place Order - $${orderTotal.toFixed(2)}`
            )}
          </button>
        </form>

        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.orderItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <div className={styles.orderItemImage}>
                  <img src={item.imageUrl} alt={item.name} />
                  <span className={styles.orderItemQuantity}>{item.quantity}</span>
                </div>
                <div className={styles.orderItemDetails}>
                  <h3 className={styles.orderItemName}>{item.name}</h3>
                  <p className={styles.orderItemPrice}>${item.price.toFixed(2)}</p>
                </div>
                <div className={styles.orderItemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
