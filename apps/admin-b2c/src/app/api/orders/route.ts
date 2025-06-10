import { NextResponse } from 'next/server';
import { client } from '@repo/db/client';

export async function GET() {
  try {
    const sales = await client.db.sale.findMany({
      include: {
        customer: true,
        items: {
          include: {
            item: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Transform the data to match the orders interface
    const orders = sales.map((sale: { id: { toString: () => string; }; customer: { name: any; email: any; address: any; }; total: number; date: { toISOString: () => string; }; items: any[]; }) => ({
      id: `ORD-${sale.id.toString().padStart(3, '0')}`,
      customerName: sale.customer.name,
      customerEmail: sale.customer.email,
      totalAmount: sale.total / 100, // Convert from cents to dollars
      orderDate: sale.date.toISOString().split('T')[0],
      lastUpdated: sale.date.toISOString().split('T')[0],
      items: sale.items.map(item => ({
        name: item.item.name,
        quantity: item.quantity,
        price: item.priceAtSale / 100 // Convert from cents to dollars
      })),
      shippingAddress: sale.customer.address || 'Address not provided'
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}