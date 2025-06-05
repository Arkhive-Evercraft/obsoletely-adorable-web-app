"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import styles from './page.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    name: string;
    description: string;
    imageUrl: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to load product');
          }
          return;
        }
        
        const productData = await response.json();
        setProduct(productData);
        setCurrentProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout>
        <Main
          pageHeading="Products Management"
          leftColumnTitle="Products"
          leftColumn={
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading product details...</p>
            </div>
          }
        />
      </AppLayout>
    );
  }

  if (error || !product || !currentProduct) {
    return (
      <AppLayout>
        <Main
          pageHeading="Product Not Found"
          leftColumn={
            <div className={styles.notFound}>
              <h1>Product Not Found</h1>
              <p>{error || 'Sorry, the product you are looking for does not exist.'}</p>
              <button 
                onClick={() => router.push('/products')}
                className={styles.backButton}
              >
                Back to Products
              </button>
            </div>
          }
        />
      </AppLayout>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement API call to update product
    // For now, just simulate the save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsSaving(false);
    // TODO: Refresh product data after save
  };

  const handleCancel = () => {
    setCurrentProduct(product);
    setIsEditing(false);
  };

  const handleBackToProducts = () => {
    router.push('/products');
  };

  const handleFieldChange = (field: string, value: any) => {
    setCurrentProduct(prev => prev ? { ...prev, [field]: value } : null);
  };

  const ProductDetailContent = () => (
    <div className={styles.productDetail}>
      <div className={styles.productHeader}>
        <div className={styles.productImage}>
          <img 
            src={currentProduct.imageUrl} 
            alt={currentProduct.name}
            className={styles.image}
          />
          <div className={styles.metadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Product ID</span>
              <span>{currentProduct.id}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Created</span>
              <span>{new Date(currentProduct.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Last Updated</span>
              <span>{new Date(currentProduct.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className={styles.productBasicInfo}>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Product Name</label>
            {isEditing ? (
              <input
                type="text"
                value={currentProduct.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={styles.input}
              />
            ) : (
              <h1 className={styles.productName}>{currentProduct.name}</h1>
            )}
          </div>

          {/* Price, Stock Status, and Category in one line */}
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <div className={styles.productMetaLine}>
              <div className={styles.priceSection}>
                {isEditing ? (
                  <div>
                    <label className={styles.fieldLabel}>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentProduct.price}
                      onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                      className={styles.input}
                    />
                  </div>
                ) : (
                  <div className={styles.price}>${currentProduct.price.toFixed(2)}</div>
                )}
              </div>

              <div className={styles.statusSection}>
                {isEditing ? (
                  <div>
                    <label className={styles.fieldLabel}>Status</label>
                    <select
                      value={currentProduct.inStock ? 'true' : 'false'}
                      onChange={(e) => handleFieldChange('inStock', e.target.value === 'true')}
                      className={styles.select}
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                ) : (
                  <div className={styles.stock}>
                    {currentProduct.inStock ? (
                      <span className={styles.inStock}>In Stock</span>
                    ) : (
                      <span className={styles.outOfStock}>Out of Stock</span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.categorySection}>
                {isEditing ? (
                  <div>
                    <label className={styles.fieldLabel}>Category</label>
                    <input
                      type="text"
                      value={currentProduct.categoryName}
                      onChange={(e) => handleFieldChange('categoryName', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                ) : (
                  <span className={styles.category}>{currentProduct.categoryName}</span>
                )}
              </div>
            </div>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Description</label>
            {isEditing ? (
              <textarea
                value={currentProduct.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className={styles.textarea}
                rows={4}
              />
            ) : (
              <p className={styles.description}>{currentProduct.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ActionsPanel = () => (
    <div className={styles.actionsPanel}>
      <button
        onClick={handleBackToProducts}
        className={styles.backToProductsButton}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        Back to Products
      </button>

      {!isEditing ? (
        <button
          onClick={handleEdit}
          className={styles.editButton}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 9.207l-3-3L12.146.146zM11.207 10.5l-7 7-.5.5h-3a.5.5 0 0 1-.5-.5v-3l.5-.5 7-7 3 3z"/>
          </svg>
          Edit Product
        </button>
      ) : (
        <div className={styles.editActions}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={styles.saveButton}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
                </svg>
                Save Changes
              </>
            )}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className={styles.cancelButton}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
            Cancel
          </button>
        </div>
      )}
    </div>
  );

  return (
    <AppLayout>
      <Main
        pageHeading="Products Management"
        leftColumnTitle={`Products | ${currentProduct.name}`}
        rightColumnTitle="Actions"
        leftColumn={<ProductDetailContent />}
        rightColumn={<ActionsPanel />}
      />
    </AppLayout>
  );
}