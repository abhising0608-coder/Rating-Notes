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
  
 const getColumnTotal = useCallback((colKey: string, parentId?: string, rowsToSum: TableRowData[] = tableRows, group?: string) => {
      return rowsToSum.reduce((sum, row) => {
          if (row.fixedLabel || row.deleted) return sum;
          if (parentId && row.parentId !== parentId) return sum;
          if (!parentId && row.parentId) return sum;
           if (group && row.group !== group) return sum;

          const value = parseFloat(row.values?.[colKey]);
          return sum + (isNaN(value) ? 0 : value);
      }, 0);
  }, [tableRows]);

  const allRows = useMemo(() => {
    let processedRows = [...tableRows];
    
    processedRows = processedRows.map(row => {
        let newRow: TableRowData = { ...row };
        if (!newRow.values) newRow.values = {};
        if(row.formulaId === 'subtotal'){
            const children = tableRows.filter(r => r.parentId === row.id && !r.deleted);
            table.columns.forEach(col => {
                if (col.isYearColumn) {
                    newRow.values[col.key] = children.reduce((acc, child) => acc + (Number(child.values?.[col.key]) || 0), 0);
                }
            });
        }
        if (row.formulaId === 'groupTotal') {
            const groupRows = tableRows.filter(r => r.group === row.formulaGroup && !r.deleted);
            table.columns.forEach(col => {
                if (col.isYearColumn) {
                    newRow.values[col.key] = groupRows.reduce((acc, r) => acc + (Number(r.values?.[col.key]) || 0), 0);
                }
            });
        }
        if(row.formulaId === 'total'){
            table.columns.forEach(col => {
                if(col.isYearColumn) {
                    newRow.values[col.key] = getColumnTotal(col.key, undefined, tableRows);
                }
            })
        }
        if(row.formulaId === 'totalRD'){
             table.columns.forEach(col => {
                if (col.isYearColumn) {
                    const capital = tableRows.find(r => r.id === 'rd-1')?.values?.[col.key] || 0;
                    const recurring = tableRows.find(r => r.id === 'rd-2')?.values?.[col.key] || 0;
                    newRow.values[col.key] = Number(capital) + Number(recurring);
                }
            });
        }
        return newRow;
    });

    return processedRows.map(row => {
      let newRow = { ...row };
      if (!newRow.values) newRow.values = {};
       if(row.formulaId === 'crossTableTotal' && row.sourceTableId) {
            const sourceTable = allTables.find(t => t.id === row.sourceTableId);
            if (sourceTable) {
                const sourceRows = sourceTable.rows.filter(r => !r.parentId);
                table.columns.forEach(col => {
                    if(col.isYearColumn) {
                         const total = sourceRows.reduce((acc, sr) => acc + (Number(sr.values?.[col.key]) || 0), 0);
                        newRow.values[col.key] = total;
                    }
                });
            }
        }
        if (row.formulaId === 'groupTotalAsPctOfCrossTableTotal' && row.sourceTableId) {
            const groupTotalRow = processedRows.find(r => r.formulaId === 'groupTotal' && r.formulaGroup === row.formulaGroup);
            const crossTableTotalRow = processedRows.find(r => r.formulaId === 'crossTableTotal' && r.sourceTableId === row.sourceTableId && r.subTotalRowId === row.subTotalRowId);
            
            if (groupTotalRow && crossTableTotalRow) {
                table.columns.forEach(col => {
                    if (col.isYearColumn) {
                        const groupTotal = Number(groupTotalRow.values?.[col.key]) || 0;
                        const crossTableTotal = Number(crossTableTotalRow.values?.[col.key]) || 0;
                        newRow.values[col.key] = crossTableTotal !== 0 ? (groupTotal / crossTableTotal) * 100 : 0;
                    }
                });
            }
        }
        if(row.formulaId === 'pctOfNetSales'){
            const totalRDRow = processedRows.find(r => r.formulaId === 'totalRD');
            const geographyTable = allTables.find(t => t.id === '5.2.1_geographyWiseSales');
            if (totalRDRow && geographyTable) {
                table.columns.forEach(col => {
                    if (col.isYearColumn) {
                        const totalRD = Number(totalRDRow.values?.[col.key]) || 0;
                        const netSales = geographyTable.rows
                            .filter(r => !r.isParent && !r.parentId && !r.formulaId)
                            .reduce((sum, r) => sum + (Number(r.values?.[col.key]) || 0), 0);
                        
                        newRow.values[col.key] = netSales > 0 ? (totalRD / netSales) * 100 : 0;
                    }
                });
            }
        }

      table.columns.forEach(col => {
        if (col.formulaId === 'share') {
          const yearKey = col.key.replace('share', '').toLowerCase();
          const total = getColumnTotal(yearKey, undefined, processedRows);
          const rowValue = parseFloat(newRow.values[yearKey]);
          if (total > 0 && !isNaN(rowValue)) {
            newRow.values[col.key] = ((rowValue / total) * 100);
          } else {
            newRow.values[col.key] = 0;
          }
        } else if (col.formulaId === 'yoy') {
            const currentYearKey = 'fy24';
            const prevYearKey = 'fy23';
            const currentVal = parseFloat(newRow.values[currentYearKey]);
            const prevVal = parseFloat(newRow.values[prevYearKey]);
            if (!isNaN(currentVal) && !isNaN(prevVal) && prevVal !== 0) {
                 newRow.values[col.key] = (((currentVal - prevVal) / prevVal) * 100);
            } else {
                 newRow.values[col.key] = 'N/A';
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
    newRow.values = {};
    table.columns.forEach(col => {
      newRow.values[col.key] = '';
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
       const insertIndex = tableRows.findIndex(r => r.canAddBelow || r.formulaId === 'total' || r.formulaId === 'groupTotal');
      if (insertIndex !== -1) {
        const newRows = [...tableRows];
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
            if (['name', 'region', 'therapy', 'brandName', 'particulars'].includes(key)) {
                updatedRow[key] = value;
            } else {
                updatedRow.values[key] = value;
            }
            return updatedRow;
        }
        return row;
    }));
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
        <TableRow className={cn(row.formulaId === 'total' || row.formulaId === 'totalRD' || row.formulaId === 'pctOfNetSales' && 'bg-muted/80 font-bold', row.isParent && 'bg-muted/50 font-medium')}>
            {table.columns.map(col => {
                const isFormulaField = row.formulaId || col.formulaId;
                const cellValue = row.values?.[col.key] ?? row[col.key];
                const isNM = (table.negativeAsNMAttributeIds || []).includes(row.mappedAttributeId || '') && (cellValue as number) < 0;
                
                let displayValue: any = cellValue;
                if(isNM) displayValue = 'NM';
                else if (col.type === 'number') displayValue = formatNumber(cellValue);
                else if (col.type === 'percent') displayValue = `${formatNumber(cellValue)}%`;

                const isEditable = !row.fixedLabel && (col.editable || row.editableLabel) && !isFormulaField;
                
                if (col.key === 'srNo') {
                  return <TableCell key={col.key} className="text-center">{row.fixedLabel ? '' : srNoCounter++}</TableCell>;
                }

                if (['name', 'region', 'therapy', 'brandName', 'particulars'].includes(col.key)) {
                    return (
                        <TableCell key={col.key} style={{ paddingLeft: `${1 + level * 1.5}rem` }}>
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
                                <span>{cellValue}</span>
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
                        <span className={cn(col.type === 'number' || col.type === 'percent' ? "text-right block" : "")}>{displayValue}</span>
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
                                {col.label}
                           </TableHead>
                        </TooltipTrigger>
                        {(table.tooltip || col.formulaId) && <TooltipContent>
                            {col.formulaId === 'share' && <p>Calculated as (Row Value / Total) * 100</p>}
                            {col.formulaId === 'yoy' && <p>Calculated as ((Current Year / Previous Year) - 1) * 100</p>}
                            {table.tooltip && <p>{table.tooltip}</p>}
                        </TooltipContent>}
                    </Tooltip>
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
    </TooltipProvider>
  );
}
