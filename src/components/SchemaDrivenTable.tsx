
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

  const allColumns = React.useMemo(() => {
    const staticCols = schema.columns.filter(c => !c.isYearColumn && c.formula !== 'share' && c.formula !== 'yoy');
    const shareCol = schema.columns.find(c => c.formula === 'share');
    const yoyCol = schema.columns.find(c => c.formula === 'yoy');
    
    let combined: TTableColumnSchema[] = [];
    const regionCol = staticCols.find(c => c.key === 'region');
    if (regionCol) combined.push(regionCol);
    
    dynamicYearColumns.forEach(yearCol => {
      combined.push(yearCol);
      if (shareCol) {
        combined.push({ ...shareCol, key: `${shareCol.key}_${yearCol.key}`, label: shareCol.label });
      }
    });

    if (yoyCol) combined.push(yoyCol);
    
    const actionsCol = staticCols.find(c => c.key === 'actions');
    if(actionsCol) combined.push(actionsCol);

    return combined;
  }, [schema.columns, dynamicYearColumns]);
  
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
      if (row.canAddChild) {
        return <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddRow(row.id)}><Plus className="h-4 w-4" /></Button>;
      }
       if (row.canDelete) {
        return <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRowToDelete(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>;
      }
      return null;
    }
    
    if (column.isYearColumn) {
        const value = row.initialValues?.[column.key] || '';
        return row.isFixed ? formatNumber(value as number) : <Input value={value} onChange={e => handleCellChange(row.id, column.key, e.target.value)} className="h-8" />;
    }

    if(column.key === 'region') {
        const isEditable = !row.isFixed;
        return isEditable ? <Input value={row.label} onChange={e => handleCellChange(row.id, 'region', e.target.value)} className="h-8" /> : <span>{row.label}</span>
    }
    
    // Placeholder for formula columns
    if (column.type === 'formula') {
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
