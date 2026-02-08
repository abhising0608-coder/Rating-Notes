
import type { CompanyMasterInfo as CompanyMasterInfoType } from '@/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '../ui/card';

interface InfoFieldProps {
  label: string;
  value: string | undefined | null;
}

const InfoField = ({ label, value }: InfoFieldProps) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value || 'N/A'}</p>
  </div>
);

export default function CompanyMasterInfo({
  masterInfo,
}: {
  masterInfo: CompanyMasterInfoType;
}) {
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger className="text-xl font-headline">
        Company Master Information (Read-Only)
      </AccordionTrigger>
      <AccordionContent>
        <Card className="bg-muted/50">
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <InfoField label="Address" value={masterInfo.address} />
              <InfoField label="City" value={masterInfo.city} />
              <InfoField label="Zip Code" value={masterInfo.zipCode} />
              <InfoField label="State" value={masterInfo.state} />
              <InfoField label="Country" value={masterInfo.country} />
              <InfoField label="Listing Status" value={masterInfo.listingStatus} />
              <InfoField label="Listing In" value={masterInfo.listingIn} />
              <InfoField
                label="Macro Economic Indicator"
                value={masterInfo.macroEconomicIndicator}
              />
              <InfoField label="Sector" value={masterInfo.sector} />
              <InfoField label="Industry" value={masterInfo.industry} />
              <InfoField label="Basic Industry" value={masterInfo.basicIndustry} />
            </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
