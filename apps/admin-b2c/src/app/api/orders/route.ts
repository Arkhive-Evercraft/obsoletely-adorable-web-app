import { NextResponse } from 'next/server';
import { client } from '@repo/db/client';

export async function GET() {
  try {
    const sales = await client.db.sale.findMany({
      include: {
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

    // Transform the data to match the admin orders interface
    const orders = sales.map(sale => ({
      id: `ORD-${sale.id.toString().padStart(3, '0')}`,
      customerName: `Customer ${sale.id}`, // Mock customer name since not in schema
      customerEmail: `customer${sale.id}@example.com`, // Mock email
      totalAmount: sale.total / 100, // Convert from cents to dollars
      status: getRandomStatus(), // Mock status since not in schema
      orderDate: sale.date.toISOString().split('T')[0],
      lastUpdated: sale.date.toISOString().split('T')[0],
      items: sale.items.map(item => ({
        name: item.item.name,
        quantity: item.quantity,
        price: item.priceAtSale / 100 // Convert from cents to dollars
      })),
      shippingAddress: `123 Mock St, City, State 12345` // Mock address
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

// Helper function to generate mock status since it's not in the database
function getRandomStatus() {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}