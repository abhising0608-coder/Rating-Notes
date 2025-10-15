
'use client';
import { useState, useEffect } from 'react';
import NoteNavigation from '@/components/NoteNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChecklistData, getRatingNoteById } from '@/lib/data';
import type { Checklist, ChecklistItem, ChecklistAnswer, RatingNote } from '@/types';
import { Plus, Badge, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useParams } from 'next/navigation';

export default function ChecklistPage() {
  const params = useParams();
  const noteId = params.noteId as string;
  const [note, setNote] = useState<RatingNote | null>(null);
  const [checklist, setChecklist] = useState<Checklist | null>(null);

  useEffect(() => {
    if (noteId) {
      getRatingNoteById(noteId).then(setNote);
      getChecklistData(noteId).then(setChecklist);
    }
  }, [noteId]);

  const handleChecklistChange = (
    list: 'commonChecklist' | 'sectorChecklists',
    itemId: string,
    field: 'answer' | 'remarks',
    value: string,
    sector?: string
  ) => {
    if (!checklist) return;

    let updatedChecklist: Checklist;

    if (list === 'commonChecklist') {
      const updatedItems = checklist.commonChecklist.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      );
      updatedChecklist = { ...checklist, commonChecklist: updatedItems };
    } else if (sector) {
      const sectorChecklist = checklist.sectorChecklists[sector] || [];
      const updatedItems = sectorChecklist.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      );
      updatedChecklist = {
        ...checklist,
        sectorChecklists: {
          ...checklist.sectorChecklists,
          [sector]: updatedItems
        }
      };
    } else {
      return;
    }
    setChecklist(updatedChecklist);
    // In a real app, this would trigger a debounced save to the backend
  };
  
  const handleAddSectorRow = (sector: string) => {
    if (!checklist) return;

    const newRow: ChecklistItem = {
      id: `manual-${sector}-${Date.now()}`,
      title: 'New Manual Item',
      answer: '',
      remarks: '',
      isManual: true,
    };

    const sectorChecklist = checklist.sectorChecklists[sector] || [];
    const updatedItems = [...sectorChecklist, newRow];
    
    const updatedChecklist: Checklist = {
      ...checklist,
      sectorChecklists: {
        ...checklist.sectorChecklists,
        [sector]: updatedItems
      }
    };
    setChecklist(updatedChecklist);
  };

  const ChecklistTable = ({
    items,
    listType,
    sector,
  }: {
    items: ChecklistItem[],
    listType: 'commonChecklist' | 'sectorChecklists',
    sector?: string
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Item</TableHead>
          <TableHead className="w-1/4">Response</TableHead>
          <TableHead>Remarks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => {
          const remarksRequired = item.answer === 'No' || item.answer === 'NA';
          return (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                    {item.title}
                    {item.isManual && <Badge variant="outline">Manual</Badge>}
                    {item.autoFilledFrom && <Badge variant="secondary">Auto</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <RadioGroup
                  value={item.answer}
                  onValueChange={(value) => handleChecklistChange(listType, item.id, 'answer', value, sector)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id={`${item.id}-yes`} />
                    <Label htmlFor={`${item.id}-yes`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id={`${item.id}-no`} />
                    <Label htmlFor={`${item.id}-no`}>No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NA" id={`${item.id}-na`} />
                    <Label htmlFor={`${item.id}-na`}>NA</Label>
                  </div>
                </RadioGroup>
              </TableCell>
              <TableCell>
                <Textarea
                  value={item.remarks}
                  onChange={(e) => handleChecklistChange(listType, item.id, 'remarks', e.target.value, sector)}
                  placeholder="Remarks required..."
                  className={remarksRequired && !item.remarks ? 'border-destructive' : ''}
                  disabled={!remarksRequired}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );

  if (!note || !checklist) {
    return (
        <div className="flex-1 flex flex-col">
            <NoteNavigation />
             <main className="flex-1 p-8 bg-background">
                <div>Loading checklist...</div>
            </main>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
       <NoteNavigation />
       <main className="flex-1 p-8 bg-background">
         <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Common Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChecklistTable items={checklist.commonChecklist} listType="commonChecklist" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sector Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={Object.keys(checklist.sectorChecklists)} className="w-full">
                       {Object.entries(checklist.sectorChecklists).map(([sector, items]) => (
                           <AccordionItem key={sector} value={sector}>
                            <AccordionTrigger className="font-semibold">{sector}</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <div className="flex justify-end">
                                    <Button variant="outline" size="sm" onClick={() => handleAddSectorRow(sector)}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Row
                                    </Button>
                                </div>
                                <ChecklistTable items={items} listType="sectorChecklists" sector={sector} />
                            </AccordionContent>
                           </AccordionItem>
                       ))}
                    </Accordion>
                </CardContent>
            </Card>
         </div>
       </main>
        <footer className="p-4 bg-card border-t flex justify-end gap-2">
            <Button>Save</Button>
            <Button variant="secondary">Mark as Complete</Button>
        </footer>
    </div>
  );
}
