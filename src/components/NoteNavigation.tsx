// src/components/NoteNavigation.tsx
'use client';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Step,
  Stepper,
} from '@/components/ui/stepper';
import type { RatingNote } from '@/types';
import { Button } from './ui/button';
import { Download, Printer, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const steps = [
    { label: 'Select Template' },
    { label: 'Add Analyst Details' },
    { label: 'Add Rating Note Details' },
    { label: 'Workspace' },
    { label: 'Preview & Export' },
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
                    <Link href={`/notes/${note.id}/preview`} passHref>
                        <Button>
                            <Printer className="mr-2 h-4 w-4" /> Preview & Export
                        </Button>
                    </Link>
                </div>
            </div>
            <Stepper initialStep={0} activeStep={3}>
                {steps.map((step, index) => (
                <Step key={index} label={step.label} />
                ))}
            </Stepper>
            <div className="flex items-center space-x-2 border-t mt-4 pt-2 overflow-x-auto">
            {note.template.sections.map((section) => {
                const isVisible = note.sections[section.id]?.applicable === 'Applicable';
                if (!isVisible && section.id !== 's1') return null;

                return (
                <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="px-3 py-1.5 border-b-2 text-sm font-medium whitespace-nowrap border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                >
                    {section.title}
                </a>
                );
            })}
            </div>
      </div>
    </div>
  );
}
