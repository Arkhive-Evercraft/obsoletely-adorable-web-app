import { getProductById } from '@repo/db/functions';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tid } = await params;

    const id = parseInt(tid);
    
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
      description: product.description,
      imageUrl: product.imageUrl,
      categoryName: product.categoryName,
      inventory: product.inventory,
      inStock: product.inventory > 0, // Compute inStock from inventory
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
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