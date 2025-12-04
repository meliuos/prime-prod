'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { createService, updateService } from '@/lib/actions/services';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  deliveryTime: number;
  icon?: string | null;
  color?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  mode: 'create' | 'edit';
}

const categories = [
  { value: 'graphic_design', label: 'Graphic Design' },
  { value: 'fivem_trailer', label: 'FiveM Trailer' },
  { value: 'custom_clothing', label: 'Custom Clothing' },
  { value: 'custom_cars', label: 'Custom Cars' },
  { value: 'streaming_design', label: 'Streaming Design' },
  { value: 'business_branding', label: 'Business Branding' },
  { value: 'discord_design', label: 'Discord Design' },
  { value: '3d_design', label: '3D Design' },
  { value: '2d_design', label: '2D Design' },
];

export function ServiceFormDialog({ open, onOpenChange, service, mode }: ServiceFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'graphic_design',
    price: '',
    deliveryTime: '',
    icon: '',
    color: '#0284c7',
    imageUrl: '',
    isActive: true,
  });

  // Update form when service changes
  useEffect(() => {
    if (service && mode === 'edit') {
      setFormData({
        name: service.name,
        slug: service.slug,
        description: service.description,
        category: service.category,
        price: service.price,
        deliveryTime: service.deliveryTime.toString(),
        icon: service.icon || '',
        color: service.color || '#0284c7',
        imageUrl: service.imageUrl || '',
        isActive: service.isActive,
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        slug: '',
        description: '',
        category: 'graphic_design',
        price: '',
        deliveryTime: '',
        icon: '',
        color: '#0284c7',
        imageUrl: '',
        isActive: true,
      });
    }
  }, [service, mode, open]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: mode === 'create' ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();

      if (mode === 'edit' && service) {
        formDataObj.append('id', service.id);
      }

      formDataObj.append('name', formData.name);
      formDataObj.append('slug', formData.slug);
      formDataObj.append('description', formData.description);
      formDataObj.append('category', formData.category);
      formDataObj.append('price', formData.price);
      formDataObj.append('deliveryTime', formData.deliveryTime);
      formDataObj.append('icon', formData.icon);
      formDataObj.append('color', formData.color);
      formDataObj.append('imageUrl', formData.imageUrl);
      formDataObj.append('isActive', formData.isActive.toString());

      if (mode === 'create') {
        await createService(formDataObj);
        toast.success('Service created successfully');
      } else {
        await updateService(formDataObj);
        toast.success('Service updated successfully');
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Service' : 'Edit Service'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new service to your platform.'
              : 'Update the service details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Professional Logo Design"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="professional-logo-design"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the service..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="text"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="49.99"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time (days) *</Label>
              <Input
                id="deliveryTime"
                type="number"
                min="1"
                value={formData.deliveryTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                placeholder="3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color (Hex)</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="lucide-icon-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                mode === 'create' ? 'Create Service' : 'Update Service'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
