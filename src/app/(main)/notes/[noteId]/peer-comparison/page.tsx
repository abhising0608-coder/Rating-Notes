'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import NoteNavigation from '@/components/NoteNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCompanies, getPrefetchedPeers } from '@/lib/data';
import type { Company, PeerCompany } from '@/types';
import { Plus, Trash2, RefreshCw, Check as CheckIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function PeerComparisonPage() {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [prefetchedPeers, setPrefetchedPeers] = useState<PeerCompany[]>([]);
  const [selectedPrefetched, setSelectedPrefetched] = useState<string[]>([]);
  const [prefetchEnabled, setPrefetchEnabled] = useState('yes');
  
  // Mock data for query results, assuming these come from running the query
  const [queryResultPeers, setQueryResultPeers] = useState<PeerCompany[]>([]);
  const [selectedQueryResults, setSelectedQueryResults] = useState<string[]>([]);


  useEffect(() => {
    getCompanies().then(setAllCompanies);
    // Assuming noteId '1' for fetching peers. In a real app, this would be dynamic.
    getPrefetchedPeers('1').then(peers => {
      setPrefetchedPeers(peers);
      // Also using prefetched peers as mock query results for now
      setQueryResultPeers(peers);
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return allCompanies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedCompanies.some(sc => sc.id === company.id)
    );
  }, [searchQuery, allCompanies, selectedCompanies]);

  const addCompany = (company: Company) => {
    setSelectedCompanies(prev => [...prev, company]);
    setSearchQuery('');
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
    
    // In a real app, you might need to fetch full Company objects
    // For this mock, we'll create Company-like objects from the PeerCompany data.
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
    
    // Clear selection after adding
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
            <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Pre-fetched Companies from Last Rating Note</AccordionTrigger>
                        <AccordionContent>
                           <div className="space-y-4">
                                <RadioGroup value={prefetchEnabled} onValueChange={setPrefetchEnabled} className="flex items-center gap-4">
                                  <Label className="font-medium">Prefetch Companies from Last Year Rating Note</Label>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="prefetch-yes" />
                                    <Label htmlFor="prefetch-yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="prefetch-no" />
                                    <Label htmlFor="prefetch-no">No</Label>
                                  </div>
                                </RadioGroup>
                               {prefetchEnabled === 'yes' && (
                                   <>
                                       <div className="border rounded-lg overflow-hidden">
                                           <Table>
                                               <TableHeader>
                                                   <TableRow>
                                                        <TableHead className="w-[50px]">
                                                           <Checkbox
                                                                checked={selectedPrefetched.length > 0 && selectedPrefetched.length === prefetchedPeers.length}
                                                                onCheckedChange={handleToggleAllPrefetched}
                                                                aria-label="Select all pre-fetched companies"
                                                            />
                                                        </TableHead>
                                                        <TableHead>Company Name</TableHead>
                                                   </TableRow>
                                               </TableHeader>
                                               <TableBody>
                                                   {prefetchedPeers.map(peer => (
                                                       <TableRow key={peer.id}>
                                                           <TableCell>
                                                               <Checkbox
                                                                    checked={selectedPrefetched.includes(peer.id)}
                                                                    onCheckedChange={() => handleTogglePrefetched(peer.id)}
                                                                    aria-label={`Select ${peer.companyName}`}
                                                               />
                                                           </TableCell>
                                                           <TableCell>{peer.companyName}</TableCell>
                                                       </TableRow>
                                                   ))}
                                               </TableBody>
                                           </Table>
                                       </div>
                                       <div className="flex justify-end">
                                           <Button onClick={addSelectedPeersToComparison} disabled={selectedPrefetched.length === 0}>
                                               Add for Comparison
                                           </Button>
                                       </div>
                                   </>
                               )}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Query Builder to Search the Companies in the DB</AccordionTrigger>
                        <AccordionContent>
                           <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <Table>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="font-medium w-1/3">Sector</TableCell>
                                      <TableCell>
                                        <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                                      </TableCell>
                                    </TableRow>
                                     <TableRow>
                                      <TableCell className="font-medium">Industry</TableCell>
                                      <TableCell>
                                        <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                                      </TableCell>
                                    </TableRow>
                                     <TableRow>
                                      <TableCell className="font-medium">Basic Industry</TableCell>
                                      <TableCell>
                                        <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                                <Table>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="font-medium w-1/3">Ratings</TableCell>
                                      <TableCell>
                                         <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></Select>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="font-medium">Peer Comparison Parameters</h4>
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[25%]">Parameter</TableHead>
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
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                             <div className="flex justify-end gap-2">
                                <Button>Run Query</Button>
                                <Button variant="outline">Reset</Button>
                            </div>
                            
                             <div className="mt-6 space-y-4">
                                <div className="border rounded-lg overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[50px]">
                                          <Checkbox
                                            checked={selectedQueryResults.length > 0 && selectedQueryResults.length === queryResultPeers.length}
                                            onCheckedChange={handleToggleAllQueryResults}
                                            aria-label="Select all query results"
                                          />
                                        </TableHead>
                                        <TableHead>Company Name</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {queryResultPeers.map(peer => (
                                        <TableRow key={peer.id}>
                                          <TableCell>
                                            <Checkbox
                                              checked={selectedQueryResults.includes(peer.id)}
                                              onCheckedChange={() => handleToggleQueryResult(peer.id)}
                                              aria-label={`Select ${peer.companyName}`}
                                            />
                                          </TableCell>
                                          <TableCell>{peer.companyName}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                <div className="flex justify-end">
                                  <Button onClick={addSelectedQueryResultsToComparison} disabled={selectedQueryResults.length === 0}>
                                    Add for Comparison
                                  </Button>
                                </div>
                              </div>

                           </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Manual Search of Companies</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <Input 
                              placeholder="Type to search for a company..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchResults.length > 0 && (
                              <ul className="border rounded-md max-h-60 overflow-y-auto">
                                {searchResults.map(company => (
                                  <li key={company.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                                    <span>{company.name}</span>
                                    <Button size="sm" variant="ghost" onClick={() => addCompany(company)}>
                                      <Plus className="mr-2 h-4 w-4"/> Add
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>List of Selected Companies for Peer Comparison</AccordionTrigger>
                        <AccordionContent>
                           {selectedCompanies.length > 0 ? (
                              <ul className="space-y-2">
                                {selectedCompanies.map(company => (
                                   <li key={company.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                                    <span>{company.name}</span>
                                    <Button size="sm" variant="destructive" onClick={() => removeCompany(company.id)}>
                                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                           ) : (
                            <p className="text-muted-foreground text-center">No companies selected yet.</p>
                           )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
         </Card>
        </main>
         <footer className="p-4 bg-card border-t flex justify-end gap-2">
            <Button variant="outline">Reset</Button>
            <Button>Save</Button>
        </footer>
    </div>
  );
}
