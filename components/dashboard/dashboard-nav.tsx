'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  History,
  LogOut,
  Briefcase,
  Home,
  Mail,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type UserRole = 'super_admin' | 'agent' | 'user';

interface DashboardNavProps {
  role: UserRole;
  userId: string;
}

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname();

  // Navigation items based on role
  const navItems =
    role === 'super_admin'
      ? [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
          },
          {
            title: 'Orders',
            href: '/dashboard/orders',
            icon: Package,
          },
          {
            title: 'Services',
            href: '/dashboard/services',
            icon: Briefcase,
          },
          {
            title: 'Users',
            href: '/dashboard/users',
            icon: Users,
          },
          {
            title: 'Invitations',
            href: '/dashboard/invitations',
            icon: Mail,
          },
          {
            title: 'Settings',
            href: '/dashboard/settings',
            icon: Settings,
          },
        ]
      : [
          {
            title: 'Pending Orders',
            href: '/dashboard',
            icon: Package,
          },
          {
            title: 'Order History',
            href: '/dashboard/history',
            icon: History,
          },
        ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              {role === 'super_admin' ? 'Admin Panel' : 'Agent Dashboard'}
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Leave Dashboard</span>
              </Button>
            </Link>

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>
                    {role === 'super_admin' ? 'SA' : 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {role === 'super_admin' ? 'Super Admin' : 'Agent'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/api/auth/sign-out">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
