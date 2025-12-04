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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { AssignOrderDialog } from './assign-order-dialog';

interface Order {
  id: string;
  orderNumber: string;
  amount: string;
  status: string;
  createdAt: Date;
  buyer: { name: string; email: string } | null;
  seller: { name: string; email: string } | null;
  service: { name: string; category: string } | null;
}

interface OrdersTableProps {
  orders: Order[];
}

function getStatusColor(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    assigned: 'default',
    in_progress: 'default',
    delivered: 'default',
    revision_requested: 'secondary',
    completed: 'default',
    cancelled: 'destructive',
    disputed: 'destructive',
  };
  return colors[status] || 'outline';
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.service?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.service?.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.buyer?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.buyer?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.seller ? (
                      <div>
                        <p className="font-medium">{order.seller.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.seller.email}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="outline">Unassigned</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${parseFloat(order.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {order.status === 'pending' && !order.seller && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Assign
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <AssignOrderDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
