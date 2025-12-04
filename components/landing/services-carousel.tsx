"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  deliveryTime: number;
  imageUrl?: string | null;
  color?: string | null;
}

interface ServicesCarouselProps {
  services: Service[];
}

export function ServicesCarousel({ services }: ServicesCarouselProps) {
  const cards = services.map((service, index) => {
    const card = {
      src: service.imageUrl || `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2448&auto=format&fit=crop`,
      title: service.name,
      category: service.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      content: (
        <ServiceContent
          service={service}
        />
      ),
    };

    return <Card key={service.id} card={card} index={index} />;
  });

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Our Premium Services
      </h2>
      <p className="max-w-7xl pl-4 mx-auto text-base md:text-xl mt-4 text-neutral-600 dark:text-neutral-400 font-sans">
        Explore our range of professional design and development services tailored to your needs
      </p>
      <Carousel items={cards} />
    </div>
  );
}

const ServiceContent = ({ service }: { service: Service }) => {
  return (
    <div className="space-y-6">
      {/* Service Details */}
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
        <h3 className="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mb-4">
          Service Details
        </h3>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              Category:
            </span>{" "}
            <span className="text-neutral-600 dark:text-neutral-400">
              {service.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          <div>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              Price:
            </span>{" "}
            <span className="text-neutral-600 dark:text-neutral-400">
              ${parseFloat(service.price).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              Delivery Time:
            </span>{" "}
            <span className="text-neutral-600 dark:text-neutral-400">
              {service.deliveryTime} days
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
        <h3 className="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mb-4">
          About This Service
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-8 md:p-14 rounded-3xl">
        <h3 className="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mb-4">
          Ready to Get Started?
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Order this service now and experience professional quality delivery
        </p>
        <div className="flex gap-4">
          <Link href={`/services/${service.slug}`}>
            <Button size="lg" className="font-semibold">
              View Details
            </Button>
          </Link>
          <Link href={`/checkout?service=${service.id}`}>
            <Button size="lg" variant="outline" className="font-semibold">
              Order Now - ${parseFloat(service.price).toFixed(2)}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
