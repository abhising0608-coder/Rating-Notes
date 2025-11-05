
'use client';
import { useState, useEffect } from 'react';
import NoteNavigation from '@/components/NoteNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCompanies, getPreviousRatingNotes, getRatingNoteById } from '@/lib/data';
import type { Company, RatingNote } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'next/navigation';
import AnnexureAttachments from '@/components/AnnexureAttachments';
import { Separator } from '@/components/ui/separator';
import PressReleaseAnnexure from '@/components/PressReleaseAnnexure';

export default function AnnexuresPage() {
    const params = useParams();
    const noteId = params.noteId as string;
    const [note, setNote] = useState<RatingNote | null>(null);
    const [sameCompanyNotes, setSameCompanyNotes] = useState<RatingNote[]>([]);
    const [otherCompanyNotes, setOtherCompanyNotes] = useState<RatingNote[]>([]);
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [selectedOtherCompany, setSelectedOtherCompany] = useState<string | null>(null);

    const [selectedSameCompanyNote, setSelectedSameCompanyNote] = useState<string | null>(null);
    const [selectedOtherCompanyNote, setSelectedOtherCompanyNote] = useState<string | null>(null);

    useEffect(() => {
        if (noteId) {
            getRatingNoteById(noteId).then(setNote);
            // Assuming the current company is the one associated with the note
            getPreviousRatingNotes('1').then(setSameCompanyNotes);
        }
        getCompanies().then(companies => {
            // Exclude current company from 'other companies' list
            setAllCompanies(companies.filter(c => c.id !== '1'));
        });
    }, [noteId]);

    useEffect(() => {
        if (selectedOtherCompany) {
            getPreviousRatingNotes(selectedOtherCompany).then(setOtherCompanyNotes);
        } else {
            setOtherCompanyNotes([]);
        }
    }, [selectedOtherCompany]);


    const RatingNoteTable = ({ notes, selectedNote, onSelectNote }: { notes: RatingNote[], selectedNote: string | null, onSelectNote: (id: string) => void }) => (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Note Title / Period</TableHead>
                        <TableHead>Creation Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <RadioGroup value={selectedNote || ''} onValueChange={onSelectNote}>
                        {notes.map(note => (
                            <TableRow key={note.id}>
                                <TableCell>
                                    <RadioGroupItem value={note.id} id={`note-${note.id}`} />
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor={`note-${note.id}`} className="font-medium">
                                        {note.company.name} AY {note.financialYearFrom}-{note.financialYearTo}
                                    </Label>
                                </TableCell>
                                <TableCell>
                                     <Label htmlFor={`note-${note.id}`}>
                                        {new Date(note.createdAt).toLocaleDateString()}
                                     </Label>
                                </TableCell>
                            </TableRow>
                        ))}
                    </RadioGroup>
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col">
            <NoteNavigation />
            <main className="flex-1 p-8 bg-background">
                <div className="space-y-8">
                    {note && <PressReleaseAnnexure entityName={note.company.name} />}
                    <Card>
                        <CardHeader>
                            <CardTitle>Select and Attach Previous / Other Rating Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Previous rating notes (Same Company)</h3>
                                <RatingNoteTable notes={sameCompanyNotes} selectedNote={selectedSameCompanyNote} onSelectNote={setSelectedSameCompanyNote} />
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Previous rating notes (Other Company)</h3>
                                <div className="max-w-sm">
                                    <Label htmlFor="select-company">Select Company</Label>
                                    <Select onValueChange={setSelectedOtherCompany}>
                                        <SelectTrigger id="select-company">
                                            <SelectValue placeholder="Select a company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allCompanies.map(company => (
                                                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedOtherCompany && (
                                    <RatingNoteTable notes={otherCompanyNotes} selectedNote={selectedOtherCompanyNote} onSelectNote={setSelectedOtherCompanyNote} />
                                )}
                            </div>

                        </CardContent>
                    </Card>
                    
                    <Separator />

                    <AnnexureAttachments />
                </div>
            </main>
             <footer className="p-4 bg-card border-t flex justify-end gap-2">
                <Button>Attach Selected Notes</Button>
            </footer>
        </div>
    );
}
