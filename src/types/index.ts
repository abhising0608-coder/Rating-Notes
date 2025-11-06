

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
  description?: string;
  uploadedOn?: string;
  uploadedBy?: string;
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
  analyst1Designation: string;
  groupHead: string;
  groupHeadDesignation: string;
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

export interface BriefFinancials {
  fetchedRows: TableRowData[];
  manualRows: TableRowData[];
  manualColumns: string[];
}

export interface AboutCompanyData {
  tag1_1: string;
  industryClassification: {
    fetchedRows: TableRowData[];
    manualRows: TableRowData[];
  };
  briefFinancials: BriefFinancials;
  combinedBriefFinancials?: BriefFinancials;
  individualBriefFinancials?: BriefFinancials;
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

export interface OtherAgencyRating {
  id: string;
  craName: string;
  ratedDebtInCrores: number;
  lastPressReleaseDate: string;
  presentRating: string;
  presentRatingOutlook: string;
  previousRating: string;
  previousRatingOutlook: string;
  lastRatingAction: string;
  categoryINC: string;
}

export interface RatingSensitivity {
  id: string;
  sensitivity: string;
  care: string;
  cra1: string;
  cra2: string;
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

export interface RCMMinute {
  id: string;
  rcmDate: string;
  ratingCommitteeReference: string;
  keyDiscussionPoints: string;
  preparedBy: string;
  fullContent: string;
}

export interface PreviousRCMMinutesData {
  availableMinutes: RCMMinute[];
  selectedMinuteIds: string[];
}

export interface AddressedQCObservationData {
  id: string;
  'Sr. No.': string;
  'QC Observation': string;
  'Comments of Rating Team': string;
  isManual?: boolean;
}

export interface PastRatingSensitivitiesData {
    positiveFactors: TableRowData[];
    negativeFactors: TableRowData[];
}

export interface ManagementDiscussionItem {
  id: string;
  srNo: number;
  issues: string;
  response: string;
}

export interface ManagementDiscussionData {
  managementPersonnel: string;
  careTeamMembers: string;
  meetingDate: string;
  meetingMode: string;
  discussionItems: ManagementDiscussionItem[];
}

export interface AuditCommitteeRecord {
    id: string;
    meetingDate: string;
    attendees: string[];
    keyDiscussions: string;
    decisions: string;
}

export interface DiscussionWithAuditCommitteeData {
    records: AuditCommitteeRecord[];
}

export interface NdsCibilCheckItem {
  id: string;
  label: string;
  details: string;
  verificationDate: string | null;
  quarter: string | null;
  status: 'Yes' | 'No' | null;
}

export interface SiteVisitDetailsData {
  applicability: 'Applicable' | 'Not Applicable' | 'Not Available';
  particulars: {
    carePersonVisited: string;
    personMetClient: string;
    dateOfVisit: string;
    facilityVisited: string;
    installedCapacity: string;
    majorProducts: string;
    remark: string;
  };
  comments: string;
}

export interface Interaction {
  id: string;
  type: 'Lender' | 'DT' | 'IPT' | string;
  date: string;
  name: string;
  checked: boolean;
}

export interface BankerInteraction {
  id: string;
  bankerName: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  dateOfInteraction: string;
  feedback: string;
}

export interface AuditorInteraction {
  id: string;
  auditFirmName: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  dateOfInteraction: string;
  feedback: string;
}

export interface DebentureTrusteeInteraction {
  id: string;
  dtName: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  dateOfInteraction: string;
  feedback: string;
}

export interface IpaInteraction {
  id: string;
  ipaName: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  dateOfInteraction: string;
  feedback: string;
}

export interface ThirdPartyInteraction {
  id: string;
  partyType: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  dateOfInteraction: string;
  feedback: string;
}

export type ChecklistAnswer = 'Yes' | 'No' | 'NA' | '';

export interface ChecklistItem {
  id: string;
  title: string;
  answer: ChecklistAnswer;
  remarks: string;
  autoFilledFrom?: string;
  isManual?: boolean;
}

export interface Checklist {
  commonChecklist: ChecklistItem[];
  sectorChecklists: {
    [sector: string]: ChecklistItem[];
  };
}

export interface WithdrawnFacility {
  id: string;
  facility: string;
  details: string;
  date: string;
}

export interface RatingHistoryItem {
  id: string;
  instrumentName: string;
  currentRatingType: 'Long Term' | 'Short Term';
  history: {
    [year: string]: string;
  };
}

export interface MandateDetailsData {
    mandateDate: string;
    constitution: string;
    cin: string;
    status: 'Initial' | 'Reaffirmed' | 'Upgraded' | 'Downgraded';
    noDefaultsStatus: string;
}

export interface ContactDetails {
  id: string;
  name: string;
  designation: string;
  address: string;
  email: string;
  contactNumber: string;
  bankLenderName?: string;
}

export interface LastRatingActionData {
    actions: {
        id: string;
        mandateId: string;
        facilitiesInstruments: string;
        volume: string;
        existingRating: string;
        agendaType: string;
    }[];
}

export interface DetailsOfInstrumentData {
  applicability: 'Applicable' | 'Not Applicable' | 'Not Available';
  amountOfCpRated: number;
  dateOfLastRevalidation: string;
  validityOfLetter: string;
  outstandingCp: TableRowData[];
}

export interface AlmStatementData {
  applicability: 'Applicable' | 'Not Applicable' | 'Not Available';
  comments: string;
}

export interface QuarterlyCashFlowData {
  applicability: 'Applicable' | 'Not Applicable' | 'Not Available';
  comments: string;
}

export interface SectionData {
  applicable: 'Applicable' | 'Not Applicable' | 'Not Available';
  isReferenceOnly?: boolean;
  referenceNote?: string;
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
  previousRCMMinutes?: PreviousRCMMinutesData;
  addressedQCObservations?: AddressedQCObservationData[];
  pastRatingSensitivities?: PastRatingSensitivitiesData;
  managementDiscussion?: ManagementDiscussionData;
  discussionWithAuditCommittee?: DiscussionWithAuditCommitteeData;
  checklist?: Checklist;
  ratingHistory?: RatingHistoryItem[];
  mandateDetails?: MandateDetailsData;
  contactDetailsEntity?: ContactDetails[];
  contactDetailsBankers?: ContactDetails[];
  contactDetailsAuditor?: ContactDetails[];
  lastRatingAction?: LastRatingActionData;
  almStatement?: AlmStatementData;
  quarterlyCashFlow?: QuarterlyCashFlowData;
  detailsOfInstrument?: DetailsOfInstrumentData;
  isPrePopulated?: boolean;
  dataSource?: 'MasterNote' | 'None';
  masterNoteId?: string;
  isEditable?: boolean;
}

export interface RatingNote {
  id: string;
  companyId: string;
  templateId: string;
  analysts: string[];
  financialApproach: 'Standalone' | 'Consolidated' | 'Combined';
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
  ratingCycle?: 'Initial' | 'Surveillance' | 'Review' | 'Revalidation' | 'Representation' | 'Withdrawal' | 'INC' | 'CPTI';
  individualEntityApproach?: 'Standalone' | 'Consolidated' | null;
  combinedGroupId?: string | null;
  entityType?: 'Master' | 'Child' | 'Standalone';
  masterEntityName?: string;
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
