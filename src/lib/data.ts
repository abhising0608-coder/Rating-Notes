import type {
  Company,
  FinancialData,
  RatingNote,
  Template,
  TooltipData,
} from '@/types';

const companies: Company[] = [
  {
    id: '1',
    name: 'Sample Industries Ltd',
    nseIndustry: 'Industrial Manufacturing',
    subIndustry: 'Heavy Machinery',
    registeredOffice: '123 Industrial Way, Mumbai, India',
  },
];

const templates: Template[] = [
  {
    id: 't1',
    name: 'Standard Industrial Rating',
    sector: 'Industrial',
    sections: [
      {
        id: 's1',
        key: 'cover',
        title: 'Cover Page',
        hasTable: false,
      },
      {
        id: 's2',
        key: 'financials',
        title: 'Financial Summary',
        hasTable: true,
        allowAddRow: true,
        instructions: 'All figures in millions. Data sourced from annual reports. Add manual rows for adjustments.',
        tableSchemaId: 'financialSummarySchema'
      },
      {
        id: 's3',
        key: 'risk_assessment',
        title: 'Risk Assessment',
        hasTable: true,
        allowAddRow: false,
        instructions: 'Assess risks based on the provided framework.',
        tableSchemaId: 'riskAssessmentSchema'
      },
    ],
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
    templateId: 't1',
    createdBy: 'user1',
    status: 'In Progress',
    currencyDenomination: 'INR',
    scale: 'Long Term',
    decimalPrecision: 2,
    createdAt: '2024-07-29T10:00:00Z',
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
