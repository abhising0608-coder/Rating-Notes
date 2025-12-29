
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
import { Button, buttonVariants } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

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
  columns: { key: string; label: string, mandatory?: boolean }[];
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
  const [recordToDelete, setRecordToDelete] = React.useState<T | null>(null);
  const { toast } = useToast();

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

  const handleDelete = (record: T) => {
    if (!isEditable) return;
    setRecordToDelete(record);
  };

  const confirmDelete = () => {
    if (!recordToDelete) return;
    onUpdate(data.filter(d => d.id !== recordToDelete.id));
    toast({
      title: 'Record Deleted',
      description: `The record has been successfully deleted.`,
    });
    setRecordToDelete(null);
  }

  const handleSave = () => {
    if (!editingRecord) return;
    
    // Validation
    for (const col of columns) {
      if (col.mandatory && !editingRecord[col.key]) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: `${col.label} is a mandatory field.`,
        });
        return;
      }
    }
    
    const emailColumn = columns.find(c => c.key.toLowerCase().includes('email'));
    if (emailColumn && editingRecord[emailColumn.key] && !/^\S+@\S+\.\S+$/.test(editingRecord[emailColumn.key])) {
       toast({ variant: 'destructive', title: 'Validation Error', description: 'Please enter a valid email address.' });
       return;
    }

    const contactNoColumn = columns.find(c => c.key.toLowerCase().includes('contact'));
     if (contactNoColumn && editingRecord[contactNoColumn.key] && !/^\d+$/.test(editingRecord[contactNoColumn.key])) {
       toast({ variant: 'destructive', title: 'Validation Error', description: 'Contact number must contain only digits.' });
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
    toast({ title: 'Success', description: `${title.slice(0, -1)} details have been saved.` });
    setIsModalOpen(false);
    setEditingRecord(null);
  };

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
                                onClick={() => handleDelete(record)}
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
        <DialogContent className="sm:max-w-lg p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {editingRecord?.id?.startsWith('new-') ? 'Add New' : 'Edit'} {title.slice(0,-1)}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Table>
              <TableBody>
                 {columns.map(col => (
                   <TableRow key={col.key}>
                      <TableCell className="w-1/3 font-medium bg-muted/50">
                        {col.label}
                        {col.mandatory && <span className="text-destructive">*</span>}
                      </TableCell>
                      <TableCell>
                        <Input
                          id={col.key}
                          value={editingRecord?.[col.key] || ''}
                          onChange={(e) => handleFieldChange(col.key, e.target.value)}
                          placeholder={`Enter ${col.label}...`}
                          className="border-0 shadow-none focus-visible:ring-0"
                        />
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="bg-muted/50 px-6 py-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={!!recordToDelete} onOpenChange={() => setRecordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({variant: "destructive"}))}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccordionItem>
  );
}
