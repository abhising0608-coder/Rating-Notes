import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckCircle, Edit, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import { getRatingNotes } from '@/lib/data';
import type { RatingNote } from '@/types';

const statusIcons: { [key: string]: React.ReactNode } = {
  'In Progress': <Edit className="h-6 w-6 text-yellow-500" />,
  'Completed': <CheckCircle className="h-6 w-6 text-green-500" />,
  'For Review': <AlertTriangle className="h-6 w-6 text-orange-500" />,
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
          <DashboardCard title="Notes in Progress" value={notesInProgress} icon={statusIcons['In Progress']} />
          <DashboardCard title="Completed Notes" value={completedNotes} icon={statusIcons['Completed']} />
          <DashboardCard title="Notes for Review" value={reviewNotes} icon={statusIcons['For Review']} />
        </div>

        <h2 className="text-2xl font-bold font-headline mb-4">Recent Rating Notes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-xl">
                      {note.company.name}
                    </CardTitle>
                    <CardDescription>
                      Created on: {new Date(note.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {statusIcons[note.status] || <FileText className="text-primary" />}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Status: <span className="font-semibold text-foreground">{note.status}</span>
                </p>
                <Link href={`/notes/${note.id}`} passHref>
                  <Button variant="outline" className="w-full">
                    Open Note
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
