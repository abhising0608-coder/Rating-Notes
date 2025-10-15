
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
import { File as FileIcon, Image, Trash2, UploadCloud } from 'lucide-react';
import type { Attachment } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function AttachmentSection() {
  const [applicability, setApplicability] = useState<'Applicable' | 'Not Applicable' | 'Not Available'>('Applicable');
  const [comments, setComments] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newAttachments: Attachment[] = [];
      
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            variant: 'destructive',
            title: 'File too large',
            description: `${file.name} exceeds the 10MB size limit.`,
          });
          continue;
        }

        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
          toast({
            variant: 'destructive',
            title: 'Invalid file type',
            description: `${file.name} is not a supported file type (JPG, PNG, PDF).`,
          });
          continue;
        }

        newAttachments.push({
          id: `file-${Date.now()}-${file.name}`,
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file), // Temporary URL for preview
          description: '',
        });
      }
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };
  
  const handleDescriptionChange = (id: string, description: string) => {
    setAttachments(prev => prev.map(att => att.id === id ? {...att, description} : att));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Attachments in Case of Withdrawal / Repayment</CardTitle>
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
        <CardDescription>Attach NOC/NDC received here.</CardDescription>
      </CardHeader>
      <CardContent>
        {applicability === 'Applicable' ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Comments</h3>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your comments here..."
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Attachments</h3>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag & drop files here, or click to browse.
                </p>
                <Button asChild variant="outline" className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        Add Attachment
                    </label>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  multiple
                  accept="image/png, image/jpeg, application/pdf"
                />
              </div>

              {attachments.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {attachments.map(att => (
                    <div key={att.id} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0 h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                        {att.type.startsWith('image/') ? (
                          <Image width={64} height={64} src={att.url} alt={att.name} className="h-full w-full object-cover rounded-md" />
                        ) : (
                          <FileIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-grow space-y-2">
                        <p className="text-sm font-medium truncate" title={att.name}>{att.name}</p>
                        <Input 
                            placeholder="Document Description..."
                            value={att.description}
                            onChange={(e) => handleDescriptionChange(att.id, e.target.value)}
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveAttachment(att.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
