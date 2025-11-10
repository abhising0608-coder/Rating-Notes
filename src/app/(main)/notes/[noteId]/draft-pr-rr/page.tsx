'use client';

import NoteNavigation from '@/components/NoteNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DraftPrRrPage() {
  return (
    <div className="flex-1 flex flex-col">
      <NoteNavigation />
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
