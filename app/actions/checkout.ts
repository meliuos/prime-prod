'use server';

import { requireAuth } from '@/lib/dal';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { getServiceById } from './services';
import { headers } from 'next/headers';

export async function createCheckoutSession(serviceId: string) {
    // Verify user is authenticated
    const { userId } = await requireAuth();

    // Get service details
    const service = await getServiceById(serviceId);

    if (!service || !service.isActive) {
        throw new Error('Service not found or inactive');
    }

    const price = parseFloat(service.price);

    // Get the origin from headers
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: service.name,
                        description: service.description,
                    },
                    unit_amount: formatAmountForStripe(price),
                },
                quantity: 1,
            },
        ],
        metadata: {
            serviceId: service.id,
            userId: userId || '',
            serviceName: service.name,
        },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
    });

    return { url: checkoutSession.url };
}
