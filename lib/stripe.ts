import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
    typescript: true,
});

// Helper function to format amount for Stripe (convert dollars to cents)
export function formatAmountForStripe(amount: number): number {
    return Math.round(amount * 100);
}

// Helper function to format amount for display
export function formatAmountForDisplay(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}
