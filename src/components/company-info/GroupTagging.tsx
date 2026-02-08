
'use client';

import * as React from 'react';
import type { Group, GroupSelection } from '@/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';

interface GroupTaggingProps {
  groups: Group[];
  combinedGroups: Group[];
  selection: GroupSelection;
  onUpdate: (selection: GroupSelection) => void;
  isEditable: boolean;
}

export default function GroupTagging({
  groups,
  combinedGroups,
  selection,
  onUpdate,
  isEditable,
}: GroupTaggingProps) {
  const isGroupLocked = !!selection.crmGroupId;

  const handleGroupChange = (value: string) => {
    onUpdate({ ...selection, selectedGroupId: value, crmGroupId: null }); // Clear CRM lock if manually changed
  };

  const handleCombinedGroupChange = (value: string) => {
    onUpdate({ ...selection, selectedCombinedGroupId: value });
  };

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="text-xl font-headline">
        Group Tagging
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="group">Group</Label>
            {isGroupLocked ? (
                <Input
                    id="group"
                    value={groups.find(g => g.id === selection.crmGroupId)?.name || 'Unknown Group'}
                    readOnly
                    className="bg-muted/50"
                />
            ) : (
                <Select
                  id="group"
                  value={selection.selectedGroupId || ''}
                  onValueChange={handleGroupChange}
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group..." />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            )}
            
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-combined">Group for Combined Approach</Label>
            <Select
              id="group-combined"
              value={selection.selectedCombinedGroupId || ''}
              onValueChange={handleCombinedGroupChange}
              disabled={!isEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a group..." />
              </SelectTrigger>
              <SelectContent>
                {combinedGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
