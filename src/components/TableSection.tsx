'use client';

import { useState, useTransition } from 'react';
import type { TableRowData } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, Download, Trash2, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

type TableSectionProps = {
  initialRows: TableRowData[];
  headers: string[];
  onRefresh: () => Promise<TableRowData[]>;
  onAddRow: (row: TableRowData) => void;
  onUpdateRow: (row: TableRowData) => void;
  onRemoveRow: (rowId: string) => void;
  allowAddRow: boolean;
  instructions?: string;
  sectionKey: string;
  companyName: string;
  readOnly?: boolean;
};

const MAX_MANUAL_ROWS = 10;

export default function TableSection({
  initialRows,
  headers,
  onRefresh,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  allowAddRow,
  instructions,
  sectionKey,
  companyName,
  readOnly = false,
}: TableSectionProps) {
  const [rows, setRows] = useState<TableRowData[]>(initialRows);
  const [isRefreshing, startRefreshTransition] = useTransition();
  const { toast } = useToast();

  const handleRefresh = () => {
    startRefreshTransition(async () => {
      try {
        const freshData = await onRefresh();
        setRows(currentRows => {
          const manualRows = currentRows.filter(r => r.isManual);
          const updatedMappedRows = freshData.map(freshRow => {
            const existingRow = currentRows.find(r => r.id === freshRow.id);
            // Preserve manual edits on specific cells if needed
            return { ...existingRow, ...freshRow };
          });
          return [...updatedMappedRows, ...manualRows];
        });
        toast({
          title: 'Success',
          description: 'Table data has been refreshed.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Refresh Failed',
          description: 'Could not fetch the latest data.',
        });
      }
    });
  };

  const handleAddRow = () => {
    const manualRowsCount = rows.filter(r => r.isManual).length;
    if (allowAddRow && sectionKey === 'financials_reference' && manualRowsCount >= MAX_MANUAL_ROWS) {
       toast({
        variant: 'destructive',
        title: 'Row Limit Reached',
        description: `You can only add a maximum of ${MAX_MANUAL_ROWS} manual rows to the reference table.`,
      });
      return;
    }

    const newRow: TableRowData = {
      id: `manual-${Date.now()}`,
      isManual: true,
    };
    headers.forEach(header => newRow[header] = '');
    setRows(current => [...current, newRow]);
    onAddRow(newRow); // Propagate to parent for persistence
  };

  const handleRemoveRow = (rowId: string) => {
    setRows(current => current.filter(r => r.id !== rowId));
    onRemoveRow(rowId);
  }
  
  const handleCellChange = (rowId: string, column: string, value: string) => {
    const updatedRows = rows.map(row => {
        if(row.id === rowId) {
            const newRow = { ...row, [column]: value };
            if (row.isManual) {
                newRow.manualEdit = true;
            }
            onUpdateRow(newRow); // Propagate change for debounced save
            return newRow;
        }
        return row;
    });
    setRows(updatedRows);
  }

  const handleExport = () => {
    // Exclude the 'Actions' column from export
    const exportHeaders = headers.filter(h => h !== 'Actions');
    
    const dataToExport = rows.map(row => {
        const newRow: any = {};
        exportHeaders.forEach(header => {
            newRow[header] = row[header];
        });
        // Include metadata
        newRow.isManual = row.isManual ?? false;
        newRow.mappedAttributeId = row.mappedAttributeId ?? '';
        return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sectionKey);

    const fileName = `${companyName}_${sectionKey}_${format(new Date(), 'yyyyMMdd')}_table.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast({ title: 'Export Successful', description: `${fileName} has been downloaded.`});
  };

  const tableHeaders = [...headers, 'Actions'];
  const nmAttributeIds = ['attr_net_worth']; // Example, replace with actual IDs

  return (
    <div className="mt-4">
      <div className="flex items-center justify-end gap-2 mb-2">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
        {allowAddRow && (
          <Button variant="outline" size="sm" onClick={handleAddRow}>
            <Plus className="mr-2 h-4 w-4" />
            Add Row
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export XLSX
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableHead key={header} className="font-bold bg-muted/50">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {headers.map((header) => {
                  const cellValue = row[header];
                  const isReadOnly = readOnly && !row.isManual;
                  const displayValue = (typeof cellValue === 'number' && cellValue < 0 && nmAttributeIds.includes(row.mappedAttributeId))
                    ? 'NM'
                    : cellValue ?? '';
                  return (
                    <TableCell key={header}>
                       <Input
                          type="text"
                          value={displayValue}
                          readOnly={isReadOnly}
                          onChange={(e) => handleCellChange(row.id, header, e.target.value)}
                          className={`h-8 border-transparent focus:border-input ${isReadOnly ? 'bg-transparent' : 'hover:border-input'}`}
                       />
                    </TableCell>
                  )
                })}
                <TableCell>
                    {row.isManual && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveRow(row.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {nmAttributeIds.some(id => rows.some(r => r.mappedAttributeId === id && typeof r.value === 'number' && r.value < 0)) && (
          <p className="text-xs text-muted-foreground mt-1">NM – Not Meaningful</p>
      )}
      {instructions && (
        <p className="text-sm text-muted-foreground mt-2">{instructions}</p>
      )}
    </div>
  );
}
