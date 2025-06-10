import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductsTable } from '../src/components/Catalogue/ProductsTable';
import { adminMockProducts } from '../src/mocks/admin-products';

// Mock the SearchFilterSort component
jest.mock('../../../packages/ui/src/components/SearchFilterSort', () => ({
  SearchFilterSort: ({ onSearch, onFilter, onSort }) => (
    <div data-testid="search-filter-sort">
      <input 
        data-testid="search-input" 
        onChange={(e) => onSearch(e.target.value)} 
      />
      <select 
        data-testid="filter-select" 
        onChange={(e) => onFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="Electronics">Electronics</option>
      </select>
      <select 
        data-testid="sort-select" 
        onChange={(e) => onSort(e.target.value)}
      >
        <option value="name">Name</option>
      </select>
    </div>
  ),
}));

describe('ProductsTable', () => {
  it('renders the products table with correct data', () => {
    render(<ProductsTable />);
    
    // Verify table headers
    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('SKU')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    
    // Verify product data
    expect(screen.getByText('Modern Slim Fit T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('CLO-TSH-001')).toBeInTheDocument();
  });
  
  it('filters products when searching', () => {
    render(<ProductsTable />);
    
    // Initially all products are shown
    expect(screen.getByText('Modern Slim Fit T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Wireless Noise-Cancelling Headphones')).toBeInTheDocument();
    
    // Search for 'headphones'
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'headphones' },
    });
    
    // Only headphones should be visible, t-shirt should not
    expect(screen.getByText('Wireless Noise-Cancelling Headphones')).toBeInTheDocument();
    expect(screen.queryByText('Modern Slim Fit T-Shirt')).not.toBeInTheDocument();
  });
  
  it('filters products by category', () => {
    render(<ProductsTable />);
    
    // Initially all products are shown
    expect(screen.getByText('Modern Slim Fit T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Wireless Noise-Cancelling Headphones')).toBeInTheDocument();
    
    // Filter by Electronics category
    fireEvent.change(screen.getByTestId('filter-select'), {
      target: { value: 'Electronics' },
    });
    
    // Only electronics should be visible, clothing should not
    expect(screen.getByText('Wireless Noise-Cancelling Headphones')).toBeInTheDocument();
    expect(screen.queryByText('Modern Slim Fit T-Shirt')).not.toBeInTheDocument();
  });
  
  it('toggles item selection', () => {
    render(<ProductsTable />);
    
    // Get the first checkbox
    const firstCheckbox = screen.getAllByRole('checkbox')[1]; // First one after "select all"
    
    // Initially not checked
    expect(firstCheckbox).not.toBeChecked();
    
    // Click to select
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
    
    // Click again to deselect
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
  });
  
  it('toggles select all functionality', () => {
    render(<ProductsTable />);
    
    // Get the select all checkbox and all product checkboxes
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    const productCheckboxes = screen.getAllByRole('checkbox').slice(1);
    
    // Initially none are checked
    expect(selectAllCheckbox).not.toBeChecked();
    productCheckboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
    
    // Click select all
    fireEvent.click(selectAllCheckbox);
    
    // All should be checked
    expect(selectAllCheckbox).toBeChecked();
    productCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
    
    // Click select all again to deselect all
    fireEvent.click(selectAllCheckbox);
    
    // None should be checked
    expect(selectAllCheckbox).not.toBeChecked();
    productCheckboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });
});
