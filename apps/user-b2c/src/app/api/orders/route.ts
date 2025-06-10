import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getSalesByCustomerEmail } from '@repo/db/functions';
import type { Sale, Customer, ProductSale, Product, Category } from '@prisma/client';

// Define the expanded type including relations
type SaleWithRelations = Sale & {
  customer: Customer;
  items: (ProductSale & {
    item: Product & {
      category: Category
    }
  })[];
}

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

    // Fetch sales/orders from database for the current user
    const sales = await getSalesByCustomerEmail(session.user.email) as unknown as SaleWithRelations[];
    
    // Transform the data to match the Order interface expected by the frontend
    const orders = sales.map((sale) => ({
      id: sale.id.toString(),
      customerName: sale.customer.name,
      customerEmail: sale.customer.email,
      totalAmount: sale.total / 100, // Convert from cents to dollars
      orderDate: sale.date.toISOString(),
      items: sale.items.map(item => ({
        name: item.item.name,
        quantity: item.quantity,
        price: item.price / 100 // Convert from cents to dollars
      })),
      shippingAddress: sale.customer.address || 'Address not provided'
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}