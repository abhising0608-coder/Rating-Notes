'use client';

import { NewNoteConfig } from '@/app/(main)/notes/new/page';

type Step4Props = {
  config: NewNoteConfig;
};

const PreviewItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="font-semibold">{value || 'Not set'}</p>
  </div>
);

export default function Step4_Preview({ config }: Step4Props) {
    const { 
        company, template, analysts, financialApproach, financialYearFrom, financialYearTo,
        operationalApproach, operationalYearFrom, operationalYearTo, currencyDenomination,
        scale, decimalPrecision, zeroRowPolicy, zeroColumnPolicy, applicableCriteria,
        description 
    } = config;

  return (
    <div className="space-y-6">
       <h2 className="text-xl font-semibold font-headline mb-4 border-b pb-2">Configuration Preview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">General</h3>
            <PreviewItem label="Company" value={company?.name} />
            <PreviewItem label="Template" value={template?.name} />
            <PreviewItem label="Industry" value={company?.nseIndustry} />
            <PreviewItem label="Secondary Analysts" value={analysts?.join(', ') || 'None'} />
             <PreviewItem label="Description" value={description || 'None'} />
        </div>

         <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">Data & Years</h3>
            <PreviewItem label="Financial Approach" value={financialApproach} />
            <PreviewItem label="Financial Years" value={`${financialYearFrom} - ${financialYearTo}`} />
             <PreviewItem label="Operational Approach" value={operationalApproach} />
            <PreviewItem label="Operational Years" value={`${operationalYearFrom} - ${operationalYearTo}`} />
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">Formatting</h3>
            <PreviewItem label="Currency" value={currencyDenomination} />
            <PreviewItem label="Scale" value={scale} />
            <PreviewItem label="Decimal Precision" value={decimalPrecision} />
        </div>

         <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">Policies & Criteria</h3>
            <PreviewItem label="Zero Row Policy" value={zeroRowPolicy} />
            <PreviewItem label="Zero Column Policy" value={zeroColumnPolicy} />
            <PreviewItem label="Applicable Criteria" value={`${applicableCriteria?.length || 0} selected`} />
        </div>
      </div>
    </div>
  );
}
