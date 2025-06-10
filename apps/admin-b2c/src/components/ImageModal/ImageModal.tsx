import React from 'react';
import styles from './ImageModal.module.css';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageName: string;
  onClose: () => void;
}

export function ImageModal({ isOpen, imageUrl, imageName, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className={styles.overlay} 
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 id="image-modal-title" className={styles.title}>{imageName}</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close image"
          >
            ×
          </button>
        </div>
        <div className={styles.modalImageContainer}>
          <img 
            src={imageUrl} 
            alt={imageName}
            className={styles.modalImage}
          />
        </div>
      </div>
    </div>
  );
}