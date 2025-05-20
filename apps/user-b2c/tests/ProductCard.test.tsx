import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../src/components/Card/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  description: 'A test product description',
  imageUrl: 'https://example.com/image.jpg',
  category: 'Test Category',
  inStock: true
};

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return (
      <a href={href} data-testid="next-link">
        {children}
      </a>
    );
  };
});

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    
    const productImage = screen.getByAltText('Test Product');
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
  
  it('shows out of stock status when product is not in stock', () => {
    const outOfStockProduct = {
      ...mockProduct,
      inStock: false
    };
    
    render(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.queryByText('In Stock')).not.toBeInTheDocument();
  });
  
  it('calls onAddToCart function when add button is clicked', () => {
    const mockAddToCart = jest.fn();
    
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockAddToCart} 
      />
    );
    
    // Hover to show the quick actions
    const card = screen.getByAltText('Test Product').closest('div');
    fireEvent.mouseEnter(card);
    
    // Find and click the add button
    const addButton = screen.getByLabelText('Add to cart');
    fireEvent.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });
  
  it('does not render add button for out of stock products', () => {
    const outOfStockProduct = {
      ...mockProduct,
      inStock: false
    };
    
    render(
      <ProductCard 
        product={outOfStockProduct} 
        onAddToCart={() => {}} 
      />
    );
    
    // Hover to reveal quick actions
    const card = screen.getByAltText('Test Product').closest('div');
    fireEvent.mouseEnter(card);
    
    // Add button should not be present
    expect(screen.queryByLabelText('Add to cart')).not.toBeInTheDocument();
  });
  
  it('renders correct links to product details page', () => {
    render(<ProductCard product={mockProduct} />);
    
    const titleLink = screen.getByText('Test Product').closest('a');
    expect(titleLink).toHaveAttribute('href', '/products/1');
    
    // Hover to show quick actions
    const card = screen.getByAltText('Test Product').closest('div');
    fireEvent.mouseEnter(card);
    
    const viewButton = screen.getByText('View').closest('a');
    expect(viewButton).toHaveAttribute('href', '/products/1');
  });
});
