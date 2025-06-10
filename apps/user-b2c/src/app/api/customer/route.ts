import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getCustomerByEmail, updateCustomer } from '@repo/db/functions';

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

export async function PUT(request: Request) {
  try {
    // Get the current session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, phone, address } = body;

    // Validate required fields
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    // Update customer data in database
    const updatedCustomer = await updateCustomer(session.user.email, {
      name,
      phone: phone || undefined,
      address: address || undefined,
    });
    
    if (!updatedCustomer) {
      return NextResponse.json(
        { error: 'Failed to update customer' },
        { status: 500 }
      );
    }

    // Return updated customer data
    return NextResponse.json({
      id: updatedCustomer.id,
      name: updatedCustomer.name,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      address: updatedCustomer.address,
      memberSince: updatedCustomer.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Error updating customer data:', error);
    return NextResponse.json(
      { error: 'Failed to update customer data' },
      { status: 500 }
    );
  }
}
