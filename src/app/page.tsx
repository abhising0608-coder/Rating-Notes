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
import { Plus, Edit, CheckCircle, AlertTriangle, LogOut, Settings, BarChart, FileCheck, LayoutGrid } from 'lucide-react';
import { getRatingNotes } from '@/lib/data';
import type { RatingNote } from '@/types';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const statusConfig: { [key: string]: { icon: React.ReactNode, className: string } } = {
  'In Progress': { icon: <Edit className="h-4 w-4 mr-2" />, className: 'bg-blue-100 text-blue-800' },
  'Completed': { icon: <CheckCircle className="h-4 w-4 mr-2" />, className: 'bg-green-100 text-green-800' },
  'For Review': { icon: <AlertTriangle className="h-4 w-4 mr-2" />, className: 'bg-orange-100 text-orange-800' },
  'De-authorized': { icon: <AlertTriangle className="h-4 w-4 mr-2" />, className: 'bg-red-100 text-red-800' },
  'Authorized': { icon: <CheckCircle className="h-4 w-4 mr-2" />, className: 'bg-teal-100 text-teal-800' },
   'Saved': { icon: <CheckCircle className="h-4 w-4 mr-2" />, className: 'bg-gray-100 text-gray-800' },
};

export default async function Home() {
  const notes = await getRatingNotes();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');


  return (
      <main className="flex-1 p-8 bg-background">
        <header className="flex items-center justify-between mb-8">
            <div className='flex items-center gap-4'>
                <LayoutGrid className="h-6 w-6" />
                <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            </div>
             <Avatar className="h-9 w-9">
                {userAvatar && (
                <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />
                )}
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </header>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold font-headline">Rating Models</h2>
            <p className="text-muted-foreground">Here's a list of all rating models in the system.</p>
          </div>
          <Link href="/notes/new" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Model
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model Name</TableHead>
                  <TableHead>Model Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => {
                  const statusInfo = statusConfig[note.status] || { icon: null, className: '' };
                  return (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">{note.company.name}</TableCell>
                      <TableCell>
                          <Badge variant="secondary" className="bg-gray-200 text-gray-800">{note.template.subSector}</Badge>
                      </TableCell>
                       <TableCell className="text-muted-foreground">{note.company.subIndustry}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusInfo.className}>
                          {note.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(note.createdAt), 'dd-MM-yyyy')}</TableCell>
                      <TableCell>{note.createdBy}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/notes/${note.id}`} passHref>
                          <Button variant="ghost" size="sm">
                            ...
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
  );
}
