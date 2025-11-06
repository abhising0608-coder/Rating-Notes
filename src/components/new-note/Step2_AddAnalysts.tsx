
'use client';
import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { getUsers } from '@/lib/data';
import { NewNoteConfig } from '@/app/(main)/notes/new/page';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

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
        <h2 className="text-xl font-semibold font-headline mb-2">Assign Secondary Analyst</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The primary analyst is the note creator. You can assign one secondary analyst to collaborate on this rating note. The assignment and section-specific permissions are managed after note creation.
        </p>
        {/* In a real implementation, a dropdown to select an analyst would go here */}
        <div className="space-y-2 rounded-md border p-4 bg-muted/50">
          <p className="text-muted-foreground">Analyst selection dropdown will be implemented here.</p>
        </div>
      </div>
      <div>
        <Label htmlFor="analyst-comments" className="font-semibold">Role Clarification Comments (Optional)</Label>
        <Textarea
          id="analyst-comments"
          placeholder="e.g., 'Analyst 2 will focus on financial modeling.'"
          value={config.description}
          onChange={(e) => onConfigChange({ description: e.target.value })}
        />
      </div>
    </div>
  );
}
