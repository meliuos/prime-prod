'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { acceptOrder } from '@/lib/actions/orders';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

interface AcceptOrderButtonProps {
  orderId: string;
}

export function AcceptOrderButton({ orderId }: AcceptOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await acceptOrder(orderId);
      toast.success('Order accepted successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to accept order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleAccept} disabled={isLoading}>
      <Check className="mr-2 h-4 w-4" />
      {isLoading ? 'Accepting...' : 'Accept Order'}
    </Button>
  );
}
