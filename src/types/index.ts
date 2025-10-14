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
  pdfUrl: string;
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

export interface WorkflowInstrument {
  instrument: string;
  category: string;
  LT: string;
  ST: string;
  LTST?: string;
}

export interface RatingRecommendation {
    LT: string;
    ST: string;
    unsupported: string;
    pendingSteps: string;
}

export interface QCSectorSpecialistData {
  id: string;
  name: string;
  qcObservations: string;
  reason: string;
}

export interface SummaryHygieneChecksData {
  negativeObservations: {
    NDS: string;
    CIBIL: string;
    BankStatements: string;
    RegulatoryDeclaration: string;
    AuditorReport: string;
    DebtListed: string;
    HistoricalDefault: string;
  };
  incorporationDate: string;
  natureOfBusiness: string;
  constitution: string;
  group: string;
  offices: {
    registered: string;
    corporate: string;
  };
  cfo: string;
  ceo: string;
  chairman: string;
  companySecretary: string;
  numEmployees: string;
  email: string;
  website: string;
  controllingOffice: string;
  auditorName: string;
  auditorReasonChange: string;
  auditorMembershipNo: string;
  auditorSigningAuthority: string;
  CIN: string;
  ownershipStructure: string;
  oneTimeSettlement: string;
  listedOn: string[];
}

export interface RichTextContent {
  aboutCompanyText: string;
  aboutCompanyComments: string;
  aboutGroupText: string;
  aboutGroupComments: string;
}

export interface KeyUpdatesContent {
  aboutCompanyText: string;
  aboutCompanyComments: string;
  aboutGroupText: string;
  aboutGroupComments: string;
  keyRatingDriversText: string;
  keyRatingDriversComments: string;
  keyUpdatesText: string;
  keyUpdatesComments: string;
}

export interface AnalyticalApproachData {
  selectedApproach: string;
  ceApplicable: '' | 'Yes' | 'No';
  guarantor: string;
  guarantorRatingAvailable: '' | 'Yes' | 'No';
  comments: string;
  annexureAttachments: Attachment[];
}

export interface ModelSummaryRow {
  id: string;
  heading: string;
  ratingModel: string;
  ratingTeam: string;
  remarks: string;
  isManual?: boolean;
}

export interface ParentSupportFrameworkRow {
    id: number;
    particular: string;
    scoreRange: [number, number];
    analystScore: number;
    reasoning: string;
}

export interface ParentSupportFrameworkData {
    selection: 'Applicable' | 'Not Applicable' | '';
    rows: ParentSupportFrameworkRow[];
    calculations: {
        economicIncentive: number;
        moralObligation: number;
        totalScore: number;
        extentNotchUp: number;
    };
    comments: string;
}

export interface GovernmentSupportFrameworkRow {
    id: number;
    particular: string;
    scoreRange: [number, number];
    analystScore: number;
    reasoning: string;
}

export interface GovernmentSupportFrameworkData {
    selection: 'Applicable' | 'Not Applicable' | '';
    rows: GovernmentSupportFrameworkRow[];
    calculations: {
        strategicImportance: number;
        moralObligation: number;
        totalScore: number;
        extentNotchUp: number;
    };
    comments: string;
}


export interface ParentGovSupportData {
    parentSupport: ParentSupportFrameworkData;
    governmentSupport: GovernmentSupportFrameworkData;
}

export interface CERatingTableRow {
  id: number;
  parameter: string;
  asPerModel: string;
  analystComments: string;
}

export interface CEChecklistData {
  ceRatingSelection: 'Applicable' | 'Not Applicable' | '';
  ceType: 'loc' | 'guaranteed' | '';
  locBackedRatingsTable: CERatingTableRow[];
  guaranteedRatingsTable: CERatingTableRow[];
  combinedViewSelection: 'Applicable' | 'Not Applicable' | '';
  combinedViewTable: TableRowData[];
  comments: {
    locBackedComments: string;
    guaranteedComments: string;
    combinedViewComments: string;
  }
}

export interface LinkedRatingsData extends TableRowData {
    'Name of Company': string;
    'Date': string;
    'Amount Rated': string;
    'Rating': string;
}

export interface BoardMemberData {
    id: string;
    name: string;
    designation: string;
    yearsOfExperience: string;
    briefProfile: string;
    age: string;
    qualification: string;
    isManual?: boolean;
}

export interface BoardCompositionData {
    boardOfDirectors: BoardMemberData[];
    keyManagementPersonnel: BoardMemberData[];
}

export interface FinancialsPastProjectedData {
    mainTable: TableRowData[];
    referenceTable: TableRowData[];
    quarterlyTable: TableRowData[];
    adjustmentsToFinancialStatement: string;
    assumptionsForProjections: string;
    noteOnMaterialContingentLiabilities: string;
}

export interface InterimResultsData {
    tableRows: TableRowData[];
    comments: string;
}

export interface QuarterlyFinancialsData {
    tableRows: TableRowData[];
    comments: string;
}

export interface RatingSensitivitiesData {
    positiveFactors: TableRowData[];
    negativeFactors: TableRowData[];
}

export interface LiquidityData {
  selection: 'Superior' | 'Strong' | 'Adequate' | 'Stretched' | 'Poor' | '';
  comment: string;
}

export interface AboutCompanyData {
  tag1_1: string;
  industryClassification: {
    fetchedRows: TableRowData[];
    manualRows: TableRowData[];
  };
  briefFinancials: {
    fetchedRows: TableRowData[];
    manualRows: TableRowData[];
    manualColumns: string[];
  };
}

export interface StatusOfNonCooperationData {
  status: 'Non-Cooperation' | 'Cooperating' | 'N/A';
  records: {
    craName: string;
    lastRatingDate: string;
  }[];
}

export interface AnyOtherInformationData {
  directors: {
    directorType: string;
    name: string;
    interestEntity: string;
    position: string;
  }[];
}

export type ExtentOfConsolidation = 'Full' | 'Moderate' | 'Proportionate' | 'Other' | '';

export interface ConsolidatedEntity {
  id: string;
  srNo: number;
  companyName: string;
  extentOfConsolidation: ExtentOfConsolidation;
  rationale: string;
}

export interface PeerCompany {
  id: string;
  companyName: string;
  industryType: string;
  industry: string;
  rating: string;
}

export interface GoodwillAssessmentData {
  tableRows: {
    id: string;
    srNo: number;
    particulars: string;
    remarks: string;
  }[];
}

export interface BalanceSheetData {
  tableRows: TableRowData[];
}

export interface ContingentLiabilitiesData {
  selection: 'Applicable' | 'Not Applicable' | 'Not Available';
  tableRows: TableRowData[];
}

export interface ProfitAndLossData {
  tableRows: TableRowData[];
}

export interface CashFlowData {
  tableRows: TableRowData[];
}

export interface RatioAnalysisData {
  tableRows: TableRowData[];
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
  ratingRecommendation?: RatingRecommendation;
  qcSpecialists?: QCSectorSpecialistData[];
  careAndCrasText?: string;
  summaryHygieneChecks?: SummaryHygieneChecksData;
  keyUpdatesContent?: KeyUpdatesContent;
  analyticalApproach?: AnalyticalApproachData;
  modelSummary?: ModelSummaryRow[];
  parentGovSupport?: ParentGovSupportData;
  ceChecklist?: CEChecklistData;
  linkedRatings?: LinkedRatingsData[];
  boardComposition?: BoardCompositionData;
  financials?: FinancialsPastProjectedData;
  interimResults?: InterimResultsData;
  assumptionsForCashFlow?: string;
  sensitivityAnalysis?: string;
  gstCalculation?: string;
  assumptionsForProjections?: string;
  adjustmentsToFinancialStatement?: string;
  noteOnMaterialContingentLiabilities?: string;
  quarterlyFinancials?: QuarterlyFinancialsData;
  rationaleAndKeyRatingDrivers?: string;
  ratingSensitivities?: RatingSensitivitiesData;
  detailedDescriptionOfKeyRatingDrivers?: {
    keyStrengths: string;
    keyWeaknesses: string;
  };
  liquidity?: LiquidityData;
  esgRisks?: string;
  aboutCompany?: AboutCompanyData;
  statusOfNonCooperation?: StatusOfNonCooperationData;
  anyOtherInformation?: AnyOtherInformationData;
  consolidatedEntities?: ConsolidatedEntity[];
  goodwillAssessment?: GoodwillAssessmentData;
  instrumentDetails?: TableRowData[];
  balanceSheet?: BalanceSheetData;
  contingentLiabilities?: ContingentLiabilitiesData;
  profitAndLoss?: ProfitAndLossData;
  cashFlow?: CashFlowData;
  ratioAnalysis?: RatioAnalysisData;
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
