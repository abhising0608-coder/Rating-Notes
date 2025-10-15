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
  LinkedRatingsData,
  FinancialsPastProjectedData,
  InterimResultsData,
  QuarterlyFinancialsData,
  LiquidityData,
  AboutCompanyData,
  StatusOfNonCooperationData,
  AnyOtherInformationData,
  ConsolidatedEntity,
  PeerCompany,
  BoardCompositionData,
  GoodwillAssessmentData,
  BalanceSheetData,
  ContingentLiabilitiesData,
  ProfitAndLossData,
  CashFlowData,
  RatioAnalysisData,
  PreviousRCMMinutesData,
  RCMMinute,
  AddressedQCObservationData,
  PastRatingSensitivitiesData,
  ManagementDiscussionData,
  DiscussionWithAuditCommitteeData,
  Checklist,
} from '@/types';
import { format } from 'date-fns';

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
    { id: 'cr_001', title: 'Capital Adequacy and Leverage', description: 'Evaluate company leverage ratio and solvency metrics.', sectorMapping: ['Manufacturing', 'BFSI', 'Agnostic'], pdfUrl: "https://www.careratings.com/upload/criteria/new%20cr/Capital%20Adequacy%20and%20Leverage.pdf" },
    { id: 'cr_002', title: 'Liquidity Position', description: 'Assess short-term liquidity and cash flow health.', sectorMapping: ['Manufacturing', 'Agnostic'], pdfUrl: "https://www.careratings.com/upload/criteria/new%20cr/Liquidity%20Analysis%20of%20Non-financial%20Sector%20Entities.pdf" },
    { id: 'cr_003', title: 'Client Concentration Risk', description: 'Analyze revenue dependency on top clients.', sectorMapping: ['Technology'], pdfUrl: "https://www.careratings.com/upload/criteria/new%20cr/Client%20Concentration%20Risk.pdf" },
    { id: 'cr_004', title: 'Regulatory Compliance', description: 'Check adherence to industry-specific regulations.', sectorMapping: ['BFSI'], pdfUrl: "https://www.careratings.com/upload/criteria/new%20cr/Regulatory%20Compliance.pdf" },
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
        id: 's_about_company',
        title: 'About the company and industry',
        hasTable: false
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
        id: 's_linked_ratings',
        title: '6. Linked ratings',
        hasTable: true,
        allowAddRow: true,
        tooltipKey: 'linked.ratings',
      },
      {
        id: 's_board_composition',
        title: '7. Board of Directors / Partners',
        hasTable: false,
        tooltipKey: 'board.composition'
      },
      {
        id: 's_financials_past_projected',
        title: '7.1 Financials (Past/Projected)',
        hasTable: false, // It's a complex component now
      },
       {
        id: 's_interim_results',
        title: '7.2 For Interim Result Reviews',
        hasTable: false,
      },
      {
        id: 's_quarterly_financials',
        title: '7.3 Quarterly Financials',
        hasTable: false,
      },
      {
        id: 's_balance_sheet',
        title: '7.4 Balance Sheet',
        hasTable: false,
      },
      {
        id: 's_profit_loss',
        title: '7.5 Profit and Loss Statement',
        hasTable: false,
      },
      {
        id: 's_cash_flow_statement',
        title: '7.6 Cash Flow Statement',
        hasTable: false,
      },
      {
        id: 's_ratio_analysis',
        title: '7.7 Ratio Analysis',
        hasTable: false,
      },
      {
        id: 's_rcm_minutes',
        title: 'Previous RCM Minutes',
        hasTable: false,
        tooltipKey: 'rcm.minutes'
      },
      {
        id: 's_qc_observations',
        title: 'Addressed QC Observations',
        hasTable: true,
        allowAddRow: true,
      },
      {
        id: 's_past_rating_sensitivities',
        title: 'Status of Past Rating Sensitivities of CARE',
        hasTable: false,
      },
      {
        id: 's_management_discussion',
        title: 'Discussion with Management',
        hasTable: false,
      },
      {
        id: 's_discussion_audit_committee',
        title: 'Discussion with Audit Committee',
        hasTable: false,
        tooltipKey: 'discussion.auditCommittee',
      },
      {
        id: 's_cash_flow_assumptions',
        title: '8. Assumptions for Cash Flow',
        hasTable: false,
        tooltipKey: 'cashflow.assumptions',
      },
      {
        id: 's_sensitivity_analysis',
        title: '9. Sensitivity Analysis',
        hasTable: false,
        tooltipKey: 'sensitivity.analysis',
      },
      {
        id: 's_gst_calculation',
        title: '10. GST Calculation',
        hasTable: false,
        tooltipKey: 'gst.calculation',
      },
      {
        id: 's_projections_assumptions',
        title: '11. Assumptions for Projections',
        hasTable: false,
        tooltipKey: 'projections.assumptions',
      },
      {
        id: 's_non_interest_income',
        title: '12. Breakup of Non-interest Income',
        hasTable: true,
        allowAddRow: true
      },
      {
        id: 's_stressed_assets',
        title: '13. Details of Stressed Assets',
        hasTable: true,
        allowAddRow: true
      },
      {
        id: 's_rationale_drivers',
        title: 'Rationale and key rating drivers',
        hasTable: false,
        tooltipKey: 'rationale.drivers',
      },
      {
        id: 's_rating_sensitivities',
        title: 'Rating Sensitivities',
        hasTable: false,
      },
      {
        id: 's_analytical_approach_display',
        title: 'Analytical Approach',
        hasTable: false,
      },
      {
        id: 's_detailed_drivers',
        title: 'Detailed description of the key rating drivers',
        hasTable: false,
      },
      {
        id: 's_liquidity',
        title: 'Liquidity',
        hasTable: false,
      },
      {
        id: 's_esg_risks',
        title: 'Environmental, Social and Governance (ESG) Risks',
        hasTable: false,
      },
      {
        id: 's_non_cooperation_status',
        title: 'Status of Non-Cooperation with Previous CRA',
        hasTable: false,
        tooltipKey: 'noncooperation.status',
      },
      {
        id: 's_any_other_info',
        title: 'Any Other Information',
        hasTable: false,
        tooltipKey: 'any.other.info',
      },
      {
        id: 's_consolidated_entities',
        title: 'Annexure: List of Entities Consolidated',
        hasTable: false,
      },
      {
        id: 's_goodwill_assessment',
        title: 'Assessment of Goodwill Impairment (if any)',
        hasTable: false,
      },
      {
        id: 's_instrument_details',
        title: 'Details of Instruments',
        hasTable: true,
        allowAddRow: true,
        tooltipKey: 'instrument.details',
      }
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
  },
  {
    key: 'linked.ratings',
    text: 'This section is to be inserted in case ABC Ltd has extended guarantees/other forms of implicit/explicit support to other companies. In case there are no such linked ratings, this section is to be skipped.'
  },
  {
    key: 'board.composition',
    text: 'Highlight changes if any since last rating action.'
  },
  {
    key: 'cashflow.assumptions',
    text: 'Detail the assumptions made for cash flow projections. This section is critical for Infrastructure projects.'
  },
  {
    key: 'sensitivity.analysis',
    text: 'Detail the sensitivity analysis for cash flow projections. This section is critical for Infrastructure projects.'
  },
  {
    key: 'gst.calculation',
    text: 'Provide details about GST calculation methodology. This section is relevant for Infrastructure projects.'
  },
  {
    key: 'projections.assumptions',
    text: 'Provide details about the assumptions made for the projections.'
  },
  {
    key: 'rationale.drivers',
    text: 'Reason for upgrade / downgrade / reaffirmation / credit watch / outlook to be mentioned here. Please note: In case RC decided rating is different, this should be suitably changed while putting in the PR.'
  },
  {
    key: 'noncooperation.status',
    text: 'If previous CRA has rated the company under non-cooperation, display respective press release reference as per CART data.'
  },
  {
    key: 'any.other.info',
    text: 'This section auto-fetches Disclosure of Interest details from the CoC Portal. If no data is available, system shows ‘Not Applicable.’'
  },
  {
    key: 'kmp.composition',
    text: 'Comment on changes in senior management and KMP over the years.'
  },
  {
    key: 'instrument.details',
    text: 'If more than one tranche of instrument exists, give them in separate columns like series I, Series II etc.'
  },
  {
    key: 'rcm.minutes',
    text: 'A review for enhancement or reclassification for facilities etc. normally would not have had a detailed discussion and hence the earlier RCs minutes would have to be selected.'
  },
  {
    key: 'discussion.auditCommittee',
    text: 'Displays details of discussion held with the Audit Committee for the entity. Data is fetched from the core database and is read-only.'
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
      { id: 'cv-1', 'Column 1': 'Data 1', 'Column 2': 'Data A', 'Analyst Comments': '' },
      { id: 'cv-2', 'Column 1': 'Data 2', 'Column 2': 'Data B', 'Analyst Comments': '' }
  ],
  comments: {
    locBackedComments: '',
    guaranteedComments: '',
    combinedViewComments: ''
  }
};

const linkedRatingsData: LinkedRatingsData[] = [
    {
      id: 'lr-1',
      'Name of Company': "Reliance Retail",
      'Date': "2025-10-10",
      'Amount Rated': "1000000000",
      'Rating': "AA+",
    },
    {
      id: 'lr-2',
      'Name of Company': "Reliance Jio",
      'Date': "2025-09-25",
      'Amount Rated': "500000000",
      'Rating': "AAA",
    }
];

const financialsPastProjectedData: FinancialsPastProjectedData = {
    mainTable: [
        { id: 'fin-1', 'Particulars': 'Revenue', '2023A': 1100, '2024P': 1200, '2025E': 1300, isManual: false },
        { id: 'fin-2', 'Particulars': 'EBITDA', '2023A': 280, '2024P': 300, '2025E': 320, isManual: false },
        { id: 'fin-3', 'Particulars': 'Net Profit', '2023A': 140, '2024P': 150, '2025E': 160, isManual: false },
        { id: 'fin-4', 'Particulars': 'Debt/Equity Ratio', '2023A': -0.5, '2024P': 0.6, '2025E': 0.55, isManual: false, mappedAttributeId: '1089' },

    ],
    referenceTable: [],
    quarterlyTable: [
        { id: 'q-1', 'Particulars': 'Revenue', 'Q1-24': 300, 'Q2-24': 310, isManual: false }
    ],
    adjustmentsToFinancialStatement: "Initial adjustment notes can go here.",
    assumptionsForProjections: "Initial assumptions for projections can go here.",
    noteOnMaterialContingentLiabilities: "Initial notes on material contingent liabilities.",
};

const interimResultsData: InterimResultsData = {
    tableRows: [
        { id: 'ir-1', 'Particulars': 'Total operating income', '3M : Y': 100, '3M : Y-1': 90, 'Change %': 11.1, 'YTD : Y': 200, 'YTD : Y-1': 180, 'Change % (YTD)': 11.1, 'Projections': 400, 'Projections Achieved (%)': 50 },
        { id: 'ir-2', 'Particulars': 'PBT', '3M : Y': 20, '3M : Y-1': 18, 'Change %': 11.1, 'Projections': null, 'Projections Achieved (%)': null },
    ],
    comments: ""
};

const quarterlyFinancialsData: QuarterlyFinancialsData = {
    tableRows: [
        { id: 'qf-1', 'Particulars': 'Net Interest Income', 'Q3-24': 120, 'Q2-24': 115, 'Q1-24': 110, 'Q4-23': 105 },
        { id: 'qf-2', 'Particulars': 'Provisions', 'Q3-24': 20, 'Q2-24': 18, 'Q1-24': 22, 'Q4-23': 15 },
        { id: 'qf-3', 'Particulars': 'PAT', 'Q3-24': 40, 'Q2-24': 38, 'Q1-24': 35, 'Q4-23': 32 },
    ],
    comments: "Quarterly financials for the Banking sector."
};

const liquidityData: LiquidityData = {
  selection: 'Adequate',
  comment: 'Liquidity position remains adequate backed by steady cash flows from operations.'
};

const aboutCompanyData: AboutCompanyData = {
  tag1_1: 'Tag 1.1: Company incorporated in 1995, engaged in textile manufacturing...',
  industryClassification: {
    fetchedRows: [
      { id: 'ir1', 'Macro-economic Indicator': 'GDP Growth', 'Sector': 'Manufacturing', 'Industry': 'Textiles', 'Basic Industry': 'Fabric', 'NSE mapping': 'NSE_TEXT' }
    ],
    manualRows: []
  },
  briefFinancials: {
    fetchedRows: [
      { id: 'bf1', 'Particulars': 'Total operating income', 'March 31, 2023 (A)': 1200, 'March 31, 2024 (A)': 1350 },
      { id: 'bf2', 'Particulars': 'PBILDT', 'March 31, 2023 (A)': 200, 'March 31, 2024 (A)': 230 },
      { id: 'bf3', 'Particulars': 'Overall gearing (times)', 'March 31, 2023 (A)': -0.5, 'March 31, 2024 (A)': 0.8, mappedAttributeId: '1089' }
    ],
    manualRows: [],
    manualColumns: []
  }
};

const statusOfNonCooperationData: StatusOfNonCooperationData = {
  status: 'Non-Cooperation',
  records: [
    { craName: "ICRA Limited", lastRatingDate: "2025-03-10" },
    { craName: "India Ratings", lastRatingDate: "2024-11-15" }
  ]
};

const anyOtherInformationData: AnyOtherInformationData = {
  directors: [
    { directorType: "Independent", name: "Mr. Amit Sharma", interestEntity: "ABC Fintech Ltd.", position: "Independent Director" },
    { directorType: "Non-Executive", name: "Ms. Priya Menon", interestEntity: "XYZ Bank Ltd.", position: "Non-Executive Director" }
  ]
};

const consolidatedEntitiesData: ConsolidatedEntity[] = [
    { id: 'ce-1', srNo: 1, companyName: 'Subsidiary A', extentOfConsolidation: '', rationale: '' },
    { id: 'ce-2', srNo: 2, companyName: 'Subsidiary B', extentOfConsolidation: '', rationale: '' },
    { id: 'ce-3', srNo: 3, companyName: 'Joint Venture X', extentOfConsolidation: '', rationale: '' },
];

const prefetchedPeersData: PeerCompany[] = [
    { id: 'comp-4', companyName: 'Torrent Pharma', industryType: 'ABC', industry: 'XYZ', rating: 'AA+' },
    { id: 'comp-5', companyName: 'Sun Pharma', industryType: 'DEF', industry: 'GHI', rating: 'A' },
    { id: 'comp-6', companyName: 'Divis Labs', industryType: 'JKL', industry: 'MNO', rating: 'B' },
    { id: 'comp-7', companyName: 'Cipla', industryType: 'PQR', industry: 'STU', rating: 'BB+' }
];

const boardCompositionData: BoardCompositionData = {
    boardOfDirectors: [
        { id: 'bod-1', name: 'Mr. Ratan Tata', designation: 'Chairman Emeritus', yearsOfExperience: '50+', briefProfile: 'Chairman of Tata Group', age: '86', qualification: 'B.S. Architecture' },
        { id: 'bod-2', name: 'Mr. N. Chandrasekaran', designation: 'Chairman', yearsOfExperience: '30+', briefProfile: 'Chairman of Tata Sons', age: '60', qualification: 'MCA' }
    ],
    keyManagementPersonnel: [
        { id: 'kmp-1', name: 'Mr. John Doe', designation: 'CEO', yearsOfExperience: '25+', briefProfile: 'CEO of the company', age: '55', qualification: 'MBA' }
    ]
}

const goodwillAssessmentData: GoodwillAssessmentData = {
    tableRows: [
        { id: 'gw-1', srNo: 1, particulars: 'Valuation of Goodwill', remarks: '' },
        { id: 'gw-2', srNo: 2, particulars: 'Details sought from company/ auditor for goodwill impairment test i.e., supporting documents, if any', remarks: '' },
        { id: 'gw-3', srNo: 3, particulars: 'Interaction with Auditors on the above', remarks: '' },
        { id: 'gw-4', srNo: 4, particulars: 'Management\'s view on impairment of Goodwill', remarks: '' },
        { id: 'gw-5', srNo: 5, particulars: 'Few reasons for no provisioning of Goodwill impairment', remarks: '' },
    ]
};

const balanceSheetData: BalanceSheetData = {
  tableRows: [
    { id: 'bs-1', 'Particulars': 'Total Assets', '2023A': 2000, '2024P': 2200 },
    { id: 'bs-2', 'Particulars': 'Total Liabilities', '2023A': 1000, '2024P': 1100 },
    { id: 'bs-3', 'Particulars': 'Equity', '2023A': 1000, '2024P': 1100 },
  ]
};

const contingentLiabilitiesData: ContingentLiabilitiesData = {
  selection: 'Applicable',
  tableRows: [
    { id: 'cl-1', 'Particulars': 'Guarantees', '2023': 50, '2022': 45 },
    { id: 'cl-2', 'Particulars': 'Letters of Credit', '2023': 100, '2022': 95 },
  ]
};

const profitAndLossData: ProfitAndLossData = {
  tableRows: [
    { id: 'pnl-1', 'Particulars': 'Revenue', '2023A': 1100, '2024P': 1200 },
    { id: 'pnl-2', 'Particulars': 'Cost of Goods Sold', '2023A': 600, '2024P': 650 },
    { id: 'pnl-3', 'Particulars': 'Gross Profit', '2023A': 500, '2024P': 550 },
    { id: 'pnl-4', 'Particulars': 'Operating Expenses', '2023A': 200, '2024P': 220 },
    { id: 'pnl-5', 'Particulars': 'Operating Income', '2023A': 300, '2024P': 330 },
  ]
};

const cashFlowData: CashFlowData = {
  tableRows: [
    { id: 'cf-1', 'Particulars': 'Cash Flow from Operations', '2023A': 350, '2024P': 380 },
    { id: 'cf-2', 'Particulars': 'Cash Flow from Investing', '2023A': -150, '2024P': -180 },
    { id: 'cf-3', 'Particulars': 'Cash Flow from Financing', '2023A': -100, '2024P': -120 },
    { id: 'cf-4', 'Particulars': 'Net Change in Cash', '2023A': 100, '2024P': 80 },
  ]
};

const ratioAnalysisData: RatioAnalysisData = {
  tableRows: [
    { id: 'ra-1', 'Category': 'Solvency Ratios (times)', 'Ratio Description': 'Debt Equity Ratio', '2023A': 0.8, '2024P': -0.75, mappedAttributeId: '1089' },
    { id: 'ra-2', 'Category': 'Profitability Ratios (%)', 'Ratio Description': 'PBILDT Margin', '2023A': 25.5, '2024P': 26.1 },
    { id: 'ra-3', 'Category': 'Profitability Ratios (%)', 'Ratio Description': 'PAT Margin', '2023A': 12.7, '2024P': 13.2 },
    { id: 'ra-4', 'Category': 'Solvency Ratios (times)', 'Ratio Description': 'Overall Gearing Ratio', '2023A': 1.2, '2024P': 1.15, mappedAttributeId: '1090' },
  ]
};

const previousRCMMinutesData: RCMMinute[] = [
  { id: 'rcm-1', rcmDate: '2024-06-15', ratingCommitteeReference: 'RCM/2024/Q2/001', keyDiscussionPoints: 'Discussed revenue growth and margin pressure.', preparedBy: 'Analyst A', fullContent: 'Full text content of the RCM minute from June 15, 2024...' },
  { id: 'rcm-2', rcmDate: '2024-03-20', ratingCommitteeReference: 'RCM/2024/Q1/015', keyDiscussionPoints: 'Reviewed capital expenditure plans.', preparedBy: 'Analyst B', fullContent: 'Full text content of the RCM minute from March 20, 2024...' },
  { id: 'rcm-3', rcmDate: '2023-12-10', ratingCommitteeReference: 'RCM/2023/Q4/089', keyDiscussionPoints: 'Annual performance review.', preparedBy: 'Analyst A', fullContent: 'Full text content of the RCM minute from December 10, 2023...' },
];

const addressedQCObservationsData: AddressedQCObservationData[] = [
    { id: 'qc-obs-1', 'Sr. No.': '1', 'QC Observation': '', 'Comments of Rating Team': '' }
];

const pastRatingSensitivitiesData: PastRatingSensitivitiesData = {
    positiveFactors: [
        { id: 'prs-pos-1', 'Factor Description': 'Sustained revenue growth above 20%', 'Remarks / Updates': '', 'Status': 'Ongoing', isManual: false },
    ],
    negativeFactors: [
        { id: 'prs-neg-1', 'Factor Description': 'Decline in operating margin below 15%', 'Remarks / Updates': '', 'Status': 'Addressed', isManual: false },
    ]
};

const managementDiscussionData: ManagementDiscussionData = {
  managementPersonnel: "Mr. John Doe (CFO), Ms. Jane Smith (CEO)",
  careTeamMembers: "Rahul Sharma, Ananya Mehta",
  meetingDate: "2024-07-15",
  meetingMode: "Virtual",
  discussionItems: [
    { id: 'md-1', srNo: 1, issues: "Q2 revenue forecast", response: "Management is confident in meeting the target." },
    { id: 'md-2', srNo: 2, issues: "Capex plan for FY25", response: "Plan is on track, new facility to be operational by Q4." },
  ]
};

const discussionWithAuditCommitteeData: DiscussionWithAuditCommitteeData = {
    records: [
        { id: 'dac-1', meetingDate: "2025-06-10", attendees: ["CFO – Mr. Arun Mehta", "Statutory Auditor – Ms. Riya Patel"], keyDiscussions: "Reviewed quarterly financial statements and related-party transactions.", decisions: "Audit Committee approved the unaudited results for Q1 FY 2025-26." }
    ]
};

const checklistData: Checklist = {
  commonChecklist: [
    { id: 'cc-1', title: 'Financial statements reconciled with audited accounts', answer: '', remarks: '', autoFilledFrom: 'briefFinancials.PAT' },
    { id: 'cc-2', title: 'Management declaration obtained', answer: '', remarks: '' },
    { id: 'cc-3', title: 'Debt service coverage ratio verified', answer: '', remarks: '' },
  ],
  sectorChecklists: {
    'Manufacturing': [
      { id: 'sc-mfg-1', title: 'Capacity Utilisation verified', answer: '', remarks: '' },
      { id: 'sc-mfg-2', title: 'Supply chain risk assessed', answer: '', remarks: '' },
    ],
    'Technology': [
        { id: 'sc-tech-1', title: 'Client concentration risk evaluated', answer: '', remarks: '' }
    ]
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
      s_about_company: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        aboutCompany: aboutCompanyData,
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
      s_linked_ratings: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        linkedRatings: linkedRatingsData,
      },
      s_board_composition: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        boardComposition: boardCompositionData
      },
       s_financials_past_projected: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        financials: financialsPastProjectedData,
      },
       s_interim_results: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        interimResults: interimResultsData,
      },
       s_quarterly_financials: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        quarterlyFinancials: quarterlyFinancialsData,
      },
      s_balance_sheet: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        balanceSheet: balanceSheetData,
        contingentLiabilities: contingentLiabilitiesData
      },
      s_profit_loss: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        profitAndLoss: profitAndLossData,
      },
      s_cash_flow_statement: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        cashFlow: cashFlowData,
      },
      s_ratio_analysis: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_rcm_minutes: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_qc_observations: {
        applicable: 'Not Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_past_rating_sensitivities: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_management_discussion: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_discussion_audit_committee: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_cash_flow_assumptions: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '<p>Initial assumptions for the cash flow models are documented here.</p>',
        attachments: [],
        assumptionsForCashFlow: 'Initial assumptions...'
      },
      s_sensitivity_analysis: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '<p>Sensitivity analysis details can be added here.</p>',
        attachments: [],
        sensitivityAnalysis: 'Sensitivity analysis...'
      },
      s_gst_calculation: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '<p>GST calculation details can be added here.</p>',
        attachments: [],
        gstCalculation: 'GST calculation...'
      },
      s_projections_assumptions: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '<p>Assumptions for projections can be detailed here.</p>',
        attachments: [],
        assumptionsForProjections: 'Assumptions for projections...'
      },
      s_non_interest_income: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_stressed_assets: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_rationale_drivers: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        rationaleAndKeyRatingDrivers: 'Initial rationale...'
      },
      s_rating_sensitivities: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        ratingSensitivities: {
            positiveFactors: [],
            negativeFactors: [],
        }
      },
      s_analytical_approach_display: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: []
      },
      s_detailed_drivers: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        detailedDescriptionOfKeyRatingDrivers: {
            keyStrengths: 'Initial key strengths...',
            keyWeaknesses: 'Initial key weaknesses...'
        }
      },
      s_liquidity: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        liquidity: {
          selection: 'Adequate',
          comment: 'Initial comment from mock data.'
        }
      },
      s_esg_risks: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '<p>Initial ESG risks can be detailed here.</p>',
        attachments: [],
        esgRisks: 'Initial ESG risks...'
      },
      s_non_cooperation_status: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_any_other_info: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_consolidated_entities: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_goodwill_assessment: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_instrument_details: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
      },
      s_checklist: {
        applicable: 'Applicable',
        tableRows: [],
        comments: '',
        attachments: [],
        checklist: checklistData,
      }
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
  if (tableId === 's_linked_ratings') {
    // This part is now handled by getLinkedRatingsData
    return undefined;
  }
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

export const getAboutCompanyData = async (companyId: string, forceRefresh = false): Promise<AboutCompanyData | null> => {
  console.log(`Fetching about company data for company: ${companyId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (companyId === '1') {
    if(forceRefresh) {
        return {
          ...aboutCompanyData,
          tag1_1: aboutCompanyData.tag1_1 + " (Refreshed).",
        };
    }
    return aboutCompanyData;
  }
  return null;
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

export const getLinkedRatingsData = async(guarantor: string): Promise<LinkedRatingsData[]> => {
    console.log(`Fetching linked ratings data for guarantor: ${guarantor}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real app, you'd filter by the guarantor.
    // For this mock, we just return all data.
    return linkedRatingsData;
}


export const getFinancialsPastProjectedData = async(noteId: string): Promise<FinancialsPastProjectedData | null> => {
    console.log(`Fetching financials data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return financialsPastProjectedData;
    }
    return null;
}

export const getInterimResultsData = async(noteId: string): Promise<InterimResultsData | null> => {
    console.log(`Fetching interim results data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return interimResultsData;
    }
    return null;
}

export const getQuarterlyFinancialsData = async(noteId: string): Promise<QuarterlyFinancialsData | null> => {
    console.log(`Fetching quarterly financials data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') { // Assuming it's for a banking sector note
        return quarterlyFinancialsData;
    }
    return null;
}

export const getLiquidityData = async(companyId: string, forceRefresh = false): Promise<LiquidityData | null> => {
    console.log(`Fetching liquidity data for company: ${companyId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (companyId === '1') {
        if(forceRefresh) {
            return {
                ...liquidityData,
                comment: liquidityData.comment + ' (Refreshed at ' + new Date().toLocaleTimeString() + ')'
            };
        }
        return liquidityData;
    }
    return null;
}

export const getStatusOfNonCooperation = async (companyId: string, forceRefresh = false): Promise<StatusOfNonCooperationData | null> => {
  console.log(`Fetching status of non-cooperation for company: ${companyId}`);
  await new Promise(resolve => setTimeout(resolve, 300));

  if (companyId === '1') {
    if (forceRefresh) {
      // Simulate potential changes in data on refresh
      const refreshedData = { ...statusOfNonCooperationData };
      refreshedData.records[0].lastRatingDate = format(new Date(), 'yyyy-MM-dd');
      return refreshedData;
    }
    return statusOfNonCooperationData;
  }
  
  if (companyId === '2') { // Add a case for a cooperating company
      return {
          status: 'Cooperating',
          records: []
      };
  }

  return null;
};

export const getAnyOtherInformationData = async (companyId: string, forceRefresh = false): Promise<AnyOtherInformationData | null> => {
  console.log(`Fetching any other information data for company: ${companyId}`);
  await new Promise(resolve => setTimeout(resolve, 300));

  if (companyId === '1') {
    if (forceRefresh) {
      const refreshedData = { ...anyOtherInformationData };
      // Simulate a change
      refreshedData.directors[0].name = "Mr. Amit Sharma (Refreshed)";
      return refreshedData;
    }
    return anyOtherInformationData;
  }
  
  if (companyId === '2') {
    return { directors: [] };
  }

  return null;
};

export const getConsolidatedEntities = async (companyId: string, forceRefresh = false): Promise<ConsolidatedEntity[] | null> => {
  console.log(`Fetching consolidated entities for company: ${companyId}`);
  await new Promise(resolve => setTimeout(resolve, 300));

  if (companyId === '1') {
    if (forceRefresh) {
      return [
          ...consolidatedEntitiesData,
          { id: 'ce-4-refresh', srNo: 4, companyName: 'New Subsidiary (Refreshed)', extentOfConsolidation: '', rationale: '' }
      ];
    }
    return consolidatedEntitiesData;
  }

  return null;
};

export const getPrefetchedPeers = async (noteId: string): Promise<PeerCompany[]> => {
    console.log(`Fetching pre-fetched peers for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real app, this would use the noteId to find the previous year's note.
    if (noteId === '1') {
        return prefetchedPeersData;
    }
    return [];
}

export const getBoardCompositionData = async (noteId: string): Promise<BoardCompositionData | null> => {
    console.log(`Fetching board composition data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return boardCompositionData;
    }
    return null;
}

export const getGoodwillAssessmentData = async (noteId: string): Promise<GoodwillAssessmentData | null> => {
    console.log(`Fetching goodwill assessment data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return goodwillAssessmentData;
    }
    return null;
}

export const getBalanceSheetData = async(noteId: string): Promise<BalanceSheetData | null> => {
    console.log(`Fetching balance sheet data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return balanceSheetData;
    }
    return null;
}

export const getContingentLiabilitiesData = async(noteId: string): Promise<ContingentLiabilitiesData | null> => {
    console.log(`Fetching contingent liabilities data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return contingentLiabilitiesData;
    }
    return null;
}

export const getProfitAndLossData = async(noteId: string): Promise<ProfitAndLossData | null> => {
    console.log(`Fetching P&L data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return profitAndLossData;
    }
    return null;
}

export const getCashFlowData = async(noteId: string): Promise<CashFlowData | null> => {
    console.log(`Fetching cash flow data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return cashFlowData;
    }
    return null;
}

export const getRatioAnalysisData = async(noteId: string): Promise<RatioAnalysisData | null> => {
    console.log(`Fetching ratio analysis data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return ratioAnalysisData;
    }
    return null;
}

export const getPreviousRCMMinutes = async (companyId: string): Promise<RCMMinute[] | null> => {
  console.log(`Fetching previous RCM minutes for company: ${companyId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  if (companyId === '1') {
      return previousRCMMinutesData;
  }
  return [];
}

export const getAddressedQCObservations = async (noteId: string): Promise<AddressedQCObservationData[] | null> => {
  console.log(`Fetching addressed QC observations for note: ${noteId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  if (noteId === '1') {
    return addressedQCObservationsData;
  }
  return [];
}

export const getPastRatingSensitivities = async (companyId: string, forceRefresh = false): Promise<PastRatingSensitivitiesData | null> => {
    console.log(`Fetching past rating sensitivities for company: ${companyId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (companyId === '1') {
        if (forceRefresh) {
            return {
                ...pastRatingSensitivitiesData,
                positiveFactors: [...pastRatingSensitivitiesData.positiveFactors, { id: 'prs-pos-refresh', 'Factor Description': 'New refreshed positive factor', 'Remarks / Updates': '', 'Status': 'Ongoing', isManual: true }]
            };
        }
        return pastRatingSensitivitiesData;
    }
    return null;
}

export const getManagementDiscussionData = async (noteId: string): Promise<ManagementDiscussionData | null> => {
  console.log(`Fetching management discussion data for note: ${noteId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  if (noteId === '1') {
    return managementDiscussionData;
  }
  return null;
};

export const getDiscussionWithAuditCommitteeData = async (noteId: string, forceRefresh = false): Promise<DiscussionWithAuditCommitteeData | null> => {
    console.log(`Fetching audit committee discussion data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        if(forceRefresh) {
            const refreshedData = { ...discussionWithAuditCommitteeData };
            refreshedData.records[0].keyDiscussions += ' (Refreshed)';
            return refreshedData;
        }
        return discussionWithAuditCommitteeData;
    }
    return null;
}

export const getChecklistData = async (noteId: string): Promise<Checklist | null> => {
    console.log(`Fetching checklist data for note: ${noteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (noteId === '1') {
        return checklistData;
    }
    return null;
}
