
'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Download, ExternalLink, Plus, Trash2 } from 'lucide-react';
import type { ImportantDataTable, TableRowData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ImportantDataTableProps {
  table: ImportantDataTable;
  onRefresh: () => void;
}

export default function ImportantDataTableComponent({ table, onRefresh }: ImportantDataTableProps) {
  const [manualRows, setManualRows] = useState<TableRowData[]>([]);
  const { toast } = useToast();

  const handleAddRow = () => {
    const manualRowsCount = manualRows.filter(r => r.isManual).length;
    if (manualRowsCount >= 10) {
      toast({
        variant: 'destructive',
        title: 'Row Limit Reached',
        description: 'You can only add a maximum of 10 manual reference rows.',
      });
      return;
    }
    const newRow: TableRowData = { id: `manual-${Date.now()}`, isManual: true };
    table.columns.forEach(col => {
      newRow[col.key] = '';
    });
    setManualRows(prev => [...prev, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    setManualRows(prev => prev.filter(row => row.id !== id));
  };
  
  const handleManualRowChange = (id: string, key: string, value: string) => {
    setManualRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row));
    // Here you would call a debounced function to save the change
  }
  
  const allRows = useMemo(() => {
    const dbRows = table.rows || [];
    const combined = [...dbRows];
    
    // For specific tables, handle dynamic rows differently
    if (table.id === '5.2.1_geographyWiseSales') {
        const exportIndex = combined.findIndex(r => r.id === 'geo-2');
        if (exportIndex !== -1) {
            const dynamicRows = manualRows.filter(r => r.isManual);
            combined.splice(exportIndex + 1, 0, ...dynamicRows);
        }
    } else {
        // Default behavior for other tables, e.g., reference tables
    }
    
    return combined;
  }, [table.rows, manualRows, table.id]);


  const hasNegativeValues = table.rows.some(row =>
    table.columns.some(col => table.negativeAsNMAttributeIds.includes(row.mappedAttributeId || '') && (row[col.key] as number) < 0)
  );

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
        <TooltipProvider>
            <Table>
            <TableHeader>
                <TableRow>
                    {table.columns.map(col => (
                    <Tooltip key={col.key}>
                        <TooltipTrigger asChild>
                        <TableHead>{col.label}</TableHead>
                        </TooltipTrigger>
                        {table.tooltip && <TooltipContent>{table.tooltip}</TooltipContent>}
                    </Tooltip>
                    ))}
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allRows.map(row => (
                <TableRow key={row.id}>
                    {table.columns.map(col => (
                    <TableCell key={col.key}>
                        { (row.isManual || (col.editable && !row.fixedLabel)) ? (
                        <Input 
                                value={row[col.key] || ''} 
                                onChange={(e) => handleManualRowChange(row.id, col.key, e.target.value)}
                                className="h-8"
                            />
                        ) : table.negativeAsNMAttributeIds.includes(row.mappedAttributeId || '') && (row[col.key] as number) < 0 ? 'NM'
                        : row[col.key]}
                    </TableCell>
                    ))}
                    <TableCell>
                        {row.canAddBelow && <Button variant="ghost" size="icon" onClick={handleAddRow}><Plus className="h-4 w-4" /></Button>}
                        {row.canDelete && <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TooltipProvider>
      </div>
      {hasNegativeValues && (
        <p className="text-xs text-muted-foreground">NM – Not Meaningful</p>
      )}

      { table.id !== '5.1_listManufacturingFacilities' && table.id !== '5.2.1_geographyWiseSales' && (
        <div className="space-y-4">
            <h5 className="font-semibold">Reference Table (Manual Rows)</h5>
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleAddRow}>
                    <Plus className="mr-2 h-4 w-4" /> Add Row
                </Button>
            </div>
            <div className="border rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {table.columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {manualRows.filter(r => r.isManual).map(row => (
                            <TableRow key={row.id}>
                                {table.columns.map(col => (
                                    <TableCell key={col.key}>
                                        <Input 
                                            value={row[col.key]} 
                                            onChange={(e) => handleManualRowChange(row.id, col.key, e.target.value)}
                                            className="h-8"
                                        />
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(row.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
      )}
    </div>
  );
}
