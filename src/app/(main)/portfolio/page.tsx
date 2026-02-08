
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCompanies } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { Company } from '@/types';

export default function PortfolioPage() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Portfolio - Pre-Committee</h1>
      <Card>
        <CardHeader>
          <CardTitle>Company List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.nseIndustry}</TableCell>
                  <TableCell>
                    <Link
                      href={`/portfolio/pre-committee/${company.id}?applicationId=app-001&ratingCycleId=rc-001`}
                      className="text-primary hover:underline"
                    >
                      View Company Info
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
