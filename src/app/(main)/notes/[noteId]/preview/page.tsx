'use client';

import { notFound, useParams } from 'next/navigation';
import { getRatingNoteById } from '@/lib/data';
import type { RatingNote } from '@/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Save, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function NotePreviewPage() {
    const params = useParams();
    const noteId = params.noteId as string;
    const [note, setNote] = useState<RatingNote | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (noteId) {
            getRatingNoteById(noteId)
                .then(data => {
                    if (data) {
                        setNote(data);
                    } else {
                        notFound();
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [noteId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="p-8">Loading preview...</div>
    }

    if (!note) {
        return notFound();
    }

    return (
        <div className="bg-white">
            <div className="p-4 sm:p-6 md:p-8 print:hidden flex justify-between items-center bg-background border-b">
                <h1 className="text-xl font-bold font-headline">Note Preview</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Save className="mr-2 h-4 w-4" /> Save as Draft
                    </Button>
                    <Button>
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                    </Button>
                    <Button variant="secondary" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print / Export
                    </Button>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-8 print:p-0" id="printable-area">
                <header className="mb-8 print:fixed print:top-0 print:left-0 print:right-0 print:p-4 print:border-b">
                    <div className="flex justify-between text-sm">
                        <span>Company: {note.company.name}</span>
                        <span>Date: {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                </header>

                <main className="space-y-8 mt-16">
                    {note.template.sections.map(section => {
                        const sectionData = note.sections[section.id];
                        if (sectionData.applicable !== 'Applicable') {
                            if (!sectionData.comments || sectionData.comments === '<p></p>') return null;
                        }

                        return (
                            <section key={section.id} id={section.key}>
                                <h2 className="text-2xl font-semibold font-headline border-b-2 border-primary pb-2 mb-4">{section.title}</h2>
                                {sectionData.applicable !== 'Applicable' && (
                                     <div className="p-3 bg-gray-100 border border-gray-200 rounded-md mb-4">
                                        <p className="text-sm italic text-gray-600">Section marked as "{sectionData.applicable}"</p>
                                     </div>
                                )}
                                {section.hasTable && sectionData.applicable === 'Applicable' && sectionData.tableRows.length > 0 && (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full text-sm border">
                                            <thead className="bg-gray-100">
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
                                                             <td key={key} className="p-2 border">{row[key]}</td>
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
                                    <div className="prose max-w-none">
                                        <h3 className="text-lg font-semibold">Comments</h3>
                                        <div dangerouslySetInnerHTML={{ __html: sectionData.comments }} className="p-3 bg-gray-50 border rounded-md"/>
                                    </div>
                                )}
                                <Separator className="my-8"/>
                            </section>
                        )
                    })}
                </main>
                 <footer className="text-center mt-12 text-xs text-gray-400 print:fixed print:bottom-0 print:left-0 print:right-0 print:p-4 print:border-t">
                    <div className="flex justify-between text-xs">
                        <span className="page-number"></span>
                        <div>
                             Go to: {note.template.sections.map(sec => (
                                <a key={sec.id} href={`#${sec.key}`} className="mx-1 underline">
                                    {sec.title}
                                </a>
                            ))}
                        </div>
                        <span>Version: {note.version}</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default NotePreviewPage;
