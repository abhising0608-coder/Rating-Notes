
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { File as FileIcon, Image as ImageIcon, Trash2, UploadCloud, Plus } from 'lucide-react';
import type { Attachment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { format } from 'date-fns';

export default function AnnexureAttachments() {
  const [applicability, setApplicability] = useState<'Applicable' | 'Not Applicable' | 'Not Available'>('Applicable');
  const [comments, setComments] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, attachmentId: string) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: `${file.name} exceeds the 10MB size limit.`,
        });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: `Unsupported file type. Allowed: JPG, PNG, PDF, DOCX, XLSX, PPTX.`,
        });
        return;
      }
      
      setAttachments(prev => prev.map(att => 
        att.id === attachmentId 
        ? {
            ...att,
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file), // Temporary URL
            uploadedOn: new Date().toISOString(),
            uploadedBy: 'Analyst User' // Mock user
          } 
        : att
      ));
    }
  };
  
  const handleAddRow = () => {
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name: '',
      type: '',
      url: '',
      description: '',
    };
    setAttachments(prev => [...prev, newAttachment]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };
  
  const handleDescriptionChange = (id: string, description: string) => {
    setAttachments(prev => prev.map(att => att.id === id ? {...att, description} : att));
  }

  const handleSave = () => {
    for (const att of attachments) {
        if (!att.description) {
            toast({ variant: 'destructive', title: 'Validation Error', description: 'Description is mandatory for all attachments.' });
            return;
        }
        if (!att.name) {
            toast({ variant: 'destructive', title: 'Validation Error', description: 'A file must be uploaded for each row.' });
            return;
        }
    }
    // In a real app, this would persist the data
    toast({ title: 'Success', description: 'Attachments saved.' });
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-muted-foreground" />;
    if (fileType === 'application/pdf') return <FileIcon className="h-5 w-5 text-red-500" />;
    if (fileType.includes('word')) return <FileIcon className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('sheet')) return <FileIcon className="h-5 w-5 text-green-500" />;
    if (fileType.includes('presentation')) return <FileIcon className="h-5 w-5 text-orange-500" />;
    return <FileIcon className="h-5 w-5 text-muted-foreground" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Annexure - Add Attachments</CardTitle>
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
        <CardDescription>Upload any supporting documents for the RCM review. Each attachment must have a description.</CardDescription>
      </CardHeader>
      <CardContent>
        {applicability === 'Applicable' ? (
          <div className="space-y-6">
            <div className="flex justify-end">
                <Button variant="outline" onClick={handleAddRow}><Plus className="mr-2 h-4 w-4" /> Add Attachment</Button>
            </div>
            
            {attachments.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description / Heading</TableHead>
                                <TableHead>Upload File</TableHead>
                                <TableHead>Uploaded On</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attachments.map(att => (
                                <TableRow key={att.id}>
                                    <TableCell className="w-1/3">
                                        <Input 
                                            placeholder="Mandatory description..."
                                            value={att.description}
                                            onChange={(e) => handleDescriptionChange(att.id, e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <label htmlFor={`file-upload-${att.id}`} className="cursor-pointer">
                                                    <UploadCloud className="mr-2 h-4 w-4" /> Browse
                                                </label>
                                            </Button>
                                            <input id={`file-upload-${att.id}`} type="file" className="hidden" onChange={(e) => handleFileChange(e, att.id)} />
                                            {att.name && (
                                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                                                    {getFileIcon(att.type)}
                                                    <span className="truncate max-w-[150px]">{att.name}</span>
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{att.uploadedOn ? format(new Date(att.uploadedOn), 'PP pp') : '-'}</TableCell>
                                    <TableCell>{att.uploadedBy || '-'}</TableCell>
                                    <TableCell>
                                         <Button variant="ghost" size="icon" onClick={() => handleRemoveAttachment(att.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            
            <div>
              <h3 className="font-semibold mb-2">Inline Comments / Images</h3>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your inline comments or paste images here..."
                rows={5}
              />
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave}>Save Attachments</Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center p-8">
            This section is marked as "{applicability}".
          </p>
        )}
      </CardContent>
    </Card>
  );
}
