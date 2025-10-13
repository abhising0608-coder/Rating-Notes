'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Attachment, TableRowData } from '@/types';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, Link, Image as ImageIcon, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import AttachmentList from './AttachmentList';
import { debounce } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { extractTable } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from './ui/alert';
import Tooltip from './Tooltip';

type RichTextFieldProps = {
  label: string;
  content: string;
  onContentChange: (newContent: string) => void;
  onRefresh?: () => void;
  tooltipKey?: string;
  sector?: string;
  comments: string;
  onCommentsChange: (newComments: string) => void;
};

export const RichTextField: React.FC<RichTextFieldProps> = ({
  label,
  content,
  onContentChange,
  onRefresh,
  tooltipKey,
  sector,
  comments,
  onCommentsChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{label}</h4>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            )}
            {tooltipKey && <Tooltip tooltipKey={tooltipKey} sector={sector} />}
          </div>
        </div>
        <div className="rounded-lg border bg-background">
          <div className="p-2 border-b flex items-center gap-1 flex-wrap">
            <Button variant="ghost" size="icon"><Bold /></Button>
            <Button variant="ghost" size="icon"><Italic /></Button>
            <Button variant="ghost" size="icon"><Underline /></Button>
          </div>
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows={6}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
            placeholder={`Enter details about the ${label.toLowerCase()}...`}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-medium">Comments</Label>
        <Textarea
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          rows={4}
          className="w-full"
          placeholder="Add your comments here..."
        />
      </div>
    </div>
  );
};


type CommentsEditorProps = {
  sectionId: string;
  initialContent: string;
  initialAttachments: Attachment[];
  onSave: (sectionId: string, content: string, attachments: Attachment[]) => void;
  onTablePaste: (rows: TableRowData[]) => void;
};

export default function CommentsEditor({
  sectionId,
  initialContent,
  initialAttachments,
  onSave,
  onTablePaste,
}: CommentsEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [attachments, setAttachments] = useState(initialAttachments);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPastingTable, setIsPastingTable] = useState(false);
  const [tablePasteText, setTablePasteText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const { toast } = useToast();

  const debouncedSave = useMemo(
    () =>
      debounce((sId: string, newContent: string, newAttachments: Attachment[]) => {
        onSave(sId, newContent, newAttachments);
        setLastSaved(new Date());
      }, 1000),
    [onSave]
  );
  
  useEffect(() => {
    if(content !== initialContent || attachments !== initialAttachments) {
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

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold font-headline mb-2">Comments</h3>
      <div className="rounded-lg border bg-card">
        <div className="p-2 border-b flex items-center gap-1 flex-wrap">
          <Button variant="ghost" size="icon"><Bold /></Button>
          <Button variant="ghost" size="icon"><Italic /></Button>
          <Button variant="ghost" size="icon"><Underline /></Button>
          <Button variant="ghost" size="icon"><List /></Button>
          <Button variant="ghost" size="icon"><Link /></Button>
          <Button variant="ghost" size="icon" onClick={handleImageUpload}><ImageIcon /></Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
           <Button variant="ghost" size="sm" onClick={() => setIsPastingTable(true)}>
            <FileSpreadsheet className="mr-2" />
            Paste from Excel
          </Button>
        </div>
        <div className="p-2">
          {/* A simplified rich text editor using textarea */}
          <Textarea
            placeholder="Add your comments here..."
            className="min-h-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-1"
            value={content.replace(/<[^>]+>/g, '')} // Simplified view
            onChange={(e) => setContent(`<p>${e.target.value}</p>`)}
          />
        </div>
        <div className="p-3 border-t bg-muted/50 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={handleAttachmentUpload}>
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
