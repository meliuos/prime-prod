'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/lib/actions/orders';
import { toast } from 'sonner';

interface UpdateOrderStatusButtonProps {
  orderId: string;
  newStatus: string;
  label: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
}

export function UpdateOrderStatusButton({
  orderId,
  newStatus,
  label,
  variant = 'default',
}: UpdateOrderStatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleUpdate} disabled={isLoading} variant={variant}>
      {isLoading ? 'Updating...' : label}
    </Button>
  );
}
