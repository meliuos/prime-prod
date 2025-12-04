'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { assignOrderToAgent, getAvailableAgents } from '@/lib/actions/orders';
import { getDefaultCommissionRate } from '@/lib/actions/settings';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Order {
  id: string;
  orderNumber: string;
  amount: string;
  service: { name: string } | null;
}

interface AssignOrderDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function AssignOrderDialog({
  order,
  open,
  onOpenChange,
}: AssignOrderDialogProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [defaultRate, setDefaultRate] = useState<number>(20);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      Promise.all([getAvailableAgents(), getDefaultCommissionRate()]).then(
        ([agentsData, rate]) => {
          setAgents(agentsData as Agent[]);
          setDefaultRate(rate);
          setCommissionRate(rate.toString());
        }
      );
      setSelectedAgent('');
      setSearchQuery('');
    }
  }, [open]);

  // Filter agents based on search query
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;

    const query = searchQuery.toLowerCase();
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.role.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  // Calculate commission breakdown
  const orderAmount = parseFloat(order.amount);
  const rate = parseFloat(commissionRate || '0');
  const platformCommission = (orderAmount * rate) / 100;
  const agentEarnings = orderAmount - platformCommission;

  const handleAssign = async () => {
    if (!selectedAgent) {
      toast.error('Please select an agent');
      return;
    }

    const numericRate = parseFloat(commissionRate);
    if (isNaN(numericRate) || numericRate < 0 || numericRate > 100) {
      toast.error('Commission rate must be between 0 and 100');
      return;
    }

    setIsLoading(true);
    try {
      await assignOrderToAgent(order.id, selectedAgent, numericRate);
      toast.success('Order assigned successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to assign order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Order to Agent</DialogTitle>
          <DialogDescription>
            Assign order {order.orderNumber} ({order.service?.name}) - $
            {orderAmount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Agents or Super Admins</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Agent List */}
          <div className="space-y-2">
            <Label>Select Agent or Super Admin</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
              {filteredAgents.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  {searchQuery ? 'No agents found' : 'No agents available'}
                </p>
              ) : (
                filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                      selectedAgent === agent.id
                        ? 'border-primary bg-primary/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {agent.email}
                        </p>
                      </div>
                      <Badge variant={agent.role === 'super_admin' ? 'default' : 'secondary'}>
                        {agent.role === 'super_admin' ? 'Super Admin' : 'Agent'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Commission Rate */}
          <div className="space-y-2">
            <Label htmlFor="commission">
              Platform Commission Rate (%)
              <span className="ml-2 text-xs text-muted-foreground">
                (Default: {defaultRate}%)
              </span>
            </Label>
            <Input
              id="commission"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              placeholder={defaultRate.toString()}
            />
          </div>

          {/* Commission Breakdown */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-3 text-sm font-medium">Commission Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Amount:</span>
                <span className="font-medium">${orderAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commission Rate:</span>
                <span className="font-medium">{rate.toFixed(2)}%</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Commission:</span>
                <span className="font-medium text-green-600">
                  ${platformCommission.toFixed(2)}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isLoading || !selectedAgent}>
            {isLoading ? 'Assigning...' : 'Assign Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
