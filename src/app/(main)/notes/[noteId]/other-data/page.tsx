'use client';

import NoteNavigation from '@/components/NoteNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OtherDataPage() {
  return (
    <div className="flex-1 flex flex-col">
      <NoteNavigation />
      <main className="flex-1 p-8 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>Other Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will allow for adding any other data, analysis, images, or tables not covered in other sections.
              The functionality for rich text editing and attachments will be implemented here.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
