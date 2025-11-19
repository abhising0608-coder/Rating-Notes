'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Download, ExternalLink, Plus, Trash2 } from 'lucide-react';
import type { ImportantDataTable, TableRowData } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ImportantDataTableProps {
  table: ImportantDataTable;
  onRefresh: () => void;
}

export default function ImportantDataTableComponent({ table, onRefresh }: ImportantDataTableProps) {
  const [manualRows, setManualRows] = useState<TableRowData[]>([]);
  const { toast } = useToast();

  const handleAddRow = () => {
    if (manualRows.length >= 10) {
      toast({
        variant: 'destructive',
        title: 'Row Limit Reached',
        description: 'You can only add a maximum of 10 manual reference rows.',
      });
      return;
    }
    const newRow: TableRowData = { id: `manual-${Date.now()}` };
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

  const hasNegativeValues = table.rows.some(row =>
    table.columns.some(col => table.negativeAsNMAttributeIds.includes(row.mappedAttributeId) && row[col.key] < 0)
  );

  return (
    <div className="space-y-4">
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
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map(row => (
              <TableRow key={row.id}>
                {table.columns.map(col => (
                  <TableCell key={col.key}>
                    {table.negativeAsNMAttributeIds.includes(row.mappedAttributeId) && row[col.key] < 0
                      ? 'NM'
                      : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {hasNegativeValues && (
        <p className="text-xs text-muted-foreground">NM – Not Meaningful</p>
      )}

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
                    {manualRows.map(row => (
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
    </div>
  );
}
