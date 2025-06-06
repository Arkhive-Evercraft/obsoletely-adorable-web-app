import { getProducts } from '@repo/db/functions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await getProducts();
    
    // Transform products to convert prices from cents to dollars and include date fields
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price / 100, // Convert from cents to dollars
      description: product.description,
      imageUrl: product.imageUrl,
      categoryName: product.categoryName,
      inventory: product.inventory,
      inStock: product.inventory > 0, // Compute inStock from inventory
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
    
    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}