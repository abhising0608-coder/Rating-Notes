'use client';

import type { Attachment } from "@/types";
import { Button } from "./ui/button";
import { Paperclip, Trash2 } from "lucide-react";

type AttachmentListProps = {
  attachments: Attachment[];
  onRemove: (attachmentId: string) => void;
};

export default function AttachmentList({ attachments, onRemove }: AttachmentListProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium">Attachments</h4>
      <ul className="divide-y rounded-md border">
        {attachments.map((attachment) => (
          <li key={attachment.id} className="flex items-center justify-between p-2 hover:bg-muted/50">
            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Paperclip className="h-4 w-4" />
              <span>{attachment.name}</span>
            </a>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(attachment.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Remove attachment</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
