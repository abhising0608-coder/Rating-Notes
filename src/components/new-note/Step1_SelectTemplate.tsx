'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  getCompanies,
  getTemplates,
  getIndustryMappings,
} from '@/lib/data';
import type { Company, Template, IndustryMapping } from '@/types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { NewNoteConfig } from '@/app/(main)/notes/new/page';

function TemplateCard({
  template,
  onSelect,
  isSelected,
}: {
  template: Template;
  onSelect: (template: Template) => void;
  isSelected: boolean;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary' : 'hover:shadow-md'}`}
      onClick={() => onSelect(template)}
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
        <p>Effective: {new Date(template.effectiveFrom).toLocaleDateString()}</p>
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


type Step1Props = {
    config: NewNoteConfig;
    onConfigChange: (newConfig: Partial<NewNoteConfig>) => void;
}

export default function Step1_SelectTemplate({ config, onConfigChange }: Step1Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [mappings, setMappings] = useState<IndustryMapping[]>([]);

  useEffect(() => {
    getCompanies().then(setCompanies);
    getTemplates().then(setTemplates);
    getIndustryMappings().then(setMappings);
  }, []);

  const { recommendedTemplates, otherTemplates } = useMemo(() => {
    if (!config.company) {
      return { recommendedTemplates: [], otherTemplates: templates };
    }

    const mapping = mappings.find(
      (m) => m.nseIndustryCode === config.company?.nseIndustry
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
  }, [config.company, templates, mappings]);

  useEffect(() => {
    if (recommendedTemplates.length > 0 && !config.template) {
      onConfigChange({ template: recommendedTemplates[0] });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedTemplates]);
  
  const handleCompanyChange = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId) || null;
    onConfigChange({ company, template: null });
  }

  const handleTemplateSelect = (template: Template) => {
      onConfigChange({ template });
  }

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-xl font-semibold font-headline mb-2">1. Select Company</h2>
            <Select
              onValueChange={handleCompanyChange}
              value={config.company?.id}
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
            {config.company && (
              <div className="mt-4 text-sm text-muted-foreground p-3 bg-muted rounded-md">
                <p><strong>NSE Industry:</strong> {config.company.nseIndustry}</p>
                <p><strong>Sub-Industry:</strong> {config.company.subIndustry}</p>
              </div>
            )}
        </div>

        {config.company && (
          <div>
            <h2 className="text-xl font-semibold font-headline mb-2">2. Select Template</h2>
             <p className="text-sm text-muted-foreground mb-4">
                Based on {config.company.name}'s industry, we recommend the following templates.
              </p>
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
                        onSelect={handleTemplateSelect}
                        isSelected={config.template?.id === template.id}
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
                        onSelect={handleTemplateSelect}
                        isSelected={config.template?.id === template.id}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
          </div>
        )}
    </div>
  );
}
