'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCompanies,
  getTemplates,
  getIndustryMappings,
  getUsers,
  getCriteria,
} from '@/lib/data';
import type {
  Company,
  Template,
  IndustryMapping,
  User,
  Criteria,
  RatingNote,
} from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Stepper, Step } from '@/components/ui/stepper';
import Step1_SelectTemplate from '@/components/new-note/Step1_SelectTemplate';
import Step2_AddAnalysts from '@/components/new-note/Step2_AddAnalysts';
import Step3_AddDetails from '@/components/new-note/Step3_AddDetails';
import Step4_Preview from '@/components/new-note/Step4_Preview';

export type NewNoteConfig = Partial<
  Omit<RatingNote, 'id' | 'createdAt' | 'company' | 'template'> & {
    company: Company | null;
    template: Template | null;
  }
>;

const steps = [
  { label: 'Select Template' },
  { label: 'Add Analysts' },
  { label: 'Add Details' },
  { label: 'Preview' },
];

export default function NewNotePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const [config, setConfig] = useState<NewNoteConfig>({
    company: null,
    template: null,
    analysts: [],
    financialApproach: 'Standalone',
    financialYearFrom: new Date().getFullYear() - 3,
    financialYearTo: new Date().getFullYear() -1,
    operationalApproach: 'Standalone',
    operationalYearFrom: new Date().getFullYear() - 3,
    operationalYearTo: new Date().getFullYear() - 1,
    currencyDenomination: 'INR',
    scale: 'Crores',
    decimalPrecision: 2,
    zeroRowPolicy: 'Delete',
    zeroColumnPolicy: 'Delete',
    highlightZeros: true,
    applicableCriteria: [],
    description: '',
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const updateConfig = (newValues: Partial<NewNoteConfig>) => {
    setConfig(prev => ({...prev, ...newValues}));
  }

  const handleCreateNote = () => {
    // In a real app, this would save the config to Firestore and create the note
    console.log('Final Rating Note Configuration:', config);
    // Navigate to the newly created note's page.
    router.push(`/notes/1`);
  };
  
  const isStep1Valid = useMemo(() => !!config.company && !!config.template, [config.company, config.template]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline">
            Create New Rating Note
          </h1>
          <p className="text-muted-foreground">
            Follow the steps to configure your new rating note.
          </p>
        </header>

        <Card>
          <CardHeader>
            <Stepper initialStep={0} activeStep={currentStep}>
              {steps.map((step, index) => (
                <Step key={index} label={step.label} />
              ))}
            </Stepper>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && <Step1_SelectTemplate config={config} onConfigChange={updateConfig} />}
            {currentStep === 1 && <Step2_AddAnalysts config={config} onConfigChange={updateConfig} />}
            {currentStep === 2 && <Step3_AddDetails config={config} onConfigChange={updateConfig} />}
            {currentStep === 3 && <Step4_Preview config={config} />}
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={currentStep === 0 && !isStep1Valid}>
              Next
            </Button>
          ) : (
            <Button size="lg" onClick={handleCreateNote}>
              Create Note and Start
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
