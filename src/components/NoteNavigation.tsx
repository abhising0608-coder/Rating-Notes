// src/components/NoteNavigation.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { RatingNote } from '@/types';
import { Button } from './ui/button';
import { Download, Printer, RefreshCw, FileText, CheckSquare, BarChart3, Database, FileWarning, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const mainSections = [
    { href: '', label: 'Workspace', icon: FileText },
    { href: '/important-data', label: 'Important Data', icon: Database },
    { href: '/peer-comparison', label: 'Peer Comparison', icon: BarChart3 },
    { href: '/checklist', label: 'Checklist', icon: CheckSquare },
    { href: '/risk-assessment', label: 'Risk Assessment', icon: FileWarning },
    { href: '/draft-pr-rr', label: 'Draft PR/RR', icon: FileText },
    { href: '/other-data', label: 'Other Data', icon: FileText },
    { href: '/annexures', label: 'Annexures', icon: FileText },
];

export default function NoteNavigation({ note }: { note: RatingNote }) {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleMasterRefresh = async () => {
    toast({ title: 'Master Refresh Initiated', description: 'Refreshing all sections...' });
    // In a real app, this would trigger a series of API calls.
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({ title: 'Master Refresh Complete', description: 'All sections have been updated with the latest data.' });
  }

  const noteBasePath = `/notes/${note.id}`;

  return (
    <div className="bg-card border-b p-4 print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                     <h1 className="text-2xl font-bold font-headline">{note.company.name}</h1>
                     <p className="text-sm text-muted-foreground">{note.template.name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleMasterRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Master Refresh
                    </Button>
                    <Link href={`${noteBasePath}/preview`} passHref>
                        <Button>
                            <Eye className="mr-2 h-4 w-4" /> Preview & Export
                        </Button>
                    </Link>
                </div>
            </div>
            
            <div className="flex items-center space-x-1 border-t mt-4 pt-2 overflow-x-auto">
            {mainSections.map((section) => {
                const fullPath = `${noteBasePath}${section.href}`;
                const isActive = pathname === fullPath;
                const Icon = section.icon;

                return (
                <Link
                    key={section.href}
                    href={fullPath}
                    className={cn(
                        "px-3 py-1.5 border-b-2 text-sm font-medium whitespace-nowrap flex items-center gap-2",
                        isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    )}
                >
                    <Icon className="h-4 w-4" />
                    {section.label}
                </Link>
                );
            })}
            </div>
      </div>
    </div>
  );
}
