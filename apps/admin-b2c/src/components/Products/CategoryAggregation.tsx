"use client";

import React, { useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

interface CategoryAggregationProps {
  products: Product[];
  filteredProducts: Product[];
}

interface CategoryStats {
  category: string;
  totalProducts: number;
  filteredProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
  averagePrice: number;
  totalInventory: number;
}

export function CategoryAggregation({ products, filteredProducts }: CategoryAggregationProps) {
  const categoryStats = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    
    return categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category);
      const filteredCategoryProducts = filteredProducts.filter(p => p.category === category);
      const inStock = categoryProducts.filter(p => p.inStock);
      const outOfStock = categoryProducts.filter(p => !p.inStock);
      const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.inventory), 0);
      const averagePrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length;
      const totalInventory = categoryProducts.reduce((sum, p) => sum + p.inventory, 0);

      return {
        category,
        totalProducts: categoryProducts.length,
        filteredProducts: filteredCategoryProducts.length,
        inStockProducts: inStock.length,
        outOfStockProducts: outOfStock.length,
        totalValue,
        averagePrice,
        totalInventory
      };
    });
  }, [products, filteredProducts]);

  const overallStats = useMemo(() => {
    const totalProducts = products.length;
    const totalFiltered = filteredProducts.length;
    const totalInStock = products.filter(p => p.inStock).length;
    const totalOutOfStock = products.filter(p => !p.inStock).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.inventory), 0);
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    const totalInventory = products.reduce((sum, p) => sum + p.inventory, 0);

    return {
      totalProducts,
      totalFiltered,
      totalInStock,
      totalOutOfStock,
      totalValue,
      averagePrice,
      totalInventory
    };
  }, [products, filteredProducts]);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  };

  const statItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6'
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const valueStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827'
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* Overall Statistics */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
          Overall Statistics
        </h3>
        <div style={statItemStyle}>
          <span style={labelStyle}>Total Products</span>
          <span style={valueStyle}>{overallStats.totalProducts}</span>
        </div>
        <div style={statItemStyle}>
          <span style={labelStyle}>Showing</span>
          <span style={valueStyle}>{overallStats.totalFiltered}</span>
        </div>
        <div style={statItemStyle}>
          <span style={labelStyle}>In Stock</span>
          <span style={{ ...valueStyle, color: '#16a34a' }}>{overallStats.totalInStock}</span>
        </div>
        <div style={statItemStyle}>
          <span style={labelStyle}>Out of Stock</span>
          <span style={{ ...valueStyle, color: '#dc2626' }}>{overallStats.totalOutOfStock}</span>
        </div>
        <div style={statItemStyle}>
          <span style={labelStyle}>Total Inventory</span>
          <span style={valueStyle}>{overallStats.totalInventory.toLocaleString()}</span>
        </div>
        <div style={statItemStyle}>
          <span style={labelStyle}>Total Value</span>
          <span style={valueStyle}>${overallStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ ...statItemStyle, borderBottom: 'none' }}>
          <span style={labelStyle}>Average Price</span>
          <span style={valueStyle}>${overallStats.averagePrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
          Category Breakdown
        </h3>
        {categoryStats.map((stats) => (
          <div key={stats.category} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500', color: '#374151' }}>
              {stats.category}
            </h4>
            <div style={{ ...statItemStyle, padding: '4px 0' }}>
              <span style={labelStyle}>Products</span>
              <span style={valueStyle}>{stats.totalProducts}</span>
            </div>
            <div style={{ ...statItemStyle, padding: '4px 0' }}>
              <span style={labelStyle}>Showing</span>
              <span style={valueStyle}>{stats.filteredProducts}</span>
            </div>
            <div style={{ ...statItemStyle, padding: '4px 0' }}>
              <span style={labelStyle}>In Stock</span>
              <span style={{ ...valueStyle, color: '#16a34a' }}>{stats.inStockProducts}</span>
            </div>
            <div style={{ ...statItemStyle, padding: '4px 0' }}>
              <span style={labelStyle}>Inventory</span>
              <span style={valueStyle}>{stats.totalInventory}</span>
            </div>
            <div style={{ ...statItemStyle, padding: '4px 0' }}>
              <span style={labelStyle}>Avg Price</span>
              <span style={valueStyle}>${stats.averagePrice.toFixed(2)}</span>
            </div>
            <div style={{ ...statItemStyle, padding: '4px 0', borderBottom: 'none' }}>
              <span style={labelStyle}>Total Value</span>
              <span style={valueStyle}>${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}