'use client';
import { useState, useEffect } from 'react';
import NoteNavigation from '@/components/NoteNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRatingNoteById } from '@/lib/data';
import type { RatingNote } from '@/types';
import { useParams } from 'next/navigation';

export default function DraftPrRrPage() {
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
      <NoteNavigation note={note} />
      <main className="flex-1 p-8 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>Draft PR & RR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will contain the Draft Press Release and Rating Rationale.
              The functionality to edit and manage this content will be implemented in a future step.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
