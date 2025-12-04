'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createShowcase, updateShowcase } from '@/lib/actions/showcases';
import { toast } from 'sonner';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface Showcase {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    order: number;
    isActive: boolean;
}

interface ShowcaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    showcase?: Showcase;
}

export function ShowcaseDialog({ open, onOpenChange, mode, showcase }: ShowcaseDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: showcase?.title || '',
        description: showcase?.description || '',
        category: showcase?.category || '',
        imageUrl: showcase?.imageUrl || '',
        order: showcase?.order || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (mode === 'create') {
                await createShowcase({
                    ...formData,
                    isActive: true,
                });
                toast.success('Showcase created successfully');
            } else if (showcase) {
                await updateShowcase(showcase.id, formData);
                toast.success('Showcase updated successfully');
            }

            onOpenChange(false);

            // Reset form if creating
            if (mode === 'create') {
                setFormData({
                    title: '',
                    description: '',
                    category: '',
                    imageUrl: '',
                    order: 0,
                });
            }
        } catch (error) {
            toast.error(`Failed to ${mode} showcase`);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update form data when showcase prop changes
    useState(() => {
        if (showcase && mode === 'edit') {
            setFormData({
                title: showcase.title,
                description: showcase.description,
                category: showcase.category,
                imageUrl: showcase.imageUrl,
                order: showcase.order,
            });
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Create New Showcase' : 'Edit Showcase'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Add a new showcase item to display on the landing page'
                            : 'Update the showcase item details'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="FiveM Server Trailer"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Cinematic trailer for a roleplay server"
                            required
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Motion Graphics"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                        {formData.imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-md"
                                    onError={(e) => {
                                        e.currentTarget.src = '';
                                        e.currentTarget.alt = 'Invalid image URL';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="order">Display Order</Label>
                        <Input
                            id="order"
                            type="number"
                            min="0"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            Lower numbers appear first on the page
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
