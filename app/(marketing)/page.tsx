import { HeroSection } from '@/components/landing/hero-section';
import { ServicesCarousel } from '@/components/landing/services-carousel';
import { PortfolioShowcase } from '@/components/landing/portfolio-showcase';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CTASection } from '@/components/landing/cta-section';
import { getAllShowcases } from '@/lib/actions/showcases';
import { getActiveServices } from '@/lib/actions/services';

export default async function HomePage() {
    const showcases = await getAllShowcases();
    const services = await getActiveServices(6);

    return (
        <main className="min-h-screen">
            <HeroSection />
            <ServicesCarousel services={services} />
            <PortfolioShowcase showcases={showcases} />
            <TestimonialsSection />
            <CTASection />
        </main>
    );
}
