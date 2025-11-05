
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PressReleaseAnnexureProps {
  entityName: string;
}

export default function PressReleaseAnnexure({ entityName }: PressReleaseAnnexureProps) {
  return (
    <div className="bg-card p-8 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <p className="font-semibold">Annexure-x</p>
        <p className="font-bold">Press Release</p>
        <h2 className="text-2xl font-bold text-accent mt-1">{entityName}</h2>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/90 hover:bg-primary/90 text-primary-foreground">
              <TableHead className="text-primary-foreground font-bold">Facilities/Instruments@</TableHead>
              <TableHead className="text-primary-foreground font-bold">Amount (₹ crore)</TableHead>
              <TableHead className="text-primary-foreground font-bold">Rating¹</TableHead>
              <TableHead className="text-primary-foreground font-bold">Rating Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Long-term bank facilities</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Short-term bank facilities</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Details of instruments/facilities in Annexure-1.</p>
    </div>
  );
}
