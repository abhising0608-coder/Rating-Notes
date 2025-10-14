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
import { getCompanies } from '@/lib/data';
import type { Company } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

export default function PeerComparisonPage() {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

  useEffect(() => {
    getCompanies().then(setAllCompanies);
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
  
  return (
    <div className="flex-1 flex flex-col">
       <NoteNavigation />
       <main className="flex-1 p-8 bg-background">
         <Card>
            <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full" defaultValue="item-3">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Pre-fetched Companies from Last Rating Note</AccordionTrigger>
                        <AccordionContent>
                        Placeholder for pre-fetched companies.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Query Builder to Search the Companies in the DB</AccordionTrigger>
                        <AccordionContent>
                        Placeholder for query builder functionality.
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
