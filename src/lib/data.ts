import type {
  Company,
  FinancialData,
  RatingNote,
  Template,
  TooltipData,
  Sector,
  IndustryMapping,
  User,
  Criteria,
  BankFacilitiesData,
  AnalystDetails,
  WorkflowInstrument,
  RatingRecommendation,
  QCSectorSpecialistData,
  SummaryHygieneChecksData,
  RichTextContent,
  KeyUpdatesContent,
  AnalyticalApproachData,
  ModelSummaryRow,
  ParentGovSupportData,
  CEChecklistData,
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
        tooltipKey: 'cover.disclosureOfInterest'
      },
      {
        id: 's_key_updates',
        title: '1. About the Company and Key Updates',
        hasTable: false,
      },
       {
        id: 's_analytical_approach',
        title: '2. Analytical Approach',
        hasTable: false,
      },
       {
        id: 's_model_summary',
        title: '3. Model Summary',
        hasTable: false,
      },
       {
        id: 's_parent_gov_support',
        title: '4. Parent/Government Support Framework',
        hasTable: false,
      },
      {
        id: 's_ce_checklist',
        title: '5. Checklist for CE Rating',
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
  },
  {
    key: 'cover.bankFacilities.volume',
    text: 'Please put previous year’s figure of volume in brackets.'
  },
  {
    key: 'cover.bankFacilities.existingRating',
    text: 'If existing rating is under watch or having positive/negative outlook, please cover the reasons for it below this table.'
  },
  {
    key: 'about.company',
    text: 'Provide a brief overview of the company\'s operations, history, and market position. This content can be refreshed from rule-based data sources.'
  },
  {
    key: 'about.group',
    text: 'Describe the parent group or holding company structure, if applicable. Explain the relationship and any support from the parent.'
  }
];

const bankFacilitiesData: BankFacilitiesData = {
  totalAmountCrore: 245.75,
  currency: "INR",
  facilities: [
    {
      facilityType: "Cash Credit",
      volumeCrore: 50,
      existingRating: "CARE A+; Stable",
      proposedRating: "CARE AA-; Stable",
      remarks: "Increase in working capital limits."
    },
    {
      facilityType: "Term Loan",
      volumeCrore: 195.75,
      existingRating: "CARE A; Positive",
      proposedRating: "CARE A+; Stable",
      remarks: "Project completion achieved."
    }
  ]
};

const analystDetailsData: AnalystDetails = {
    analyst1: 'Rahul Sharma',
    groupHead: 'Ananya Mehta',
    ratingHead: 'Vikram Nair',
    qcHead: 'Sanjay Patel',
};

const qcSpecialistsData: QCSectorSpecialistData[] = [
  { id: 'qc-1', name: "John Doe", qcObservations: "Observation 1", reason: "Reason 1" },
  { id: 'qc-2', name: "Jane Smith", qcObservations: "Observation 2", reason: "Reason 2" },
];

const hygieneChecksData: SummaryHygieneChecksData = {
  negativeObservations: {
    NDS: "No",
    CIBIL: "No",
    BankStatements: "Yes",
    RegulatoryDeclaration: "No",
    AuditorReport: "No",
    DebtListed: "Not Applicable",
    HistoricalDefault: "No"
  },
  incorporationDate: "2005-04-12",
  natureOfBusiness: "Basic Industry - Chemicals",
  constitution: "Private Limited",
  group: "ABC Group",
  offices: {
    registered: "Mumbai, India",
    corporate: "Mumbai, India"
  },
  cfo: "John Doe",
  ceo: "Jane Smith",
  chairman: "Mr. Chairman",
  companySecretary: "Alice Johnson",
  numEmployees: "550",
  email: "contact@sampleindustries.com",
  website: "https://sampleindustries.com",
  controllingOffice: "Mumbai HO",
  auditorName: "Audit & Co.",
  auditorReasonChange: "N/A",
  auditorMembershipNo: "12345",
  auditorSigningAuthority: "Yes",
  CIN: "L12345MH2025PLC123456",
  ownershipStructure: "Closely held by promoters",
  oneTimeSettlement: "No",
  listedOn: ["NSE", "BSE"]
};

const keyUpdatesData: KeyUpdatesContent = {
    aboutCompanyText: "Sample Industries Ltd. is a leading manufacturer in the chemicals industry, specializing in specialty chemicals and solvents. Established in 2005, the company has grown to become a key player in the domestic market.",
    aboutCompanyComments: "Initial comments on company overview.",
    aboutGroupText: "Sample Industries Ltd. is part of the larger 'Sample Group', which has interests in pharmaceuticals and logistics. The group provides strategic oversight and financial support.",
    aboutGroupComments: "",
    keyRatingDriversText: "1. Strong market position in niche chemical segments.\n2. Experienced management team.\n3. Moderation in profitability margins.",
    keyRatingDriversComments: "",
    keyUpdatesText: "1. Recently commissioned a new manufacturing plant in Dahej, Gujarat.\n2. Acquired a minority stake in a logistics startup to improve supply chain.",
    keyUpdatesComments: "",
};

const analyticalApproachData: AnalyticalApproachData = {
  selectedApproach: 'Quantitative Approach',
  ceApplicable: '',
  guarantor: '',
  guarantorRatingAvailable: '',
  comments: '',
  annexureAttachments: [],
};

const modelSummaryData: ModelSummaryRow[] = [
    { id: 'ms-1', heading: "Management Risk", ratingModel: "AA", ratingTeam: "", remarks: "" },
    { id: 'ms-2', heading: "Operational Risk", ratingModel: "A+", ratingTeam: "", remarks: "" },
    { id: 'ms-3', heading: "Financial Risk", ratingModel: "A", ratingTeam: "", remarks: "" },
    { id: 'ms-4', heading: "Industry Risk", ratingModel: "AA-", ratingTeam: "", remarks: "" },
    { id: 'ms-5', heading: "Project Risk", ratingModel: "A+", ratingTeam: "", remarks: "" },
    { id: 'ms-6', heading: "Notch up/down considered", ratingModel: "NA", ratingTeam: "", remarks: "" },
    { id: 'ms-7', heading: "Correction for constitution", ratingModel: "NA", ratingTeam: "", remarks: "" },
    { id: 'ms-8', heading: "Final Standalone Rating", ratingModel: "AA", ratingTeam: "", remarks: "" },
    { id: 'ms-9', heading: "Final Rating after Notching", ratingModel: "AA", ratingTeam: "", remarks: "" },
    { id: 'ms-10', heading: "Final Rating Recommendation", ratingModel: "AA", ratingTeam: "", remarks: "" }
];

const parentGovSupportData: ParentGovSupportData = {
    parentSupport: {
        selection: "",
        rows: [
            { id: 1, particular: "Strategic importance to Parent Company", scoreRange: [0,5], analystScore: 0, reasoning: "" },
            { id: 2, particular: "Extent of Parent Shareholding", scoreRange: [0,5], analystScore: 0, reasoning: "" },
            { id: 3, particular: "Economic incentive to Parent", scoreRange: [0,10], analystScore: 0, reasoning: "" },
            { id: 4, particular: "Extent of Management Control", scoreRange: [0,10], analystScore: 0, reasoning: "" },
            { id: 5, particular: "Shared Name", scoreRange: [0,5], analystScore: 0, reasoning: "" },
            { id: 6, particular: "Stated Posture", scoreRange: [0,5], analystScore: 0, reasoning: "" },
            { id: 7, particular: "Domiciled in the Same Country", scoreRange: [0,5], analystScore: 0, reasoning: "" },
            { id: 8, particular: "Listing Status", scoreRange: [0,4], analystScore: 0, reasoning: "" },
            { id: 9, particular: "Track record of support to group companies", scoreRange: [0,10], analystScore: 0, reasoning: "" }
        ],
        calculations: { economicIncentive: 0, moralObligation: 0, totalScore: 0, extentNotchUp: 0 },
        comments: ""
    },
    governmentSupport: {
        selection: "",
        rows: [
            { id: 1, particular: "Policy Function Served", scoreRange: [0,10], analystScore: 0, reasoning: "" },
            { id: 2, particular: "Extent of Parent Shareholding of Govt/PSE", scoreRange: [0,15], analystScore: 0, reasoning: "" },
            { id: 3, particular: "Extent of Management Control", scoreRange: [0,25], analystScore: 0, reasoning: "" },
            { id: 4, particular: "Track Record of Support to entity", scoreRange: [0,10], analystScore: 0, reasoning: "" }
        ],
        calculations: { strategicImportance: 0, moralObligation: 0, totalScore: 0, extentNotchUp: 0 },
        comments: ""
    }
};

const ceChecklistData: CEChecklistData = {
  ceRatingSelection: '',
  ceType: '',
  locBackedRatingsTable: [
    { id: 1, parameter: 'Parameter 1', asPerModel: 'Value A', analystComments: '' },
    { id: 2, parameter: 'Parameter 2', asPerModel: 'Value B', analystComments: '' }
  ],
  guaranteedRatingsTable: [
    { id: 1, parameter: 'Parameter X', asPerModel: 'Value Y', analystComments: '' },
    { id: 2, parameter: 'Parameter Z', asPerModel: 'Value W', analystComments: '' }
  ],
  combinedViewSelection: '',
  combinedViewTable: [
      { id: 'cv-1', 'Column 1': 'Data 1', 'Column 2': 'Data A' },
      { id: 'cv-2', 'Column 1': 'Data 2', 'Column 2': 'Data B' }
  ],
  comments: {
    locBackedComments: '',
    guaranteedComments: '',
    combinedViewComments: ''
  }
};


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
    version: '1.0',
    rcmDate: '2024-08-15',
    sections: {
      s1: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '<h1>Cover Page Comments</h1><p>Initial draft of the cover page is ready.</p>',
        attachments: [],
        disclosure: {
          independentDirectors: 'No director has disclosed any conflict of interest for FY2024.',
          managingDirector: 'CEO has no declared interests in rated entities.',
        },
        bankFacilities: bankFacilitiesData,
        analystDetails: analystDetailsData,
        qcSpecialists: qcSpecialistsData,
        careAndCrasText: "CARE and other CRAs (Click here for their history, sensitivities and key factors)",
        summaryHygieneChecks: hygieneChecksData,
      },
      s_key_updates: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        keyUpdatesContent: keyUpdatesData,
      },
       s_analytical_approach: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        analyticalApproach: analyticalApproachData
      },
       s_model_summary: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        modelSummary: modelSummaryData,
      },
      s_parent_gov_support: {
          applicable: 'Applicable',
          tableRows: [],
          comments: '',
          attachments: [],
          parentGovSupport: parentGovSupportData,
      },
      s_ce_checklist: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        ceChecklist: ceChecklistData,
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

export const getDisclosureData = async (companyId: string): Promise<any> => {
    console.log(`Fetching disclosure data for company: ${companyId}`);
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would fetch from an external API
    if (companyId === '1') {
        return {
            independentDirectors: 'No director has disclosed any conflict of interest for FY2024.',
            managingDirector: 'CEO has no declared interests in rated entities.',
        };
    }
    return null;
}

export const getBankFacilitiesData = async (companyId: string): Promise<BankFacilitiesData | null> => {
    console.log(`Fetching bank facilities data for company: ${companyId}`);
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));

    if (companyId === '1') {
        return bankFacilitiesData;
    }
    return null;
}

export const getAnalystDetails = async (noteId: string): Promise<AnalystDetails | null> => {
    console.log(`Fetching analyst details for note: ${noteId}`);
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));

    // In a real app, this would be based on the noteId or associated users
    if (noteId === '1') {
        return analystDetailsData;
    }
    return null;
}

const workflowData: WorkflowInstrument[] = [
  { instrument: "Instrument 1", category: "Long Term Instruments", LT: "CARE AA+; Stable", ST: "", LTST: "" },
  { instrument: "Instrument 2", category: "LT/ST Instrument", LT: "CARE AAA; Stable", ST: "CARE A1+", LTST: "" },
  { instrument: "Instrument 3", category: "Short Term Instruments", LT: "", ST: "CARE A1+", LTST: "" },
  { instrument: "Instrument 4", category: "Bank Facilities", LT: "CARE A+", ST: "", LTST: "" },
  { instrument: "Instrument 5", category: "Long Term Instruments", LT: "CARE AA+; Stable", ST: "", LTST: "" },
  { instrument: "Instrument 6", category: "Bank Facilities", LT: "CARE A-", ST: "", LTST: "" }
];

const getConcatenatedRatings = (data: WorkflowInstrument[], column: "LT" | "ST") => {
  const relevant = data
    .filter(item => ["Bank Facilities","Long Term Instruments","LT/ST Instrument","Medium Term Instruments"].includes(item.category))
    .map(item => item[column])
    .filter(Boolean);
  const uniqueRatings = [...new Set(relevant)];
  return uniqueRatings.join(", ");
};

export const getRatingRecommendation = async (noteId: string): Promise<RatingRecommendation | null> => {
    console.log(`Fetching rating recommendation data for note: ${noteId}`);
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));

    if (noteId === '1') {
        return {
          LT: getConcatenatedRatings(workflowData, "LT"),
          ST: getConcatenatedRatings(workflowData, "ST"),
          unsupported: workflowData.find(d => d.instrument === 'Instrument 2')?.LT || '',
          pendingSteps: workflowData.find(d => d.instrument === 'Instrument 3')?.ST || '',
        };
    }

    return null;
}

export const getQCSpecialists = async (noteId: string): Promise<QCSectorSpecialistData[] | null> => {
    console.log(`Fetching QC specialists for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (noteId === '1') {
        return qcSpecialistsData;
    }

    return null;
};

export const getSummaryHygieneChecksData = async (noteId: string): Promise<SummaryHygieneChecksData | null> => {
    console.log(`Fetching summary hygiene checks data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (noteId === '1') {
        return hygieneChecksData;
    }

    return null;
}

export const getAboutCompanyData = async (companyId: string, forceRefresh = false): Promise<RichTextContent> => {
  console.log(`Fetching about company data for company: ${companyId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if(forceRefresh) {
      // Simulate fetching slightly different data on refresh
      return {
        aboutCompanyText: "Sample Industries Ltd. is a leading manufacturer in the chemicals industry, specializing in specialty chemicals and solvents. Established in 2005, the company has grown to become a key player in the domestic market. (Refreshed)",
        aboutCompanyComments: "",
        aboutGroupText: "Sample Industries Ltd. is part of the larger 'Sample Group', which has interests in pharmaceuticals and logistics. The group provides strategic oversight and financial support. (Refreshed)",
        aboutGroupComments: ""
      };
  }

  return {
    aboutCompanyText: "Sample Industries Ltd. is a leading manufacturer in the chemicals industry, specializing in specialty chemicals and solvents. Established in 2005, the company has grown to become a key player in the domestic market.",
    aboutCompanyComments: "Initial comments on company overview.",
    aboutGroupText: "Sample Industries Ltd. is part of the larger 'Sample Group', which has interests in pharmaceuticals and logistics. The group provides strategic oversight and financial support.",
    aboutGroupComments: ""
  };
}


export const getKeyUpdatesData = async (companyId: string, forceRefresh = false): Promise<KeyUpdatesContent> => {
  console.log(`Fetching key updates data for company: ${companyId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if(forceRefresh) {
      return {
        ...keyUpdatesData,
        aboutCompanyText: keyUpdatesData.aboutCompanyText + " (Refreshed).",
      };
  }

  return keyUpdatesData;
}

export const getAnalyticalApproachData = async (noteId: string): Promise<AnalyticalApproachData | null> => {
    console.log(`Fetching analytical approach data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (noteId === '1') {
        return analyticalApproachData;
    }

    return null;
}


export const getModelSummaryData = async (noteId: string): Promise<ModelSummaryRow[] | null> => {
    console.log(`Fetching model summary data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return modelSummaryData;
    }
    return null;
}

export const getParentGovSupportData = async (noteId: string): Promise<ParentGovSupportData | null> => {
    console.log(`Fetching parent/government support data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return parentGovSupportData;
    }
    return null;
}

export const getCEChecklistData = async (noteId: string): Promise<CEChecklistData | null> => {
    console.log(`Fetching CE checklist data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return ceChecklistData;
    }
    return null;
}
