'use client';
import { useState, useEffect } from 'react';
import NoteNavigation from '@/components/NoteNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRatingNoteById } from '@/lib/data';
import type { RatingNote } from '@/types';
import { useParams } from 'next/navigation';

export default function ImportantDataPage() {
  const params = useParams();
  const noteId = params.noteId as string;
  const [note, setNote] = useState<RatingNote | null>(null);

  useEffect(() => {
    if (noteId) {
      getRatingNoteById(noteId).then(setNote);
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
            <CardTitle>Important Data, Ratios, etc.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will display operational data from the CKC module.
              The functionality to fetch and display this data will be implemented in a future step.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
