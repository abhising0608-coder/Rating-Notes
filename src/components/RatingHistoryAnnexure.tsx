'use client';
import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Download, Loader2 } from 'lucide-react';
import type { RatingHistoryItem } from '@/types';
import { getRatingHistory } from '@/lib/data';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface RatingHistoryAnnexureProps {
  noteId: string;
}

export default function RatingHistoryAnnexure({ noteId }: RatingHistoryAnnexureProps) {
  const [ratingHistory, setRatingHistory] = useState<RatingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const fetchHistory = (forceRefresh = false) => {
    setIsLoading(!forceRefresh);
    getRatingHistory(noteId, forceRefresh)
      .then(setRatingHistory)
      .finally(() => setIsLoading(false));
  };
  
  useEffect(() => {
    fetchHistory();
  }, [noteId]);

  const handleRefresh = () => {
    startRefreshTransition(() => {
       fetchHistory(true);
    });
  };

  const handleDownload = () => {
    const dataToExport = ratingHistory.map(item => ({
        'Instrument Name': item.instrumentName,
        'Rating Type': item.currentRatingType,
        ...item.history
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rating History');

    const fileName = `Rating_History_${noteId}_${format(new Date(), 'yyyyMMdd')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  const years = ratingHistory.length > 0 
    ? Object.keys(ratingHistory[0].history).sort((a, b) => parseInt(b) - parseInt(a)) 
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Annexure-2: Rating History for the Last 3 Years</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading rating history...</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instrument Name</TableHead>
                  <TableHead>Amount (₹ crore)</TableHead>
                  <TableHead>Ratings*</TableHead>
                   {years.map(year => <TableHead key={year}>{year}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ratingHistory.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.instrumentName}</TableCell>
                    <TableCell></TableCell> {/* Amount is blank as per requirement */}
                    <TableCell>{item.currentRatingType}</TableCell>
                    {years.map(year => <TableCell key={year}>{item.history[year] || '-'}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>*Issuer did not cooperate; based on best available information.</p>
            <p>*Long term/Short term.</p>
        </div>
      </CardContent>
    </Card>
  );
}
