'use client';
import { useState } from 'react';
import type { PreviousRCMMinutesData } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

type PreviousRCMMinutesSectionProps = {
  initialData: PreviousRCMMinutesData;
  onUpdate: (data: PreviousRCMMinutesData) => void;
};

export default function PreviousRCMMinutesSection({ initialData, onUpdate }: PreviousRCMMinutesSectionProps) {
  const [data, setData] = useState(initialData);

  const handleSelectionChange = (minuteId: string) => {
    const selectedMinuteIds = data.selectedMinuteIds.includes(minuteId)
      ? data.selectedMinuteIds.filter(id => id !== minuteId)
      : [...data.selectedMinuteIds, minuteId];
    
    if (selectedMinuteIds.length > 5) {
        // Optional: show a toast or message
        return;
    }

    const updatedData = { ...data, selectedMinuteIds };
    setData(updatedData);
    onUpdate(updatedData);
  };

  const selectedMinutes = data.availableMinutes
    .filter(minute => data.selectedMinuteIds.includes(minute.id))
    .sort((a, b) => new Date(b.rcmDate).getTime() - new Date(a.rcmDate).getTime());

  if (data.availableMinutes.length === 0) {
    return <p className="text-muted-foreground">No previous RCM minutes found for this entity.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox 
                checked={data.selectedMinuteIds.length === data.availableMinutes.length && data.availableMinutes.length > 0}
                onCheckedChange={(checked) => {
                    const allIds = checked ? data.availableMinutes.map(m => m.id) : [];
                    const updatedData = { ...data, selectedMinuteIds: allIds.slice(0, 5) };
                     setData(updatedData);
                     onUpdate(updatedData);
                }}
              /></TableHead>
              <TableHead>RCM Date</TableHead>
              <TableHead>Rating Committee Reference</TableHead>
              <TableHead>Key Discussion Points</TableHead>
              <TableHead>Prepared By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.availableMinutes.map(minute => (
              <TableRow key={minute.id}>
                <TableCell>
                  <Checkbox
                    checked={data.selectedMinuteIds.includes(minute.id)}
                    onCheckedChange={() => handleSelectionChange(minute.id)}
                  />
                </TableCell>
                <TableCell>{minute.rcmDate}</TableCell>
                <TableCell>{minute.ratingCommitteeReference}</TableCell>
                <TableCell>{minute.keyDiscussionPoints}</TableCell>
                <TableCell>{minute.preparedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMinutes.length > 0 && (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Selected RCM Minutes Content</h3>
            {selectedMinutes.map(minute => (
                <Card key={minute.id}>
                    <CardHeader>
                        <CardTitle className="text-base font-headline">RCM from {minute.rcmDate}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{minute.fullContent}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
