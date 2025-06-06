import { getProductById } from '@repo/db/functions';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the ID from params
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform the database product to match the frontend interface
    const transformedProduct = {
      id: product.id,
      name: product.name,
      price: product.price / 100, // Convert from cents to dollars
      description: product.description || '',
      imageUrl: product.imageUrl,
      categoryName: product.categoryName || 'Uncategorized',
      //featured: product.featured,
      inventory: product.inventory, // Access inventory field directly
      inStock: product.inventory > 0, // Compute inStock from inventory
      // Use current date as fallback since database doesn't have these fields
      createdAt: (product as any).createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: (product as any).updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}