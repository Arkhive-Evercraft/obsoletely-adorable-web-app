import { NextResponse } from 'next/server';
import { getSales } from '@repo/db/functions'

export async function GET() {
  try {
    const sales = await getSales();

    // Transform the data to match the orders interface
    const orders = sales.map((sale: any) => ({
      id: sale.id,
      customerName: sale.customer.name,
      customerEmail: sale.customer.email,
      totalAmount: sale.total / 100, // Convert from cents to dollars
      orderDate: sale.date.toISOString().split('T')[0],
      lastUpdated: sale.date.toISOString().split('T')[0],
      items: sale.items.map((item: { item: { name: any; }; quantity: any; price: number; }) => ({
        name: item.item.name,
        quantity: item.quantity,
        price: item.price / 100 // Convert from cents to dollars
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