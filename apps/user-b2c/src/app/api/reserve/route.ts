import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/auth';
import { 
  getProductById, 
  createCartReservation, 
  createUserCartReservation,
  getAvailableInventory,
  removeCartReservation,
  removeUserCartReservation
} from '@repo/db/functions';

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();
    
    if (!productId || !quantity) {
      return NextResponse.json(
        { message: 'Missing required product information' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { message: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email; // Using email as user ID
    
    // Get current session ID or create a new one
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart_session_id')?.value;
    
    if (!sessionId) {
      sessionId = uuidv4();
      cookieStore.set('cart_session_id', sessionId, { 
        maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
        path: '/',
        httpOnly: true
      });
    }
    
    // Check if the product exists
    const product = await getProductById(Number(productId));
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check available inventory
    const availableInventory = await getAvailableInventory(Number(productId));
    
    if (availableInventory < quantity) {
      return NextResponse.json(
        { 
          success: false,
          message: `Not enough inventory available. Only ${availableInventory} items remaining.`,
          availableInventory: availableInventory
        },
        { status: 409 } // Conflict
      );
    }
    
    // Create weekly reservation (1 week expiry)
    let reservationCreated;
    
    if (userId) {
      // User is logged in, create user-based reservation with 1 week expiry
      reservationCreated = await createUserCartReservation({
        productId: Number(productId),
        quantity: quantity,
        sessionId: sessionId,
        userId: userId,
        expiryWeeks: 1 // Weekly reservation
      });
    } else {
      // Guest user, create session-based reservation with 1 week expiry
      reservationCreated = await createCartReservation({
        productId: Number(productId),
        quantity: quantity,
        sessionId: sessionId,
        expiryWeeks: 1 // Weekly reservation
      });
    }
    
    if (!reservationCreated) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to create reservation. Please try again.',
        },
        { status: 500 }
      );
    }
    
    // Calculate expiration date - 1 week from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    return NextResponse.json({
      success: true,
      message: 'Item reserved for 1 week',
      reservation: {
        productId: Number(productId),
        quantity: quantity,
        sessionId: sessionId,
        expiresAt: expiresAt.toISOString(),
        reservationType: 'weekly'
      }
    });
    
  } catch (error) {
    console.error('Weekly reservation error:', error);
    
    let errorMessage = 'Failed to create weekly reservation';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false,
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email;
    
    // Get session ID from cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session_id')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { message: 'No active session found' },
        { status: 400 }
      );
    }
    
    // Remove reservation
    let removed;
    
    if (userId) {
      // Remove user-based reservation
      removed = await removeUserCartReservation(Number(productId), userId);
    } else {
      // Remove session-based reservation
      removed = await removeCartReservation(Number(productId), sessionId);
    }
    
    if (!removed) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to remove reservation' 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Weekly reservation removed successfully'
    });
    
  } catch (error) {
    console.error('Remove weekly reservation error:', error);
    
    let errorMessage = 'Failed to remove weekly reservation';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false,
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}
