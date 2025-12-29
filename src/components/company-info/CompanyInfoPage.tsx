

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  getCompanyInfo,
  getCombinedApproachGroups,
  getGroups,
} from '@/lib/data';
import type {
  Company,
  CompanyInfo,
  Group,
  Contact,
  Auditor,
  Banker,
  DebentureTrustee,
  Ipa,
  ThirdParty,
} from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion } from '@/components/ui/accordion';
import CompanyMasterInfo from './CompanyMasterInfo';
import GroupTagging from './GroupTagging';
import DetailSection from './DetailSection';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import CompanyContactDetails from './CompanyContactDetails';

interface CompanyInfoPageProps {
  company: Company;
  applicationId: string;
  ratingCycleId: string;
}

// Simulated RBAC - in a real app, this would come from an auth context
const currentUserRole = 'Rating Analyst';

export default function CompanyInfoPage({
  company,
  applicationId,
  ratingCycleId,
}: CompanyInfoPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = React.useState<CompanyInfo | null>(
    null
  );
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [combinedGroups, setCombinedGroups] = React.useState<Group[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // RBAC checks
  const isReadOnly = !['Rating Analyst'].includes(currentUserRole);
  const canEdit = currentUserRole === 'Rating Analyst';

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [info, groupData, combinedGroupData] = await Promise.all([
          getCompanyInfo(company.id),
          getGroups(),
          getCombinedApproachGroups(),
        ]);
        setCompanyInfo(info);
        setGroups(groupData);
        setCombinedGroups(combinedGroupData);
      } catch (error) {
        console.error('Failed to fetch company data:', error);
         toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load company information.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [company.id, toast]);

  const handleUpdate = React.useCallback(
    (key: keyof CompanyInfo, value: any) => {
      if (isReadOnly) return;
      setCompanyInfo((prev) => (prev ? { ...prev, [key]: value } : null));
    },
    [isReadOnly]
  );

  const handleSave = async () => {
    setIsSaving(true);
    console.log('Saving data for ratingCycleId:', ratingCycleId);
    console.log('Data to persist:', companyInfo);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: 'Success',
      description: 'Company information has been saved.',
    });
  };

  const handleCancel = () => {
    router.push('/portfolio');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Company Information...</p>
      </div>
    );
  }

  if (!companyInfo) {
    return (
       <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load company information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b -mx-8 px-8 mb-8">
        <div className="py-4 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold font-headline">{company.name}</h1>
                <p className="text-sm text-muted-foreground">
                    Rating Cycle ID: {ratingCycleId}
                </p>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving || isReadOnly}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save
                </Button>
            </div>
        </div>
      </header>

      <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-contact-details', 'item-auditor-details', 'item-banker-details', 'item-dt-details', 'item-ipa-details', 'item-third-party-details']} className="w-full">
          <CompanyMasterInfo masterInfo={companyInfo.masterSnapshot} />
          <GroupTagging
            groups={groups}
            combinedGroups={combinedGroups}
            selection={companyInfo.groupSelection}
            onUpdate={(value) => handleUpdate('groupSelection', value)}
            isEditable={canEdit}
          />
          <DetailSection<Contact>
              title="Contact Details"
              data={companyInfo.contactDetails}
              onUpdate={(value) => handleUpdate('contactDetails', value)}
              isEditable={canEdit}
              columns={[
                { key: 'name', label: 'Contact Name', mandatory: true },
                { key: 'designation', label: 'Designation' },
                { key: 'department', label: 'Department' },
                { key: 'email', label: 'Email' },
                { key: 'mobile', label: 'Mobile' },
              ]}
          />
          <DetailSection<Auditor>
              title="Auditor Details"
              data={companyInfo.auditorDetails}
              onUpdate={(value) => handleUpdate('auditorDetails', value)}
              isEditable={canEdit}
              columns={[
                { key: 'firmName', label: 'Firm Name', mandatory: true },
                { key: 'partnerName', label: 'Contact Person', mandatory: true },
                 { key: 'designation', label: 'Designation' },
                { key: 'email', label: 'Email ID' },
                { key: 'contactNumber', label: 'Contact No.' },
              ]}
          />
           <DetailSection<Banker>
              title="Banker Details"
              data={companyInfo.bankerDetails}
              onUpdate={(value) => handleUpdate('bankerDetails', value)}
              isEditable={canEdit}
              columns={[
                  { key: 'bankName', label: 'Bank Name', mandatory: true },
                  { key: 'name', label: 'Contact Person', mandatory: true },
                  { key: 'designation', label: 'Designation' },
                  { key: 'email', label: 'Email ID' },
                  { key: 'contactNumber', label: 'Contact No.' },
              ]}
          />
           <DetailSection<DebentureTrustee>
              title="DT Details"
              data={companyInfo.dtDetails}
              onUpdate={(value) => handleUpdate('dtDetails', value)}
              isEditable={canEdit}
              columns={[
                { key: 'name', label: 'Name of the DT', mandatory: true },
                { key: 'contactPerson', label: 'Contact Person', mandatory: true },
                { key: 'designation', label: 'Designation' },
                { key: 'email', label: 'Email ID' },
                { key: 'contactNumber', label: 'Contact No.' },
              ]}
          />
          <DetailSection<Ipa>
              title="IPA Details"
              data={companyInfo.ipaDetails}
              onUpdate={(value) => handleUpdate('ipaDetails', value)}
              isEditable={canEdit}
              columns={[
                { key: 'name', label: 'Name of the IPA', mandatory: true },
                { key: 'designation', label: 'Designation' },
                { key: 'email', label: 'Email' },
                { key: 'contactNumber', label: 'Contact Number' },
              ]}
          />
          <DetailSection<ThirdParty>
              title="Third Party Details"
              data={companyInfo.thirdPartyDetails}
              onUpdate={(value) => handleUpdate('thirdPartyDetails', value)}
              isEditable={canEdit}
               columns={[
                { key: 'type', label: 'Relation with the Client', mandatory: true },
                { key: 'name', label: 'Firm Name', mandatory: true },
                { key: 'designation', label: 'Contact Person' },
                { key: 'email', label: 'Email' },
                { key: 'contactNumber', label: 'Contact Number' },
              ]}
          />
      </Accordion>
    </div>
  );
}
