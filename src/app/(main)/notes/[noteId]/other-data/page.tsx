'use client';

import NoteNavigation from '@/components/NoteNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AttachmentSection from '@/components/AttachmentSection';
import { useState, useEffect } from 'react';
import type { WithdrawnFacility } from '@/types';
import { getWithdrawnFacilities } from '@/lib/data';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const WithdrawnFacilitiesSection = () => {
  const [applicability, setApplicability] = useState<'Applicable' | 'Not Applicable' | 'Not Available'>('Applicable');
  const [facilities, setFacilities] = useState<WithdrawnFacility[]>([]);

  useEffect(() => {
    getWithdrawnFacilities('1').then(setFacilities);
  }, []);

  const handleAddRow = () => {
    const newRow: WithdrawnFacility = {
      id: `manual-${Date.now()}`,
      facility: '',
      details: '',
      date: '',
    };
    setFacilities(prev => [...prev, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    setFacilities(prev => prev.filter(row => row.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof WithdrawnFacility, value: string) => {
    setFacilities(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Details of instruments/facilities withdrawn</CardTitle>
            <Select value={applicability} onValueChange={setApplicability as any}>
                <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Applicability" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Applicable">Applicable</SelectItem>
                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                <SelectItem value="Not Available">Not Available</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        {applicability === 'Applicable' ? (
            <div className='space-y-4'>
                <div className='flex justify-end'>
                    <Button variant="outline" size="sm" onClick={handleAddRow}><Plus className="mr-2 h-4 w-4"/>Add Row</Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Facility</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facilities.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Input value={row.facility} onChange={e => handleUpdateRow(row.id, 'facility', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <Textarea value={row.details} onChange={e => handleUpdateRow(row.id, 'details', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="date" value={row.date} onChange={e => handleUpdateRow(row.id, 'date', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(row.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        ) : (
             <p className="text-muted-foreground text-center p-8">
                This section is marked as "{applicability}".
            </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function OtherDataPage() {
  return (
    <div className="flex-1 flex flex-col">
      <NoteNavigation />
      <main className="flex-1 p-8 bg-background">
        <div className="space-y-8">
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

            <WithdrawnFacilitiesSection />
            <AttachmentSection />
        </div>
      </main>
    </div>
  );
}
