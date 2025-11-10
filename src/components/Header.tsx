'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { LogOut, Settings, BarChart, FileCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CareEdgeLogo from './CareEdgeLogo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/notes/new', label: 'Create Note' },
  { href: '/validation', label: 'Validation' },
  { href: '/reports', label: 'Reports' },
  { href: '/admin', label: 'Admin' },
];

const Header = () => {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <CareEdgeLogo />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
          <Avatar className="h-9 w-9">
            {userAvatar && (
               <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />
            )}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
