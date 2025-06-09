import { NextRequest, NextResponse } from 'next/server';
import { SquareClient, SquareEnvironment } from 'square';
import { randomUUID } from 'crypto';
import { env } from "@repo/env/web"

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox, // Change to Environment.Production for live
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

    // Check if Square location ID is available
    if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
      throw new Error('Square location ID is not configured');
    }

    // Create order in Square
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
        // Add taxes to match the client-side tax calculation (10%)
        taxes: [
          {
            name: "GST",
            percentage: "10",
            scope: "ORDER" as const,  // Use const assertion for proper type
          }
        ]
      },
      idempotencyKey: randomUUID(),
    };

    const orderResponse = await ordersApi.create(orderRequest);
    
    if (!orderResponse.order) {
      throw new Error('Failed to create order');
    }

    // Use the order's total amount rather than the client-provided amount
    // to ensure they match exactly
    const orderAmount = orderResponse.order.totalMoney?.amount;
    
    if (!orderAmount) {
      throw new Error('Order total amount is missing');
    }
    
    console.log('Order total:', orderAmount.toString());
    console.log('Client-provided amount:', amount.toString());

    // Process payment
    const paymentRequest = {
      sourceId: token,
      amountMoney: {
        amount: orderAmount, // Always use the order amount
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
