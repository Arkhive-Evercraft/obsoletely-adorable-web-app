import { getProductById, updateProduct } from '@repo/db/functions';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the ID from params
    const id = parseInt((await params).id);
    
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
      story: product.story,
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { 
      name, 
      price, 
      description, 
      story,
      imageUrl, 
      categoryName, 
      inventory 
    } = body;
    
    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }
    
    if (price === undefined || price <= 0) {
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
    
    // Update the product with inventory field
    const updatedProduct = await updateProduct(id, {
      name,
      price, // Convert to cents for database
      description: description || '',
      story: story || '',
      imageUrl,
      categoryName,
      inventory: inventory || 0
    });
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }
    
    // Transform the response to include proper date fields
    const transformedProduct = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      price: updatedProduct.price / 100, // Convert to dollars for frontend
      description: updatedProduct.description,
      imageUrl: updatedProduct.imageUrl,
      categoryName: updatedProduct.categoryName,
      inventory: updatedProduct.inventory,
      inStock: updatedProduct.inventory > 0,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt
    };
    
    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}