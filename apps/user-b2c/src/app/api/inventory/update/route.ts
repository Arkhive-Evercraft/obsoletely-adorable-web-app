import { NextRequest, NextResponse } from 'next/server';
import { updateInventoryAfterSale } from '@repo/db/functions';

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: 'Invalid items data' },
        { status: 400 }
      );
    }

    // Validate the items array
    const validItems = items.every(item => 
      typeof item.itemId === 'number' && 
      typeof item.quantity === 'number' && 
      item.quantity > 0
    );

    if (!validItems) {
      return NextResponse.json(
        { message: 'Invalid item data format' },
        { status: 400 }
      );
    }

    // Update inventory in the database
    const success = await updateInventoryAfterSale(items);

    if (success) {
      return NextResponse.json({ 
        success: true,
        message: 'Inventory updated successfully' 
      });
    } else {
      throw new Error('Failed to update inventory');
    }
  } catch (error) {
    console.error('Inventory update error:', error);
    
    let errorMessage = 'Inventory update failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
