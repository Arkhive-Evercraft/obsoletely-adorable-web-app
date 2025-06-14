import { getProducts, createProduct, getAvailableInventory } from '@repo/db/functions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await getProducts();
    
    // Transform products to convert prices from cents to dollars and include real-time availability
    const transformedProducts = await Promise.all(
      products.map(async (product) => {
        const availableInventory = await getAvailableInventory(product.id);
        
        return {
          id: product.id,
          name: product.name,
          price: product.price / 100, // Convert from cents to dollars
          description: product.description,
          story: product.story,
          imageUrl: product.imageUrl,
          categoryName: product.categoryName,
          inventory: product.inventory,
          availableInventory, // Real-time available inventory considering reservations
          inStock: availableInventory > 0, // Compute inStock from available inventory
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        };
      })
    );
    
    return NextResponse.json(transformedProducts);
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
    const { name, price, description, story, imageUrl, categoryName, inventory } = body;

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
      story: story || '',
      imageUrl,
      categoryName,
      inventory: inventory || 0
    });

    if (!newProduct) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    // Transform the response to include date fields and proper formatting
    const transformedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      price: newProduct.price / 100, // Convert back to dollars
      description: newProduct.description,
      imageUrl: newProduct.imageUrl,
      categoryName: newProduct.categoryName,
      inventory: newProduct.inventory,
      inStock: newProduct.inventory > 0,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt
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