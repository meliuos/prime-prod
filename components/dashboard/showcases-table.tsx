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
import { toggleShowcaseStatus, deleteShowcase } from '@/lib/actions/showcases';
import { toast } from 'sonner';
import { useState } from 'react';
import { ShowcaseDialog } from './showcase-dialog';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';

interface Showcase {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
}

interface ShowcasesTableProps {
    showcases: Showcase[];
}

export function ShowcasesTable({ showcases }: ShowcasesTableProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [editingShowcase, setEditingShowcase] = useState<Showcase | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleToggleStatus = async (showcaseId: string, currentStatus: boolean) => {
        setLoadingId(showcaseId);
        try {
            await toggleShowcaseStatus(showcaseId, !currentStatus);
            toast.success(`Showcase ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            toast.error('Failed to update showcase status');
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (showcaseId: string) => {
        if (!confirm('Are you sure you want to delete this showcase?')) {
            return;
        }

        setLoadingId(showcaseId);
        try {
            await deleteShowcase(showcaseId);
            toast.success('Showcase deleted successfully');
        } catch (error) {
            toast.error('Failed to delete showcase');
        } finally {
            setLoadingId(null);
        }
    };

    const handleEdit = (showcase: Showcase) => {
        setEditingShowcase(showcase);
    };

    return (
        <>
            <div className="mb-4 flex justify-end">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Showcase
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {showcases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No showcases found
                                </TableCell>
                            </TableRow>
                        ) : (
                            showcases.map((showcase) => (
                                <TableRow key={showcase.id}>
                                    <TableCell>
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                            <Image
                                                src={showcase.imageUrl}
                                                alt={showcase.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>
                                            <div>{showcase.title}</div>
                                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                {showcase.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{showcase.category}</Badge>
                                    </TableCell>
                                    <TableCell>{showcase.order}</TableCell>
                                    <TableCell>
                                        <Badge variant={showcase.isActive ? 'default' : 'secondary'}>
                                            {showcase.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(showcase)}
                                                disabled={loadingId === showcase.id}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={showcase.isActive ? 'outline' : 'default'}
                                                onClick={() => handleToggleStatus(showcase.id, showcase.isActive)}
                                                disabled={loadingId === showcase.id}
                                            >
                                                {loadingId === showcase.id
                                                    ? 'Updating...'
                                                    : showcase.isActive
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(showcase.id)}
                                                disabled={loadingId === showcase.id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ShowcaseDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                mode="create"
            />

            <ShowcaseDialog
                open={!!editingShowcase}
                onOpenChange={(open: boolean) => !open && setEditingShowcase(null)}
                mode="edit"
                showcase={editingShowcase || undefined}
            />
        </>
    );
}
