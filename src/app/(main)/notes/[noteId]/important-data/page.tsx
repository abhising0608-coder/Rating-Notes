'use client';
import { useState, useEffect } from 'react';
import NoteNavigation from '@/components/NoteNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getImportantDataSections, getRatingNoteById } from '@/lib/data';
import type { ImportantDataSection, RatingNote } from '@/types';
import { useParams } from 'next/navigation';
import { Accordion } from '@/components/ui/accordion';
import ImportantDataAccordion from '@/components/ImportantDataAccordion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const sectorOptions = [
    "Paper", "EPC", "Pharma", "Cement", "Renewable", "NBFC", "HFC", 
    "General Manufacturing BIG", "Real Estate", "Toll including ToT", "HAM", 
    "Iron and Steel", "General Manufacturing", "Sugar", "Broking", "Bank", 
    "Infra General", "Ports", "Power", "Insurance", "Power Transmission", 
    "Airport", "Gas", "Hospitality/Hotel", "LRD", "Wholesale Trading", 
    "Retailing", "Healthcare/ Hospital", "Textile", "Educational Institution", 
    "Auto Component", "Auto", "Chemical", "Fertilizer"
];


export default function ImportantDataPage() {
  const params = useParams();
  const noteId = params.noteId as string;
  const [note, setNote] = useState<RatingNote | null>(null);
  const [sections, setSections] = useState<ImportantDataSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>('FY24');
  const [selectedSector, setSelectedSector] = useState<string>('');

  useEffect(() => {
    if (noteId) {
      getRatingNoteById(noteId).then(setNote);
      getImportantDataSections(noteId)
        .then(data => {
          setSections(data);
          setLoading(false);
        });
    }
  }, [noteId]);

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    // In a real app, this would trigger an autosave to Firestore:
    // e.g., updateNoteInFirestore({ operationalData: { sector: sector } });
    console.log('Sector saved (simulated):', sector);
  };
  
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
      <NoteNavigation note={note}/>
      <main className="flex-1 p-8 bg-background">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-4 w-full">
                <CardTitle>Section 5 — Important data, ratios etc.</CardTitle>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="select-sector">Select Sector</Label>
                    <Select
                        value={selectedSector}
                        onValueChange={handleSectorChange}
                        required
                    >
                        <SelectTrigger id="select-sector">
                            <SelectValue placeholder="Please Select Sector" />
                        </SelectTrigger>
                        <SelectContent>
                            {sectorOptions.map(sector => (
                                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <p className="text-sm text-muted-foreground">
                        Choose the sector to load relevant operational formulas.
                    </p>
                </div>
              </div>
              <div className="w-48">
                <Label>Select Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FY24">FY24</SelectItem>
                    <SelectItem value="FY23">FY23</SelectItem>
                    <SelectItem value="Q1-25">Q1-25</SelectItem>
                    <SelectItem value="Q4-24">Q4-24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading sections...</p>
            ) : sections.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                    {sections.map(section => (
                        <ImportantDataAccordion
                            key={section.id}
                            section={section}
                            entityId={note.companyId}
                            period={period}
                        />
                    ))}
                </Accordion>
            ) : (
              <p className="text-muted-foreground">
                No operational data sections are configured for this entity.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
