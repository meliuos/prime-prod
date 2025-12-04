'use client';

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
import { toggleServiceStatus } from '@/lib/actions/services';
import { toast } from 'sonner';
import { useState } from 'react';

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  deliveryTime: number;
  isActive: boolean;
  createdAt: Date;
}

interface ServicesTableProps {
  services: Service[];
}

export function ServicesTable({ services }: ServicesTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (serviceId: string, currentStatus: boolean) => {
    setLoadingId(serviceId);
    try {
      await toggleServiceStatus(serviceId, !currentStatus);
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update service status');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Delivery Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                <TableCell>
                  <Button
                    size="sm"
                    variant={service.isActive ? 'outline' : 'default'}
                    onClick={() => handleToggleStatus(service.id, service.isActive)}
                    disabled={loadingId === service.id}
                  >
                    {loadingId === service.id
                      ? 'Updating...'
                      : service.isActive
                      ? 'Deactivate'
                      : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
