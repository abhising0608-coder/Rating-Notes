import { notFound } from 'next/navigation';
import { getRatingNoteById, getLiquidityData } from '@/lib/data';
import type { RatingNote, TableRowData, LiquidityData } from '@/types';
import { updateNoteSection, refreshTable } from '@/lib/actions';
import SectionWrapper from '@/components/SectionWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import NoteNavigation from '@/components/NoteNavigation';
import { Accordion } from '@/components/ui/accordion';

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

  const handleRefreshLiquidity = async (): Promise<LiquidityData | null> => {
    'use server';
    return getLiquidityData(note.companyId, true);
  }

  return (
    <div className="flex-1 flex flex-col">
       <NoteNavigation note={note} />
        <main className="flex-1 p-8 bg-background">
          <Accordion type="multiple" defaultValue={note.template.sections.map(s => s.id)} className="space-y-8">
            {note.template.sections.map((section) => (
              <SectionWrapper
                key={section.id}
                section={{...section, key: section.id}}
                note={note}
                onUpdateSection={handleUpdateSection}
                onRefreshTable={handleRefreshTable}
              />
            ))}
          </Accordion>
       </main>
    </div>
  );
}
