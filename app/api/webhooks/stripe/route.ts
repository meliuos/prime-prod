import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { orders, orderStatusHistory } from '@/db/schema/orders';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('STRIPE_WEBHOOK_SECRET is not configured');
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract metadata
        const { serviceId, userId } = session.metadata || {};

        if (!serviceId || !userId) {
            console.error('Missing metadata in checkout session');
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // Generate order number
        const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        try {
            // Create order in database
            const [newOrder] = await db
                .insert(orders)
                .values({
                    orderNumber,
                    buyerId: userId,
                    serviceId,
                    amount: ((session.amount_total || 0) / 100).toString(), // Convert cents to dollars
                    status: 'pending',
                    stripeSessionId: session.id,
                    stripePaymentIntentId: session.payment_intent as string,
                })
                .returning();

            // Create status history entry
            await db.insert(orderStatusHistory).values({
                orderId: newOrder.id,
                status: 'pending',
                changedBy: userId,
                note: 'Order created from successful payment',
            });

            console.log('Order created successfully:', newOrder.id);
        } catch (error) {
            console.error('Error creating order:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
