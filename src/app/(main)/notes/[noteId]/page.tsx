import { notFound } from 'next/navigation';
import { getRatingNoteById } from '@/lib/data';
import type { RatingNote, TableRowData } from '@/types';
import { updateNoteSection, refreshTable } from '@/lib/actions';
import SectionWrapper from '@/components/SectionWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function NotePage({ params }: { params: { noteId: string } }) {
  const note = await getRatingNoteById(params.noteId);

  if (!note) {
    notFound();
  }

  const handleUpdateSection = async (
    sectionId: string,
    data: Partial<RatingNote['sections'][string]>
  ) => {
    'use server';
    return updateNoteSection(note.id, sectionId, data);
  };

  const handleRefreshTable = async (tableId: string): Promise<TableRowData[]> => {
    'use server';
    return refreshTable(tableId, note.companyId);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">{note.company.name}</h1>
            <p className="text-muted-foreground">{note.template.name}</p>
        </div>
        <Link href={`/notes/${note.id}/preview`} passHref>
          <Button>Preview</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {note.template.sections.map((section) => (
          <SectionWrapper
            key={section.id}
            section={{...section, key: section.id}}
            note={note}
            onUpdateSection={handleUpdateSection}
            onRefreshTable={handleRefreshTable}
          />
        ))}
      </div>
    </div>
  );
}
