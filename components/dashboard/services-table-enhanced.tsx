'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { deleteService, toggleServiceStatus } from '@/lib/actions/services';
import { toast } from 'sonner';
import { ServiceFormDialog } from './service-form-dialog';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  createdAt: Date;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ServicesTableEnhancedProps {
  services: Service[];
  pagination: Pagination;
  searchParams: {
    search?: string;
    category?: string;
    isActive?: string;
    page?: string;
  };
}

const categories = [
  { value: 'all', label: 'All Categories' },
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

export function ServicesTableEnhanced({ services, pagination, searchParams }: ServicesTableEnhancedProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState(searchParams.search || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.category || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.isActive || 'all');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    if (statusFilter !== 'all') params.set('isActive', statusFilter);
    params.set('page', '1');

    router.push(`/dashboard/services?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setCategoryFilter('all');
    setStatusFilter('all');
    router.push('/dashboard/services');
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    if (statusFilter !== 'all') params.set('isActive', statusFilter);
    params.set('page', newPage.toString());

    router.push(`/dashboard/services?${params.toString()}`);
  };

  const handleToggleStatus = async (serviceId: string, currentStatus: boolean) => {
    setLoadingId(serviceId);
    try {
      await toggleServiceStatus(serviceId, !currentStatus);
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update service status');
    } finally {
      setLoadingId(null);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleDeleteClick = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete);
      toast.success('Service deleted successfully');
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Search</label>
          <div className="flex gap-2">
            <Input
              placeholder="Search services..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full md:w-48">
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
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

        <div className="w-full md:w-40">
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No services found
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {service.category.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${parseFloat(service.price).toFixed(2)}
                  </TableCell>
                  <TableCell>{service.deliveryTime} days</TableCell>
                  <TableCell>
                    <Badge variant={service.isActive ? 'default' : 'secondary'}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={service.isActive ? 'outline' : 'default'}
                        onClick={() => handleToggleStatus(service.id, service.isActive)}
                        disabled={loadingId === service.id}
                      >
                        {loadingId === service.id
                          ? '...'
                          : service.isActive
                          ? 'Deactivate'
                          : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} services
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Service Form Dialog */}
      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        service={selectedService}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this service. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
