import React, { useState } from 'react';
import styles from './ImageModal.module.css';

export type ImageSize = 'small' | 'medium' | 'large';

interface EditableProductImageProps {
  imageUrl: string;
  alt: string;
  size?: ImageSize;
  isEditing?: boolean;
  onImageChange?: (file: File) => void;
  onImageClick?: () => void;
  className?: string;
  productId?: string;
}

export function EditableProductImage({
  imageUrl,
  alt,
  size = 'medium',
  isEditing = false,
  onImageChange,
  onImageClick,
  className = '',
  productId
}: EditableProductImageProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking image
    
    if (isEditing && onImageChange) {
      // Trigger file input click
      const fileInput = document.getElementById(`product-image-input-${productId}`) as HTMLInputElement;
      fileInput?.click();
    } else if (onImageClick) {
      onImageClick();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEditing) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (isEditing && onImageChange) {
      const files = e.dataTransfer.files;
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        onImageChange(file);
      }
    }
  };

  const sizeClass = styles[size];
  const editableClass = isEditing ? styles.editable : '';
  const dragOverClass = dragOver ? styles.dragOver : '';
  
  // Check if we have a valid image URL
  const hasImage = imageUrl && imageUrl.trim() !== '';

  return (
    <div className={`${styles.imageContainer} ${sizeClass} ${editableClass} ${dragOverClass} ${className}`}>
      <div
        className={styles.imageWrapper}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hasImage ? (
          <img 
            src={imageUrl} 
            alt={alt}
            className={styles.productImage}
          />
        ) : (
          <div className={`${styles.productImage} ${styles.placeholder}`}>
            <div className={styles.placeholderContent}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
              </svg>
              <span>No Image</span>
            </div>
          </div>
        )}
        {isEditing && onImageChange && (
          <div className={styles.imageOverlay}>
            <div className={styles.imageOverlayContent}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15 12V6a1 1 0 0 0-1-1h-1.172a3 3 0 0 1-2.12-.879L9.828 3.24a1 1 0 0 0-.707-.293H6.879a1 1 0 0 0-.707.293L5.292 4.121A3 3 0 0 1 3.172 5H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM2 4a2 2 0 0 1 2-2h1.172a2 2 0 0 1 1.414.586L7.465 3.465A1 1 0 0 0 8.172 4h1.656a1 1 0 0 0 .707-.293L11.414 2.586A2 2 0 0 1 12.828 2H14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z"/>
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
              </svg>
              <span className={styles.overlayText}>
                {hasImage 
                  ? (size === 'small' ? 'Edit' : 'Click to change image')
                  : (size === 'small' ? 'Add' : 'Click to add image')
                }
              </span>
            </div>
          </div>
        )}
      </div>
      {isEditing && onImageChange && (
        <input
          id={`product-image-input-${productId}`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
      )}
    </div>
  );
}