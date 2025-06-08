import { deleteProduct } from '../../../../../../../packages/db/dist/functions';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Convert string ID to number for database function
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const result = await deleteProduct(productId);
    
    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}