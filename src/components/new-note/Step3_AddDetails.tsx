'use client';

import { useState, useEffect, useMemo } from 'react';
import { NewNoteConfig } from '@/app/(main)/notes/new/page';
import { getCriteria, getCompanies } from '@/lib/data';
import type { Criteria, Company } from '@/types';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Link } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Step3Props = {
  config: NewNoteConfig;
  onConfigChange: (newConfig: Partial<NewNoteConfig>) => void;
};

const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 1; i > currentYear - 10; i--) {
        years.push(i);
    }
    return years;
}

export default function Step3_AddDetails({ config, onConfigChange }: Step3Props) {
  const [allCriteria, setAllCriteria] = useState<Criteria[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const yearOptions = generateYearOptions();

  useEffect(() => {
    getCriteria().then(setAllCriteria);
    getCompanies().then(setCompanies);
  }, []);

  useEffect(() => {
    if (allCriteria.length > 0 && config.template) {
        const recommendedCriteria = allCriteria.filter(c => 
            c.sectorMapping.includes(config.template?.sector || '') || c.sectorMapping.includes('Agnostic')
        ).map(c => c.id);
        
        // This pre-selects the recommended criteria when the component loads or template changes.
        // It won't override existing user selections unless the template is changed.
        if (!config.applicableCriteria || config.applicableCriteria.length === 0) {
            onConfigChange({ applicableCriteria: recommendedCriteria });
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCriteria, config.template]);

  const handleCriteriaToggle = (criteriaId: string) => {
    const currentCriteria = config.applicableCriteria || [];
    const newCriteria = currentCriteria.includes(criteriaId)
      ? currentCriteria.filter((id) => id !== criteriaId)
      : [...currentCriteria, criteriaId];
    onConfigChange({ applicableCriteria: newCriteria });
  };
  
  const handleCombinedEntitiesChange = (entityIds: string[]) => {
    onConfigChange({ combinedEntities: entityIds });
  }

  const combinedApproachError = useMemo(() => {
    if (config.financialApproach !== 'Combined') return null;
    if (config.template?.isAgnostic) {
      return "Combined Approach cannot be used with Sector-Agnostic templates (Review, Revalidation, Representation, Withdrawal, INC, CPTI). Please choose Standalone/Consolidated or select a non-agnostic template.";
    }
    if (!['Initial', 'Surveillance'].includes(config.ratingCycle!)) {
      return "Combined Approach is allowed only for Initial or Surveillance rating cycles.";
    }
    return null;
  }, [config.financialApproach, config.template?.isAgnostic, config.ratingCycle]);


  return (
    <div className="space-y-8">
      {/* Financial Data Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-headline">Financial Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-4 border rounded-lg">
          <div className="space-y-2">
            <Label>Analytical Approach for Financials</Label>
            <Select value={config.financialApproach} onValueChange={(v) => onConfigChange({ financialApproach: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Standalone">Standalone</SelectItem>
                <SelectItem value="Consolidated">Consolidated</SelectItem>
                <SelectItem value="Combined">Combined</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
                <div>
                    <Label>From Year</Label>
                    <Select value={config.financialYearFrom?.toString()} onValueChange={(v) => onConfigChange({ financialYearFrom: parseInt(v) })}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>{yearOptions.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>To Year</Label>
                    <Select value={config.financialYearTo?.toString()} onValueChange={(v) => onConfigChange({ financialYearTo: parseInt(v) })}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>{yearOptions.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
           {config.financialApproach === 'Combined' && !combinedApproachError && (
            <>
              <div className="space-y-2">
                <Label>Approach for Individual Entity</Label>
                <Select value={config.individualEntityApproach || ''} onValueChange={(v) => onConfigChange({ individualEntityApproach: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Select approach..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standalone">Standalone</SelectItem>
                    <SelectItem value="Consolidated">Consolidated</SelectItem>
                  </SelectContent>
                </Select>
                {!(config.individualEntityApproach) && <p className="text-xs text-destructive">This field is required for Combined approach.</p>}
              </div>
               <div className="space-y-2">
                <Label>Select Group</Label>
                <Select value={config.combinedGroupId || ''} onValueChange={(v) => onConfigChange({ combinedGroupId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a group..." /></SelectTrigger>
                  <SelectContent>
                    {/* Mock data, in real app this would be fetched */}
                    <SelectItem value="group_1">Major Conglomerate Group</SelectItem>
                    <SelectItem value="group_2">PQR Industries Group</SelectItem>
                  </SelectContent>
                </Select>
                 {!(config.combinedGroupId) && <p className="text-xs text-destructive">This field is required for Combined approach.</p>}
              </div>
            </>
           )}
           {combinedApproachError && (
              <div className="md:col-span-2">
                <Alert variant="destructive">
                  <AlertTitle>Invalid Configuration</AlertTitle>
                  <AlertDescription>{combinedApproachError}</AlertDescription>
                </Alert>
              </div>
           )}
        </div>
      </div>

      {/* Operational Data Section */}
       <div className="space-y-4">
        <h3 className="text-lg font-semibold font-headline">Operational Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end p-4 border rounded-lg">
          <div>
            <Label>Approach for Operational Data</Label>
            <Select value={config.operationalApproach} onValueChange={(v) => onConfigChange({ operationalApproach: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Standalone">Standalone</SelectItem>
                <SelectItem value="Consolidated">Consolidated</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex gap-4">
                <div>
                    <Label>From Year</Label>
                    <Select value={config.operationalYearFrom?.toString()} onValueChange={(v) => onConfigChange({ operationalYearFrom: parseInt(v) })}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>{yearOptions.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>To Year</Label>
                     <Select value={config.operationalYearTo?.toString()} onValueChange={(v) => onConfigChange({ operationalYearTo: parseInt(v) })}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>{yearOptions.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
        </div>
      </div>

      <Separator />

      {/* Currency, Scale, Decimal Section */}
       <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Formatting</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div>
                    <Label>Currency Denomination</Label>
                    <Select value={config.currencyDenomination} onValueChange={v => onConfigChange({ currencyDenomination: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INR">Indian Rupee</SelectItem>
                            <SelectItem value="USD">US Dollar</SelectItem>
                            <SelectItem value="EUR">Euro</SelectItem>
                            <SelectItem value="GBP">Great Britain Pound</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Scale</Label>
                    <Select value={config.scale} onValueChange={v => onConfigChange({ scale: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="Hundreds">Hundreds</SelectItem>
                            <SelectItem value="Thousands">Thousands</SelectItem>
                            <SelectItem value="Lacs">Lacs</SelectItem>
                            <SelectItem value="Million">Million</SelectItem>
                            <SelectItem value="Crores">Crores</SelectItem>
                            <SelectItem value="Billions">Billions</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>Decimal Precision</Label>
                    <Select value={config.decimalPrecision?.toString()} onValueChange={v => onConfigChange({ decimalPrecision: parseInt(v) })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
       </div>

        {/* Zero Rows/Columns Section */}
         <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Zero Value Display Policy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div>
                    <Label>Zero Rows</Label>
                     <Select value={config.zeroRowPolicy} onValueChange={v => onConfigChange({ zeroRowPolicy: v as any })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Delete">Delete</SelectItem>
                            <SelectItem value="No Deletion">No Deletion</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>Zero Columns</Label>
                     <Select value={config.zeroColumnPolicy} onValueChange={v => onConfigChange({ zeroColumnPolicy: v as any })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Delete">Delete</SelectItem>
                            <SelectItem value="No Deletion">No Deletion</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                    <Switch id="highlight-zeros" checked={config.highlightZeros} onCheckedChange={c => onConfigChange({ highlightZeros: c })}/>
                    <Label htmlFor="highlight-zeros">Highlight Zero-Value Rows</Label>
                </div>
            </div>
        </div>

        <Separator />

        {/* Applicable Criteria Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Applicable Criteria</h3>
            <div className="space-y-3 rounded-md border p-4">
                {allCriteria.map(c => (
                    <div key={c.id} className="flex items-center space-x-3">
                         <Checkbox
                            id={`criteria-${c.id}`}
                            checked={(config.applicableCriteria || []).includes(c.id)}
                            onCheckedChange={() => handleCriteriaToggle(c.id)}
                         />
                         <a 
                            href={c.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            {c.title}
                            <Link className="h-3 w-3" />
                         </a>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
