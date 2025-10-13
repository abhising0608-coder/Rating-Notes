import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import Header from '@/components/Header';
import { getRatingNotes } from '@/lib/data';

export default async function Home() {
  const notes = await getRatingNotes();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-headline">Rating Notes</h1>
          <Button>
            <Plus className="mr-2" /> Create New Note
          </Button>
        </div>

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
                  <FileText className="text-primary" />
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
