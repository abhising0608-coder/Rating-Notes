import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button }from '@/components/ui/button';
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
import Header from '@/components/Header';
import { getRatingNotes } from '@/lib/data';
import type { RatingNote } from '@/types';
import { format } from 'date-fns';

const statusConfig: { [key: string]: { icon: React.ReactNode, className: string } } = {
  'In Progress': { icon: <Edit className="h-4 w-4 mr-2" />, className: 'bg-yellow-100 text-yellow-800' },
  'Completed': { icon: <CheckCircle className="h-4 w-4 mr-2" />, className: 'bg-green-100 text-green-800' },
  'For Review': { icon: <AlertTriangle className="h-4 w-4 mr-2" />, className: 'bg-orange-100 text-orange-800' },
};


const DashboardCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">notes currently in this state</p>
    </CardContent>
  </Card>
)

export default async function Home() {
  const notes = await getRatingNotes();

  const notesInProgress = notes.filter(n => n.status === 'In Progress').length;
  const completedNotes = notes.filter(n => n.status === 'Completed').length;
  const reviewNotes = notes.filter(n => n.status === 'For Review').length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <Link href="/notes/new" passHref>
            <Button>
              <Plus className="mr-2" /> Create New Note
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <DashboardCard title="Notes in Progress" value={notesInProgress} icon={<Edit className="h-5 w-5 text-yellow-500" />} />
          <DashboardCard title="Completed Notes" value={completedNotes} icon={<CheckCircle className="h-5 w-5 text-green-500" />} />
          <DashboardCard title="Notes for Review" value={reviewNotes} icon={<AlertTriangle className="h-5 w-5 text-orange-500" />} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rating Notes</CardTitle>
            <CardDescription>An overview of all rating notes you have access to.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Primary Analyst</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => {
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
                      <TableCell>{format(new Date(note.createdAt), 'PP')}</TableCell>
                      <TableCell>{format(new Date(note.lastModified), 'PP')}</TableCell>
                      <TableCell>{note.analysts[0]}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/notes/${note.id}`} passHref>
                          <Button variant="outline" size="sm">
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
      </main>
    </div>
  );
}
