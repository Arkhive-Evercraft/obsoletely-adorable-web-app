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
  removeUserCartReservation,
  getSessionReservations 
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

    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email;
    
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
    
    // Create the reservation
    let reservationCreated;
    
    if (userId) {
      reservationCreated = await createUserCartReservation({
        productId: Number(productId),
        quantity: quantity,
        sessionId: sessionId,
        userId: userId
      });
    } else {
      reservationCreated = await createCartReservation({
        productId: Number(productId),
        quantity: quantity,
        sessionId: sessionId
      });
    }
    
    if (!reservationCreated) {
      const availableInventory = await getAvailableInventory(Number(productId));
      return NextResponse.json(
        { 
          success: false,
          message: 'Not enough inventory available',
          availableInventory: availableInventory
        },
        { status: 409 }
      );
    }
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    return NextResponse.json({
      success: true,
      message: 'Item reserved successfully',
      productId: productId,
      quantity: quantity,
      sessionId: sessionId,
      expiresAt: expiresAt.toISOString(),
      reservationTime: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error reserving inventory:', error);
    
    let errorMessage = 'Failed to reserve inventory';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Missing product ID' },
        { status: 400 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email;
    
    // Get session ID from cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session_id')?.value;
    
    if (!sessionId && !userId) {
      return NextResponse.json(
        { message: 'No active cart session' },
        { status: 404 }
      );
    }

    // Remove the reservation
    let reservationRemoved;
    
    if (userId) {
      reservationRemoved = await removeUserCartReservation(Number(productId), userId);
    } else if (sessionId) {
      reservationRemoved = await removeCartReservation(Number(productId), sessionId);
    } else {
      reservationRemoved = false;
    }
    
    if (!reservationRemoved) {
      return NextResponse.json(
        { message: 'Failed to remove reservation' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Reservation released successfully',
      productId: productId
    });
    
  } catch (error) {
    console.error('Error releasing reservation:', error);
    
    let errorMessage = 'Failed to release reservation';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

// Get current reservations for the session
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session_id')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { message: 'No active cart session' },
        { status: 404 }
      );
    }
    
    const reservations = await getSessionReservations(sessionId);
    
    return NextResponse.json({
      sessionId: sessionId,
      reservations: reservations,
      message: 'Active reservations retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching reservations:', error);
    
    let errorMessage = 'Failed to fetch reservations';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
