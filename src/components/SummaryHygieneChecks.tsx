'use client';
import { useState } from 'react';
import type { SummaryHygieneChecksData } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableRow } from './ui/table';

type SummaryHygieneChecksProps = {
  initialData: SummaryHygieneChecksData;
  onUpdate: (data: SummaryHygieneChecksData) => void;
};

const options = ["Yes", "No", "Not Applicable"];
const stockExchanges = ["NSE", "BSE", "NSE Emerge", "BSE SME"];

export default function SummaryHygieneChecks({ initialData, onUpdate }: SummaryHygieneChecksProps) {
  const [data, setData] = useState(initialData);

  const handleUpdate = (updatedData: Partial<SummaryHygieneChecksData>) => {
    const newData = { ...data, ...updatedData };
    setData(newData);
    onUpdate(newData);
  };
  
  const handleDropdownChange = (field: keyof SummaryHygieneChecksData['negativeObservations'], value: string) => {
    const updatedObservations = { ...data.negativeObservations, [field]: value };
    handleUpdate({ negativeObservations: updatedObservations });
  };

  const handleInputChange = (field: keyof SummaryHygieneChecksData, value: string) => {
    handleUpdate({ [field]: value });
  };
  
  const handleListedOnChange = (exchange: string) => {
    const newListedOn = data.listedOn.includes(exchange)
      ? data.listedOn.filter(item => item !== exchange)
      : [...data.listedOn, exchange];
    handleUpdate({ listedOn: newListedOn });
  };

  return (
     <div className="space-y-3">
      <h3 className="font-semibold text-lg font-headline">Summary of Hygiene Checks</h3>
       <div className="border rounded-lg overflow-hidden">
        <Table>
            <TableBody>
                {Object.entries(data.negativeObservations).map(([key, value]) => (
                    <TableRow key={key}>
                        <TableCell className="font-medium bg-muted/50 w-1/3">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                        <TableCell>
                            <Select value={value} onValueChange={(v) => handleDropdownChange(key as any, v)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </TableCell>
                    </TableRow>
                ))}
                 <TableRow>
                    <TableCell className="font-medium bg-muted/50">Incorporation Date</TableCell>
                    <TableCell>
                        <Input
                            type="date"
                            value={data.incorporationDate}
                            onChange={(e) => handleInputChange("incorporationDate", e.target.value)}
                             className="h-8"
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium bg-muted/50">Nature of Business</TableCell>
                    <TableCell className="bg-muted/50 text-muted-foreground">{data.natureOfBusiness} (Auto-fetched)</TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium bg-muted/50">Number of Employees</TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            value={data.numEmployees}
                            onChange={(e) => handleInputChange("numEmployees", e.target.value)}
                             className="h-8"
                        />
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium bg-muted/50">Email ID</TableCell>
                    <TableCell>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                             className="h-8"
                        />
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium bg-muted/50">Website</TableCell>
                    <TableCell>
                        <Input
                            type="url"
                            value={data.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                             className="h-8"
                        />
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium bg-muted/50">Listed On (Equity Shares)</TableCell>
                    <TableCell>
                        <div className="flex items-center space-x-4">
                        {stockExchanges.map(exchange => (
                            <div key={exchange} className="flex items-center space-x-2">
                               <Checkbox
                                    id={`exchange-${exchange}`}
                                    checked={data.listedOn.includes(exchange)}
                                    onCheckedChange={() => handleListedOnChange(exchange)}
                                />
                                <Label htmlFor={`exchange-${exchange}`} className="font-normal">{exchange}</Label>
                            </div>
                        ))}
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
       </div>
    </div>
  );
};
