'use server';

import { revalidatePath } from 'next/cache';
import { getFinancialData } from './data';
import type { RatingNote, TableRowData } from '@/types';
import { extractTable as extractTableFlow } from '@/ai/flows/extract-table';

// In a real app, these actions would interact with a database like Firestore.
// For this prototype, we simulate the interaction.

export async function refreshTable(
  tableId: string,
  companyId: string
): Promise<TableRowData[]> {
  console.log(`Refreshing data for table: ${tableId}, company: ${companyId}`);
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = await getFinancialData(companyId, tableId);
  
  if (!data) {
    throw new Error('Financial data not found');
  }

  // Simulate some data change
  const refreshedRows = data.rows.map(row => ({
      ...row,
      '2024': (row['2024'] ?? 0) + Math.floor(Math.random() * 10 - 5) // random small change
  }));

  return refreshedRows;
}

export async function updateNoteSection(
  noteId: string,
  sectionId: string,
  data: Partial<RatingNote['sections'][string]>
) {
  console.log(`Updating section ${sectionId} for note ${noteId} with`, data);
  // In a real app, you would update the document in Firestore here.
  // e.g., db.collection('ratingNotes').doc(noteId).update({ ... });
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Revalidate the path to show updated data
  revalidatePath(`/notes/${noteId}`);

  return { success: true };
}

export async function extractTable(input: { text: string }): Promise<{ tableData: string }> {
  try {
    const result = await extractTableFlow(input);
    return result;
  } catch (error) {
    console.error('Error in extractTable flow:', error);
    throw new Error('Failed to process text with AI model.');
  }
}
