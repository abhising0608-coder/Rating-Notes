'use client';
import { useState, useEffect, useMemo } from 'react';
import NoteNavigation from '@/components/NoteNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCompanies, getPrefetchedPeers, getOtherAgencyRatings, getRatingNoteById } from '@/lib/data';
import type { Company, PeerCompany, OtherAgencyRating, RatingSensitivity, NdsCibilCheckItem, SiteVisitDetailsData, Interaction, BankerInteraction, AuditorInteraction, DebentureTrusteeInteraction, IpaInteraction, ThirdPartyInteraction, RatingNote } from '@/types';
import { Plus, Trash2, RefreshCw, Pencil, Check as CheckIcon, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useParams } from 'next/navigation';


export default function PeerComparisonPage() {
  const params = useParams();
  const noteId = params.noteId as string;
  const [note, setNote] = useState<RatingNote | null>(null);

  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [prefetchedPeers, setPrefetchedPeers] = useState<PeerCompany[]>([]);
  const [selectedPrefetched, setSelectedPrefetched] = useState<string[]>([]);
  const [prefetchEnabled, setPrefetchEnabled] = useState('yes');
  
  const [queryResultPeers, setQueryResultPeers] = useState<PeerCompany[]>([]);
  const [selectedQueryResults, setSelectedQueryResults] = useState<string[]>([]);
  const [manualSelection, setManualSelection] = useState<string[]>([]);

  const [manualCompanyName, setManualCompanyName] = useState('');

  const [otherAgencyRatings, setOtherAgencyRatings] = useState<OtherAgencyRating[]>([]);

  const [ratingSensitivities, setRatingSensitivities] = useState<RatingSensitivity[]>([
    { id: 'rs-1', sensitivity: 'Improvement in operating margin', care: 'Positive', cra1: 'Positive', cra2: 'Stable' },
    { id: 'rs-2', sensitivity: 'Decline in revenue growth', care: 'Negative', cra1: 'Negative', cra2: 'Negative' },
    { id: 'rs-3', sensitivity: 'Successful project commissioning', care: 'Positive', cra1: 'Positive', cra2: 'Positive' },
    { id: 'rs-4', sensitivity: 'Increase in debt levels', care: 'Negative', cra1: 'Stable', cra2: 'Negative' },
  ]);

  const [ndsCibilChecks, setNdsCibilChecks] = useState<NdsCibilCheckItem[]>([
    { id: 'nds-1', label: 'Status of No-defaults and Delays', details: 'No; As per NDS dated Feb 01, 2025', verificationDate: '', quarter: null, status: null },
    { id: 'nds-2', label: 'Due diligence as per CIBIL for latest quarter', details: 'No Adverse Remark for quarter ended December 31, 2024 (Verified on January 25, 2025)', verificationDate: '', quarter: '', status: null },
    { id: 'nds-3', label: 'Due diligence as per CIBIL for previous quarter', details: 'No Adverse Remark for quarter ended September 30, 2024 (Verified on December 29, 2025)', verificationDate: '', quarter: '', status: null },
    { id: 'nds-4', label: 'Due diligence as per watchout investors', details: 'No Adverse remarks (Verified on January 25, 2025)', verificationDate: '', quarter: null, status: null },
    { id: 'nds-5', label: 'Status of receipts of Bank Statements from client', details: '', verificationDate: null, quarter: null, status: 'No' },
    { id: 'nds-6', label: 'Annual Declaration on regulatory action/adverse', details: '', verificationDate: null, quarter: null, status: 'Yes' },
  ]);

  const [siteVisitDetails, setSiteVisitDetails] = useState<SiteVisitDetailsData>({
    applicability: 'Applicable',
    particulars: {
      carePersonVisited: '',
      personMetClient: '',
      dateOfVisit: '',
      facilityVisited: '',
      installedCapacity: '',
      majorProducts: '',
      remark: ''
    },
    comments: ''
  });

  const [interactions, setInteractions] = useState<Interaction[]>([
    { id: 'int-1', type: 'Lender', date: '', name: '', checked: false },
    { id: 'int-2', type: 'DT', date: '', name: '', checked: false },
    { id: 'int-3', type: 'IPT', date: '', name: '', checked: false },
  ]);

  const [bankerInteractions, setBankerInteractions] = useState<BankerInteraction[]>([
    { id: 'bi-1', bankerName: 'SBI', name: 'Nihar Lenka', designation: 'RM', email: 'nihar.lenka@abi.co.in', mobile: '9898989898', dateOfInteraction: '2025-02-04', feedback: 'The classification of the account is standard.\nThe conduct of the account is satisfactory\nThere are no delays or defaults in debt servicing\nUtilization of the limits remains around 40%' },
    { id: 'bi-2', bankerName: 'HDFC Bank', name: 'Amit Shah', designation: 'RM', email: 'amit.shah@hdfc.co.in', mobile: '9898989898', dateOfInteraction: '2025-02-04', feedback: 'The classification of the account is standard.\nThe conduct of the account is satisfactory\nThere are no delays or defaults in debt servicing\nUtilization of the limits remains around 40%' },
    { id: 'bi-3', bankerName: 'Kotak Mahindra Bank', name: 'Mahesh Patil', designation: 'RM', email: 'mahesh.patil@kotak.com', mobile: '8989898989', dateOfInteraction: '2025-02-04', feedback: 'The classification of the account is standard.\nThe conduct of the account is satisfactory\nThere are no delays or defaults in debt servicing\nUtilization of the limits remains around 40%' },
  ]);

  const [auditorInteractions, setAuditorInteractions] = useState<AuditorInteraction[]>([
    { id: 'ai-1', auditFirmName: 'Deloitte', name: 'Ravi Kumar', designation: 'Partner', email: 'ravi.kumar@deloitte.com', mobile: '9876543210', dateOfInteraction: '2025-01-15', feedback: 'No qualifications in the last audit report. Management has been cooperative.' },
  ]);

  const [debentureTrusteeInteractions, setDebentureTrusteeInteractions] = useState<DebentureTrusteeInteraction[]>([
      { id: 'dt-1', dtName: 'IDBI Trusteeship', name: 'Anjali Sharma', designation: 'Trustee Officer', email: 'anjali.s@idbitrustee.com', mobile: '9988776655', dateOfInteraction: '2025-01-20', feedback: 'All covenants are complied with. No investor complaints received.' },
  ]);

  const [ipaInteractions, setIpaInteractions] = useState<IpaInteraction[]>([
    { id: 'ipa-1', ipaName: 'Axis Bank', name: 'Priya Singh', designation: 'IPA Officer', email: 'priya.singh@axisbank.com', mobile: '9876543211', dateOfInteraction: '2025-01-22', feedback: 'All payments processed on time. No issues reported.' },
  ]);

  const [thirdPartyInteractions, setThirdPartyInteractions] = useState<ThirdPartyInteraction[]>([
    { id: 'tp-1', partyType: 'Customers/Suppliers/Dealers/Distributors', name: '', designation: '', email: '', mobile: '', dateOfInteraction: '', feedback: '' },
  ]);

  const handleNdsCibilChange = (id: string, field: keyof NdsCibilCheckItem, value: string | null) => {
    setNdsCibilChecks(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const handleSiteVisitChange = (field: keyof SiteVisitDetailsData['particulars'], value: string) => {
    setSiteVisitDetails(prev => ({
      ...prev,
      particulars: {
        ...prev.particulars,
        [field]: value
      }
    }));
  };

  const handleInteractionChange = (id: string, field: keyof Interaction, value: string | boolean) => {
    setInteractions(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleBankerInteractionChange = (id: string, field: keyof BankerInteraction, value: string) => {
    setBankerInteractions(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAuditorInteractionChange = (id: string, field: keyof AuditorInteraction, value: string) => {
    setAuditorInteractions(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const handleDebentureTrusteeInteractionChange = (id: string, field: keyof DebentureTrusteeInteraction, value: string) => {
    setDebentureTrusteeInteractions(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleIpaInteractionChange = (id: string, field: keyof IpaInteraction, value: string) => {
    setIpaInteractions(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleThirdPartyInteractionChange = (id: string, field: keyof ThirdPartyInteraction, value: string) => {
    setThirdPartyInteractions(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  useEffect(() => {
    if(noteId) {
        getRatingNoteById(noteId).then(setNote);
    }
  }, [noteId]);

  useEffect(() => {
    getCompanies().then(companies => {
        setAllCompanies(companies);
        // Add the company being rated to the list by default
        if (companies.length > 0) {
            setSelectedCompanies([companies[0]]); 
        }
    });
    getPrefetchedPeers('1').then(peers => {
      setPrefetchedPeers(peers);
      // Use a slice of prefetched as mock query results
      const mockQueryResults = peers.slice(0, 4);
      setQueryResultPeers(mockQueryResults);
    });
    getOtherAgencyRatings('1').then(setOtherAgencyRatings);
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

  const addManualCompany = () => {
    if (!manualCompanyName.trim()) return;

    const newCompany: Company = {
        id: `manual-${Date.now()}`,
        name: manualCompanyName.trim(),
        nseIndustry: 'N/A (Manual)',
        subIndustry: 'N/A (Manual)',
        registeredOffice: 'N/A (Manual)',
    };

    setSelectedCompanies(prev => [...prev, newCompany]);
    setManualCompanyName('');
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

  const getCompanyRating = (company: Company): string => {
      if (company.id.startsWith('manual-')) return 'N/A';
      const peer = prefetchedPeers.find(p => p.id === company.id) || queryResultPeers.find(p => p.id === company.id);
      return peer?.rating || 'A+'; // Default mock rating
  }

  if (!note) {
      return (
           <div className="flex-1 flex flex-col">
              <main className="flex-1 p-8 bg-background">
                  <div>Loading...</div>
              </main>
          </div>
      )
  }

  return (
    <div className="flex-1 flex flex-col">
       <NoteNavigation note={note} />
       <main className="flex-1 p-8 bg-background">
         <Card>
            <CardHeader>
                <CardTitle>Peer Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6', 'item-7']} className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold">Pre-fetched Companies from Last Rating Note</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
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
                       {prefetchEnabled === 'yes' && (
                        <>
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead><Checkbox onCheckedChange={(c) => handleToggleAllPrefetched(c as boolean)} /></TableHead>
                                  <TableHead>Company Name</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {prefetchedPeers.map(peer => (
                                  <TableRow key={peer.id}>
                                    <TableCell><Checkbox checked={selectedPrefetched.includes(peer.id)} onCheckedChange={() => handleTogglePrefetched(peer.id)} /></TableCell>
                                    <TableCell>{peer.companyName}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={addSelectedPeersToComparison} disabled={selectedPrefetched.length === 0}>Add Selected for Comparison</Button>
                          </div>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="font-semibold">Query Builder to Search the Companies in the DB</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-2">
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
                      
                      <div className="space-y-4">
                          <h4 className="font-semibold">Peer Comparison Parameters</h4>
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
                                  </TableBody>
                              </Table>
                          </div>
                           <div className="flex justify-end gap-2">
                              <Button>Show List</Button>
                              <Button variant="outline">Reset</Button>
                          </div>
                      </div>

                       <div className="space-y-4">
                          <h4 className="font-semibold">Select Companies for Peer Comparison</h4>
                          <div className="border rounded-lg overflow-hidden">
                              <Table>
                                  <TableHeader>
                                      <TableRow>
                                          <TableHead><Checkbox onCheckedChange={(c) => handleToggleAllQueryResults(c as boolean)} /></TableHead>
                                          <TableHead>Company Name</TableHead>
                                          <TableHead>No. of Years</TableHead>
                                          <TableHead>Industry Type</TableHead>
                                          <TableHead>Industry</TableHead>
                                          <TableHead>Rating (If Available)</TableHead>
                                          <TableHead>Actions</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {queryResultPeers.map(peer => (
                                           <TableRow key={peer.id}>
                                              <TableCell><Checkbox checked={selectedQueryResults.includes(peer.id)} onCheckedChange={() => handleToggleQueryResult(peer.id)}/></TableCell>
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
                          <div className="flex justify-end">
                              <Button onClick={addSelectedQueryResultsToComparison} disabled={selectedQueryResults.length === 0}>Add Selected for Comparison</Button>
                          </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="font-semibold">Manual Search of Companies</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="flex items-end gap-4">
                        <div className="flex-grow">
                          <Label>Select Company</Label>
                          <MultiSelect options={manualSearchOptions} selected={manualSelection} onChange={setManualSelection} placeholder="Search and select companies..." />
                        </div>
                        <Button onClick={addManualSelectionToComparison} disabled={manualSelection.length === 0}>Add for Comparison</Button>
                      </div>
                       <div className="flex items-end gap-4">
                        <div className="flex-grow">
                          <Label>Or, Add New Company Manually</Label>
                          <Input
                            placeholder="Enter company name to add manually"
                            value={manualCompanyName}
                            onChange={(e) => setManualCompanyName(e.target.value)}
                          />
                        </div>
                        <Button onClick={addManualCompany}>Add</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="item-4">
                    <AccordionTrigger className="font-semibold">List of Selected Companies for Peer Comparison</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                       <h4 className="font-semibold">Selected Companies for Peer Comparison</h4>
                       <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead><Checkbox /></TableHead>
                              <TableHead>Company Name</TableHead>
                              <TableHead>Years</TableHead>
                              <TableHead>Result Type</TableHead>
                              <TableHead>Industry Type</TableHead>
                              <TableHead>Industry</TableHead>
                              <TableHead>Rating (If Available)</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedCompanies.map(company => (
                              <TableRow key={company.id}>
                                <TableCell><Checkbox /></TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>
                                  <Select><SelectTrigger className="w-[100px]"><SelectValue placeholder="Select" /></SelectTrigger></Select>
                                </TableCell>
                                <TableCell>
                                   <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="Select" /></SelectTrigger></Select>
                                </TableCell>
                                <TableCell>{company.subIndustry}</TableCell>
                                <TableCell>{company.nseIndustry}</TableCell>
                                <TableCell>{getCompanyRating(company)}</TableCell>
                                <TableCell className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" onClick={() => removeCompany(company.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button>Compare</Button>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="font-semibold">Outstanding Ratings of Other CRAs</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>CRA Name</TableHead>
                              <TableHead>Rated Debt (₹ crore)</TableHead>
                              <TableHead>Last Date of Press Release</TableHead>
                              <TableHead>Present Rating - Long Term / Short Term</TableHead>
                              <TableHead>Present Rating Outlook</TableHead>
                              <TableHead>Previous Rating - Long Term / Short Term</TableHead>
                              <TableHead>Previous Rating Outlook</TableHead>
                              <TableHead>Last Rating Action</TableHead>
                              <TableHead>Category - INC / Accepted / Unaccepted</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {otherAgencyRatings.map((rating) => (
                              <TableRow key={rating.id}>
                                <TableCell>{rating.craName}</TableCell>
                                <TableCell>{rating.ratedDebtInCrores}</TableCell>
                                <TableCell>{rating.lastPressReleaseDate}</TableCell>
                                <TableCell>{rating.presentRating}</TableCell>
                                <TableCell>{rating.presentRatingOutlook}</TableCell>
                                <TableCell>{rating.previousRating}</TableCell>
                                <TableCell>{rating.previousRatingOutlook}</TableCell>
                                <TableCell>{rating.lastRatingAction}</TableCell>
                                <TableCell>{rating.categoryINC}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger className="font-semibold">Rating sensitivities considered at the time of last rating</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                           <TableHeader>
                            <TableRow>
                              <TableHead>Factors considered at the time of last rating</TableHead>
                              <TableHead>CARE</TableHead>
                              <TableHead>CRA 1</TableHead>
                              <TableHead>CRA 2</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ratingSensitivities.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.sensitivity}</TableCell>
                                <TableCell>{item.care}</TableCell>
                                <TableCell>{item.cra1}</TableCell>
                                <TableCell>{item.cra2}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="item-7">
                    <AccordionTrigger className="font-semibold">Discussion with Key Stakeholders</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <h4 className="font-semibold text-md">NDS, CIBIL &amp; Watchout Investors Check</h4>
                       <div className="border rounded-lg overflow-hidden">
                        <Table>
                           <TableHeader>
                            <TableRow>
                              <TableHead className="w-1/4">Check Item</TableHead>
                              <TableHead className="w-1/3">Details</TableHead>
                              <TableHead>Verification Date</TableHead>
                              <TableHead>Quarter / Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ndsCibilChecks.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.label}</TableCell>
                                <TableCell>
                                  <Input 
                                    type="text"
                                    value={item.details}
                                    onChange={(e) => handleNdsCibilChange(item.id, 'details', e.target.value)}
                                    disabled={item.status !== null}
                                  />
                                </TableCell>
                                <TableCell>
                                  {item.verificationDate !== null && (
                                    <Input
                                        type="date"
                                        value={item.verificationDate}
                                        onChange={(e) => handleNdsCibilChange(item.id, 'verificationDate', e.target.value)}
                                    />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {item.quarter !== null ? (
                                    <Select value={item.quarter} onValueChange={(v) => handleNdsCibilChange(item.id, 'quarter', v)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Quarter" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="March">March</SelectItem>
                                        <SelectItem value="June">June</SelectItem>
                                        <SelectItem value="September">September</SelectItem>
                                        <SelectItem value="December">December</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : item.status !== null ? (
                                    <Select value={item.status} onValueChange={(v) => handleNdsCibilChange(item.id, 'status', v)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ): null}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                       </div>
                       <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-md">Site visit details</h4>
                            <div className="w-[180px]">
                                <Select value={siteVisitDetails.applicability} onValueChange={(v) => setSiteVisitDetails(prev => ({...prev, applicability: v as any}))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Applicability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Applicable">Applicable</SelectItem>
                                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                        <SelectItem value="Not Available">Not Available</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {siteVisitDetails.applicability === 'Applicable' && (
                            <div className="space-y-4">
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Particulars</TableHead>
                                                <TableHead>Comments</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(siteVisitDetails.particulars).map(([key, value]) => (
                                                <TableRow key={key}>
                                                    <TableCell className="font-medium capitalize w-1/3">{key.replace(/([A-Z])/g, ' $1')}</TableCell>
                                                    <TableCell>
                                                        <Input 
                                                            type={key === 'dateOfVisit' ? 'date' : 'text'}
                                                            value={value}
                                                            onChange={(e) => handleSiteVisitChange(key as any, e.target.value)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div>
                                    <Label>Comments</Label>
                                    <Textarea value={siteVisitDetails.comments} onChange={(e) => setSiteVisitDetails(prev => ({...prev, comments: e.target.value}))} />
                                </div>
                            </div>
                        )}
                       </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-md">Interaction with key stakeholders</h4>
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Check-box</TableHead>
                                  <TableHead>Type of stake holder</TableHead>
                                  <TableHead>Date of Interaction</TableHead>
                                  <TableHead>Name of stake holder</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {interactions.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Checkbox
                                        checked={item.checked}
                                        onCheckedChange={(checked) => handleInteractionChange(item.id, 'checked', !!checked)}
                                      />
                                    </TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>
                                      <Input
                                        type="date"
                                        value={item.date}
                                        onChange={(e) => handleInteractionChange(item.id, 'date', e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleInteractionChange(item.id, 'name', e.target.value)}
                                        placeholder="Enter name..."
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                         <div className="space-y-4">
                          <h4 className="font-semibold text-md">Banker Interactions</h4>
                           <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name of the banker/lender</TableHead>
                                  <TableHead>Banker Interactions</TableHead>
                                  <TableHead>Feedback</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {bankerInteractions.map(item => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Input value={item.bankerName} onChange={e => handleBankerInteractionChange(item.id, 'bankerName', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Name:</span><Input value={item.name} onChange={e => handleBankerInteractionChange(item.id, 'name', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Designation:</span><Input value={item.designation} onChange={e => handleBankerInteractionChange(item.id, 'designation', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Email Id:</span><Input type="email" value={item.email} onChange={e => handleBankerInteractionChange(item.id, 'email', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Mobile No:</span><Input value={item.mobile} onChange={e => handleBankerInteractionChange(item.id, 'mobile', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Date:</span><Input type="date" value={item.dateOfInteraction} onChange={e => handleBankerInteractionChange(item.id, 'dateOfInteraction', e.target.value)} /></div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Textarea value={item.feedback} onChange={e => handleBankerInteractionChange(item.id, 'feedback', e.target.value)} rows={5} />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                           </div>
                         </div>
                         <div className="space-y-4">
                          <h4 className="font-semibold text-md">Auditor Interactions</h4>
                           <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name of the audit firm</TableHead>
                                  <TableHead>Auditor Interaction</TableHead>
                                  <TableHead>Feedback</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {auditorInteractions.map(item => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Input value={item.auditFirmName} onChange={e => handleAuditorInteractionChange(item.id, 'auditFirmName', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Name:</span><Input value={item.name} onChange={e => handleAuditorInteractionChange(item.id, 'name', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Designation:</span><Input value={item.designation} onChange={e => handleAuditorInteractionChange(item.id, 'designation', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Email Id:</span><Input type="email" value={item.email} onChange={e => handleAuditorInteractionChange(item.id, 'email', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Mobile No:</span><Input value={item.mobile} onChange={e => handleAuditorInteractionChange(item.id, 'mobile', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Date:</span><Input type="date" value={item.dateOfInteraction} onChange={e => handleAuditorInteractionChange(item.id, 'dateOfInteraction', e.target.value)} /></div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Textarea value={item.feedback} onChange={e => handleAuditorInteractionChange(item.id, 'feedback', e.target.value)} rows={5} />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                           </div>
                         </div>
                         <div className="space-y-4">
                          <h4 className="font-semibold text-md">Debenture Trustee</h4>
                           <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name of the DT</TableHead>
                                  <TableHead>Debenture Trustee</TableHead>
                                  <TableHead>Feedback</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {debentureTrusteeInteractions.map(item => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Input value={item.dtName} onChange={e => handleDebentureTrusteeInteractionChange(item.id, 'dtName', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Name:</span><Input value={item.name} onChange={e => handleDebentureTrusteeInteractionChange(item.id, 'name', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Designation:</span><Input value={item.designation} onChange={e => handleDebentureTrusteeInteractionChange(item.id, 'designation', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Email Id:</span><Input type="email" value={item.email} onChange={e => handleDebentureTrusteeInteractionChange(item.id, 'email', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Mobile No:</span><Input value={item.mobile} onChange={e => handleDebentureTrusteeInteractionChange(item.id, 'mobile', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Date:</span><Input type="date" value={item.dateOfInteraction} onChange={e => handleDebentureTrusteeInteractionChange(item.id, 'dateOfInteraction', e.target.value)} /></div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Textarea value={item.feedback} onChange={e => handleDebentureTrusteeInteractionChange(item.id, 'feedback', e.target.value)} rows={5} />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                           </div>
                         </div>
                         <div className="space-y-4">
                          <h4 className="font-semibold text-md">Issuing and Paying Agent</h4>
                           <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name of IPA</TableHead>
                                  <TableHead>Issuing and Paying Agent</TableHead>
                                  <TableHead>Feedback</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {ipaInteractions.map(item => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Input value={item.ipaName} onChange={e => handleIpaInteractionChange(item.id, 'ipaName', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Name:</span><Input value={item.name} onChange={e => handleIpaInteractionChange(item.id, 'name', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Designation:</span><Input value={item.designation} onChange={e => handleIpaInteractionChange(item.id, 'designation', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Email Id:</span><Input type="email" value={item.email} onChange={e => handleIpaInteractionChange(item.id, 'email', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Mobile No:</span><Input value={item.mobile} onChange={e => handleIpaInteractionChange(item.id, 'mobile', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Date:</span><Input type="date" value={item.dateOfInteraction} onChange={e => handleIpaInteractionChange(item.id, 'dateOfInteraction', e.target.value)} /></div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Textarea value={item.feedback} onChange={e => handleIpaInteractionChange(item.id, 'feedback', e.target.value)} rows={5} />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                           </div>
                         </div>
                         <div className="space-y-4">
                          <h4 className="font-semibold text-md">Third Party Check</h4>
                           <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Customers/Suppliers/Dealers/Distributors</TableHead>
                                  <TableHead>Third Party Check</TableHead>
                                  <TableHead>Feedback</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {thirdPartyInteractions.map(item => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <Input value={item.partyType} onChange={e => handleThirdPartyInteractionChange(item.id, 'partyType', e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Name:</span><Input value={item.name} onChange={e => handleThirdPartyInteractionChange(item.id, 'name', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Designation:</span><Input value={item.designation} onChange={e => handleThirdPartyInteractionChange(item.id, 'designation', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Email Id:</span><Input type="email" value={item.email} onChange={e => handleThirdPartyInteractionChange(item.id, 'email', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Mobile No:</span><Input value={item.mobile} onChange={e => handleThirdPartyInteractionChange(item.id, 'mobile', e.target.value)} /></div>
                                        <div className="grid grid-cols-[100px_1fr] items-center"><span>Date:</span><Input type="date" value={item.dateOfInteraction} onChange={e => handleThirdPartyInteractionChange(item.id, 'dateOfInteraction', e.target.value)} /></div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Textarea value={item.feedback} onChange={e => handleThirdPartyInteractionChange(item.id, 'feedback', e.target.value)} rows={5} />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                           </div>
                         </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardContent>
         </Card>
        </main>
         <footer className="p-4 bg-card border-t flex justify-end gap-2">
            <Button>Save</Button>
            <Button variant="outline">Reset</Button>
        </footer>
    </div>
  );
}
