
'use client';
import * as React from 'react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';


interface ImportantDataTableProps {
  table: ImportantDataTable;
  onRefresh: () => void;
  allTables: ImportantDataTable[];
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

export default function ImportantDataTableComponent({ table, onRefresh, allTables }: ImportantDataTableProps) {
  const [tableRows, setTableRows] = useState<TableRowData[]>(table.rows || []);
  const { toast } = useToast();
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const allRows = useMemo(() => {
    let processedRows = [...tableRows];
    
    // This is a complex memo that calculates derived values.
    // It will be simplified or replaced by the schema-driven approach.
    processedRows.forEach(row => {
      if (!row.values) row.values = {};

      if (row.formulaId === 'total' && table.id === '5.2.4_manufacturingFacilityWiseSales') {
        table.columns.forEach(col => {
          if (col.isYearColumn) {
            const total = tableRows.reduce((acc, r) => acc + (r.id !== 'fac-total' && !r.deleted ? Number(r.values?.[col.key]) || 0 : 0), 0);
            row.values[col.key] = total;
          }
        });
      }

      if (row.formulaId === 'totalRM') {
          table.columns.forEach(col => {
              if (col.isYearColumn) {
                  const importVal = tableRows.find(r => r.id === 'rm-1')?.values?.[col.key] || 0;
                  const chinaVal = tableRows.find(r => r.id === 'rm-2')?.values?.[col.key] || 0;
                  const domesticVal = tableRows.find(r => r.id === 'rm-3')?.values?.[col.key] || 0;
                  row.values[col.key] = Number(importVal) + Number(chinaVal) + Number(domesticVal);
              }
          });
      }

      if (row.formulaId === 'importAsPctOfRM') {
          const totalRMRaw = processedRows.find(r => r.formulaId === 'totalRM');
          const importRMRaw = tableRows.find(r => r.id === 'rm-1');
          if(totalRMRaw && importRMRaw) {
              table.columns.forEach(col => {
                  if (col.isYearColumn) {
                      const totalRM = Number(totalRMRaw.values?.[col.key]) || 0;
                      const importRM = Number(importRMRaw.values?.[col.key]) || 0;
                      row.values[col.key] = totalRM > 0 ? (importRM / totalRM) * 100 : 0;
                  }
              });
          }
      }

       if (row.formulaId === 'groupTotal' && row.formulaGroup === 'top10' && table.id === '5.2.3_brandWiseSales') {
            table.columns.forEach(col => {
                if (col.isYearColumn) {
                    row.values[col.key] = tableRows
                        .filter(r => r.group === 'top10' && !r.deleted)
                        .reduce((acc, r) => acc + (Number(r.values?.[col.key]) || 0), 0);
                }
            });
        }
        if (row.formulaId === 'crossTableTotal' && row.sourceTableId === '5.2.1_geographyWiseSales' && row.subTotalRowId === 'geo-1') {
             // This logic needs to be revisited, as it depends on external state
             // For now, we'll keep it simple or mock it. This highlights the need for a better state management solution (like a context or hook).
        }
    });

    return processedRows;
  }, [tableRows, table.columns, table.id]);


  const handleAddRow = (parentId?: string, group?: string) => {
    const newRow: TableRowData = { id: `manual-${Date.now()}` };
    newRow.values = {};
    table.columns.forEach(col => {
      newRow.values[col.key] = '';
    });
    
    newRow.canDelete = true;
    newRow.canHide = true;
    newRow.isManual = true;
    
    if (table.id === '5.2.4_manufacturingFacilityWiseSales') {
        const insertIndex = allRows.findIndex(r => r.id === 'fac-total');
        if (insertIndex !== -1) {
            const newRows = [...allRows];
            newRows.splice(insertIndex, 0, newRow);
            setTableRows(newRows);
        } else {
            setTableRows(prev => [...prev, newRow]);
        }
    } else {
         const insertIndex = allRows.findIndex(r => r.canAddBelow || r.formulaId === 'total' || r.formulaId === 'groupTotal' || r.formulaId === 'crossTableTotal');
        if (insertIndex !== -1) {
            const newRows = [...allRows];
            newRows.splice(insertIndex, 0, newRow);
            setTableRows(newRows);
        } else {
            setTableRows(prev => [...prev, newRow]);
        }
    }
  };

  const handleRowChange = (id: string, key: string, value: string) => {
    setTableRows(prev => prev.map(row => {
        if (row.id === id) {
            let updatedRow: TableRowData = { ...row };
             if (!updatedRow.values) updatedRow.values = {};
            
            const columnDef = table.columns.find(c => c.key === key);
            if (columnDef?.isYearColumn) {
                 updatedRow.values[key] = value;
            } else {
                 updatedRow[key] = value;
            }
            return updatedRow;
        }
        return row;
    }));
  }

  const handleRowAction = (id: string, action: 'hide' | 'delete') => {
    const isDeletion = action === 'delete';
    
    setTableRows(prev => prev.map(row => {
        if (row.id === id) {
            return { ...row, [action]: !(row[action]) };
        }
        return row;
    }));

    if (isDeletion) {
      toast({
        title: "Row deleted",
        description: "The row has been marked for deletion.",
        action: (
          <Button variant="secondary" onClick={() => handleUndoDelete(id)}>
            Undo
          </Button>
        ),
      });
    }
  };
  
  const handleConfirmDelete = () => {
    if (rowToDelete) {
      handleRowAction(rowToDelete, 'delete');
    }
    setRowToDelete(null);
  };

  const handleUndoDelete = (id: string) => {
    setTableRows(prev => prev.map(row => {
        if (row.id === id) {
            return { ...row, deleted: false };
        }
        return row;
    }));
    toast({
      title: "Row restored",
      description: "The row has been restored.",
    });
  };

  const hasNegativeValues = tableRows.some(row =>
    (table.negativeAsNMAttributeIds || []).includes(row.mappedAttributeId || '') &&
    table.columns.some(col => (row.values?.[col.key] as number) < 0)
  );

  const visibleRows = allRows.filter(row => !row.hidden && !row.deleted);
  
  let srNoCounter = 1;

  const renderRow = (row: TableRowData, level = 0) => {
    if (row.hidden || row.deleted) return null;

    const isParent = row.isParent;
    const children = isParent ? visibleRows.filter(child => child.parentId === row.id) : [];
    
    return (
      <React.Fragment key={row.id}>
        <TableRow className={cn(
            row.formulaId && 'font-bold',
            row.style?.backgroundColor,
            row.isParent && 'bg-muted/50 font-medium'
        )}>
            {table.columns.map(col => {
                const isFormulaField = row.formulaId || col.formulaId;
                const cellValue = row.values?.[col.key] ?? row[col.key];
                const isNM = (table.negativeAsNMAttributeIds || []).includes(row.mappedAttributeId || '') && (cellValue as number) < 0;
                
                let displayValue: any = cellValue;
                if(isNM) displayValue = 'NM';
                else if (col.type === 'number') displayValue = formatNumber(cellValue);
                else if (col.type === 'percent' || col.formulaId?.includes('Pct') || row.formulaId?.includes('Pct') || col.formulaId === 'share') displayValue = `${formatNumber(cellValue)}%`;

                const isEditable = !row.isFixed && (col.editable || row.editableLabel) && !isFormulaField;
                
                if (col.key === 'srNo') {
                  return <TableCell key={col.key} className="text-center">{row.isFixed ? '' : srNoCounter++}</TableCell>;
                }

                const fieldKey = ['name', 'region', 'therapy', 'brandName', 'particulars', 'location', 'productSegment', 'regApprovals', 'therapeuticSegment', 'creditRatings'].find(k => k === col.key);

                if (fieldKey) {
                    return (
                        <TableCell key={col.key} style={{ paddingLeft: `${1 + level * 1.5}rem` }} className={cn((row.isParent || row.formulaId) && 'font-bold', row.style?.italic && 'italic')}>
                          <div className='flex items-center gap-2'>
                           {row.canAddChild && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddRow(row.id, row.group)}><Plus className="h-4 w-4" /></Button>}
                           {isEditable ? (
                                <Input
                                    type='text'
                                    value={cellValue || ''}
                                    onChange={(e) => handleRowChange(row.id, col.key, e.target.value)}
                                    className="h-8"
                                />
                            ) : (
                                <span className={cn(row.formulaId && 'italic')}>{cellValue}</span>
                            )}
                          </div>
                        </TableCell>
                    );
                }
                
                return (
                <TableCell key={col.key} className={cn(isFormulaField && "italic", (row.isParent || row.parentId) && "py-1")}>
                    { isEditable ? (
                        <Input 
                            type={col.type === 'date' ? 'date' : 'text'}
                            value={col.type === 'date' && cellValue ? format(new Date(cellValue), 'yyyy-MM-dd') : (cellValue || '')}
                            onChange={(e) => handleRowChange(row.id, col.key, e.target.value)}
                            className="h-8"
                            placeholder={col.type === 'date' ? 'MM-YY' : undefined}
                        />
                    ) : (
                        <span className={cn(col.type === 'number' || col.type === 'percent' || col.formulaId?.includes('Pct') || row.formulaId?.includes('Pct') || col.formulaId === 'share' ? "text-right block" : "")}>{displayValue}</span>
                    )}
                </TableCell>
                )
            })}
             {(table.rows.some(r => r.canHide || r.canDelete) || table.rows.some(r => r.canAddChild) || table.rows.some(r => r.canAddBelow)) && (
              <TableCell>
                  <div className='flex'>
                      {row.canHide && (
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleRowAction(row.id, 'hide')}><EyeOff className="h-4 w-4 text-muted-foreground" /></Button>
                              </TooltipTrigger>
                              <TooltipContent><p>{row.hidden ? 'Show' : 'Hide'} Row</p></TooltipContent>
                          </Tooltip>
                      )}
                      {row.canDelete && (
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setRowToDelete(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Delete Row</p></TooltipContent>
                          </Tooltip>
                      )}
                  </div>
              </TableCell>
             )}
        </TableRow>
        {isParent && children.map(child => renderRow(child, level + 1))}
      </React.Fragment>
    )
  }

  return (
    <TooltipProvider>
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
              {table.ckcModuleUrl && <a href={table.ckcModuleUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" /> Navigate to CKC
                  </Button>
              </a>}
          </div>
        </div>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
                <TableRow>
                {table.columns.map(col => (
                     <TableHead key={col.key} className={cn(col.formulaId && "italic", col.style?.textAlign === 'right' && 'text-right')}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>{col.label}</div>
                            </TooltipTrigger>
                            {(table.tooltip || col.formulaId) && <TooltipContent>
                                {col.formulaId === 'share' && <p>Calculated as (Row Value / Total) * 100</p>}
                                {col.formulaId === 'yoy' && <p>Calculated as ((Current Year / Previous Year) - 1) * 100</p>}
                                {table.tooltip && <p>{table.tooltip}</p>}
                            </TooltipContent>}
                        </Tooltip>
                    </TableHead>
                ))}
                {(table.rows.some(r => r.canHide || r.canDelete) || table.rows.some(r => r.canAddChild) || table.rows.some(r => r.canAddBelow)) && <TableHead>Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {visibleRows.filter(r => !r.parentId).map(row => renderRow(row))}
            </TableBody>
          </Table>
        </div>
        {hasNegativeValues && (
          <p className="text-xs text-muted-foreground">NM – Not Meaningful</p>
        )}
        
        { table.rows.some(r => r.canAddBelow) && (
          <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => handleAddRow()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Row
              </Button>
          </div>
        )}
      </div>

       <AlertDialog open={!!rowToDelete} onOpenChange={(open) => !open && setRowToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this row?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be immediately undone, but you will have a 5-second window to restore the row.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRowToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
