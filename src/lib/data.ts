import type {
  Company,
  FinancialData,
  RatingNote,
  Template,
  TooltipData,
  Sector,
  IndustryMapping,
  User,
  Criteria
} from '@/types';

const companies: Company[] = [
  {
    id: '1',
    name: 'Sample Industries Ltd',
    nseIndustry: 'NSE_MANUFACTURING',
    subIndustry: 'Heavy Machinery',
    registeredOffice: '123 Industrial Way, Mumbai, India',
  },
  {
    id: '2',
    name: 'Tech Solutions Inc.',
    nseIndustry: 'NSE_IT',
    subIndustry: 'Software Development',
    registeredOffice: '456 Tech Park, Bangalore, India',
  },
   {
    id: '3',
    name: 'General Goods Co.',
    nseIndustry: 'NSE_MISCELLANEOUS',
    subIndustry: 'Retail',
    registeredOffice: '789 Market St, Delhi, India',
  },
];

const users: User[] = [
    { id: 'u_001', name: 'Ananlyst 1', email: 'analyst1@example.com', role: 'Analyst' },
    { id: 'u_002', name: 'Ananlyst 2', email: 'analyst2@example.com', role: 'Analyst' },
    { id: 'u_003', name: 'Ananlyst 3', email: 'analyst3@example.com', role: 'Analyst' },
    { id: 'admin_01', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
];

const criteria: Criteria[] = [
    { id: 'cr_001', title: 'Capital Adequacy and Leverage', description: 'Evaluate company leverage ratio and solvency metrics.', sectorMapping: ['Manufacturing', 'BFSI', 'Agnostic'] },
    { id: 'cr_002', title: 'Liquidity Position', description: 'Assess short-term liquidity and cash flow health.', sectorMapping: ['Manufacturing', 'Agnostic'] },
    { id: 'cr_003', title: 'Client Concentration Risk', description: 'Analyze revenue dependency on top clients.', sectorMapping: ['Technology'] },
    { id: 'cr_004', title: 'Regulatory Compliance', description: 'Check adherence to industry-specific regulations.', sectorMapping: ['BFSI'] },
];

const templates: Template[] = [
  {
    id: 'tmpl_001',
    name: 'Manufacturing - Heavy Engineering',
    sector: 'Manufacturing',
    subSector: 'Heavy Engineering',
    isAgnostic: false,
    version: 'v1.0',
    effectiveFrom: '2024-01-01',
    description: 'Template for Manufacturing sector - Heavy Engineering.',
    sampleFormatUrl: '/samples/template_manufacturing_v1.xlsx',
    sections: [
      {
        id: 's1',
        title: 'Cover Page',
        hasTable: false,
      },
      {
        id: 's2',
        title: 'Financial Summary',
        hasTable: true,
        allowAddRow: true,
        instructions: 'All figures in millions. Data sourced from annual reports. Add manual rows for adjustments.',
      },
      {
        id: 's3',
        title: 'Risk Assessment',
        hasTable: true,
        allowAddRow: false,
        instructions: 'Assess risks based on the provided framework.',
      },
    ],
    industryMapping: ['NSE_MANUFACTURING', 'NSE_HEAVY_ENGG'],
    createdAt: '2023-12-01T10:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'tmpl_002',
    name: 'IT Services Template',
    sector: 'Technology',
    subSector: 'IT Services',
    isAgnostic: false,
    version: 'v1.2',
    effectiveFrom: '2024-02-01',
    description: 'Standard template for IT services and consulting companies.',
    sampleFormatUrl: '/samples/template_it_v1.xlsx',
    sections: [
       { id: 's_it_1', title: 'Client Concentration', hasTable: true, allowAddRow: false },
       { id: 's_it_2', title: 'Service Offering Mix', hasTable: true, allowAddRow: true }
    ],
    industryMapping: ['NSE_IT'],
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'tmpl_agn_01',
    name: 'Sector-Agnostic General',
    sector: 'Agnostic',
    isAgnostic: true,
    version: 'v1.0',
    effectiveFrom: '2024-01-01',
    description: 'A general-purpose template for any sector.',
    sampleFormatUrl: null,
    sections: [
      { id: 's_common_1', title: 'Generic Financial Assessment', hasTable: true },
      { id: 's_common_2', title: 'SWOT Analysis', hasTable: false }
    ],
    industryMapping: [],
    createdAt: '2023-11-01T10:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'tmpl_agn_02',
    name: 'Sector-Agnostic Start-up',
    sector: 'Agnostic',
    isAgnostic: true,
    version: 'v1.1',
    effectiveFrom: '2024-03-01',
    description: 'Template for early-stage companies and start-ups.',
    sampleFormatUrl: null,
    sections: [
      { id: 's_su_1', title: 'Funding Overview', hasTable: true },
      { id: 's_su_2', title: 'Growth Projections', hasTable: true }
    ],
    industryMapping: [],
    createdAt: '2024-02-20T10:00:00Z',
    createdBy: 'system'
  }
];

const sectors: Sector[] = [
  {
    id: 'sector_manufacturing',
    name: 'Manufacturing',
    subSectors: ['Heavy Engineering', 'Textiles', 'Automotive', 'Chemicals'],
    templateIds: ['tmpl_001'],
  },
  {
    id: 'sector_technology',
    name: 'Technology',
    subSectors: ['IT Services', 'SaaS', 'Hardware'],
    templateIds: ['tmpl_002'],
  },
  {
    id: 'sector_agnostic',
    name: 'Agnostic',
    subSectors: [],
    templateIds: ['tmpl_agn_01', 'tmpl_agn_02'],
  },
];

const industryMappings: IndustryMapping[] = [
  {
    nseIndustryCode: 'NSE_MANUFACTURING',
    description: 'NSE Industry - Manufacturing',
    recommendedTemplateIds: ['tmpl_001'],
  },
  {
    nseIndustryCode: 'NSE_IT',
    description: 'NSE Industry - Information Technology',
    recommendedTemplateIds: ['tmpl_002'],
  },
  {
    nseIndustryCode: 'NSE_MISCELLANEOUS',
    description: 'NSE Industry - Miscellaneous',
    recommendedTemplateIds: ['tmpl_agn_01', 'tmpl_agn_02'],
  },
];


const financialData: FinancialData[] = [
  {
    companyId: '1',
    year: 2024,
    tableId: 'financials',
    rows: [
      { id: 'fin-1', 'Particulars': 'Revenue', '2024': 1200, '2023': 1100, mappedAttributeId: 'attr_revenue', isManual: false },
      { id: 'fin-2', 'Particulars': 'EBITDA', '2024': 300, '2023': 280, mappedAttributeId: 'attr_ebitda', isManual: false },
      { id: 'fin-3', 'Particulars': 'Net Profit', '2024': 150, '2023': 140, mappedAttributeId: 'attr_netprofit', isManual: false },
    ],
  },
  {
    companyId: '1',
    year: 2024,
    tableId: 'risk_assessment',
     rows: [
      { id: 'risk-1', 'Risk Category': 'Market Risk', 'Assessment': 'Moderate', 'Mitigation': 'Diversification of product lines.' },
      { id: 'risk-2', 'Risk Category': 'Operational Risk', 'Assessment': 'Low', 'Mitigation': 'Strong internal controls in place.' },
    ],
  }
];

const tooltips: TooltipData[] = [
  {
    key: 'cover.disclosureOfInterest',
    text: 'Details to be mentioned only when conflicts of interest exist. Refer to compliance policy 2.1.',
    sectorOverrides: {
      BFSI: 'For Banks and Financial Services, disclose all related party transactions as per regulatory guidelines.',
    },
  },
  {
    key: 'financials.ebitda',
    text: 'Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of a company\'s overall financial performance.'
  },
  {
    key: 'section.applicable',
    text: 'Select "Applicable" if this section is relevant for the rating. "Not Applicable" will hide the section\'s content from the final report but retain comments. "Not Available" implies data could not be sourced.'
  }
];

const ratingNotes: Omit<RatingNote, 'company' | 'template'>[] = [
  {
    id: '1',
    companyId: '1',
    templateId: 'tmpl_001',
    createdBy: 'user1',
    status: 'In Progress',
    currencyDenomination: 'INR',
    scale: 'Long Term',
    decimalPrecision: 2,
    createdAt: '2024-07-29T10:00:00Z',
    analysts: ['u_001', 'u_002'],
    financialApproach: 'Standalone',
    financialYearFrom: 2022,
    financialYearTo: 2024,
    operationalApproach: 'Standalone',
    operationalYearFrom: 2022,
    operationalYearTo: 2024,
    zeroRowPolicy: 'Delete',
    zeroColumnPolicy: 'Delete',
    highlightZeros: false,
    applicableCriteria: ['cr_001', 'cr_002'],
    description: 'FY22-24 rating note.',
    sections: {
      s1: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '<h1>Cover Page Comments</h1><p>Initial draft of the cover page is ready.</p>',
        attachments: [],
      },
      s2: {
        applicable: 'Applicable',
        tableRows: financialData.find(fd => fd.tableId === 'financials')?.rows || [],
        comments: '<p>Financials look stable with moderate growth.</p>',
        attachments: [
          { id: 'att-1', name: 'Annual Report 2024.pdf', type: 'application/pdf', url: '#' }
        ],
      },
       s3: {
        applicable: 'Not Applicable',
        tableRows: financialData.find(fd => fd.tableId === 'risk_assessment')?.rows || [],
        comments: '<p>Risk assessment deferred to next quarter.</p>',
        attachments: [],
      },
    },
  },
];

// Simulate DB calls
export const getRatingNotes = async (): Promise<RatingNote[]> => {
  return ratingNotes.map(note => ({
    ...note,
    company: companies.find(c => c.id === note.companyId)!,
    template: templates.find(t => t.id === note.templateId)!,
  }));
};

export const getRatingNoteById = async (id: string): Promise<RatingNote | undefined> => {
  const note = ratingNotes.find(n => n.id === id);
  if (!note) return undefined;
  return {
    ...note,
    company: companies.find(c => c.id === note.companyId)!,
    template: templates.find(t => t.id === note.templateId)!,
  };
};

export const getFinancialData = async (companyId: string, tableId: string): Promise<FinancialData | undefined> => {
  return financialData.find(fd => fd.companyId === companyId && fd.tableId === tableId);
}

export const getTooltips = async (): Promise<TooltipData[]> => {
  return tooltips;
}

export const getTooltipByKey = async (key: string): Promise<TooltipData | undefined> => {
  return tooltips.find(t => t.key === key);
}

export const getCompanies = async (): Promise<Company[]> => {
    return companies;
}

export const getTemplates = async (): Promise<Template[]> => {
    return templates;
}

export const getSectors = async (): Promise<Sector[]> => {
    return sectors;
}

export const getIndustryMappings = async (): Promise<IndustryMapping[]> => {
    return industryMappings;
}

export const getUsers = async (): Promise<User[]> => {
    return users;
}

export const getCriteria = async (): Promise<Criteria[]> => {
    return criteria;
}
