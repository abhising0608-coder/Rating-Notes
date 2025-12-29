
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CareEdgeLogo from '@/components/CareEdgeLogo';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, User, FileText, BarChart2 } from 'lucide-react';
import Link from 'next/link';

// Mock data for the dashboard
const ratingNotes = [
  { id: 'NOTE-001', company: 'Sample Industries Ltd', requestId: 'REQ-123', companyId: '1', date: '2024-07-28', sector: 'Manufacturing', status: 'Accepted', cycle: 'Review', analyst: 'Rahul Sharma', ho_ro: 'Mumbai HO' },
  { id: 'NOTE-002', company: 'Tech Solutions Inc.', requestId: 'REQ-124', companyId: '2', date: '2024-07-27', sector: 'Technology', status: 'Pending', cycle: 'Initial', analyst: 'Ananya Mehta', ho_ro: 'Bangalore RO' },
  { id: 'NOTE-003', company: 'General Goods Co.', requestId: 'REQ-125', companyId: '3', date: '2024-07-26', sector: 'Retail', status: 'In Review', cycle: 'Surveillance', analyst: 'Rahul Sharma', ho_ro: 'Delhi RO' },
  { id: 'NOTE-004', company: 'NFCC', requestId: 'REQ-126', companyId: '6', date: '2024-07-25', sector: 'NBFC', status: 'WIP', cycle: 'Initial', analyst: 'Ananya Mehta', ho_ro: 'Mumbai HO' },
];

const summaryCards = [
  { title: 'Not Allotted', value: 5, icon: <FileText className="h-5 w-5 text-muted-foreground" /> },
  { title: 'WIP', value: 12, icon: <User className="h-5 w-5 text-muted-foreground" /> },
  { title: 'Checking Pending', value: 3, icon: <FileText className="h-5 w-5 text-muted-foreground" /> },
  { title: 'CWIP', value: 2, icon: <BarChart2 className="h-5 w-5 text-muted-foreground" /> },
  { title: 'In Review', value: 4, icon: <FileText className="h-5 w-5 text-muted-foreground" /> },
];

export default function DashboardPage() {
  const router = useRouter();

  const handleInitiate = () => {
    router.push('/notes/new');
  };

  return (
    <div className="flex-1 flex flex-col">
       <header className="bg-card border-b p-4 print:hidden">
          <div className="flex justify-between items-center">
              <div>
                  <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Welcome, Rating Analyst</p>
              </div>
              <div className="flex items-center gap-4">
                  <Button onClick={handleInitiate}>
                      Initiate Rating Note
                  </Button>
              </div>
          </div>
       </header>

       <main className="flex-1 p-8 bg-background">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            {summaryCards.map(card => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
                <CardTitle>My Assignments</CardTitle>
                <CardDescription>List of companies assigned to you.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Cycle</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ratingNotes.map(note => (
                            <TableRow key={note.id}>
                                <TableCell>
                                    <Link href={`/notes/${note.companyId}`} className="text-primary hover:underline font-medium">
                                        {note.requestId}
                                    </Link>
                                </TableCell>
                                <TableCell>{note.company}</TableCell>
                                <TableCell>{note.date}</TableCell>
                                <TableCell><Badge variant="outline">{note.status}</Badge></TableCell>
                                <TableCell>{note.cycle}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => router.push(`/notes/${note.companyId}`)}>Open Note</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/portfolio/pre-committee/${note.companyId}?applicationId=app-001&ratingCycleId=rc-001`)}>
                                              View Portfolio Info
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Assign to Maker & Checker</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Reject Request</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
       </main>
    </div>
  );
}
