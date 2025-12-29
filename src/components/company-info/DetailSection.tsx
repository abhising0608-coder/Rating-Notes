
'use client';
import * as React from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type BaseRecord = {
  id: string;
  source: 'CRM' | 'Rating';
  [key: string]: any;
};

interface DetailSectionProps<T extends BaseRecord> {
  title: string;
  data: T[];
  onUpdate: (data: T[]) => void;
  isEditable: boolean;
  columns: { key: string; label: string }[];
}

export default function DetailSection<T extends BaseRecord>({
  title,
  data,
  onUpdate,
  isEditable,
  columns,
}: DetailSectionProps<T>) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<Partial<T> | null>(
    null
  );

  const handleAddNew = () => {
    if (!isEditable) return;
    const newRecord: Partial<T> = {};
    columns.forEach(col => newRecord[col.key] = '');
    newRecord.source = 'Rating';
    newRecord.id = `new-${Date.now()}`;
    setEditingRecord(newRecord);
    setIsModalOpen(true);
  };

  const handleEdit = (record: T) => {
    if (!isEditable) return;
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingRecord) return;
    
    // Simple validation
    if (columns.some(col => !editingRecord[col.key])) {
        alert('All fields are required.');
        return;
    }

    const isNew = editingRecord.id?.startsWith('new-');
    let updatedData;
    if (isNew) {
      updatedData = [...data, editingRecord as T];
    } else {
      updatedData = data.map((d) =>
        d.id === editingRecord.id ? (editingRecord as T) : d
      );
    }
    onUpdate(updatedData);
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    if(!isEditable) return;
    onUpdate(data.filter(d => d.id !== id));
  }

  const handleFieldChange = (key: string, value: string) => {
    setEditingRecord((prev) => (prev ? { ...prev, [key]: value } : null));
  };
  
  const getAccordionValue = () => `item-${title.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <AccordionItem value={getAccordionValue()}>
      <AccordionTrigger className="text-xl font-headline">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            {isEditable && (
              <Button variant="outline" size="sm" onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Button>
            )}
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
                  <TableHead>Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((record) => (
                    <TableRow key={record.id}>
                        {columns.map(col => <TableCell key={col.key}>{record[col.key]}</TableCell>)}
                      <TableCell>{record.source}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                           <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(record)}
                            disabled={!isEditable}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {record.source === 'Rating' && isEditable && (
                               <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(record.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2} className="text-center">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AccordionContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRecord?.id?.startsWith('new-') ? 'Add New' : 'Edit'} {title.slice(0,-1)}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {columns.map(col => (
               <div key={col.key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={col.key} className="text-right">
                    {col.label}
                  </Label>
                  <Input
                    id={col.key}
                    value={editingRecord?.[col.key] || ''}
                    onChange={(e) => handleFieldChange(col.key, e.target.value)}
                    className="col-span-3"
                  />
                </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
}
