'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateDefaultCommissionRate } from '@/lib/actions/settings';
import { toast } from 'sonner';

interface CommissionRateFormProps {
  currentRate: number;
}

export function CommissionRateForm({ currentRate }: CommissionRateFormProps) {
  const [rate, setRate] = useState(currentRate.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const numericRate = parseFloat(rate);

      if (isNaN(numericRate)) {
        toast.error('Please enter a valid number');
        return;
      }

      if (numericRate < 0 || numericRate > 100) {
        toast.error('Commission rate must be between 0 and 100');
        return;
      }

      await updateDefaultCommissionRate(numericRate);
      toast.success(`Commission rate updated to ${numericRate}%`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update commission rate');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate example amounts
  const exampleOrderAmount = 100;
  const calculatedCommission = (exampleOrderAmount * parseFloat(rate || '0')) / 100;
  const agentEarnings = exampleOrderAmount - calculatedCommission;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="commissionRate">Default Commission Rate (%)</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="commissionRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="20.00"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter a percentage between 0 and 100. Example: 20 for 20% commission.
        </p>
      </div>

      {/* Example calculation */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="mb-3 font-medium">Example Calculation</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Amount:</span>
            <span className="font-medium">${exampleOrderAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Commission Rate:</span>
            <span className="font-medium">{parseFloat(rate || '0').toFixed(2)}%</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Commission:</span>
            <span className="font-medium text-green-600">
              ${calculatedCommission.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Agent Earnings:</span>
            <span className="font-medium text-blue-600">
              ${agentEarnings.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
