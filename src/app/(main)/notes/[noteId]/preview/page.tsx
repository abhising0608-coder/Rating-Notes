
'use client';

import { notFound, useParams } from 'next/navigation';
import { getRatingNoteById } from '@/lib/data';
import type { RatingNote } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, CheckCircle, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import NoteNavigation from '@/components/NoteNavigation';

function NotePreviewPage() {
    const params = useParams();
    const noteId = params.noteId as string;
    const [note, setNote] = useState<RatingNote | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Mock current user ID. In a real app, this would come from an auth context.
    const currentUserId = 'u_002'; // Changed to u_002 to test secondary analyst view

    useEffect(() => {
        if (noteId) {
            getRatingNoteById(noteId)
                .then(data => {
                    if (data) {
                        setNote(data);
                    } else {
                        toast({
                          variant: 'destructive',
                          title: 'Error',
                          description: 'Unable to fetch rating note details. Please refresh or contact system admin.',
                        });
                        notFound();
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [noteId, toast]);

    const { canShowMarkAsComplete, isMarkAsCompleteDisabled, isSecondaryAnalyst } = useMemo(() => {
        if (!note) {
            return { canShowMarkAsComplete: false, isMarkAsCompleteDisabled: true, isSecondaryAnalyst: false };
        }

        const isPrimary = note.analysts[0] === currentUserId;
        const localIsSecondary = note.analysts[1] === currentUserId;

        if (!isPrimary && !localIsSecondary) {
            return { canShowMarkAsComplete: false, isMarkAsCompleteDisabled: true, isSecondaryAnalyst: false };
        }

        let isCompletable = false;
        if (isPrimary) {
             if (note.template.isAgnostic) {
                // For agnostic, primary can only complete if no secondary is assigned
                isCompletable = !note.analysts[1];
            } else {
                // For sectorial, primary can complete only if all sections are assigned back to them
                isCompletable = Object.values(note.sections).every(section => {
                    const assignedTo = (section as any).assignedTo;
                    return !assignedTo || assignedTo === note.analysts[0];
                });
            }
        }
       

        return {
            canShowMarkAsComplete: isPrimary, // Only primary can ever see the button
            isMarkAsCompleteDisabled: !isCompletable, // Disabled if conditions aren't met
            isSecondaryAnalyst: localIsSecondary,
        };
    }, [note, currentUserId]);

    const handlePrint = () => {
        window.print();
    };

    const handleExport = (format: 'word' | 'html') => {
      toast({
        title: 'Export Failed',
        description: `Export to ${format.toUpperCase()} failed. Please try again later.`,
        variant: 'destructive'
      });
    };

    const handleMarkAsComplete = () => {
        // In a real app, this would call the validateAndMarkAsComplete cloud function
        console.log("Marking note as complete...");
        toast({
            title: 'Success',
            description: 'Rating note has been marked as complete and is now read-only.',
        });
        // Here you would typically disable editing, e.g., by setting a state
        // or re-fetching the note with an updated 'completed' status.
    };
    
    const handleReassignCase = () => {
        // Simulates calling the reassignSecondaryAnalyst cloud function
        console.log(`Simulating reassignment of case ${noteId} from ${currentUserId} to another analyst.`);
        toast({
            title: 'Case Reassigned',
            description: 'The rating note has been successfully transferred.'
        });
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <NoteNavigation />
                <div className="flex-1 p-8 text-center">Loading preview...</div>
            </div>
        )
    }

    if (!note) {
        return notFound();
    }

    return (
        <div className="bg-background">
            <NoteNavigation />
            <div className="p-4 sm:p-6 md:p-8 print:hidden flex justify-between items-center bg-card border-b sticky top-0 z-50">
                <h1 className="text-xl font-bold font-headline">Note Preview</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => handleExport('word')}>
                        <Download className="mr-2 h-4 w-4" /> Export as Word
                    </Button>
                     <Button variant="outline" onClick={() => handleExport('html')}>
                        <Download className="mr-2 h-4 w-4" /> Export as HTML
                    </Button>
                    <Button variant="secondary" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
                    </Button>
                    {isSecondaryAnalyst && (
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <Send className="mr-2 h-4 w-4" /> Assign Case to Another Analyst
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Case Reassignment</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to assign this case to another analyst? You will lose all access to this note after the transfer is complete.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>No</AlertDialogCancel>
                                <AlertDialogAction onClick={handleReassignCase}>Yes, Assign</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {canShowMarkAsComplete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button disabled={isMarkAsCompleteDisabled}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to mark this rating note as complete?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will freeze the note, and it will become read-only. You will not be able to make any more changes.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>No</AlertDialogCancel>
                                <AlertDialogAction onClick={handleMarkAsComplete}>Yes</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-8 bg-white print:p-0" id="printable-area">
                <header className="mb-8 print:mb-4">
                     <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold font-headline">{note.company.name}</h1>
                        <p className="text-muted-foreground">{note.template.name}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Company: {note.company.name}</span>
                        <span>Date: {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                </header>

                <main className="space-y-8">
                    {note.template.sections.map(section => {
                        const sectionData = note.sections[section.id];
                        const showSection = sectionData && (sectionData.applicable === 'Applicable' || (sectionData.comments && sectionData.comments !== '<p></p>'));

                        if (!showSection) {
                             return null;
                        }

                        return (
                            <section key={section.id} id={section.key} className="break-after-page">
                                <h2 className="text-2xl font-semibold font-headline border-b-2 border-primary pb-2 mb-4">{section.title}</h2>
                                
                                {sectionData.applicable !== 'Applicable' && (
                                     <div className="p-3 bg-gray-100 border border-gray-200 rounded-md mb-4 print:bg-gray-50">
                                        <p className="text-sm italic text-gray-600">Section marked as "{sectionData.applicable}"</p>
                                     </div>
                                )}
                                
                                {section.hasTable && sectionData.applicable === 'Applicable' && sectionData.tableRows && sectionData.tableRows.length > 0 && (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full text-sm border">
                                            <thead className="bg-gray-100 print:bg-gray-50">
                                                <tr>
                                                    {Object.keys(sectionData.tableRows[0] || {}).filter(k => !['id', 'isManual', 'mappedAttributeId', 'manualEdit'].includes(k)).map(header => (
                                                        <th key={header} className="p-2 border font-medium text-left">{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sectionData.tableRows.map(row => (
                                                    <tr key={row.id} className="border-b">
                                                        {Object.keys(row).filter(k => !['id', 'isManual', 'mappedAttributeId', 'manualEdit'].includes(k)).map(key => (
                                                             <td key={key} className="p-2 border">{String(row[key])}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                         {section.instructions && (
                                            <p className="text-xs text-gray-500 mt-1">{section.instructions}</p>
                                        )}
                                    </div>
                                )}

                                {sectionData.comments && sectionData.comments !== '<p></p>' && (
                                    <div className="prose max-w-none prose-sm sm:prose-base">
                                        <h3 className="text-lg font-semibold">Comments</h3>
                                        <div dangerouslySetInnerHTML={{ __html: sectionData.comments }} className="p-3 bg-gray-50 border rounded-md"/>
                                    </div>
                                )}
                                <Separator className="my-8 print:hidden"/>
                            </section>
                        )
                    })}
                </main>
                 <footer className="text-center mt-12 text-xs text-gray-400 print:fixed print:bottom-0 print:left-0 print:right-0 print:p-4 print:border-t bg-white">
                    <div className="flex justify-between text-xs">
                        <span className="page-number"></span>
                        <div className="text-center">
                             Go to: {note.template.sections.map(sec => {
                                const sectionData = note.sections[sec.id];
                                if (!sectionData || (sectionData.applicable !== 'Applicable' && (!sectionData.comments || sectionData.comments === '<p></p>'))) {
                                    return null;
                                }
                                return (
                                    <a key={sec.id} href={`#${sec.key}`} className="mx-1 underline">
                                        {sec.title}
                                    </a>
                                )
                            }).filter(Boolean).reduce((prev, curr, index) => [prev, <span key={`sep-${index}`}> | </span>, curr] as any)}
                        </div>
                        <span>Version: {note.version}</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default NotePreviewPage;

    