'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

const categories = [
    'graphic_design',
    'fivem_trailer',
    'custom_clothing',
    'custom_cars',
    'streaming_design',
    'business_branding',
    'discord_design',
    '3d_design',
    '2d_design',
] as const;

export function ServiceFilters() {
    const t = useTranslations('categories');
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category') || ''
    );

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCategory) params.set('category', selectedCategory);

        router.push(`/services?${params.toString()}`);
    };

    const handleCategoryClick = (category: string) => {
        const newCategory = category === selectedCategory ? '' : category;
        setSelectedCategory(newCategory);

        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (newCategory) params.set('category', newCategory);

        router.push(`/services?${params.toString()}`);
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        router.push('/services');
    };

    return (
        <div className="space-y-6 mb-8">
            <div className="flex gap-4">
                <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">Search services</Label>
                    <Input
                        id="search"
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                    />
                </div>
                <Button onClick={handleFilter}>Search</Button>
                <Button onClick={clearFilters} variant="outline">Clear</Button>
            </div>

            <div>
                <Label className="mb-3 block">Filter by Category:</Label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Badge
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            className="cursor-pointer text-sm px-3 py-1.5"
                            onClick={() => handleCategoryClick(category)}
                        >
                            {t(category)}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
