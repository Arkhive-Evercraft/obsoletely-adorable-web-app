import { getProducts, createProduct } from '@repo/db/functions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description, imageUrl, categoryName, featured, inventory } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: 'Valid product price is required' },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Product image URL is required' },
        { status: 400 }
      );
    }

    if (!categoryName) {
      return NextResponse.json(
        { error: 'Product category is required' },
        { status: 400 }
      );
    }

    // Create the product
    const newProduct = await createProduct({
      name,
      price: Math.round(price * 100), // Convert to cents
      description: description || '',
      imageUrl,
      categoryName,
      featured: featured || false,
      inventory: inventory || 0
    });

    if (!newProduct) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    // Transform the response to match frontend expectations
    const transformedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      price: newProduct.price / 100, // Convert back to dollars
      description: newProduct.description || '',
      imageUrl: newProduct.imageUrl,
      categoryName: newProduct.categoryName || 'Uncategorized',
      featured: newProduct.featured || false,
      inventory: newProduct.inventory || 0,
      inStock: (newProduct.inventory || 0) > 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(transformedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}