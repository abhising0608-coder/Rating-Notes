
'use client';
import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { getUsers } from '@/lib/data';
import { NewNoteConfig } from '@/app/(main)/notes/new/page';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';

type Step2Props = {
  config: NewNoteConfig;
  onConfigChange: (newConfig: Partial<NewNoteConfig>) => void;
};

export default function Step2_AddAnalysts({ config, onConfigChange }: Step2Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-xl font-semibold font-headline mb-2">Assign Analysts</h2>
         <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Note on Analyst Assignment</AlertTitle>
          <AlertDescription>
            You are the Primary Analyst for this note. After the note is created, you can assign a Secondary Analyst to collaborate on specific sections. This step is for initial clarification only.
          </AlertDescription>
        </Alert>
      </div>
      <div>
        <Label htmlFor="analyst-comments" className="font-semibold">Role Clarification Comments (Optional)</Label>
        <Textarea
          id="analyst-comments"
          placeholder="e.g., 'Analyst 2 will focus on financial modeling and peer analysis.'"
          value={config.description}
          onChange={(e) => onConfigChange({ description: e.target.value })}
        />
      </div>
    </div>
  );
}
