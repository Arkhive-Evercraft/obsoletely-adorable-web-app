import { NextRequest, NextResponse } from 'next/server';
import { SquareClient, SquareEnvironment } from 'square';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { clearSessionReservations } from '@repo/db/functions';

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});

export async function POST(request: NextRequest) {
  try {
    const { token, amount, currency, orderItems, shippingInfo } = await request.json();

    if (!token || !amount) {
      return NextResponse.json(
        { message: 'Missing required payment information' },
        { status: 400 }
      );
    }

    const paymentsApi = client.payments;
    const ordersApi = client.orders;

    if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
      throw new Error('Square location ID is not configured');
    }

    const orderRequest = {
      order: {
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
        lineItems: orderItems.map((item: any) => ({
          name: item.name,
          quantity: item.quantity.toString(),
          basePriceMoney: {
            amount: BigInt(Math.round(item.price * 100)),
            currency: currency || 'AUD',
          },
        })),
        taxes: [
          {
            name: "GST",
            percentage: "10",
            scope: "ORDER" as const,
          }
        ]
      },
      idempotencyKey: randomUUID(),
    };

    const orderResponse = await ordersApi.create(orderRequest);
    
    if (!orderResponse.order) {
      throw new Error('Failed to create order');
    }

    const orderAmount = orderResponse.order.totalMoney?.amount;
    
    if (!orderAmount) {
      throw new Error('Order total amount is missing');
    }
    
    console.log('Order total:', orderAmount.toString());
    console.log('Client-provided amount:', amount.toString());

    const paymentRequest = {
      sourceId: token,
      amountMoney: {
        amount: orderAmount,
        currency: currency || 'AUD',
      },
      orderId: orderResponse.order.id,
      idempotencyKey: randomUUID(),
      autocomplete: true,
      note: `Order from ${shippingInfo.firstName} ${shippingInfo.lastName}`,
      buyerEmailAddress: shippingInfo.email,
    };

    const paymentResponse = await paymentsApi.create(paymentRequest);

    if (paymentResponse.payment?.status === 'COMPLETED') {
      try {
        const inventoryUpdateResponse = await fetch(new URL('/api/inventory/update', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: orderItems.map((item: any) => ({
              itemId: Number(item.id),
              quantity: Number(item.quantity)
            }))
          }),
        });
        
        if (!inventoryUpdateResponse.ok) {
          console.error('Failed to update inventory:', await inventoryUpdateResponse.text());
        }
      } catch (inventoryError) {
        console.error('Inventory update error:', inventoryError);
      }

      try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('cart_session_id')?.value;

        if (sessionId) {
          await clearSessionReservations(sessionId);
        }
      } catch (cleanupError) {
        console.error('Cart reservation cleanup error:', cleanupError);
      }

      return NextResponse.json({
        success: true,
        paymentId: paymentResponse.payment.id,
        orderId: orderResponse.order.id,
      });
    } else {
      throw new Error('Payment was not completed');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    
    let errorMessage = 'Payment processing failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
