
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
import { Plus, Edit, CheckCircle, AlertTriangle, MoreHorizontal, ArrowUpDown, Search, Calendar, ChevronDown } from 'lucide-react';
import { getRatingNotes } from '@/lib/data';
import type { RatingNote, User } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';


const statusConfig: { [key: string]: { icon: React.ReactNode, className: string } } = {
  'In Progress': { icon: <Edit className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
  'Completed': { icon: <CheckCircle className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
  'For Review': { icon: <AlertTriangle className="h-3 w-3" />, className: 'bg-orange-100 text-orange-800' },
  'Draft': { icon: <Edit className="h-3 w-3" />, className: 'bg-gray-200 text-gray-800' },
  'Sent to RCM': { icon: <CheckCircle className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
};


export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<RatingNote[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RatingNote | 'noteName'; direction: 'ascending' | 'descending' } | null>({ key: 'createdOn', direction: 'descending' });
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

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
      setLastRefreshed(new Date());
    }
    fetchNotes();
  }, []);

  const sortedNotes = useMemo(() => {
    let sortableItems = [...notes];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'noteName') {
          aValue = a.noteName;
          bValue = b.noteName;
        } else if (sortConfig.key === 'createdOn') {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        } else {
          aValue = a[sortConfig.key as keyof RatingNote];
          bValue = b[sortConfig.key as keyof RatingNote];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [notes, sortConfig]);
  
  const requestSort = (key: keyof RatingNote | 'noteName') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (!user) {
    return null; // or a loading spinner
  }

  const FilterBar = () => (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Filter by note name..." className="pl-10 rounded-full" />
      </div>
      <Select>
        <SelectTrigger className="w-[180px] rounded-full">
            <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="in-progress">In-progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="sent-to-rcm">Sent to RCM</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px] rounded-full">
            <SelectValue placeholder="Note Type" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="revalidation">Revalidation</SelectItem>
            <SelectItem value="representation">Representation</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="inc">INC</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px] rounded-full">
            <SelectValue placeholder="Sector" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="bfsi">BFSI</SelectItem>
            <SelectItem value="infra">Infra</SelectItem>
            <SelectItem value="others">Others</SelectItem>
        </SelectContent>
      </Select>
       <Select>
        <SelectTrigger className="w-[180px] rounded-full">
            <SelectValue placeholder="Creator" />
        </SelectTrigger>
        <SelectContent>
            {/* This would be populated dynamically */}
            <SelectItem value="analyst1">Analyst 1</SelectItem>
            <SelectItem value="analyst2">Analyst 2</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
          <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal rounded-full", !notes && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Date Range</span>
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent mode="range" numberOfMonths={2} />
          </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="container mx-auto p-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold font-headline">Rating Notes</h1>
          <p className="text-sm text-muted-foreground">
            Here’s a list of all rating notes prepared in the system.
          </p>
        </div>
        <div className="flex items-center gap-4">
             <p className="text-xs text-muted-foreground">Last Refreshed: {format(lastRefreshed, 'PPpp')}</p>
             <Link href="/notes/new" passHref>
                <Button className="bg-[#0F766E] hover:bg-[#0D635B] rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Create New Rating Note
                </Button>
            </Link>
        </div>
      </div>
      
       <Card className="mt-4">
        <CardContent className="p-0">
            <div className="p-4">
               <FilterBar />
            </div>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('noteName')} className="cursor-pointer">
                    <div className="flex items-center">
                        Note Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                </TableHead>
                <TableHead>Template Type</TableHead>
                <TableHead>Sector / Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead onClick={() => requestSort('createdOn')} className="cursor-pointer">
                    <div className="flex items-center">
                        Created On <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                </TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedNotes.map((note) => {
                const statusInfo = statusConfig[note.status] || { icon: <AlertTriangle className="h-3 w-3" />, className: 'bg-gray-200 text-gray-800' };
                const templateType = note.template.isAgnostic ? 'Sector Agnostic' : 'Sectorial';
                return (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">
                        <Link href={`/notes/${note.id}`} className="text-primary hover:underline">{note.noteName}</Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={templateType === 'Sectorial' ? "secondary" : "outline"} className={templateType === 'Sectorial' ? 'bg-teal-100 text-teal-800' : ''}>
                        {templateType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{note.template.sector}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-full px-3 py-1 text-xs font-normal ${statusInfo.className}`}>
                        {statusInfo.icon}
                        <span className="ml-1.5">{note.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(note.createdAt), 'dd-MM-yyyy')}</TableCell>
                    <TableCell>{note.createdBy}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/notes/${note.id}`)}>View</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
            Showing 1 to {Math.min(10, notes.length)} of {notes.length} notes.
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
