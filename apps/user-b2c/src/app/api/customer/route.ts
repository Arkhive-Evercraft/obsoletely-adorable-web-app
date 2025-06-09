import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getCustomerByEmail } from '@repo/db/functions';

export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch customer data from database
    const customer = await getCustomerByEmail(session.user.email);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Return customer data
    return NextResponse.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      memberSince: customer.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer data' },
      { status: 500 }
    );
  }
}
