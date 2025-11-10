'use client';

import NoteNavigation from '@/components/NoteNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RiskAssessmentPage() {
  return (
    <div className="flex-1 flex flex-col">
      <NoteNavigation />
      <main className="flex-1 p-8 bg-background">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Framework / Model Output</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will display the risk assessment framework and model outputs.
              The functionality to fetch and display this data will be implemented in a future step.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
