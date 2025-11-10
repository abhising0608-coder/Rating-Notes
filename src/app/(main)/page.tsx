
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, CheckCircle, AlertTriangle } from 'lucide-react';
import { getRatingNotes } from '@/lib/data';
import type { RatingNote, User } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const statusConfig: { [key: string]: { icon: React.ReactNode, className: string } } = {
  'In Progress': { icon: <Edit className="h-4 w-4 mr-2" />, className: 'bg-blue-100 text-blue-800' },
  'Completed': { icon: <CheckCircle className="h-4 w-4 mr-2" />, className: 'bg-green-100 text-green-800' },
  'For Review': { icon: <AlertTriangle className="h-4 w-4 mr-2" />, className: 'bg-orange-100 text-orange-800' },
};

export default function Home() {
  const router = useRouter();
  const [notes, setNotes] = useState<RatingNote[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    async function fetchNotes() {
      const allNotes = await getRatingNotes();
      setNotes(allNotes);
    }
    fetchNotes();
  }, []);

  const notesInProgress = notes.filter(n => n.status === 'In Progress').length;
  const notesCompleted = notes.filter(n => n.status === 'Completed').length;
  const notesForReview = notes.filter(n => n.status === 'For Review').length;

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <p className="text-muted-foreground">
            An overview of your recent rating notes.
          </p>
        </div>
        <Link href="/notes/new" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Note
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes in Progress</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notesInProgress}</div>
            <p className="text-xs text-muted-foreground">Currently being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Notes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notesCompleted}</div>
            <p className="text-xs text-muted-foreground">Finished and finalized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes for Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notesForReview}</div>
            <p className="text-xs text-muted-foreground">Ready for QC or committee review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Rating Notes</CardTitle>
          <CardDescription>
            Here's a list of your most recently accessed rating notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.slice(0, 5).map((note) => {
                const statusInfo = statusConfig[note.status] || { icon: null, className: '' };
                return (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">{note.company.name}</TableCell>
                    <TableCell className="text-muted-foreground">{note.template.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusInfo.className}>
                        {statusInfo.icon}
                        {note.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(note.lastModified), 'dd MMM, yyyy')}</TableCell>
                    <TableCell className="text-right">
                       <Link href={`/notes/${note.id}`} passHref>
                        <Button variant="ghost" size="sm">
                          Open Note
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
