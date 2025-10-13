'use client';
import { useState, useEffect } from 'react';
import type { RatingNote, TableRowData, TemplateSection } from '@/types';
import {
  Card,
  CardContent,
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
import Tooltip from '@/components/Tooltip';
import TableSection from './TableSection';
import CommentsEditor from './CommentsEditor';
import { getDisclosureData } from '@/lib/data';

const DisclosureSection = ({ disclosure, tooltipKey, sector }: { disclosure: any, tooltipKey?: string, sector: string }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg font-headline">NOTE FOR RATING COMMITTEE</h3>
            {tooltipKey && <Tooltip tooltipKey={tooltipKey} sector={sector} />}
        </div>
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <tbody className="divide-y">
                    <tr className="hover:bg-muted/50">
                        <td className="font-medium p-3 w-1/3 bg-muted/50">Disclosure of Interest of Independent/Non-Executive Directors of CARE</td>
                        <td className="p-3">{disclosure.independentDirectors || 'Not Applicable'}</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                        <td className="font-medium p-3 w-1/3 bg-muted/50">Disclosure of Interest of Managing Director & CEO</td>
                        <td className="p-3">{disclosure.managingDirector || 'Not Applicable'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);


type SectionWrapperProps = {
  section: TemplateSection;
  note: RatingNote;
  onUpdateSection: (sectionId: string, data: Partial<RatingNote['sections'][string]>) => void;
  onRefreshTable: (tableId: string) => Promise<TableRowData[]>;
};

export default function SectionWrapper({
  section,
  note,
  onUpdateSection,
  onRefreshTable
}: SectionWrapperProps) {
  const sectionData = note.sections[section.id];
  const [applicability, setApplicability] = useState(sectionData.applicable);
  const [tableRows, setTableRows] = useState(sectionData.tableRows);
  const [disclosureData, setDisclosureData] = useState(sectionData.disclosure);

  useEffect(() => {
    if (section.id === 's1' && !disclosureData) { // Cover page section
        getDisclosureData(note.companyId).then(data => {
            const newDisclosureData = data || { independentDirectors: 'Not Applicable', managingDirector: 'Not Applicable' };
            setDisclosureData(newDisclosureData);
            onUpdateSection(section.id, { disclosure: newDisclosureData });
        });
    }
  }, [section.id, disclosureData, note.companyId, onUpdateSection]);

  const handleApplicabilityChange = (value: 'Applicable' | 'Not Applicable' | 'Not Available') => {
    setApplicability(value);
    onUpdateSection(section.id, { applicable: value });
  };
  
  const handleSaveComment = (sectionId: string, content: string, attachments: any[]) => {
    onUpdateSection(sectionId, { comments: content, attachments });
  }

  const handleTablePaste = (newRows: TableRowData[]) => {
    const updatedRows = [...tableRows, ...newRows];
    setTableRows(updatedRows);
    onUpdateSection(section.id, { tableRows: updatedRows });
  }

  const handleRowUpdate = (updatedRow: TableRowData) => {
    const updatedRows = tableRows.map(row => row.id === updatedRow.id ? updatedRow : row);
    setTableRows(updatedRows);
    onUpdateSection(section.id, { tableRows: updatedRows });
  }
  
  const handleRowAdd = (newRow: TableRowData) => {
    const updatedRows = [...tableRows, newRow];
    setTableRows(updatedRows);
    onUpdateSection(section.id, { tableRows: updatedRows });
  }

  const handleRowRemove = (rowId: string) => {
    const updatedRows = tableRows.filter(row => row.id !== rowId);
    setTableRows(updatedRows);
    onUpdateSection(section.id, { tableRows: updatedRows });
  }

  const tableVisible = applicability === 'Applicable';
  const tableHeaders = sectionData.tableRows.length > 0 ? Object.keys(sectionData.tableRows[0]).filter(k => k !== 'id' && k !== 'isManual' && k !== 'manualEdit' && k !== 'mappedAttributeId') : [];

  const isCoverPage = section.id === 's1';

  return (
    <Card id={section.key}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">{section.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={applicability}
            onValueChange={handleApplicabilityChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select applicability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applicable">Applicable</SelectItem>
              <SelectItem value="Not Applicable">Not Applicable</SelectItem>
              <SelectItem value="Not Available">Not Available</SelectItem>
            </SelectContent>
          </Select>
          {section.tooltipKey && !isCoverPage && <Tooltip tooltipKey={section.tooltipKey} sector={note.template.sector} />}
        </div>
      </CardHeader>
      <CardContent>
        {isCoverPage && disclosureData && (
             <DisclosureSection disclosure={disclosureData} tooltipKey={section.tooltipKey} sector={note.template.sector} />
        )}
        {section.hasTable && tableVisible && (
          <TableSection
            initialRows={tableRows}
            headers={tableHeaders}
            allowAddRow={section.allowAddRow ?? false}
            instructions={section.instructions}
            sectionKey={section.key}
            companyName={note.company.name}
            onRefresh={() => onRefreshTable(section.key)}
            onAddRow={handleRowAdd}
            onUpdateRow={handleRowUpdate}
            onRemoveRow={handleRowRemove}
          />
        )}
        <CommentsEditor 
          sectionId={section.id} 
          initialContent={sectionData.comments}
          initialAttachments={sectionData.attachments}
          onSave={handleSaveComment}
          onTablePaste={handleTablePaste}
        />
      </CardContent>
    </Card>
  );
}
