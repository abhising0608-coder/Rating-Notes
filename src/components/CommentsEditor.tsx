
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Attachment, TableRowData } from '@/types';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, Link, Image as ImageIcon, FileSpreadsheet, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import AttachmentList from './AttachmentList';
import { debounce } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { extractTable } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';

type CommentsEditorProps = {
  sectionId: string;
  initialContent: string;
  initialAttachments: Attachment[];
  onSave: (sectionId: string, content: string, attachments: Attachment[]) => void;
  onTablePaste: (rows: TableRowData[]) => void;
  disabled?: boolean;
};

const MAX_COMMENT_LENGTH = 500;

export default function CommentsEditor({
  sectionId,
  initialContent,
  initialAttachments,
  onSave,
  onTablePaste,
  disabled = false,
}: CommentsEditorProps) {
  const [content, setContent] = useState(initialContent.replace(/<[^>]+>/g, ''));
  const [attachments, setAttachments] = useState(initialAttachments);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPastingTable, setIsPastingTable] = useState(false);
  const [tablePasteText, setTablePasteText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const { toast } = useToast();

  const debouncedSave = useMemo(
    () =>
      debounce((sId: string, newContent: string, newAttachments: Attachment[]) => {
        onSave(sId, `<p>${newContent}</p>`, newAttachments);
        setLastSaved(new Date());
      }, 800),
    [onSave]
  );
  
  useEffect(() => {
    // Check against the raw initial content, not the stripped version
    if(content !== initialContent.replace(/<[^>]+>/g, '') || attachments !== initialAttachments) {
      debouncedSave(sectionId, content, attachments);
    }
  }, [content, attachments, sectionId, debouncedSave, initialContent, initialAttachments]);

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };
  
  const handleImageUpload = () => {
    // This is a mock. In a real app, this would open a file picker
    // and upload to Firebase Storage.
    toast({ title: "Image Upload", description: "Image upload simulation." });
  };
  
  const handleAttachmentUpload = () => {
    // Mock attachment upload
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name: `document-${Date.now()}.pdf`,
      type: 'application/pdf',
      url: '#'
    };
    setAttachments(prev => [...prev, newAttachment]);
    toast({ title: "Attachment Added", description: `${newAttachment.name} has been added.` });
  };

  const handleExtractTable = async () => {
    if (!tablePasteText) return;
    setIsExtracting(true);
    try {
      const result = await extractTable({ text: tablePasteText });
      const parsedData = JSON.parse(result.tableData);
      if (Array.isArray(parsedData)) {
        const newRows = parsedData.map((row, index) => ({
            ...row,
            id: `manual-${Date.now()}-${index}`,
            isManual: true,
        }));
        onTablePaste(newRows);
        toast({ title: "Success", description: "Table data extracted and added." });
        setIsPastingTable(false);
        setTablePasteText('');
      } else {
        throw new Error("Extracted data is not an array.");
      }
    } catch (error) {
      console.error("Failed to extract table:", error);
      toast({
        variant: 'destructive',
        title: "Extraction Failed",
        description: "Could not extract table from the provided text.",
      });
    } finally {
      setIsExtracting(false);
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_COMMENT_LENGTH) {
      setContent(e.target.value);
    }
  };

  const handleBlur = () => {
    // Trigger save on blur
    onSave(sectionId, `<p>${content}</p>`, attachments);
    setLastSaved(new Date());
  };

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-semibold font-headline">Comments</h3>
      <div className="rounded-lg border bg-card">
        <div className="p-2 border-b flex items-center gap-1 flex-wrap">
          <Button variant="ghost" size="icon" disabled={disabled}><Bold className="h-4 w-4"/></Button>
          <Button variant="ghost" size="icon" disabled={disabled}><Italic className="h-4 w-4"/></Button>
          <Button variant="ghost" size="icon" disabled={disabled}><Underline className="h-4 w-4"/></Button>
          <Button variant="ghost" size="icon" disabled={disabled}><List className="h-4 w-4"/></Button>
          <Button variant="ghost" size="icon" disabled={disabled}><Link className="h-4 w-4"/></Button>
          <Button variant="ghost" size="icon" onClick={handleImageUpload} disabled={disabled}><ImageIcon className="h-4 w-4"/></Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
           <Button variant="ghost" size="sm" onClick={() => setIsPastingTable(true)} disabled={disabled}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Paste from Excel
          </Button>
        </div>
        <div className="p-2">
            <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div className="relative">
                        <Textarea
                          placeholder="Add Comments..."
                          className="w-full bg-[#FAFAFA] rounded-[10px] pl-2.5 pr-8 py-2 text-[13px] min-h-[40px] transition-all duration-150 ease-in-out focus-visible:ring-offset-0"
                          value={content}
                          onChange={handleContentChange}
                          onBlur={handleBlur}
                          disabled={disabled}
                          style={{ height: content ? 'auto' : '40px' }}
                          rows={1}
                        />
                        <MessageSquare className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter your observations or remarks</p>
                  </TooltipContent>
              </Tooltip>
            </TooltipProvider>
             <div className="text-right text-xs text-muted-foreground mt-1">
                {content.length} / {MAX_COMMENT_LENGTH}
            </div>
        </div>
        <div className="p-3 border-t bg-muted/50 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={handleAttachmentUpload} disabled={disabled}>
            Add Attachment
          </Button>
          {lastSaved && (
            <p className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
        {attachments.length > 0 && 
            <div className="p-3 border-t">
                <AttachmentList attachments={attachments} onRemove={handleRemoveAttachment} />
            </div>
        }
      </div>
      
      <Dialog open={isPastingTable} onOpenChange={setIsPastingTable}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Extract Table from Text</DialogTitle>
            <DialogDescription>
              Paste your table data from Excel, a webpage, or other sources into the text area below. The AI will attempt to extract it into a structured table.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="table-text">Pasted Data</Label>
              <Textarea 
                id="table-text" 
                className="min-h-[200px] font-code" 
                value={tablePasteText}
                onChange={(e) => setTablePasteText(e.target.value)}
              />
            </div>
            <Alert>
              <AlertDescription>
                The extracted rows will be added as manual rows to the table in this section.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPastingTable(false)}>Cancel</Button>
            <Button onClick={handleExtractTable} disabled={isExtracting}>
              {isExtracting ? 'Extracting...' : 'Extract and Add to Table'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
