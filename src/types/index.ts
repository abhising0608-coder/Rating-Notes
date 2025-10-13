export interface Company {
  id: string;
  name: string;
  nseIndustry: string;
  subIndustry: string;
  registeredOffice: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Analyst' | 'Admin';
}

export interface Criteria {
  id: string;
  title: string;
  description: string;
  sectorMapping: string[];
}

export interface TemplateSection {
  id: string;
  key: string;
  title: string;
  hasTable: boolean;
  tableSchemaId?: string;
  instructions?: string;
  mandatoryDropdown?: boolean;
  allowAddRow?: boolean;
  tooltipKey?: string;
}

export interface Template {
  id: string;
  name: string;
  sector: string;
  subSector?: string;
  isAgnostic: boolean;
  version: string;
  effectiveFrom: string;
  description?: string;
  sampleFormatUrl?: string | null;
  sections: Omit<TemplateSection, 'key' | 'tableSchemaId'>[];
  industryMapping: string[];
  createdAt: string;
  createdBy: string;
}

export interface TableRowData {
  [key: string]: any;
  id: string;
  isManual?: boolean;
  manualEdit?: boolean;
  mappedAttributeId?: string;
}

export interface Attachment {
  id: string;
  url: string;
  type: string;
  name: string;
}

export interface BankFacility {
  facilityType: string;
  volumeCrore: number;
  existingRating: string;
  proposedRating: string;
  remarks: string;
}

export interface BankFacilitiesData {
  totalAmountCrore: number;
  currency: string;
  facilities: BankFacility[];
}

export interface AnalystDetails {
  analyst1: string;
  groupHead: string;
  ratingHead: string;
  qcHead: string;
}

export interface SectionData {
  applicable: 'Applicable' | 'Not Applicable' | 'Not Available';
  tableRows: TableRowData[];
  comments: string;
  attachments: Attachment[];
  disclosure?: {
    independentDirectors: string;
    managingDirector: string;
  };
  bankFacilities?: BankFacilitiesData;
  analystDetails?: AnalystDetails;
}

export interface RatingNote {
  id: string;
  companyId: string;
  templateId: string;
  analysts: string[];
  financialApproach: 'Standalone' | 'Consolidated' | 'Combined';
  combinedEntities?: string[];
  financialYearFrom: number;
  financialYearTo: number;
  operationalApproach: 'Standalone' | 'Consolidated';
  operationalYearFrom: number;
  operationalYearTo: number;
  currencyDenomination: string;
  scale: string;
  decimalPrecision: number;
  zeroRowPolicy: 'Delete' | 'No Deletion';
  zeroColumnPolicy: 'Delete' | 'No Deletion';
  highlightZeros: boolean;
  applicableCriteria: string[];
  description: string;
  status: string;
  createdBy: string;
  sections: {
    [sectionId: string]: SectionData;
  };
  createdAt: string;
  company: Company;
  template: Template;
  version?: string;
  rcmDate?: string;
}

export interface FinancialData {
  companyId: string;
  year: number;
  tableId: string;
  rows: TableRowData[];
}

export interface TooltipData {
  key: string;
  text: string;
  sectorOverrides?: {
    [sector: string]: string;
  };
}

export interface Sector {
  id: string;
  name: string;
  subSectors: string[];
  templateIds: string[];
}

export interface IndustryMapping {
  nseIndustryCode: string;
  description: string;
  recommendedTemplateIds: string[];
}
