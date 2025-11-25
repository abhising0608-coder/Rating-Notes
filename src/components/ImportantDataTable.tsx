'use client';

import { useState, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Download, ExternalLink, Plus, Trash2, EyeOff } from 'lucide-react';
import type { ImportantDataTable, TableRowData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ImportantDataTableProps {
  table: ImportantDataTable;
  onRefresh: () => void;
}

const formatNumber = (num: number | string | undefined | null) => {
    if (num === undefined || num === null || num === '') return '0.00';
    const number = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(number)) return '0.00';
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

export default function ImportantDataTableComponent({ table, onRefresh }: ImportantDataTableProps) {
  const [tableRows, setTableRows] = useState<TableRowData[]>(table.rows || []);
  const { toast } = useToast();
  
  const getColumnTotal = useCallback((colKey: string) => {
      return tableRows.reduce((sum, row) => {
          if (row.fixedLabel || row.deleted) return sum; 
          const value = parseFloat(row[colKey]);
          return sum + (isNaN(value) ? 0 : value);
      }, 0);
  }, [tableRows]);

  const allRows = useMemo(() => {
    return tableRows.map(row => {
      let newRow = { ...row };

      if (row.formulaId === 'total') {
        table.columns.forEach(col => {
          if (col.isYearColumn && col.type === 'number') {
            newRow[col.key] = getColumnTotal(col.key);
          }
        });
      }

      table.columns.forEach(col => {
        if (col.formulaId === 'share') {
          const yearKey = col.key.replace('share', '').toLowerCase();
          const yearCol = table.columns.find(c => c.key.toLowerCase() === yearKey && c.type === 'number');
          if (yearCol) {
            const total = getColumnTotal(yearCol.key);
            const rowValue = parseFloat(newRow[yearCol.key]);
            if (total > 0 && !isNaN(rowValue)) {
              newRow[col.key] = ((rowValue / total) * 100).toFixed(2) + '%';
            } else {
              newRow[col.key] = '0.00%';
            }
          }
        } else if (col.formulaId === 'yoy') {
            const currentYearKey = 'fy24';
            const prevYearKey = 'fy23';
            const currentVal = parseFloat(newRow[currentYearKey]);
            const prevVal = parseFloat(newRow[prevYearKey]);
            if (!isNaN(currentVal) && !isNaN(prevVal) && prevVal !== 0) {
                 newRow[col.key] = (((currentVal - prevVal) / prevVal) * 100).toFixed(2) + '%';
            } else {
                 newRow[col.key] = 'N/A';
            }
        }
      });
      return newRow;
    });
  }, [tableRows, table.columns, getColumnTotal]);

  const handleAddRow = (afterRowId?: string) => {
    if (tableRows.filter(r => !r.deleted).length >= 200) {
      toast({
        variant: 'destructive',
        title: 'Row Limit Reached',
        description: 'You can add a maximum of 200 rows.',
      });
      return;
    }
    const newRow: TableRowData = { id: `manual-${Date.now()}` };
    table.columns.forEach(col => {
      newRow[col.key] = '';
    });
    
    if (afterRowId) {
        const index = tableRows.findIndex(r => r.id === afterRowId);
        const newRows = [...tableRows];
        newRows.splice(index + 1, 0, newRow);
        setTableRows(newRows);
    } else {
        setTableRows(prev => [...prev, newRow]);
    }
  };

  const handleRowChange = (id: string, key: string, value: string) => {
    setTableRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row));
    // Here you would call a debounced function to save the change
  }

  const handleRowAction = (id: string, action: 'hide' | 'delete') => {
    setTableRows(prev => prev.map(row => {
        if (row.id === id) {
            return { ...row, [action === 'hide' ? 'hidden' : 'deleted']: true };
        }
        return row;
    }));
  };

  const hasNegativeValues = table.rows.some(row =>
    table.columns.some(col => table.negativeAsNMAttributeIds.includes(row.mappedAttributeId || '') && (row[col.key] as number) < 0)
  );

  const visibleRows = allRows.filter(row => !row.hidden && !row.deleted);
  
  let srNoCounter = 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <h5 className="font-semibold">{table.unit && `(Unit: ${table.unit})`}</h5>
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <a href={table.ckcModuleUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" /> Navigate to CKC
                </Button>
            </a>
        </div>
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map(col => (
                <TableHead key={col.key} className={cn(col.formulaId && "italic")}>
                   <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>{col.label}</div>
                      </TooltipTrigger>
                      {table.tooltip && <TooltipContent>{table.tooltip}</TooltipContent>}
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map(row => (
              <TableRow key={row.id} className={cn(row.formulaId === 'total' && 'bg-muted/80 font-bold')}>
                {table.columns.map(col => {
                    const cellValue = row[col.key];
                    const isNM = table.negativeAsNMAttributeIds.includes(row.mappedAttributeId || '') && (cellValue as number) < 0;
                    const displayValue = isNM ? 'NM' : cellValue;
                    const isEditable = col.editable && (!row.fixedLabel);
                    
                    if (col.key === 'srNo') {
                      return <TableCell key={col.key}>{row.fixedLabel ? '' : srNoCounter++}</TableCell>;
                    }

                    return (
                       <TableCell key={col.key}>
                        { isEditable ? (
                            <Input 
                                type={col.type === 'date' ? 'date' : 'text'}
                                value={col.type === 'date' && cellValue ? format(new Date(cellValue), 'yyyy-MM-dd') : (cellValue || '')}
                                onChange={(e) => handleRowChange(row.id, col.key, e.target.value)}
                                className="h-8"
                                placeholder={col.type === 'date' ? 'MM-YY' : undefined}
                            />
                        ) : (
                            <span>{col.type === 'number' ? formatNumber(displayValue) : displayValue}</span>
                        )}
                       </TableCell>
                    )
                })}
                <TableCell>
                  <div className='flex'>
                    {row.canAddBelow && <Button variant="ghost" size="icon" onClick={() => handleAddRow(row.id)}><Plus className="h-4 w-4" /></Button>}
                    {row.canDelete && <Button variant="ghost" size="icon" onClick={() => handleRowAction(row.id, 'delete')}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    {row.canHide && <Button variant="ghost" size="icon" onClick={() => handleRowAction(row.id, 'hide')}><EyeOff className="h-4 w-4 text-muted-foreground" /></Button>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {hasNegativeValues && (
        <p className="text-xs text-muted-foreground">NM – Not Meaningful</p>
      )}

      { !table.rows.some(r => r.canAddBelow) && (
        <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm" onClick={() => handleAddRow()}>
                <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
        </div>
      )}
      
      {table.developerGuidance && (
        <div className="mt-4 p-3 border rounded-md bg-rose-50 text-rose-800">
          <p className="text-sm font-bold">🔴 Guidance for Developers</p>
          <ul className="list-disc list-inside text-xs">
            {table.developerGuidance.map((line, index) => <li key={index}>{line}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
