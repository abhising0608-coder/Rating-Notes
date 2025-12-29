
'use client';
import * as React from 'react';
import type { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CompanyContactDetailsProps {
  contacts: Contact[];
  onUpdate: (contacts: Contact[]) => void;
  isEditable: boolean;
}

const initialContactState: Omit<Contact, 'id' | 'source'> = {
  name: '',
  designation: '',
  department: '',
  email: '',
  mobile: '',
  phone: '',
  isPrimary: false,
  isUPSI: false,
  authorizedSignatory: false,
  isDeleted: false,
};

export default function CompanyContactDetails({
  contacts,
  onUpdate,
  isEditable,
}: CompanyContactDetailsProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<Partial<Contact> | null>(null);
  const [contactToDelete, setContactToDelete] = React.useState<Contact | null>(null);

  const visibleContacts = React.useMemo(() => {
    return contacts.filter(c => !c.isDeleted);
  }, [contacts]);

  const handleAddNew = () => {
    if (!isEditable) return;
    setEditingContact({ ...initialContactState, id: `new-${Date.now()}`, source: 'Rating' });
    setIsModalOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    if (!isEditable) return;
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = (contact: Contact) => {
    if (!isEditable) return;
    setContactToDelete(contact);
  };

  const confirmDelete = () => {
    if (!contactToDelete) return;
    const updatedContacts = contacts.map(c => 
      c.id === contactToDelete.id ? { ...c, isDeleted: true, pendingSync: true } : c
    );
    onUpdate(updatedContacts);
    toast({ title: 'Contact Deleted', description: `${contactToDelete.name} has been marked for deletion.` });
    setContactToDelete(null);
  };

  const handleSave = () => {
    if (!editingContact) return;

    // Validation
    if (!editingContact.name || (!editingContact.email && !editingContact.mobile)) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Contact Name and either Email or Mobile are required.',
      });
      return;
    }

    const now = new Date().toISOString();
    const currentUser = 'Rating Analyst'; // Mock user

    const updatedContact: Contact = {
      ...initialContactState,
      ...editingContact,
      id: editingContact.id || `new-${Date.now()}`,
      source: editingContact.source || 'Rating',
      pendingSync: true,
      lastUpdatedAt: now,
      lastUpdatedBy: currentUser,
    };

    let updatedContacts: Contact[];
    if (editingContact.id?.startsWith('new-')) {
      updatedContacts = [...contacts, updatedContact];
    } else {
      updatedContacts = contacts.map(c => (c.id === updatedContact.id ? updatedContact : c));
    }
    
    onUpdate(updatedContacts);
    toast({ title: 'Contact Saved', description: `${updatedContact.name} has been saved successfully.` });
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleFieldChange = (key: keyof Contact, value: string | boolean) => {
    setEditingContact(prev => (prev ? { ...prev, [key]: value } : null));
  };
  
  const FormField = ({ id, label, value, onChange, placeholder, required }: { id: string, label: string, value: string, onChange: (val: string) => void, placeholder?: string, required?: boolean }) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">{label}{required && <span className="text-destructive">*</span>}</Label>
      <Input id={id} value={value} onChange={e => onChange(e.target.value)} className="col-span-3" placeholder={placeholder}/>
    </div>
  );

  const FormSwitch = ({ id, label, checked, onCheckedChange }: { id: string, label: string, checked: boolean, onCheckedChange: (val: boolean) => void }) => (
     <div className="flex items-center space-x-2">
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor={id}>{label}</Label>
      </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isEditable && (
          <Button variant="outline" size="sm" onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add New Contact
          </Button>
        )}
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Email / Mobile</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleContacts.length > 0 ? (
              visibleContacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.designation}</TableCell>
                  <TableCell>
                    <div>{contact.email}</div>
                    <div>{contact.mobile}</div>
                  </TableCell>
                   <TableCell>
                    <div className="flex flex-col gap-1">
                        {contact.isPrimary && <Badge variant="outline">Primary</Badge>}
                        {contact.isUPSI && <Badge variant="secondary">UPSI</Badge>}
                        {contact.authorizedSignatory && <Badge>Auth. Signatory</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{contact.source}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(contact)} disabled={!isEditable}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {contact.source === 'Rating' && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(contact)} disabled={!isEditable}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No contacts found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingContact?.id?.startsWith('new-') ? 'Add New' : 'Edit'} Contact</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <FormField id="name" label="Contact Name" value={editingContact?.name || ''} onChange={val => handleFieldChange('name', val)} required />
             <FormField id="designation" label="Designation" value={editingContact?.designation || ''} onChange={val => handleFieldChange('designation', val)} />
             <FormField id="department" label="Department" value={editingContact?.department || ''} onChange={val => handleFieldChange('department', val)} />
             <FormField id="email" label="Email" value={editingContact?.email || ''} onChange={val => handleFieldChange('email', val)} placeholder="Email is required if Mobile is empty" />
             <FormField id="mobile" label="Mobile" value={editingContact?.mobile || ''} onChange={val => handleFieldChange('mobile', val)} placeholder="Mobile is required if Email is empty"/>
             <FormField id="phone" label="Phone" value={editingContact?.phone || ''} onChange={val => handleFieldChange('phone', val)} />
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Flags</Label>
                <div className="col-span-3 flex gap-4">
                    <FormSwitch id="isPrimary" label="Primary" checked={!!editingContact?.isPrimary} onCheckedChange={val => handleFieldChange('isPrimary', val)} />
                    <FormSwitch id="isUPSI" label="UPSI" checked={!!editingContact?.isUPSI} onCheckedChange={val => handleFieldChange('isUPSI', val)} />
                    <FormSwitch id="authorizedSignatory" label="Auth. Signatory" checked={!!editingContact?.authorizedSignatory} onCheckedChange={val => handleFieldChange('authorizedSignatory', val)} />
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSave}>Save Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={!!contactToDelete} onOpenChange={() => setContactToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the contact '{contactToDelete?.name}'. This action cannot be undone.
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
    </div>
  );
}
