
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
import { COMMON_SECTIONS_FOR_CHILD_LOCK } from '@/lib/constants';

export type NewNoteConfig = Partial<
  Omit<RatingNote, 'id' | 'createdAt' | 'company' | 'template'> & {
    company: Company | null;
    template: Template | null;
    ratingCycle: 'Initial' | 'Surveillance' | 'Review' | 'Revalidation' | 'Representation' | 'Withdrawal' | 'INC' | 'CPTI';
    individualEntityApproach: 'Standalone' | 'Consolidated' | null;
    combinedGroupId: string | null;
    entityType?: 'Master' | 'Child' | 'Standalone';
    masterEntityName?: string;
    combinedEntities?: string[];
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
    ratingCycle: 'Review', // Default cycle for validation testing
    financialApproach: 'Standalone',
    individualEntityApproach: null,
    combinedGroupId: null,
    financialYearFrom: new Date().getFullYear() - 3,
    financialYearTo: new Date().getFullYear() - 1,
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
    entityType: 'Standalone',
    masterEntityName: '',
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
    // In a real app, this would save the config to Firestore and create the note.
    // This simulates the logic from `createChildRatingNote` and `copyPRandRRFromMasterNote` cloud functions.
    console.log('Final Rating Note Configuration:', config);

    if (config.financialApproach === 'Combined' && config.entityType === 'Child') {
        const masterName = config.masterEntityName || 'Master Company';
        const masterNoteId = 'master_note_001'; // Simulated master note ID
        const referenceNote = `Note: Please refer Master Company Note ${masterName}`;
        
        const mockMasterPR = `This is the Press Release content copied from the master note (${masterNoteId}) for ${masterName}. It is now editable.`;
        const mockMasterRR = `This is the Rating Rationale content copied from the master note (${masterNoteId}) for ${masterName}. This content is also editable.`;

        const noteData = {
            ...config,
            sections: config.template?.sections.reduce((acc, section) => {
                const isCommonLockedSection = COMMON_SECTIONS_FOR_CHILD_LOCK.includes(section.id);
                
                let sectionConfig: Partial<RatingNote['sections'][string]> = {
                    applicable: isCommonLockedSection ? 'Applicable' : 'Not Applicable',
                    tableRows: [],
                    comments: '',
                    attachments: [],
                };

                if (isCommonLockedSection) {
                    sectionConfig = {
                        ...sectionConfig,
                        isReferenceOnly: true,
                        referenceNote: referenceNote,
                    };
                }

                // Simulate copying PR and RR data
                if (section.id === 's_rationale_drivers') { // Corresponds to Rating Rationale
                     sectionConfig = {
                        ...sectionConfig,
                        applicable: 'Applicable',
                        isPrePopulated: true,
                        dataSource: 'MasterNote',
                        masterNoteId: masterNoteId,
                        rationaleAndKeyRatingDrivers: mockMasterRR,
                        isEditable: true,
                    };
                }

                if (section.id === 'draft-pr-rr') { // A more specific ID for draft PR
                     sectionConfig.comments = mockMasterPR;
                     sectionConfig.isPrePopulated = true;
                     sectionConfig.dataSource = 'MasterNote';
                     sectionConfig.masterNoteId = masterNoteId;
                     sectionConfig.isEditable = true;
                }

                acc[section.id] = sectionConfig as RatingNote['sections'][string];
                return acc;
            }, {} as RatingNote['sections'])
        };
        console.log('Creating CHILD note with locked and pre-populated sections:', noteData);
        // Here you would save the `noteData` to your database.
    } else {
        console.log('Creating MASTER or non-combined note.');
    }

    // For prototype purposes, navigate to a pre-existing note page.
    router.push(`/notes/1`);
  };
  
  const isStep1Valid = useMemo(() => !!config.company && !!config.template, [config.company, config.template]);
  
  const isStep3Valid = useMemo(() => {
    if (config.financialApproach === 'Combined') {
      if (!config.individualEntityApproach || !config.combinedGroupId) return false;
       if (config.template?.isAgnostic && !['Initial', 'Surveillance'].includes(config.ratingCycle!)) {
        return false;
      }
    }
    return true;
  }, [config.financialApproach, config.individualEntityApproach, config.combinedGroupId, config.template?.isAgnostic, config.ratingCycle]);


  const getNextButtonDisabledState = () => {
    if (currentStep === 0) return !isStep1Valid;
    if (currentStep === 2) return !isStep3Valid;
    return false;
  }

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
            <Button onClick={handleNext} disabled={getNextButtonDisabledState()}>
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
