
'use client';

import * as React from 'react';
import type { TTableSchema, TTableRowSchema, TTableColumnSchema } from '@/schema/geography-sales.schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';


interface SchemaDrivenTableProps {
  schema: TTableSchema;
}

// Helper to generate dynamic year columns based on the schema
const generateYearColumns = (schema: TTableSchema): TTableColumnSchema[] => {
  const { type, count } = schema.yearGeneration;
  if (type !== 'past') return [];

  const currentMonth = new Date().getMonth(); // 0-11
  const currentYear = new Date().getFullYear();
  // Fiscal year starts in April (month 3)
  const currentFiscalYear = currentMonth >= 3 ? currentYear + 1 : currentYear;

  return Array.from({ length: count }, (_, i) => {
    const year = currentFiscalYear - i;
    const yearLabel = `FY${year.toString().slice(-2)}`;
    return {
      key: yearLabel,
      label: yearLabel,
      type: 'number',
      editable: true,
      isYearColumn: true,
    };
  }).reverse();
};

const formatNumber = (num: number | string | undefined | null) => {
    if (num === undefined || num === null || num === '') return '0.00';
    const number = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(number)) return '0.00';
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};


export default function SchemaDrivenTable({ schema }: SchemaDrivenTableProps) {
  const [rows, setRows] = React.useState<TTableRowSchema[]>(schema.rows);
  const [rowToDelete, setRowToDelete] = React.useState<string | null>(null);
  const { toast } = useToast();

  const dynamicYearColumns = React.useMemo(() => generateYearColumns(schema), [schema]);
  
  const periodColumns = React.useMemo(() => {
    // Combine dynamic years with any static year-like columns from the schema
    const staticPeriodColumns = schema.columns.filter(c => c.isYearColumn && !dynamicYearColumns.some(dc => dc.key === c.key));
    return [...dynamicYearColumns, ...staticPeriodColumns];
  }, [schema.columns, dynamicYearColumns]);


  const allColumns = React.useMemo(() => {
    const staticCols = schema.columns.filter(c => !c.isYearColumn);
    let combined: TTableColumnSchema[] = [];
  
    const regionCol = staticCols.find(c => c.key === 'region');
    if (regionCol) combined.push(regionCol);
  
    periodColumns.forEach(yearCol => {
      combined.push(yearCol);
      const shareCol = staticCols.find(c => c.formula === 'share');
      if (shareCol) {
        combined.push({ ...shareCol, key: `${shareCol.key}_${yearCol.key}`, label: shareCol.label });
      }
    });
  
    const yoyCol = staticCols.find(c => c.formula === 'yoy');
    if (yoyCol) combined.push(yoyCol);
  
    const actionsCol = staticCols.find(c => c.key === 'actions');
    if (actionsCol) combined.push(actionsCol);
  
    return combined;
  }, [schema.columns, periodColumns]);
  
    const computedValues = React.useMemo(() => {
        const newComputations: { [rowId: string]: { [year: string]: number } } = {};

        // Calculate subtotals first
        rows.forEach(row => {
            if (row.formula === 'subtotal') {
                newComputations[row.id] = {};
                periodColumns.forEach(yearCol => {
                    const subtotal = rows
                        .filter(child => child.parentId === row.id)
                        .reduce((acc, child) => {
                            const value = child.initialValues?.[yearCol.key] || '0';
                            return acc + parseFloat(value as string);
                        }, 0);
                    newComputations[row.id][yearCol.key] = subtotal;
                });
            }
        });

        // Calculate totals based on subtotals and other rows
        rows.forEach(row => {
            if (row.formula === 'total') {
                newComputations[row.id] = {};
                periodColumns.forEach(yearCol => {
                    const domesticRow = rows.find(r => (r.label || '').toLowerCase().trim() === 'domestic');
                    const domesticValue = domesticRow ? parseFloat(domesticRow.initialValues?.[yearCol.key] as string || '0') : 0;
                    
                    const exportSubtotalRowId = rows.find(r => r.label.toLowerCase().trim() === 'export' && r.isParent)?.id;
                    const exportSubtotal = exportSubtotalRowId ? (newComputations[exportSubtotalRowId]?.[yearCol.key] || 0) : 0;
                    
                    newComputations[row.id][yearCol.key] = domesticValue + exportSubtotal;
                });
            }
        });


        return newComputations;
    }, [rows, periodColumns]);


  const handleAddRow = (parentId?: string) => {
    const newRow: TTableRowSchema = {
      id: `manual-${Date.now()}`,
      label: '',
      isParent: false,
      parentId: parentId,
      canDelete: true,
      initialValues: {},
    };
    setRows(prev => [...prev, newRow]);
  };
  
  const handleDelete = () => {
    if(rowToDelete) {
        setRows(prev => prev.filter(r => r.id !== rowToDelete));
        toast({
            title: "Row deleted",
            description: "The row has been successfully deleted.",
        });
    }
    setRowToDelete(null);
  }

  const handleCellChange = (rowId: string, columnKey: string, value: string) => {
    setRows(prevRows => prevRows.map(row => {
        if (row.id === rowId) {
            if (columnKey === 'region') {
                return { ...row, label: value };
            }
            const newValues = { ...row.initialValues, [columnKey]: value };
            return { ...row, initialValues: newValues };
        }
        return row;
    }));
  };

  const renderCellContent = (row: TTableRowSchema, column: TTableColumnSchema) => {
     if (column.type === 'actions') {
      const isDomesticRow = (row.label || '').toLowerCase().trim() === 'domestic';
      if (row.canAddChild) {
        return <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddRow(row.id)}><Plus className="h-4 w-4" /></Button>;
      }
       if (row.canDelete && !isDomesticRow) {
        return <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRowToDelete(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>;
      }
      return null;
    }
    
    if (column.isYearColumn) {
        if (row.formula) {
            const computedValue = computedValues[row.id]?.[column.key] || 0;
            return <span className="font-bold">{formatNumber(computedValue)}</span>;
        }
        const value = row.initialValues?.[column.key] || '';
        const isDomesticRow = (row.label || '').toLowerCase().trim() === 'domestic';
        const isEditable = (!row.isFixed && row.id !== 'geo-total') || isDomesticRow;
        return isEditable ? <Input value={value} onChange={e => handleCellChange(row.id, column.key, e.target.value)} className="h-8" /> : <span>{formatNumber(value as number)}</span>;
    }

    if(column.key === 'region') {
        const isDomesticRow = (row.label || '').toLowerCase().trim() === 'domestic';
        const isEditable = !row.isFixed || isDomesticRow;
        return isEditable ? <Input value={row.label} onChange={e => handleCellChange(row.id, 'region', e.target.value)} className="h-8" /> : <span>{row.label}</span>
    }
    
    // Placeholder for formula columns like % Share and Y-o-Y
    if (column.type === 'formula') {
       if (column.formula === 'share') {
            const yearKey = column.key.replace('share_', '');
            const totalSales = computedValues['geo-total']?.[yearKey] || 0;

            let rowValue = 0;
            if (row.formula) { // For subtotal/total rows
                rowValue = computedValues[row.id]?.[yearKey] || 0;
            } else { // For regular data rows
                rowValue = parseFloat(row.initialValues?.[yearKey] as string || '0');
            }

            if (totalSales === 0) {
                return <span className={cn(column.style?.italic && 'italic')}>-</span>;
            }
            
            const percentage = (rowValue / totalSales) * 100;
             if (row.formula === 'total') return <span className={cn(column.style?.italic && 'italic', 'font-bold')}>100.00%</span>
            return <span className={cn(column.style?.italic && 'italic')}>{percentage.toFixed(2)}%</span>;
        }
        if(column.formula === 'yoy') {
            if (periodColumns.length < 2) return <span className={cn(column.style?.italic && 'italic')}>-</span>;
            const currentYearKey = periodColumns[periodColumns.length - 1].key;
            const previousYearKey = periodColumns[periodColumns.length - 2].key;
            
            let currentValue = 0;
            let previousValue = 0;

            if (row.formula) {
                currentValue = computedValues[row.id]?.[currentYearKey] || 0;
                previousValue = computedValues[row.id]?.[previousYearKey] || 0;
            } else {
                currentValue = parseFloat(row.initialValues?.[currentYearKey] as string || '0');
                previousValue = parseFloat(row.initialValues?.[previousYearKey] as string || '0');
            }

            if (previousValue === 0) {
                return <span className={cn(column.style?.italic && 'italic')}>-</span>;
            }

            const yoy = ((currentValue - previousValue) / previousValue) * 100;
            return <span className={cn(column.style?.italic && 'italic')}>{yoy.toFixed(2)}%</span>;
        }
        return <span className={cn(column.style?.italic && 'italic')}>-</span>;
    }

    return row.label;
  };
  
  const renderRow = (row: TTableRowSchema, level = 0) => {
    const children = rows.filter(child => child.parentId === row.id);
    
    return (
      <React.Fragment key={row.id}>
        <TableRow style={row.style} className={cn(row.style?.bold && 'font-bold', row.style?.backgroundColor)}>
            {allColumns.map(col => (
                <TableCell key={col.key} style={{ paddingLeft: col.key === 'region' ? `${1 + level * 1.5}rem` : undefined }} className={cn('py-1', col.style?.textAlign === 'right' && 'text-right')}>
                    {renderCellContent(row, col)}
                </TableCell>
            ))}
        </TableRow>
        {children.map(child => renderRow(child, level + 1))}
      </React.Fragment>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {allColumns.map(col => <TableHead key={col.key} className={cn(col.style?.italic && "italic", col.style?.textAlign === 'right' && 'text-right')}>{col.label}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
             {rows.filter(r => !r.parentId).map(row => renderRow(row))}
          </TableBody>
        </Table>
      </div>
      {schema.developerGuidance && (
         <div className="text-xs text-red-500 italic space-y-1">
            {schema.developerGuidance.map((line, index) => <p key={index}>* {line}</p>)}
        </div>
      )}
       <AlertDialog open={!!rowToDelete} onOpenChange={(open) => !open && setRowToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the row. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRowToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
