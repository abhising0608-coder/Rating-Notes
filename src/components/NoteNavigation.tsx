// src/components/NoteNavigation.tsx
'use client';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Step,
  Stepper,
  useStepper,
} from '@/components/ui/stepper';


const steps = [
    { label: 'Select Template' },
    { label: 'Add Analyst Details' },
    { label: 'Add Rating Note Details' },
    { label: 'Preview' },
  ];

const navLinks = [
  { href: 'company-details', label: 'Company Details' },
  { href: 'risk-assessment', label: 'Risk Assessment Framework / Model Output' },
  { href: 'draft-pr-rr', label: 'Draft PR & RR' },
  { href: 'peer-comparison', label: 'Peer Comparison' },
  { href: 'checklist', label: 'Checklist' },
  { href: 'important-data', label: 'Important Data, Ratios, etc.' },
  { href: 'other-data', label: 'Other Data' },
];

export default function NoteNavigation() {
  const params = useParams();
  const pathname = usePathname();
  const noteId = params.noteId;

  return (
    <div className="bg-card border-b p-4">
        <div className="max-w-7xl mx-auto">
            <div className="mb-4">
                <Stepper initialStep={0} activeStep={2}>
                    {steps.map((step, index) => (
                    <Step key={index} label={step.label} />
                    ))}
                </Stepper>
            </div>
            <div className="flex items-center space-x-4 border-b">
            {navLinks.map((link) => {
                const fullPath = `/notes/${noteId}/${link.href}`;
                const isActive = pathname.includes(link.href);
                return (
                <Link
                    key={link.href}
                    href={fullPath}
                    className={cn(
                    'px-3 py-2 border-b-2 text-sm font-medium',
                    isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    )}
                >
                    {link.label}
                </Link>
                );
            })}
            </div>
      </div>
    </div>
  );
}
