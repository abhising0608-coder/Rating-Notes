'use client';
import { useState, useEffect } from 'react';
import NoteNavigation from '@/components/NoteNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getImportantDataSections, getRatingNoteById } from '@/lib/data';
import type { ImportantDataSection, RatingNote } from '@/types';
import { useParams } from 'next/navigation';
import { Accordion } from '@/components/ui/accordion';
import ImportantDataAccordion from '@/components/ImportantDataAccordion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function ImportantDataPage() {
  const params = useParams();
  const noteId = params.noteId as string;
  const [note, setNote] = useState<RatingNote | null>(null);
  const [sections, setSections] = useState<ImportantDataSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>('FY24');

  useEffect(() => {
    if (noteId) {
      getRatingNoteById(noteId).then(setNote);
      getImportantDataSections(noteId)
        .then(data => {
          setSections(data);
          setLoading(false);
        });
    }
  }, [noteId]);
  
  if (!note) {
      return (
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-8 bg-background">
                    <div>Loading...</div>
                </main>
            </div>
      )
  }

  return (
    <div className="flex-1 flex flex-col">
      <NoteNavigation note={note}/>
      <main className="flex-1 p-8 bg-background">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Section 5 — Important data, ratios etc.</CardTitle>
              <div className="w-48">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FY24">FY24</SelectItem>
                    <SelectItem value="FY23">FY23</SelectItem>
                    <SelectItem value="Q1-25">Q1-25</SelectItem>
                    <SelectItem value="Q4-24">Q4-24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading sections...</p>
            ) : sections.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                    {sections.map(section => (
                        <ImportantDataAccordion
                            key={section.id}
                            section={section}
                            entityId={note.companyId}
                            period={period}
                        />
                    ))}
                </Accordion>
            ) : (
              <p className="text-muted-foreground">
                No operational data sections are configured for this entity.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
