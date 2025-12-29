
import { getCompanyById } from '@/lib/data';
import { notFound } from 'next/navigation';
import CompanyInfoPage from '@/components/company-info/CompanyInfoPage';

export default async function CompanyInformation({
  params,
  searchParams,
}: {
  params: { companyId: string };
  searchParams: { applicationId: string; ratingCycleId: string };
}) {
  const company = await getCompanyById(params.companyId);

  if (!company) {
    notFound();
  }

  return (
    <CompanyInfoPage
      company={company}
      applicationId={searchParams.applicationId}
      ratingCycleId={searchParams.ratingCycleId}
    />
  );
}

