import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredReservations } from '@repo/db/functions';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.nextUrl.searchParams.get('apiKey');
    const expectedApiKey = process.env.CRON_API_KEY || 'default-cron-api-key';
    
    if (apiKey !== expectedApiKey) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log(`[${new Date().toISOString()}] Running cart reservation cleanup`);
    
    const cleanedCount = await cleanupExpiredReservations();
    
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${cleanedCount} expired reservations`,
      cleanedCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error cleaning up expired reservations:', error);
    
    let errorMessage = 'Failed to clean up expired reservations';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
