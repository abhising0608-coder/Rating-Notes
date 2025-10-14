

'use client';
import { useState, useEffect, useMemo } from 'react';
import NoteNavigation from '@/components/NoteNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCompanies, getPrefetchedPeers } from '@/lib/data';
import type { Company, PeerCompany } from '@/types';
import { Plus, Trash2, RefreshCw, Pencil, Check as CheckIcon, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const MultiSelect = ({
  options,
  selected,
  onChange,
  className,
  placeholder = 'Select...',
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${selected.length > 0 ? 'h-auto' : 'h-10'}`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              options
                .filter((option) => selected.includes(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(option.value);
                    }}
                  >
                    {option.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    );
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


export default function PeerComparisonPage() {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [prefetchedPeers, setPrefetchedPeers] = useState<PeerCompany[]>([]);
  const [selectedPrefetched, setSelectedPrefetched] = useState<string[]>([]);
  const [prefetchEnabled, setPrefetchEnabled] = useState('yes');
  
  const [queryResultPeers, setQueryResultPeers] = useState<PeerCompany[]>([]);
  const [selectedQueryResults, setSelectedQueryResults] = useState<string[]>([]);
  const [manualSelection, setManualSelection] = useState<string[]>([]);


  useEffect(() => {
    getCompanies().then(setAllCompanies);
    getPrefetchedPeers('1').then(peers => {
      setPrefetchedPeers(peers);
      const mockQueryResults = peers.filter(p => ['Torrent Pharma', 'Sun Pharma', 'Divis Labs', 'Cipla'].includes(p.companyName));
      setQueryResultPeers(mockQueryResults);
    });
  }, []);

  const manualSearchOptions = useMemo(() => {
    return allCompanies.map(c => ({ value: c.id, label: c.name }));
  }, [allCompanies]);

  const addManualSelectionToComparison = () => {
    const companiesToAdd = allCompanies.filter(c => manualSelection.includes(c.id));
     setSelectedCompanies(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const newCompanies = companiesToAdd.filter(c => !existingIds.has(c.id));
        return [...prev, ...newCompanies];
    });
    setManualSelection([]);
  };

  const removeCompany = (companyId: string) => {
    setSelectedCompanies(prev => prev.filter(c => c.id !== companyId));
  };
  
  const handleTogglePrefetched = (companyId: string) => {
    setSelectedPrefetched(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };
  
  const handleToggleAllPrefetched = (checked: boolean) => {
    if (checked) {
      setSelectedPrefetched(prefetchedPeers.map(p => p.id));
    } else {
      setSelectedPrefetched([]);
    }
  };

  const addSelectedPeersToComparison = () => {
    const peersToAdd = prefetchedPeers.filter(peer => selectedPrefetched.includes(peer.id));
    
    const companiesToAdd: Company[] = peersToAdd.map(peer => ({
      id: peer.id,
      name: peer.companyName,
      nseIndustry: peer.industry,
      subIndustry: peer.industryType,
      registeredOffice: ''
    }));

    setSelectedCompanies(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const newCompanies = companiesToAdd.filter(c => !existingIds.has(c.id));
        return [...prev, ...newCompanies];
    });
    
    setSelectedPrefetched([]);
  };

  const handleToggleQueryResult = (companyId: string) => {
    setSelectedQueryResults(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };
  
  const handleToggleAllQueryResults = (checked: boolean) => {
    if (checked) {
      setSelectedQueryResults(queryResultPeers.map(p => p.id));
    } else {
      setSelectedQueryResults([]);
    }
  };

  const addSelectedQueryResultsToComparison = () => {
    const peersToAdd = queryResultPeers.filter(peer => selectedQueryResults.includes(peer.id));
    
    const companiesToAdd: Company[] = peersToAdd.map(peer => ({
      id: peer.id,
      name: peer.companyName,
      nseIndustry: peer.industry,
      subIndustry: peer.industryType,
      registeredOffice: ''
    }));

    setSelectedCompanies(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const newCompanies = companiesToAdd.filter(c => !existingIds.has(c.id));
        return [...prev, ...newCompanies];
    });
    
    setSelectedQueryResults([]);
  };

  return (
    <div className="flex-1 flex flex-col">
       <NoteNavigation />
       <main className="flex-1 p-8 bg-background">
         <Card>
            <CardHeader>
                <CardTitle>Peer Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                    <h3 className="font-semibold">Prefetch Companies from Last Year Rating Note</h3>
                    <RadioGroup value={prefetchEnabled} onValueChange={setPrefetchEnabled} className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="prefetch-yes" />
                        <Label htmlFor="prefetch-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="prefetch-no" />
                        <Label htmlFor="prefetch-no">No</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-6">
                    <h3 className="font-semibold">Query Builder</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <Label>Sector</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <Label>Industry</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <Label>Basic Industry</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <Label>Ratings</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <Label>Result Type</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Consolidated" /></SelectTrigger></Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold">Peer Comparison Parameters</h3>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Parameter</TableHead>
                                    <TableHead>Min Range</TableHead>
                                    <TableHead>Max Range</TableHead>
                                    <TableHead>Operations</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                                    </TableCell>
                                    <TableCell><Input placeholder="Min" /></TableCell>
                                    <TableCell><Input placeholder="Max" /></TableCell>
                                    <TableCell>
                                        <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button variant="ghost" size="icon"><CheckIcon className="h-5 w-5 text-green-600" /></Button>
                                        <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Input value="Track Record (No. of Years)" readOnly /></TableCell>
                                    <TableCell><Input value="0" readOnly /></TableCell>
                                    <TableCell><Input value="100" readOnly /></TableCell>
                                    <TableCell><Input value="AND" readOnly /></TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Input value="% Share of Domestic Export" readOnly /></TableCell>
                                    <TableCell><Input value="0" readOnly /></TableCell>
                                    <TableCell><Input value="100" readOnly /></TableCell>
                                    <TableCell><Input value="OR" readOnly /></TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                     <div className="flex justify-end gap-2">
                        <Button>Show List</Button>
                        <Button variant="outline">Reset</Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold">Select Companies for Peer Comparison</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Checkbox /></TableHead>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>No. of Years</TableHead>
                                    <TableHead>Industry Type</TableHead>
                                    <TableHead>Industry</TableHead>
                                    <TableHead>Rating (If Available)</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {queryResultPeers.slice(0,4).map(peer => (
                                     <TableRow key={peer.id}>
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell>{peer.companyName}</TableCell>
                                        <TableCell><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select></TableCell>
                                        <TableCell>{peer.industryType}</TableCell>
                                        <TableCell>{peer.industry}</TableCell>
                                        <TableCell>{peer.rating}</TableCell>
                                        <TableCell><Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4" /></Button></TableCell>
                                     </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </CardContent>
         </Card>
        </main>
         <footer className="p-4 bg-card border-t flex justify-end gap-2">
            <Button>Compare</Button>
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
        </footer>
    </div>
  );
}
