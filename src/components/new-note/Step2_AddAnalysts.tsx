'use client';
import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { getUsers } from '@/lib/data';
import { NewNoteConfig } from '@/app/(main)/notes/new/page';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';

type Step2Props = {
  config: NewNoteConfig;
  onConfigChange: (newConfig: Partial<NewNoteConfig>) => void;
};

export default function Step2_AddAnalysts({ config, onConfigChange }: Step2Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleAnalystToggle = (userId: string) => {
    const currentAnalysts = config.analysts || [];
    const newAnalysts = currentAnalysts.includes(userId)
      ? currentAnalysts.filter((id) => id !== userId)
      : [...currentAnalysts, userId];
    onConfigChange({ analysts: newAnalysts });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold font-headline mb-2">Select Secondary Analysts</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The primary analyst is the note creator. You can add one or more secondary analysts.
        </p>
        <div className="space-y-2 rounded-md border p-4">
          {users.filter(u => u.role === 'Analyst').map(user => (
            <div key={user.id} className="flex items-center space-x-2">
              <Checkbox
                id={`analyst-${user.id}`}
                checked={(config.analysts || []).includes(user.id)}
                onCheckedChange={() => handleAnalystToggle(user.id)}
              />
              <Label htmlFor={`analyst-${user.id}`} className="font-normal">
                {user.name} ({user.email})
              </Label>
            </div>
          ))}
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
