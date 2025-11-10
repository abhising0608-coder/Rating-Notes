'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { LogOut, Settings, BarChart, FileCheck, LayoutGrid, FilePlus, ShieldCheck } from 'lucide-react';
import CareEdgeLogo from './CareEdgeLogo';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/notes/new', label: 'Create Model', icon: FilePlus },
  { href: '/validation', label: 'Validation', icon: ShieldCheck },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/admin', label: 'Admin', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col bg-[#20252B] text-white">
      <div className="p-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-white tracking-widest">CREST</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                isActive
                  ? 'bg-[#009688] text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
