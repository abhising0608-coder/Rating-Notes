'use client';

import { useState, useEffect } from 'react';
import type { ImportantDataSection, ImportantDataTable, TableRowData } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImportantDataTable } from '@/lib/data';
import ImportantDataTableComponent from './ImportantDataTable';
import CommentsEditor from './CommentsEditor';
import { Separator } from './ui/separator';

interface ImportantDataAccordionProps {
  section: ImportantDataSection;
  entityId: string;
  period: string;
}

export default function ImportantDataAccordion({ section, entityId, period }: ImportantDataAccordionProps) {
  const [applicability, setApplicability] = useState<{ [key: string]: string }>({});
  const [tableData, setTableData] = useState<{ [key: string]: ImportantDataTable | null }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const handleApplicabilityChange = (tableId: string, value: string) => {
    setApplicability(prev => ({ ...prev, [tableId]: value }));
    if (value === 'Applicable' && !tableData[tableId]) {
      setLoading(prev => ({ ...prev, [tableId]: true }));
      getImportantDataTable(entityId, section.id, tableId, period)
        .then(data => {
          setTableData(prev => ({ ...prev, [tableId]: data }));
        })
        .finally(() => {
          setLoading(prev => ({ ...prev, [tableId]: false }));
        });
    }
  };
  
  const handleRefresh = (tableId: string) => {
    setLoading(prev => ({ ...prev, [tableId]: true }));
    getImportantDataTable(entityId, section.id, tableId, period, true) // force refresh
        .then(data => {
            setTableData(prev => ({ ...prev, [tableId]: data }));
        })
        .finally(() => {
            setLoading(prev => ({ ...prev, [tableId]: false }));
        });
  };
  
  const handleSaveComment = (tableId: string, content: string) => {
    console.log(`Saving comment for table ${tableId}:`, content);
    setComments(prev => ({ ...prev, [tableId]: content }));
    // Here you would typically call an API to persist the comment
  }

  return (
    <AccordionItem value={section.id}>
      <AccordionTrigger className="text-xl font-headline">{section.title}</AccordionTrigger>
      <AccordionContent className="space-y-6">
        {section.tables.map((tableMeta, index) => (
          <div key={tableMeta.id}>
            <div className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg">{tableMeta.label}</h4>
                <div className="w-48">
                  <Select onValueChange={(value) => handleApplicabilityChange(tableMeta.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Applicability..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Applicable">Applicable</SelectItem>
                      <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      <SelectItem value="Not Available">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {applicability[tableMeta.id] === 'Applicable' && (
                loading[tableMeta.id] ? (
                  <p>Loading table...</p>
                ) : tableData[tableMeta.id] ? (
                  <ImportantDataTableComponent
                    table={tableData[tableMeta.id]!}
                    onRefresh={() => handleRefresh(tableMeta.id)}
                  />
                ) : (
                  <p className="text-destructive">Could not load table data.</p>
                )
              )}
              
              { (applicability[tableMeta.id] === 'Not Applicable' || applicability[tableMeta.id] === 'Not Available') && (
                  <p className="text-muted-foreground text-center p-4 bg-muted rounded-md">
                      This table is marked as "{applicability[tableMeta.id]}".
                  </p>
              )}

              <CommentsEditor
                sectionId={tableMeta.id}
                initialContent={comments[tableMeta.id] || ''}
                initialAttachments={[]}
                onSave={(id, content) => handleSaveComment(id, content)}
                onTablePaste={() => {}}
              />
            </div>
            {index < section.tables.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
