export interface Company {
  id: string;
  name: string;
  nseIndustry: string;
  subIndustry: string;
  registeredOffice: string;
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
  sampleFormatUrl?: string;
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

export interface SectionData {
  applicable: 'Applicable' | 'Not Applicable' | 'Not Available';
  tableRows: TableRowData[];
  comments: string;
  attachments: Attachment[];
}

export interface RatingNote {
  id: string;
  companyId: string;
  templateId: string;
  createdBy: string;
  status: string;
  currencyDenomination: string;
  scale: string;
  decimalPrecision: number;
  sections: {
    [sectionId: string]: SectionData;
  };
  createdAt: string;
  company: Company;
  template: Template;
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
