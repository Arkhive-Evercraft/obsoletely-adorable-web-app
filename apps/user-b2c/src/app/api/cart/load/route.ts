import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/auth';
import { 
  getSessionReservations, 
  getUserReservations,
  transferSessionCartToUser 
} from '@repo/db/functions';

export async function GET(request: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    // Get session ID from cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session_id')?.value;
    
    let cartItems: any[] = [];
    
    if (session?.user?.email) {
      // User is logged in
      const userId = session.user.email; // Using email as user ID
      
      if (sessionId) {
        // Transfer any session-based cart items to user account
        await transferSessionCartToUser(sessionId, userId);
      }
      
      // Get user's saved cart
      const userReservations = await getUserReservations(userId);
      cartItems = userReservations.map(reservation => ({
        id: reservation.productId.toString(),
        name: reservation.product.name,
        price: reservation.product.price / 100, // Convert from cents
        description: reservation.product.description,
        imageUrl: reservation.product.imageUrl,
        category: reservation.product.categoryName,
        quantity: reservation.quantity,
        inStock: true, // Will be updated based on real-time inventory
        expiresAt: reservation.expiresAt,
      }));
    } else if (sessionId) {
      // Guest user with session
      const sessionReservations = await getSessionReservations(sessionId);
      cartItems = sessionReservations.map(reservation => ({
        id: reservation.productId.toString(),
        name: reservation.product.name,
        price: reservation.product.price / 100, // Convert from cents
        description: reservation.product.description,
        imageUrl: reservation.product.imageUrl,
        category: reservation.product.categoryName,
        quantity: reservation.quantity,
        inStock: true, // Will be updated based on real-time inventory
        expiresAt: reservation.expiresAt,
      }));
    }
    
    return NextResponse.json({
      success: true,
      cartItems,
      isLoggedIn: !!session?.user?.email,
      sessionId
    });
    
  } catch (error) {
    console.error('Error loading cart:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to load cart',
        cartItems: []
      },
      { status: 500 }
    );
  }
}
