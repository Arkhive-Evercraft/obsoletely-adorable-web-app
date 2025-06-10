import { NextResponse } from 'next/server';
import { getSaleById } from '@repo/db/functions';
import type { Sale, Customer, ProductSale, Product, Category } from '@prisma/client';
import { Order } from "@repo/db/data"

// Define the expanded type including relations
type SaleWithRelations = Sale & {
  customer: Customer;
  items: (ProductSale & {
    item: Product & {
      category: Category
    }
  })[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const sale = await getSaleById(id) as unknown as SaleWithRelations;
    
    if (!sale) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Transform the Prisma Sale object to match the Order interface
    const order: Order = {
      id: sale.id.toString(),
      customerName: sale.customer.name,
      customerEmail: sale.customer.email,
      totalAmount: sale.total / 100, // Convert from cents to dollars
      orderDate: sale.date.toISOString(),
      items: sale.items.map(item => ({
        name: item.item.name,
        quantity: item.quantity,
        price: item.price / 100 // Convert item price from cents to dollars
      })),
      shippingAddress: sale.customer.address || 'Address not provided'
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}