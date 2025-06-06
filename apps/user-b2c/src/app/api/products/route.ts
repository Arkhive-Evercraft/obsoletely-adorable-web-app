import { getProducts } from '@repo/db/functions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await getProducts();
    
    // Transform products to convert prices from cents to dollars
    const transformedProducts = products.map(product => ({
      ...product,
      price: product.price / 100, // Convert from cents to dollars
      inStock: product.inventory > 0 // Compute inStock from inventory
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