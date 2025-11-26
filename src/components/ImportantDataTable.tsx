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
import { getImportantDataTableById } from '@/lib/data';


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
  
 const getColumnTotal = useCallback((colKey: string, parentId?: string, rowsToSum: TableRowData[] = tableRows) => {
      return rowsToSum.reduce((sum, row) => {
          if (row.fixedLabel || row.deleted) return sum;
          if (parentId && row.parentId !== parentId) return sum;
          if (!parentId && row.parentId) return sum;
          const value = parseFloat(row[colKey]);
          return sum + (isNaN(value) ? 0 : value);
      }, 0);
  }, [tableRows]);

  const allRows = useMemo(() => {
    let processedRows = [...tableRows];
    
    processedRows = processedRows.map(row => {
        let newRow: TableRowData = { ...row };
        if(row.isParent) {
            table.columns.forEach(col => {
                if (col.isYearColumn && col.type === 'number') {
                    newRow[col.key] = getColumnTotal(col.key, row.id);
                }
            });
        }
        if (row.formulaId === 'total') {
            table.columns.forEach(col => {
                if (col.isYearColumn && col.type === 'number') {
                    newRow[col.key] = getColumnTotal(col.key);
                }
            });
        }
        if(row.formulaId === 'subtotal'){
            const children = tableRows.filter(r => r.parentId === row.id && !r.deleted);
            table.columns.forEach(col => {
                if (col.isYearColumn && col.type === 'number') {
                    newRow[col.key] = children.reduce((acc, child) => acc + (Number(child[col.key]) || 0), 0);
                }
            });
        }
        if (row.formulaId === 'groupTotal') {
            const groupRows = tableRows.filter(r => r.group === row.formulaGroup && !r.deleted);
            table.columns.forEach(col => {
                if (col.isYearColumn) {
                    newRow[col.key] = groupRows.reduce((acc, r) => acc + (Number(r[col.key]) || 0), 0);
                }
            });
        }
        if(row.formulaId === 'crossTableTotal' && row.sourceTableId) {
            const sourceTable = allTables.find(t => t.id === row.sourceTableId);
            if(sourceTable) {
                let total = 0;
                 sourceTable.rows.forEach(sourceRow => {
                    if (row.subTotalRowId && sourceRow.id !== row.subTotalRowId) return;
                    if (!row.subTotalRowId && sourceRow.formulaId === 'total') return;
                    
                    table.columns.forEach(col => {
                        if (col.isYearColumn && sourceRow[col.key]) {
                            total += Number(sourceRow[col.key]) || 0;
                        }
                    });
                });
                table.columns.forEach(col => {
                   if (col.isYearColumn) newRow[col.key] = total;
                });
            }
        }
        if (row.formulaId === 'groupTotalAsPctOfCrossTableTotal' && row.sourceTableId) {
            const groupTotalRow = processedRows.find(r => r.formulaId === 'groupTotal' && r.formulaGroup === row.formulaGroup);
            const crossTableTotalRow = processedRows.find(r => r.formulaId === 'crossTableTotal' && r.sourceTableId === row.sourceTableId && r.subTotalRowId === row.subTotalRowId);

            if (groupTotalRow && crossTableTotalRow) {
                table.columns.forEach(col => {
                    if (col.isYearColumn) {
                        const groupTotal = Number(groupTotalRow[col.key]) || 0;
                        const crossTableTotal = Number(crossTableTotalRow[col.key]) || 0;
                        newRow[col.key] = crossTableTotal !== 0 ? (groupTotal / crossTableTotal) * 100 : 0;
                    }
                });
            }
        }
        return newRow;
    });

    return processedRows.map(row => {
      let newRow: TableRowData = { ...row };
      table.columns.forEach(col => {
        if (col.formulaId === 'share') {
          const yearKey = col.key.replace('share', '').toLowerCase();
          const total = getColumnTotal(yearKey);
          const rowValue = parseFloat(newRow[yearKey]);
          if (total > 0 && !isNaN(rowValue)) {
            newRow[col.key] = ((rowValue / total) * 100);
          } else {
            newRow[col.key] = 0;
          }
        } else if (col.formulaId === 'yoy') {
            const currentYearKey = 'fy24';
            const prevYearKey = 'fy23';
            const currentVal = parseFloat(newRow[currentYearKey]);
            const prevVal = parseFloat(newRow[prevYearKey]);
            if (!isNaN(currentVal) && !isNaN(prevVal) && prevVal !== 0) {
                 newRow[col.key] = (((currentVal - prevVal) / prevVal) * 100);
            } else {
                 newRow[col.key] = 'N/A';
            }
        }
      });
      return newRow;
    });
  }, [tableRows, table.columns, getColumnTotal, allTables]);

  const handleAddRow = (parentId?: string, group?: string) => {
    if (table.id === '5.1_listManufacturingFacilities' && tableRows.filter(r => !r.deleted).length >= 200) {
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
    
    newRow.canDelete = true;
    newRow.canHide = true;
    newRow.isManual = true;
    
    if (parentId) {
      const parentRow = table.rows.find(r => r.id === parentId);
      newRow.parentId = parentId;
      newRow.group = group || parentRow?.group || 'others';
      newRow.editableLabel = true;

      const parentIndex = allRows.findIndex(r => r.id === parentId);
      const childRows = allRows.filter(r => r.parentId === parentId);
      const lastChildIndex = childRows.length > 0 ? allRows.findIndex(r => r.id === childRows[childRows.length - 1].id) : parentIndex;
      
      const newRows = [...allRows];
      newRows.splice(lastChildIndex + 1, 0, newRow);
      setTableRows(newRows);
    } else {
      const totalRowIndex = tableRows.findIndex(r => r.formulaId === 'total' || r.formulaId === 'groupTotal');
      if (totalRowIndex !== -1) {
        const newRows = [...tableRows];
        newRows.splice(totalRowIndex, 0, newRow);
        setTableRows(newRows);
      } else {
        setTableRows(prev => [...prev, newRow]);
      }
    }
  };

  const handleRowChange = (id: string, key: string, value: string) => {
    setTableRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row));
  }

  const handleRowAction = (id: string, action: 'hide' | 'delete') => {
    setTableRows(prev => prev.map(row => {
        if (row.id === id) {
            return { ...row, [action]: !(row[action]) };
        }
        return row;
    }));
  };

  const hasNegativeValues = tableRows.some(row =>
    (table.negativeAsNMAttributeIds || []).includes(row.mappedAttributeId || '') &&
    table.columns.some(col => (row[col.key] as number) < 0)
  );

  const visibleRows = allRows.filter(row => !row.hidden && !row.deleted);
  
  let srNoCounter = 1;

  const renderRow = (row: TableRowData, level = 0) => {
    if (row.hidden || row.deleted) return null;

    const isParent = row.isParent;
    const children = isParent ? visibleRows.filter(child => child.parentId === row.id) : [];

    return (
      <React.Fragment key={row.id}>
        <TableRow className={cn(row.formulaId === 'total' && 'bg-muted/80 font-bold', row.isParent && 'bg-muted/50 font-medium')}>
            {table.columns.map(col => {
                const cellValue = row[col.key];
                const isNM = (table.negativeAsNMAttributeIds || []).includes(row.mappedAttributeId || '') && (cellValue as number) < 0;
                
                let displayValue: any = cellValue;
                if(isNM) displayValue = 'NM';
                else if (col.type === 'number') displayValue = formatNumber(cellValue);
                else if (col.type === 'percent') displayValue = `${formatNumber(cellValue)}%`;

                const isEditable = (col.editable && !row.fixedLabel) || (row.editableLabel && col.key === 'region');
                
                if (col.key === 'srNo') {
                  return <TableCell key={col.key} className="text-center">{row.fixedLabel ? '' : srNoCounter++}</TableCell>;
                }

                if ((col.key === 'region' || col.key === 'therapy' || col.key === 'brandName') && row.parentId) {
                  return (
                    <TableCell key={col.key} style={{ paddingLeft: `${1 + level * 1.5}rem` }}>
                       {row.editableLabel ? (
                        <Input 
                            type='text'
                            value={displayValue || ''}
                            onChange={(e) => handleRowChange(row.id, col.key, e.target.value)}
                            className="h-8"
                        /> ) : (
                            <span>{displayValue}</span>
                        )}
                    </TableCell>
                  )
                }
                
                if ((col.key === 'region' || col.key === 'therapy' || col.key === 'brandName') && isParent) {
                   return (
                     <TableCell key={col.key} className="flex items-center gap-2">
                       {row.canAddChild && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddRow(row.id, row.group)}><Plus className="h-4 w-4" /></Button>}
                       <span>{displayValue}</span>
                     </TableCell>
                   )
                }

                return (
                <TableCell key={col.key} className={cn(col.formulaId && "italic", (row.isParent || row.parentId) && "py-1")}>
                    { isEditable ? (
                        <Input 
                            type={col.type === 'date' ? 'date' : 'text'}
                            value={col.type === 'date' && cellValue ? format(new Date(cellValue), 'yyyy-MM-dd') : (cellValue || '')}
                            onChange={(e) => handleRowChange(row.id, col.key, e.target.value)}
                            className="h-8"
                            placeholder={col.type === 'date' ? 'MM-YY' : undefined}
                        />
                    ) : (
                        <span className={cn(col.type === 'number' && "text-right block")}>{displayValue}</span>
                    )}
                </TableCell>
                )
            })}
             {(table.rows.some(r => r.canHide || r.canDelete) || table.rows.some(r => r.canAddChild)) && (
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
                                  <Button variant="ghost" size="icon" onClick={() => handleRowAction(row.id, 'delete')}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </TooltipTrigger>
                              <TooltipContent><p>{row.deleted ? 'Undo Delete' : 'Delete'} Row</p></TooltipContent>
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
                     <Tooltip key={col.key}>
                        <TooltipTrigger asChild>
                           <TableHead className={cn(col.formulaId && "italic")}>
                                <div>{col.label}</div>
                           </TableHead>
                        </TooltipTrigger>
                        {(table.tooltip || col.formulaId) && <TooltipContent>
                            {col.formulaId === 'share' && <p>Calculated as (Row Value / Total) * 100</p>}
                            {col.formulaId === 'yoy' && <p>Calculated as ((Current Year / Previous Year) - 1) * 100</p>}
                            {table.tooltip && <p>{table.tooltip}</p>}
                        </TooltipContent>}
                    </Tooltip>
                ))}
                {(table.rows.some(r => r.canHide || r.canDelete) || table.rows.some(r => r.canAddChild)) && <TableHead>Actions</TableHead>}
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
    </TooltipProvider>
  );
}
