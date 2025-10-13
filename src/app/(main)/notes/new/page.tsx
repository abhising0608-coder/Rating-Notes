'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCompanies,
  getTemplates,
  getIndustryMappings,
} from '@/lib/data';
import type { Company, Template, IndustryMapping } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


function TemplateCard({
  template,
  onSelect,
  isSelected,
}: {
  template: Template;
  onSelect: (templateId: string) => void;
  isSelected: boolean;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary' : 'hover:shadow-md'}`}
      onClick={() => onSelect(template.id)}
    >
      <CardHeader>
        <CardTitle className="font-headline text-lg flex justify-between items-start">
          {template.name}
          {isSelected && <Check className="text-primary" />}
        </CardTitle>
        <CardDescription>
          {template.sector} {template.subSector && `> ${template.subSector}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>Version: {template.version}</p>
        <p>Effective: {template.effectiveFrom}</p>
        {template.description && <p className="mt-2 italic">"{template.description}"</p>}
      </CardContent>
      <CardFooter>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <a 
                        href={template.sampleFormatUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => !template.sampleFormatUrl && e.preventDefault()}
                        className={`text-xs ${!template.sampleFormatUrl ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'}`}
                    >
                        Sample Format
                    </a>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Template configured as per sector-specific sample format.</p>
                </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

export default function NewNotePage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [mappings, setMappings] = useState<IndustryMapping[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  useEffect(() => {
    getCompanies().then(setCompanies);
    getTemplates().then(setTemplates);
    getIndustryMappings().then(setMappings);
  }, []);

  const { recommendedTemplates, otherTemplates } = useMemo(() => {
    if (!selectedCompany) {
      return { recommendedTemplates: [], otherTemplates: templates };
    }

    const mapping = mappings.find(
      (m) => m.nseIndustryCode === selectedCompany.nseIndustry
    );
    const recommendedIds = mapping?.recommendedTemplateIds || [];
    
    const agnosticTemplates = templates.filter(t => t.isAgnostic);
    
    let recommended = templates.filter(t => recommendedIds.includes(t.id));
    if(recommended.length === 0) {
        recommended = agnosticTemplates;
    }

    const other = templates.filter(
      (t) => !recommended.some(rec => rec.id === t.id)
    );

    return { recommendedTemplates: recommended, otherTemplates: other };
  }, [selectedCompany, templates, mappings]);

  const handleCreateNote = () => {
    if (selectedCompany && selectedTemplateId) {
      // In a real app, this would create a new note in the DB
      // and then navigate to the new note's page.
      // For now, we'll just navigate to a placeholder.
      console.log(
        `Creating note for ${selectedCompany.name} with template ${selectedTemplateId}`
      );
      // Simulate navigation to a new note page
      router.push(`/notes/new-note-id-placeholder`);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline">Create New Rating Note</h1>
          <p className="text-muted-foreground">
            Start by selecting a company to see recommended templates.
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Select Company</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={(companyId) =>
                setSelectedCompany(companies.find((c) => c.id === companyId) || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a company..." />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCompany && (
              <div className="mt-4 text-sm text-muted-foreground p-3 bg-muted rounded-md">
                <p><strong>NSE Industry:</strong> {selectedCompany.nseIndustry}</p>
                <p><strong>Sub-Industry:</strong> {selectedCompany.subIndustry}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedCompany && (
          <Card>
            <CardHeader>
              <CardTitle>2. Select Template</CardTitle>
              <CardDescription>
                Based on {selectedCompany.name}'s industry, we recommend the following templates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recommended">
                <TabsList>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  <TabsTrigger value="all">All Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="recommended" className="pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {recommendedTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={setSelectedTemplateId}
                        isSelected={selectedTemplateId === template.id}
                      />
                    ))}
                  </div>
                  {recommendedTemplates.length === 0 && (
                      <p className="text-muted-foreground text-center p-8">No specific recommendations. Showing sector-agnostic templates.</p>
                  )}
                </TabsContent>
                <TabsContent value="all" className="pt-4">
                  <h3 className="font-semibold mb-2 font-headline">Other Templates</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {otherTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={setSelectedTemplateId}
                        isSelected={selectedTemplateId === template.id}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            onClick={handleCreateNote}
            disabled={!selectedCompany || !selectedTemplateId}
          >
            Create Note
          </Button>
        </div>
      </div>
    </div>
  );
}
