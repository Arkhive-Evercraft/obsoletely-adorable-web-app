import React from 'react';
import styles from '../ProductsTable.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl: string;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onToggleSelectProduct: (id: string) => void;
  onEditProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
}

export function ProductTable({
  products,
  selectedProducts,
  onToggleSelectProduct,
  onEditProduct,
  onDeleteProduct
}: ProductTableProps) {
  return (
    <>
      {products.map((product) => (
        <tr 
          key={product.id}
          className={`${styles.tableRow} ${selectedProducts.includes(product.id) ? styles.selectedRow : ''}`}
        >
          <td className={styles.checkboxCell}>
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={() => onToggleSelectProduct(product.id)}
              className={styles.checkbox}
            />
          </td>
          <td className={styles.imageCell}>
            {product.imageUrl ? (
              <div className={styles.productImageWrapper}>
                <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
              </div>
            ) : (
              <div className={styles.noImage}>No image</div>
            )}
          </td>
          <td className={styles.productNameCell}>{product.name}</td>
          <td>{product.category}</td>
          <td>${product.price.toFixed(2)}</td>
          <td>{product.inventory}</td>
          <td>
            <span className={`${styles.statusBadge} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </td>
          <td>{new Date(product.dateAdded).toLocaleDateString()}</td>
          <td className={styles.actionsCell}>
            <div className={styles.actionButtons}>
              <button
                className={`${styles.iconButton} ${styles.editButton}`}
                onClick={() => onEditProduct(product.id)}
                aria-label={`Edit ${product.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </button>
              <button
                className={`${styles.iconButton} ${styles.deleteButton}`}
                onClick={() => onDeleteProduct(product.id)}
                aria-label={`Delete ${product.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}