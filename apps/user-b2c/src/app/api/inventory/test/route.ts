import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateInventoryAfterSale } from '@repo/db/functions';

/**
 * This is a test endpoint to verify inventory updating functionality.
 * In a production environment, this would be secured or removed.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the product ID from the query string
    const productId = request.nextUrl.searchParams.get('productId');
    
    if (!productId || isNaN(Number(productId))) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    // Get the product before updating inventory
    const productBefore = await getProductById(Number(productId));
    
    if (!productBefore) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Get quantity from query string (default to 1)
    const quantity = Number(request.nextUrl.searchParams.get('quantity')) || 1;
    
    // Update inventory
    const success = await updateInventoryAfterSale([
      { itemId: Number(productId), quantity }
    ]);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to update inventory' },
        { status: 500 }
      );
    }
    
    // Get the product after updating inventory
    const productAfter = await getProductById(Number(productId));
    
    return NextResponse.json({
      success: true,
      before: {
        id: productBefore.id,
        name: productBefore.name,
        inventory: productBefore.inventory
      },
      after: {
        id: productAfter?.id,
        name: productAfter?.name,
        inventory: productAfter?.inventory
      },
      quantityReduced: quantity
    });
  } catch (error) {
    console.error('Test inventory update error:', error);
    
    let errorMessage = 'Test inventory update failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
