

'use client';
import { useState, useEffect, useMemo, useTransition } from 'react';
import type { RatingNote, TableRowData, TemplateSection, BankFacilitiesData, AnalystDetails, RatingRecommendation, QCSectorSpecialistData, SummaryHygieneChecksData, RichTextContent, Attachment, AnalyticalApproachData, ModelSummaryRow, ParentGovSupportData, CEChecklistData, LinkedRatingsData, FinancialsPastProjectedData, InterimResultsData, QuarterlyFinancialsData, RatingSensitivitiesData, LiquidityData, AboutCompanyData, StatusOfNonCooperationData, AnyOtherInformationData, ConsolidatedEntity, ExtentOfConsolidation, BoardCompositionData, GoodwillAssessmentData, BalanceSheetData, ContingentLiabilitiesData, ProfitAndLossData, CashFlowData, RatioAnalysisData, PreviousRCMMinutesData, AddressedQCObservationData, PastRatingSensitivitiesData, ManagementDiscussionData, DiscussionWithAuditCommitteeData, MandateDetailsData, ContactDetails, AuditCommitteeRecord, LastRatingActionData, AlmStatementData, QuarterlyCashFlowData, DetailsOfInstrumentData } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Tooltip from '@/components/Tooltip';
import TableSection from './TableSection';
import CommentsEditor from './CommentsEditor';
import { getDisclosureData, getBankFacilitiesData, getAnalystDetails, getRatingRecommendation, getQCSpecialists, getSummaryHygieneChecksData, getAboutCompanyData, getKeyUpdatesData, getAnalyticalApproachData, getModelSummaryData, getParentGovSupportData, getCEChecklistData, getLinkedRatingsData, getFinancialsPastProjectedData, getInterimResultsData, getQuarterlyFinancialsData, getLiquidityData, getStatusOfNonCooperation, getAnyOtherInformationData, getConsolidatedEntities, getBoardCompositionData, getGoodwillAssessmentData, getBalanceSheetData, getContingentLiabilitiesData, getProfitAndLossData, getCashFlowData, getRatioAnalysisData, getPreviousRCMMinutes, getAddressedQCObservations, getPastRatingSensitivities, getManagementDiscussionData, getDiscussionWithAuditCommitteeData, getMandateDetails, getContactDetailsEntity, getContactDetailsBankers, getContactDetailsAuditor, getLastRatingActionData, getAlmStatementData, getQuarterlyCashFlowData, getDetailsOfInstrumentData } from '@/lib/data';
import { Separator } from './ui/separator';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Trash2, RefreshCw, Upload, Loader2, MessageSquare, Download, Send } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Label } from './ui/label';
import SummaryHygieneChecks from './SummaryHygieneChecks';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import PreviousRCMMinutesSection from './PreviousRCMMinutesSection';


const DisclosureSection = ({ disclosure, tooltipKey, sector }: { disclosure: any, tooltipKey?: string, sector: string }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg font-headline">NOTE FOR RATING COMMITTEE</h3>
            {tooltipKey && <Tooltip tooltipKey={tooltipKey} sector={sector} />}
        </div>
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <tbody className="divide-y">
                    <tr className="hover:bg-muted/50">
                        <td className="font-medium p-3 w-1/3 bg-muted/50">Disclosure of Interest of Independent/Non-Executive Directors of CARE</td>
                        <td className="p-3">{disclosure.independentDirectors || 'Not Applicable'}</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                        <td className="font-medium p-3 w-1/3 bg-muted/50">Disclosure of Interest of Managing Director & CEO</td>
                        <td className="p-3">{disclosure.managingDirector || 'Not Applicable'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const BankFacilitiesSection = ({ facilitiesData }: { facilitiesData: BankFacilitiesData }) => {
    const { totalAmountCrore, facilities } = facilitiesData;
    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg font-headline">
                Rating of Bank Facilities/Instruments of ₹{totalAmountCrore.toFixed(2)} crore*
            </h3>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr className="divide-x">
                            <th className="p-2 text-left font-medium">Facility Type</th>
                            <th className="p-2 text-left font-medium flex items-center gap-1">
                                Volume (₹ crore) <Tooltip tooltipKey="cover.bankFacilities.volume" />
                            </th>
                            <th className="p-2 text-left font-medium flex items-center gap-1">
                                Existing Rating <Tooltip tooltipKey="cover.bankFacilities.existingRating" />
                            </th>
                            <th className="p-2 text-left font-medium">Proposed Rating</th>
                            <th className="p-2 text-left font-medium">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {facilities.length > 0 ? (
                            facilities.map((facility, index) => (
                                <tr key={index} className="divide-x hover:bg-muted/50">
                                    <td className="p-2">{facility.facilityType}</td>
                                    <td className="p-2">{facility.volumeCrore.toFixed(2)}</td>
                                    <td className="p-2">{facility.existingRating}</td>
                                    <td className="p-2">{facility.proposedRating}</td>
                                    <td className="p-2">{facility.remarks}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center p-4 text-muted-foreground">
                                    No facilities available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AnalystDetailsSection = ({ details }: { details: AnalystDetails }) => (
    <div className="space-y-3">
        <h3 className="font-semibold text-lg font-headline">Analyst Details</h3>
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr className="divide-x">
                        <th className="p-2 text-left font-medium">Analyst</th>
                        <th className="p-2 text-left font-medium">Designation</th>
                        <th className="p-2 text-left font-medium">Group Head</th>
                        <th className="p-2 text-left font-medium">Designation</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    <tr className="divide-x hover:bg-muted/50">
                        <td className="p-2">{details.analyst1 || 'Not Available'}</td>
                        <td className="p-2">{details.analyst1Designation || 'Not Available'}</td>
                        <td className="p-2">{details.groupHead || 'Not Available'}</td>
                        <td className="p-2">{details.groupHeadDesignation || 'Not Available'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const RatingRecommendationSection = ({ ratings }: { ratings: RatingRecommendation }) => (
    <div className="space-y-3">
        <h3 className="font-semibold text-lg font-headline">Rating Recommendation</h3>
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr className="divide-x">
                        <th className="p-2 text-left font-medium">Rating Team Recommendation</th>
                        <th className="p-2 text-left font-medium">Long Term Rating and Outlook</th>
                        <th className="p-2 text-left font-medium">Short Term Rating</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    <tr className="hover:bg-muted/50 divide-x">
                        <td className="p-2">Rating(s)</td>
                        <td className="p-2">
                             <TooltipProvider>
                                <ShadcnTooltip>
                                    <TooltipTrigger asChild>
                                        <span>{ratings.LT}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>This rating is fetched from workflow and concatenated if multiple instruments exist.</p>
                                    </TooltipContent>
                                </ShadcnTooltip>
                            </TooltipProvider>
                        </td>
                        <td className="p-2">
                             <TooltipProvider>
                                <ShadcnTooltip>
                                    <TooltipTrigger asChild>
                                        <span>{ratings.ST}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>This rating is fetched from workflow and concatenated if multiple instruments exist.</p>
                                    </TooltipContent>
                                </ShadcnTooltip>
                            </TooltipProvider>
                        </td>
                    </tr>
                    <tr className="hover:bg-muted/50 divide-x">
                        <td className="p-2">Unsupported Rating(s), if any</td>
                        <td className="p-2">{ratings.unsupported}</td>
                        <td className="p-2"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const QCSectorSpecialistSection = ({ specialists, onUpdate }: { specialists: QCSectorSpecialistData[], onUpdate: (data: QCSectorSpecialistData[]) => void }) => {
    const [localSpecialists, setLocalSpecialists] = useState(specialists);

    const handleUpdate = (index: number, field: keyof QCSectorSpecialistData, value: string) => {
        const updated = [...localSpecialists];
        updated[index] = { ...updated[index], [field]: value };
        setLocalSpecialists(updated);
        onUpdate(updated);
    };

    const handleAddRow = () => {
        const newRow: QCSectorSpecialistData = {
            id: `qc-manual-${Date.now()}`,
            name: 'New Specialist', // This could be a dropdown in a real app
            qcObservations: '',
            reason: ''
        };
        const updated = [...localSpecialists, newRow];
        setLocalSpecialists(updated);
        onUpdate(updated);
    };

    const handleDeleteRow = (id: string) => {
        const updated = localSpecialists.filter(sp => sp.id !== id);
        setLocalSpecialists(updated);
        onUpdate(updated);
    };
    
    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg font-headline">QC/Sector Specialist</h3>
             <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>QC/Sector Specialist</TableHead>
                            <TableHead>QC Observations (only exceptions)</TableHead>
                            <TableHead>Reason for not accepting / not acting</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {localSpecialists.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Input
                                        type="text"
                                        value={row.name}
                                        readOnly
                                        className="h-8 bg-muted/50 border-transparent"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="text"
                                        value={row.qcObservations}
                                        onChange={(e) => handleUpdate(index, "qcObservations", e.target.value)}
                                        className="h-8"
                                    />
                                </TableCell>
                                <TableCell>
                                     <Input
                                        type="text"
                                        value={row.reason}
                                        onChange={(e) => handleUpdate(index, "reason", e.target.value)}
                                        className="h-8"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteRow(row.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
             <Button variant="outline" size="sm" onClick={handleAddRow}>
                <Plus className="mr-2" />
                Add Row
            </Button>
        </div>
    );
};

const CareAndCrasSection = ({ text, onTextChange }: { text: string, onTextChange: (newText: string) => void }) => {
    
    const handleClick = () => {
        alert("Navigate to CARE and other CRAs - rating history, sensitivities and key factors");
    };

    return (
        <div className="space-y-3">
            <Label htmlFor="care-cras-input" className="font-semibold text-lg font-headline">CARE and Other CRAs</Label>
            <TooltipProvider>
                <ShadcnTooltip>
                    <TooltipTrigger asChild>
                        <Input
                            id="care-cras-input"
                            type="text"
                            value={text}
                            onChange={(e) => onTextChange(e.target.value)}
                            onClick={handleClick}
                            className="cursor-pointer text-primary underline"
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Click to view CARE and other CRAs - rating history, sensitivities and key factors</p>
                    </TooltipContent>
                </ShadcnTooltip>
            </TooltipProvider>
        </div>
    );
};

const RichTextField = ({
  label,
  content,
  onContentChange,
  onRefresh,
  tooltipKey,
  sector,
  comments,
  onCommentsChange
}: {
  label: string;
  content: string;
  onContentChange: (newContent: string) => void;
  onRefresh?: () => void;
  tooltipKey?: string;
  sector?: string;
  comments: string;
  onCommentsChange: (newComments: string) => void;
}) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{label}</h4>
          <div className="flex items-center gap-2">
            {onRefresh && (
               <TooltipProvider>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={onRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fetch latest rule-based data</p>
                    </TooltipContent>
                  </ShadcnTooltip>
              </TooltipProvider>
            )}
            {tooltipKey && <Tooltip tooltipKey={tooltipKey} sector={sector} />}
          </div>
        </div>
        <div className="rounded-lg border bg-background">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows={6}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
            placeholder={`Enter details about the ${label.toLowerCase()}...`}
          />
        </div>
      </div>
      <div className="space-y-2">
         <Button variant="link" className="p-0 h-auto" onClick={() => setShowComments(!showComments)}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </Button>
        {showComments && (
            <Textarea
              value={comments}
              onChange={(e) => onCommentsChange(e.target.value)}
              rows={4}
              className="w-full"
              placeholder="Add your comments here..."
            />
        )}
      </div>
    </div>
  );
};

const AboutCompanySection = ({ initialData, onUpdate, onRefresh, companyName, analyticalApproach }: { initialData: AboutCompanyData, onUpdate: (data: AboutCompanyData) => void, onRefresh: (approach: 'Standalone' | 'Consolidated' | 'Combined') => void, companyName: string, analyticalApproach: 'Standalone' | 'Consolidated' | 'Combined' }) => {
    const [data, setData] = useState(initialData);

    const handleUpdate = (field: keyof AboutCompanyData, value: any) => {
        const updatedData = { ...data, [field]: value };
        setData(updatedData);
        onUpdate(updatedData);
    };

    const handleIndustryClassRowChange = (updatedRow: TableRowData) => {
        const updatedManualRows = data.industryClassification.manualRows.map(row => row.id === updatedRow.id ? updatedRow : row);
        handleUpdate('industryClassification', { ...data.industryClassification, manualRows: updatedManualRows });
    };

    const handleBriefFinancialsRowChange = (updatedRow: TableRowData, type: 'briefFinancials' | 'combinedBriefFinancials' | 'individualBriefFinancials') => {
        if (!data[type]) return;
        const currentData = data[type]!;
        const updatedManualRows = currentData.manualRows.map(row => row.id === updatedRow.id ? updatedRow : row);
        handleUpdate(type, { ...currentData, manualRows: updatedManualRows });
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg font-headline">Tag 1.1</h3>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{data.tag1_1}</p>
            </div>
            
            <Separator />

            <div>
                <h3 className="font-semibold text-lg font-headline mb-2">Industry Classification</h3>
                <TableSection 
                    initialRows={[...data.industryClassification.fetchedRows, ...data.industryClassification.manualRows]}
                    headers={['Macro-economic Indicator', 'Sector', 'Industry', 'Basic Industry', 'NSE mapping']}
                    onRefresh={async () => { onRefresh(analyticalApproach); return data.industryClassification.fetchedRows; }}
                    onAddRow={(newRow) => handleUpdate('industryClassification', { ...data.industryClassification, manualRows: [...data.industryClassification.manualRows, newRow] })}
                    onUpdateRow={handleIndustryClassRowChange}
                    onRemoveRow={(rowId) => handleUpdate('industryClassification', { ...data.industryClassification, manualRows: data.industryClassification.manualRows.filter(r => r.id !== rowId) })}
                    allowAddRow={true}
                    sectionKey="about_company_industry"
                    companyName={companyName}
                />
            </div>

            <Separator />
            
             <div>
                <h3 className="font-semibold text-lg font-headline mb-2">Brief Financials (₹ crore)</h3>
                <TableSection 
                    initialRows={[...data.briefFinancials.fetchedRows, ...data.briefFinancials.manualRows]}
                    headers={['Particulars', 'March 31, 2023 (A)', 'March 31, 2024 (A)', ...data.briefFinancials.manualColumns]}
                    onRefresh={async () => { onRefresh(analyticalApproach); return data.briefFinancials.fetchedRows; }}
                    onAddRow={(newRow) => handleUpdate('briefFinancials', { ...data.briefFinancials, manualRows: [...data.briefFinancials.manualRows, newRow] })}
                    onUpdateRow={(row) => handleBriefFinancialsRowChange(row, 'briefFinancials')}
                    onRemoveRow={(rowId) => handleUpdate('briefFinancials', { ...data.briefFinancials, manualRows: data.briefFinancials.manualRows.filter(r => r.id !== rowId) })}
                    allowAddRow={true}
                    sectionKey="about_company_financials"
                    companyName={companyName}
                />
            </div>
        </div>
    );
};


const KeyUpdatesSection = ({ content, onUpdate, onRefresh, sector }: { content: any, onUpdate: (newContent: any) => void, onRefresh: (field: string) => Promise<string>, sector: string }) => {
    const [localContent, setLocalContent] = useState(content);

    const handleContentChange = (field: string, value: string) => {
        const updated = { ...localContent, [field]: value };
        setLocalContent(updated);
        onUpdate(updated);
    };

    const handleRefresh = async (field: string) => {
        const refreshedData = await onRefresh(field);
        handleContentChange(field, refreshedData);
    };
    
    return (
        <div className="space-y-6">
            <RichTextField
                label="I) About the Company"
                content={localContent.aboutCompanyText}
                onContentChange={(v) => handleContentChange('aboutCompanyText', v)}
                comments={localContent.aboutCompanyComments}
                onCommentsChange={(v) => handleContentChange('aboutCompanyComments', v)}
                onRefresh={() => handleRefresh('aboutCompanyText')}
                tooltipKey="about.company"
                sector={sector}
            />
            <RichTextField
                label="II) About the Group/Parent"
                content={localContent.aboutGroupText}
                onContentChange={(v) => handleContentChange('aboutGroupText', v)}
                comments={localContent.aboutGroupComments}
                onCommentsChange={(v) => handleContentChange('aboutGroupComments', v)}
                onRefresh={() => handleRefresh('aboutGroupText')}
                tooltipKey="about.group"
                sector={sector}
            />
             <RichTextField
                label="III) Key Rating Drivers for the Proposed Rating"
                content={localContent.keyRatingDriversText}
                onContentChange={(v) => handleContentChange('keyRatingDriversText', v)}
                comments={localContent.keyRatingDriversComments}
                onCommentsChange={(v) => handleContentChange('keyRatingDriversComments', v)}
                onRefresh={() => handleRefresh('keyRatingDriversText')}
                sector={sector}
            />
             <RichTextField
                label="IV) Key Updates Since Last RCM"
                content={localContent.keyUpdatesText}
                onContentChange={(v) => handleContentChange('keyUpdatesText', v)}
                comments={localContent.keyUpdatesComments}
                onCommentsChange={(v) => handleContentChange('keyUpdatesComments', v)}
                onRefresh={() => handleRefresh('keyUpdatesText')}
                sector={sector}
            />
        </div>
    );
};

const AnalyticalApproachSection = ({
  data,
  onUpdate
}: {
  data: AnalyticalApproachData;
  onUpdate: (data: AnalyticalApproachData) => void;
}) => {
  const [localData, setLocalData] = useState(data);

  const handleUpdate = (field: keyof AnalyticalApproachData, value: any) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdate(updatedData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: Attachment[] = Array.from(e.target.files).map(file => ({
        id: `annex-${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file), // This is temporary for preview
      }));
      handleUpdate('annexureAttachments', [...localData.annexureAttachments, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    const updatedAttachments = localData.annexureAttachments.filter(att => att.id !== id);
    handleUpdate('annexureAttachments', updatedAttachments);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Analytical Approach</Label>
        <Input 
          value={localData.selectedApproach} 
          onChange={(e) => handleUpdate('selectedApproach', e.target.value)} 
        />
      </div>
       <div className="space-y-2">
        <Label>Is Credit Enhancement (CE) rating applicable?</Label>
        <Select 
          value={localData.ceApplicable} 
          onValueChange={(v) => handleUpdate('ceApplicable', v as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
        {localData.ceApplicable === '' && <p className="text-sm text-destructive">This field is mandatory.</p>}
      </div>

      {localData.ceApplicable === 'Yes' && (
        <div className="space-y-4 p-4 border rounded-md">
           <div className="space-y-2">
              <Label>Select Guarantor</Label>
              <Input 
                value={localData.guarantor} 
                onChange={(e) => handleUpdate('guarantor', e.target.value)}
                placeholder="Search or enter guarantor name"
              />
              {localData.guarantor === '' && <p className="text-sm text-destructive">Guarantor is mandatory.</p>}
           </div>
            <div className="space-y-2">
              <Label>Is rating note for selected guarantor available?</Label>
               <Select 
                value={localData.guarantorRatingAvailable} 
                onValueChange={(v) => handleUpdate('guarantorRatingAvailable', v as any)}
              >
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {localData.guarantorRatingAvailable === 'Yes' && (
              <div className="space-y-2">
                <Label>Attach Guarantor Rating Note (PDF)</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" id="guarantor-note-upload" multiple />
                  <Label htmlFor="guarantor-note-upload" className={cn(buttonVariants({variant: 'outline'}), 'cursor-pointer')}>
                    <Upload className="mr-2"/> Upload PDF
                  </Label>
                </div>
                 {localData.annexureAttachments.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {localData.annexureAttachments.map(file => (
                      <li key={file.id} className="flex items-center justify-between p-1 bg-muted/50 rounded-md">
                        <span>{file.name}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(file.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {localData.guarantorRatingAvailable === 'No' && (
                <div className="space-y-2">
                    <Label>Comments / Data</Label>
                    <Textarea 
                      value={localData.comments}
                      onChange={(e) => handleUpdate('comments', e.target.value)}
                    />
                </div>
            )}
        </div>
      )}

      {localData.ceApplicable === 'No' && (
        <div className="space-y-2">
            <Label>Comments / Data (Optional)</Label>
            <Textarea 
              value={localData.comments}
              onChange={(e) => handleUpdate('comments', e.target.value)}
            />
        </div>
      )}
    </div>
  );
};


const ModelSummarySection = ({ initialData, onUpdate, onRefresh }: { initialData: ModelSummaryRow[], onUpdate: (data: ModelSummaryRow[]) => void, onRefresh: () => void }) => {
  const [rows, setRows] = useState(initialData);
  const [popupRemarks, setPopupRemarks] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const handleUpdate = (rowId: string, field: keyof ModelSummaryRow, value: string) => {
    const updatedRows = rows.map(row => (row.id === rowId ? { ...row, [field]: value } : row));
    setRows(updatedRows);
    onUpdate(updatedRows);
  };
  
  const openRemarksPopup = (rowId: string) => {
    const row = rows.find(r => r.id === rowId);
    if(row) {
      setPopupRemarks(row.remarks);
      setActiveRowId(rowId);
      setIsPopupOpen(true);
    }
  };

  const saveRemarksPopup = () => {
    if(activeRowId !== null){
      handleUpdate(activeRowId, "remarks", popupRemarks);
    }
    setIsPopupOpen(false);
    setActiveRowId(null);
  };

  const addRow = (afterRowId: string) => {
    const newRow: ModelSummaryRow = { id: `manual-${Date.now()}`, heading: "", ratingModel: "N/A", ratingTeam: "", remarks: "", isManual: true };
    const index = rows.findIndex(r => r.id === afterRowId);
    const updatedRows = [...rows];
    updatedRows.splice(index + 1, 0, newRow);
    setRows(updatedRows);
    onUpdate(updatedRows);
  };

  const deleteRow = (rowId: string) => {
    const updatedRows = rows.filter(r => r.id !== rowId);
    setRows(updatedRows);
    onUpdate(updatedRows);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <a href="#" className="text-primary underline font-medium">Rating Model</a>
        <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="mr-2 h-4 w-4"/>Refresh</Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Heading</TableHead>
              <TableHead>Rating as per CoRF / Model</TableHead>
              <TableHead>Rating Team Assessment</TableHead>
              <TableHead>Remarks by Rating Team</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.isManual ? (
                     <Input
                        type="text"
                        value={row.heading}
                        onChange={(e) => handleUpdate(row.id, "heading", e.target.value)}
                        className="h-8"
                      />
                  ) : (
                    <span className="font-medium">{row.heading}</span>
                  )}
                </TableCell>
                <TableCell>{row.ratingModel}</TableCell>
                <TableCell>
                  <Input type="text" value={row.ratingTeam} onChange={(e) => handleUpdate(row.id, "ratingTeam", e.target.value)} className="h-8"/>
                </TableCell>
                <TableCell>
                   <Button variant="ghost" onClick={() => openRemarksPopup(row.id)} className="w-full justify-start text-left font-normal h-8 px-2">
                        <MessageSquare className="mr-2 h-4 w-4"/>
                        {row.remarks ? <span className="truncate">{row.remarks}</span> : <span className="text-muted-foreground">Add Remarks</span>}
                   </Button>
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => addRow(row.id)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    {row.isManual && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteRow(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Remarks</DialogTitle>
            <DialogDescription>
              Provide detailed remarks for the selected item. This content will be visible in the final report.
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            value={popupRemarks} 
            onChange={(e) => setPopupRemarks(e.target.value)} 
            rows={6}
            className="my-4"
            />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPopupOpen(false)}>Cancel</Button>
            <Button onClick={saveRemarksPopup}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
};

const ParentGovSupportSection = ({ initialData, onUpdate }: { initialData: ParentGovSupportData, onUpdate: (data: ParentGovSupportData) => void }) => {
    const [data, setData] = useState(initialData);

    const handleSelectionChange = (framework: 'parentSupport' | 'governmentSupport', value: 'Applicable' | 'Not Applicable' | '') => {
        const updatedData = { ...data, [framework]: { ...data[framework], selection: value } };
        setData(updatedData);
        onUpdate(updatedData);
    };

    const handleScoreChange = (framework: 'parentSupport' | 'governmentSupport', rowId: number, score: string) => {
        const frameworkData = data[framework];
        const row = frameworkData.rows.find(r => r.id === rowId);
        if (!row) return;

        let newScore = parseInt(score, 10);
        if (isNaN(newScore)) newScore = 0;

        if (newScore < row.scoreRange[0] || newScore > row.scoreRange[1]) {
            // Out of range, maybe show a toast or message
            return;
        }

        const updatedRows = frameworkData.rows.map(r => r.id === rowId ? { ...r, analystScore: newScore } : r);
        const updatedFrameworkData = { ...frameworkData, rows: updatedRows };
        const updatedData = { ...data, [framework]: updatedFrameworkData };
        
        recalculate(updatedData, framework);
    };

    const handleReasoningChange = (framework: 'parentSupport' | 'governmentSupport', rowId: number, reasoning: string) => {
        const frameworkData = data[framework];
        const updatedRows = frameworkData.rows.map(r => r.id === rowId ? { ...r, reasoning } : r);
        const updatedFrameworkData = { ...frameworkData, rows: updatedRows };
        const updatedData = { ...data, [framework]: updatedFrameworkData };
        setData(updatedData);
        onUpdate(updatedData);
    };

    const handleCommentsChange = (framework: 'parentSupport' | 'governmentSupport', comments: string) => {
        const updatedData = { ...data, [framework]: { ...data[framework], comments } };
        setData(updatedData);
        onUpdate(updatedData);
    }
    
    const recalculate = (currentData: ParentGovSupportData, framework: 'parentSupport' | 'governmentSupport') => {
        if (framework === 'parentSupport') {
            const rows = currentData.parentSupport.rows;
            const economicIncentive = (rows[1]?.analystScore || 0) + (rows[2]?.analystScore || 0);
            const moralObligation = (rows[0]?.analystScore || 0) + (rows[3]?.analystScore || 0) + (rows[4]?.analystScore || 0) + (rows[5]?.analystScore || 0) + (rows[6]?.analystScore || 0) + (rows[7]?.analystScore || 0) + (rows[8]?.analystScore || 0);
            const totalScore = economicIncentive + moralObligation;
            // Assuming difference 'A' is 1 for now
            const extentNotchUp = (totalScore / 100) * 1; 

            const updated = { ...currentData, parentSupport: { ...currentData.parentSupport, calculations: { economicIncentive, moralObligation, totalScore, extentNotchUp } } };
            setData(updated);
            onUpdate(updated);
        } else { // governmentSupport
            const rows = currentData.governmentSupport.rows;
            const strategicImportance = (rows[0]?.analystScore || 0);
            const moralObligation = (rows[1]?.analystScore || 0) + (rows[2]?.analystScore || 0) + (rows[3]?.analystScore || 0);
            const totalScore = strategicImportance + moralObligation;
             // Assuming difference 'A' is 1 for now
            const extentNotchUp = (totalScore / 100) * 1;
            
            const updated = { ...currentData, governmentSupport: { ...currentData.governmentSupport, calculations: { strategicImportance, moralObligation, totalScore, extentNotchUp } } };
            setData(updated);
            onUpdate(updated);
        }
    };
    
    const SupportFrameworkTable = ({ title, framework, frameworkKey }: { title: string, framework: any, frameworkKey: 'parentSupport' | 'governmentSupport' }) => {
        const isParent = frameworkKey === 'parentSupport';

        return (
             <div className="space-y-4">
                <h4 className="font-semibold text-lg">{title}</h4>
                 <div className="space-y-2">
                    <Label>Framework Applicability</Label>
                    <Select value={framework.selection} onValueChange={(v) => handleSelectionChange(frameworkKey, v as any)}>
                        <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select Applicability" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Applicable">Applicable</SelectItem>
                            <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 {framework.selection === 'Applicable' && (
                     <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/2">Particular</TableHead>
                                    <TableHead>Analyst Score ({isParent ? '0-10' : '0-25'})</TableHead>
                                    <TableHead className="w-1/3">Analyst Reasoning (Mandatory if score &gt; 0)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {framework.rows.map((row: any) => (
                                     <TableRow key={row.id}>
                                        <TableCell className="font-medium">{row.particular}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={row.analystScore}
                                                onChange={(e) => handleScoreChange(frameworkKey, row.id, e.target.value)}
                                                min={row.scoreRange[0]}
                                                max={row.scoreRange[1]}
                                                className="h-8 w-24"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Textarea
                                                value={row.reasoning}
                                                onChange={(e) => handleReasoningChange(frameworkKey, row.id, e.target.value)}
                                                rows={2}
                                                placeholder="Enter reasoning..."
                                                className={cn(row.analystScore > 0 && !row.reasoning ? 'border-destructive' : '')}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/80 font-semibold">
                                    <TableCell>{isParent ? 'Total Economic Incentive' : 'Total Strategic Importance'}</TableCell>
                                    <TableCell>{isParent ? framework.calculations.economicIncentive : framework.calculations.strategicImportance}</TableCell>
                                    <TableCell><Input readOnly className="h-8 bg-muted" value="Auto-calculated"/></TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/80 font-semibold">
                                    <TableCell>Total Moral Obligation</TableCell>
                                    <TableCell>{framework.calculations.moralObligation}</TableCell>
                                    <TableCell><Input readOnly className="h-8 bg-muted" value="Auto-calculated"/></TableCell>
                                </TableRow>
                                <TableRow className="bg-primary/10 font-bold text-primary">
                                    <TableCell>Total Score</TableCell>
                                    <TableCell>{framework.calculations.totalScore}</TableCell>
                                    <TableCell><Input readOnly className="h-8 bg-primary/20 border-primary/30" value="Auto-calculated"/></TableCell>
                                </TableRow>
                                 <TableRow className="bg-primary/10 font-bold text-primary">
                                    <TableCell>Extent of Notch-up</TableCell>
                                    <TableCell>{framework.calculations.extentNotchUp.toFixed(2)}</TableCell>
                                    <TableCell><Input readOnly className="h-8 bg-primary/20 border-primary/30" value="Auto-calculated"/></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                         <div className="space-y-2">
                            <Label>Comments</Label>
                            <Textarea
                                value={framework.comments}
                                onChange={(e) => handleCommentsChange(frameworkKey, e.target.value)}
                                rows={4}
                                placeholder="Add your comments here..."
                            />
                        </div>
                     </div>
                 )}
            </div>
        )
    };

    return (
        <div className="space-y-8">
            <SupportFrameworkTable title="Parent Support Framework" framework={data.parentSupport} frameworkKey="parentSupport" />
            <Separator />
            <SupportFrameworkTable title="Government Support Framework" framework={data.governmentSupport} frameworkKey="governmentSupport" />
        </div>
    );
};

const CEChecklistSection = ({ initialData, onUpdate }: { initialData: CEChecklistData, onUpdate: (data: CEChecklistData) => void }) => {
  const [data, setData] = useState(initialData);

  const handleUpdate = (field: keyof CEChecklistData, value: any) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate(updatedData);
  };
  
  const handleTableUpdate = (table: 'locBackedRatingsTable' | 'guaranteedRatingsTable', rowId: number, field: keyof CERatingTableRow, value: string) => {
      const updatedTable = data[table].map(row => row.id === rowId ? {...row, [field]: value} : row);
      handleUpdate(table, updatedTable);
  }
  
  const handleCombinedTableUpdate = (rowId: string, column: string, value: string) => {
      const updatedTable = data.combinedViewTable.map(row => row.id === rowId ? {...row, [column]: value} : row);
      handleUpdate('combinedViewTable', updatedTable);
  }
  
  const handleCommentsUpdate = (field: keyof CEChecklistData['comments'], value: string) => {
      handleUpdate('comments', {...data.comments, [field]: value});
  }

  const CETable = ({ title, tableData, onUpdateRow }: { title: string, tableData: CERatingTableRow[], onUpdateRow: (rowId: number, field: keyof CERatingTableRow, value: string) => void }) => (
    <div className="space-y-2">
        <h4 className="font-semibold">{title}</h4>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>As per Model</TableHead>
                    <TableHead>Analyst Comments</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map(row => (
                    <TableRow key={row.id}>
                        <TableCell>{row.parameter}</TableCell>
                        <TableCell>{row.asPerModel}</TableCell>
                        <TableCell>
                            <Textarea 
                                value={row.analystComments} 
                                onChange={e => onUpdateRow(row.id, 'analystComments', e.target.value)}
                                rows={2}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <Label>Checklist for CE rating</Label>
            <Select value={data.ceRatingSelection} onValueChange={v => handleUpdate('ceRatingSelection', v)}>
                <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Applicable">Applicable</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {data.ceRatingSelection === 'Applicable' && (
            <div className="p-4 border rounded-md space-y-6">
                <RadioGroup value={data.ceType} onValueChange={v => handleUpdate('ceType', v)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="loc" id="loc" />
                        <Label htmlFor="loc">In case of LOC backed ratings</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="guaranteed" id="guaranteed" />
                        <Label htmlFor="guaranteed">In case of guaranteed rating</Label>
                    </div>
                </RadioGroup>

                {data.ceType === 'loc' && (
                    <div className="space-y-4">
                        <CETable title="LOC Backed Ratings" tableData={data.locBackedRatingsTable} onUpdateRow={(rowId, field, value) => handleTableUpdate('locBackedRatingsTable', rowId, field, value)} />
                        <div>
                            <Label>Comments</Label>
                            <Textarea value={data.comments.locBackedComments} onChange={e => handleCommentsUpdate('locBackedComments', e.target.value)} />
                        </div>
                    </div>
                )}
                {data.ceType === 'guaranteed' && (
                    <div className="space-y-4">
                         <CETable title="Guaranteed Ratings" tableData={data.guaranteedRatingsTable} onUpdateRow={(rowId, field, value) => handleTableUpdate('guaranteedRatingsTable', rowId, field, value)} />
                         <div>
                            <Label>Comments</Label>
                            <Textarea value={data.comments.guaranteedComments} onChange={e => handleCommentsUpdate('guaranteedComments', e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
        )}

        <Separator />
        
        <div className="space-y-2">
            <Label>Checklist for combined view</Label>
             <Select value={data.combinedViewSelection} onValueChange={v => handleUpdate('combinedViewSelection', v)}>
                <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Applicable">Applicable</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {data.combinedViewSelection === 'Applicable' && (
            <div className="p-4 border rounded-md space-y-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Column 1</TableHead>
                            <TableHead>Column 2</TableHead>
                            <TableHead>Analyst Comments</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.combinedViewTable.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Input value={row['Column 1']} onChange={e => handleCombinedTableUpdate(row.id, 'Column 1', e.target.value)} />
                                </TableCell>
                                <TableCell>
                                    <Input value={row['Column 2']} onChange={e => handleCombinedTableUpdate(row.id, 'Column 2', e.target.value)} />
                                </TableCell>
                                 <TableCell>
                                    <Textarea value={row['Analyst Comments']} onChange={e => handleCombinedTableUpdate(row.id, 'Analyst Comments', e.target.value)} />
                                 </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <div>
                    <Label>Comments</Label>
                    <Textarea value={data.comments.combinedViewComments} onChange={e => handleCommentsUpdate('combinedViewComments', e.target.value)} />
                </div>
            </div>
        )}
    </div>
  );
};


const FinancialsPastProjectedSection = ({
  initialData,
  onUpdate,
  onRefresh,
  companyName
}: {
  initialData: FinancialsPastProjectedData;
  onUpdate: (data: FinancialsPastProjectedData) => void;
  onRefresh: (table: 'main' | 'quarterly') => Promise<TableRowData[]>;
  companyName: string;
}) => {
  const [data, setData] = useState(initialData);

  const handleUpdate = (field: keyof FinancialsPastProjectedData, value: any) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate(updatedData);
  };
  
  const getTableHeaders = (rows: TableRowData[]) => {
      if (rows.length === 0) return [];
      return Object.keys(rows[0]).filter(k => !['id', 'isManual', 'manualEdit', 'mappedAttributeId'].includes(k));
  }
  
  const handleRichTextUpdate = (field: 'adjustmentsToFinancialStatement' | 'assumptionsForProjections' | 'noteOnMaterialContingentLiabilities', content: string) => {
      handleUpdate(field, content);
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-lg font-headline mb-2">Main Financials</h3>
        <TableSection
          initialRows={data.mainTable}
          headers={getTableHeaders(data.mainTable)}
          onRefresh={() => onRefresh('main')}
          onAddRow={(row) => handleUpdate('mainTable', [...data.mainTable, row])}
          onUpdateRow={(updatedRow) => handleUpdate('mainTable', data.mainTable.map(r => r.id === updatedRow.id ? updatedRow : r))}
          onRemoveRow={(rowId) => handleUpdate('mainTable', data.mainTable.filter(r => r.id !== rowId))}
          allowAddRow={false}
          sectionKey="financials_main"
          companyName={companyName}
          readOnly={true}
        />
      </div>
      
      <Separator />

      <div>
        <h3 className="font-semibold text-lg font-headline mb-2">Reference Table</h3>
        <TableSection
          initialRows={data.referenceTable}
          headers={getTableHeaders(data.mainTable)} // Use main table headers for consistency
          onRefresh={async () => data.referenceTable} // No refresh for reference table
          onAddRow={(row) => handleUpdate('referenceTable', [...data.referenceTable, row])}
          onUpdateRow={(updatedRow) => handleUpdate('referenceTable', data.referenceTable.map(r => r.id === updatedRow.id ? updatedRow : r))}
          onRemoveRow={(rowId) => handleUpdate('referenceTable', data.referenceTable.filter(r => r.id !== rowId))}
          allowAddRow={true}
          sectionKey="financials_reference"
          companyName={companyName}
        />
      </div>

       <Separator />
      
       <div>
        <h3 className="font-semibold text-lg font-headline mb-2">Quarterly Data</h3>
        <TableSection
          initialRows={data.quarterlyTable}
          headers={getTableHeaders(data.quarterlyTable)}
          onRefresh={() => onRefresh('quarterly')}
          onAddRow={(row) => handleUpdate('quarterlyTable', [...data.quarterlyTable, row])}
          onUpdateRow={(updatedRow) => handleUpdate('quarterlyTable', data.quarterlyTable.map(r => r.id === updatedRow.id ? updatedRow : r))}
          onRemoveRow={(rowId) => handleUpdate('quarterlyTable', data.quarterlyTable.filter(r => r.id !== rowId))}
          allowAddRow={false}
          sectionKey="financials_quarterly"
          companyName={companyName}
          readOnly={true}
        />
      </div>
      
      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
            <Label>Adjustments (if any) made to the financial statement for the interpretation of financial ratio</Label>
            <Textarea
                value={data.adjustmentsToFinancialStatement}
                onChange={(e) => handleRichTextUpdate('adjustmentsToFinancialStatement', e.target.value)}
                rows={4}
            />
        </div>
         <div className="space-y-2">
            <Label>Assumptions for Projections</Label>
            <Textarea
                value={data.assumptionsForProjections}
                onChange={(e) => handleRichTextUpdate('assumptionsForProjections', e.target.value)}
                rows={4}
            />
        </div>
        <div className="space-y-2">
            <Label>Note on material contingent liabilities</Label>
            <Textarea
                value={data.noteOnMaterialContingentLiabilities}
                onChange={(e) => handleRichTextUpdate('noteOnMaterialContingentLiabilities', e.target.value)}
                rows={4}
            />
        </div>
      </div>

    </div>
  );
};


const InterimResultReviewsSection = ({ initialData, onUpdate }: { initialData: InterimResultsData, onUpdate: (data: InterimResultsData) => void }) => {
    const [data, setData] = useState(initialData);

    const handleUpdate = (field: keyof InterimResultsData, value: any) => {
        const updatedData = { ...data, [field]: value };
        setData(updatedData);
        onUpdate(updatedData);
    };

    const handleRowUpdate = (rowId: string, field: string, value: any) => {
        const updatedRows = data.tableRows.map(row => 
            row.id === rowId ? { ...row, [field]: value } : row
        );
        handleUpdate('tableRows', updatedRows);
    };

    const tableHeaders = useMemo(() => {
        if (!data.tableRows || data.tableRows.length === 0) return [];
        const ytdExists = data.tableRows.some(row => row['YTD : Y'] !== undefined && row['YTD : Y'] !== null);
        const projectionsExist = data.tableRows.some(row => row['Projections'] !== undefined && row['Projections'] !== null);
        
        let headers = ['Particulars', '3M : Y', '3M : Y-1', 'Change %'];
        if (ytdExists) headers.push('YTD : Y', 'YTD : Y-1', 'Change % (YTD)');
        if (projectionsExist) headers.push('Projections', 'Projections Achieved (%)');
        
        return headers;
    }, [data.tableRows]);


    return (
        <div className="space-y-4">
             <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead rowSpan={2} className="align-bottom p-2">Particulars<br/>(₹ crore)</TableHead>
                            <TableHead colSpan={3} className="text-center p-2 border-l">3M</TableHead>
                            {tableHeaders.includes('YTD : Y') && <TableHead colSpan={3} className="text-center p-2 border-l">YTD</TableHead>}
                            {tableHeaders.includes('Projections') && <TableHead colSpan={2} className="text-center p-2 border-l">Projections</TableHead>}
                        </TableRow>
                        <TableRow className="bg-muted/50">
                           <TableHead className="text-center p-2 border-l">Y</TableHead>
                           <TableHead className="text-center p-2 border-l">Y-1</TableHead>
                           <TableHead className="text-center p-2 border-l">Change (%)</TableHead>
                           {tableHeaders.includes('YTD : Y') && <>
                                <TableHead className="text-center p-2 border-l">Y</TableHead>
                                <TableHead className="text-center p-2 border-l">Y-1</TableHead>
                                <TableHead className="text-center p-2 border-l">Change (%)</TableHead>
                           </>}
                           {tableHeaders.includes('Projections') && <>
                                <TableHead className="text-center p-2 border-l">Y</TableHead>
                                <TableHead className="text-center p-2 border-l">Achieved (%)</TableHead>
                           </>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.tableRows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell className="p-2 font-medium">{row['Particulars']}</TableCell>
                                <TableCell className="p-2 text-right border-l">{row['3M : Y'] ?? 'N/A'}</TableCell>
                                <TableCell className="p-2 text-right border-l">{row['3M : Y-1'] ?? 'N/A'}</TableCell>
                                <TableCell className="p-2 text-right border-l">{row['Change %'] ?? 'N/A'}</TableCell>

                                {tableHeaders.includes('YTD : Y') && <>
                                    <TableCell className="p-2 text-right border-l">{row['YTD : Y'] ?? 'N/A'}</TableCell>
                                    <TableCell className="p-2 text-right border-l">{row['YTD : Y-1'] ?? 'N/A'}</TableCell>
                                    <TableCell className="p-2 text-right border-l">{row['Change % (YTD)'] ?? 'N/A'}</TableCell>
                                </>}
                                {tableHeaders.includes('Projections') && <>
                                    <TableCell className="p-2 text-right border-l">{row['Projections'] ?? 'N/A'}</TableCell>
                                    <TableCell className="p-2 border-l">
                                        <Input
                                            type="number"
                                            value={row['Projections Achieved (%)'] || ''}
                                            onChange={(e) => handleRowUpdate(row.id, 'Projections Achieved (%)', e.target.value === '' ? null : parseFloat(e.target.value))}
                                            className="h-8 text-right"
                                        />
                                    </TableCell>
                                </>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
             <div className="space-y-2">
                <Label>Comments</Label>
                <Textarea
                    value={data.comments}
                    onChange={e => handleUpdate('comments', e.target.value)}
                    rows={4}
                    placeholder="Add your comments here..."
                />
            </div>
        </div>
    );
};

const QuarterlyFinancialsSection = ({
  initialData,
  onUpdate,
  onRefresh,
  companyName,
}: {
  initialData: QuarterlyFinancialsData;
  onUpdate: (data: QuarterlyFinancialsData) => void;
  onRefresh: () => Promise<TableRowData[]>;
  companyName: string;
}) => {
  const [data, setData] = useState(initialData);

  const handleUpdate = (field: keyof QuarterlyFinancialsData, value: any) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate(updatedData);
  };
  
  const getTableHeaders = (rows: TableRowData[]) => {
      if (rows.length === 0) return [];
      return Object.keys(rows[0]).filter(k => !['id', 'isManual', 'manualEdit', 'mappedAttributeId'].includes(k));
  }

  return (
    <div className="space-y-4">
      <TableSection
        initialRows={data.tableRows}
        headers={getTableHeaders(data.tableRows)}
        onRefresh={onRefresh}
        onAddRow={() => {}} // No adding rows
        onUpdateRow={() => {}} // Read-only
        onRemoveRow={() => {}} // No removing rows
        allowAddRow={false}
        sectionKey="quarterly_financials"
        companyName={companyName}
        readOnly={true}
      />
      <div className="space-y-2">
        <Label>Comments</Label>
        <Textarea
          value={data.comments}
          onChange={(e) => handleUpdate('comments', e.target.value)}
          rows={4}
          placeholder="Add your comments for the quarterly financials here..."
        />
      </div>
    </div>
  );
};

const RatingSensitivitiesSection = ({
  initialData,
  onUpdate,
}: {
  initialData: RatingSensitivitiesData;
  onUpdate: (data: RatingSensitivitiesData) => void;
}) => {
  const [data, setData] = useState(initialData);

  const handleUpdate = (
    factorType: 'positiveFactors' | 'negativeFactors',
    newRows: TableRowData[]
  ) => {
    const updatedData = { ...data, [factorType]: newRows };
    setData(updatedData);
    onUpdate(updatedData);
  };

  const handleAddRow = (factorType: 'positiveFactors' | 'negativeFactors') => {
    const newRow = { id: `manual-${Date.now()}`, Factor: '', isManual: true };
    const updatedRows = [...data[factorType], newRow];
    handleUpdate(factorType, updatedRows);
  };
  
  const handleRemoveRow = (factorType: 'positiveFactors' | 'negativeFactors', rowId: string) => {
    const updatedRows = data[factorType].filter(row => row.id !== rowId);
    handleUpdate(factorType, updatedRows);
  };
  
  const handleRowChange = (factorType: 'positiveFactors' | 'negativeFactors', rowId: string, value: string) => {
    const updatedRows = data[factorType].map(row => 
        row.id === rowId ? { ...row, Factor: value } : row
    );
    handleUpdate(factorType, updatedRows);
  };


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-headline">Positive Factors</h3>
        <TableSection
          initialRows={data.positiveFactors}
          headers={['Factor']}
          onRefresh={async () => data.positiveFactors}
          onAddRow={() => handleAddRow('positiveFactors')}
          onUpdateRow={(row) => handleRowChange('positiveFactors', row.id, row.Factor)}
          onRemoveRow={(rowId) => handleRemoveRow('positiveFactors', rowId)}
          allowAddRow={true}
          sectionKey="rating_sensitivities_positive"
          companyName=""
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold font-headline">Negative Factors</h3>
        <TableSection
          initialRows={data.negativeFactors}
          headers={['Factor']}
          onRefresh={async () => data.negativeFactors}
          onAddRow={() => handleAddRow('negativeFactors')}
          onUpdateRow={(row) => handleRowChange('negativeFactors', row.id, row.Factor)}
          onRemoveRow={(rowId) => handleRemoveRow('negativeFactors', rowId)}
          allowAddRow={true}
          sectionKey="rating_sensitivities_negative"
          companyName=""
        />
      </div>
    </div>
  );
};


const AnalyticalApproachDisplaySection = ({ analyticalApproach }: { analyticalApproach?: AnalyticalApproachData }) => {
    if (!analyticalApproach) {
        return <p className="text-muted-foreground">Analytical approach data not available.</p>;
    }
    return (
        <div className="space-y-4 text-sm">
             <div className="p-4 border rounded-lg bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium text-muted-foreground">Analytical Approach</p>
                        <p>{analyticalApproach.selectedApproach || 'N/A'}</p>
                    </div>
                     <div>
                        <p className="font-medium text-muted-foreground">CE Rating Applicable?</p>
                        <p>{analyticalApproach.ceApplicable || 'N/A'}</p>
                    </div>
                     {analyticalApproach.ceApplicable === 'Yes' && (
                        <>
                            <div>
                                <p className="font-medium text-muted-foreground">Guarantor</p>
                                <p>{analyticalApproach.guarantor || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Guarantor Rating Note Available?</p>
                                <p>{analyticalApproach.guarantorRatingAvailable || 'N/A'}</p>
                            </div>
                        </>
                    )}
                </div>
                 <div className="mt-4">
                    <p className="font-medium text-muted-foreground">Comments</p>
                    <p className="whitespace-pre-wrap">{analyticalApproach.comments || 'No comments.'}</p>
                </div>
             </div>
        </div>
    );
};

const LiquiditySection = ({
  initialData,
  onUpdate,
  onRefresh,
}: {
  initialData: LiquidityData;
  onUpdate: (data: LiquidityData) => void;
  onRefresh: () => Promise<LiquidityData | null>;
}) => {
  const [data, setData] = useState(initialData);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const handleUpdate = (field: keyof LiquidityData, value: any) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate(updatedData);
  };
  
  const handleRefresh = () => {
    startRefreshTransition(async () => {
      const refreshedData = await onRefresh();
      if(refreshedData) {
        handleUpdate('comment', refreshedData.comment);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <Label>Liquidity Assessment</Label>
          <Select
            value={data.selection}
            onValueChange={(v) => handleUpdate('selection', v as LiquidityData['selection'])}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Assessment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Superior">Superior</SelectItem>
              <SelectItem value="Strong">Strong</SelectItem>
              <SelectItem value="Adequate">Adequate</SelectItem>
              <SelectItem value="Stretched">Stretched</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          {data.selection === '' && <p className="text-sm text-destructive mt-1">This field is mandatory.</p>}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Comment
        </Button>
      </div>

      <div>
        <Label>Comments from Rule-Based Output</Label>
        <Textarea
          value={data.comment}
          onChange={(e) => handleUpdate('comment', e.target.value)}
          rows={6}
          placeholder="Liquidity comments..."
        />
      </div>
    </div>
  );
};

const StatusOfNonCooperationSection = ({ initialData, onRefresh }: { initialData?: StatusOfNonCooperationData, onRefresh: () => Promise<StatusOfNonCooperationData | null> }) => {
  const [data, setData] = useState(initialData);
  const [isRefreshing, startRefreshTransition] = useTransition();

  useEffect(() => {
    if (!initialData) {
      handleRefresh();
    }
  }, [initialData]);

  const handleRefresh = () => {
    startRefreshTransition(async () => {
      const refreshedData = await onRefresh();
      setData(refreshedData ?? undefined);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {!data ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : data.status === 'Non-Cooperation' && data.records.length > 0 ? (
        <div className="space-y-3">
          {data.records.map((record, index) => (
            <div key={index} className="p-3 bg-muted/50 border rounded-md text-sm">
              <p>
                <span className="font-semibold">{record.craName}</span> has reviewed the ratings on the basis of best available information under ‘Issuer Not-Cooperating’ category vide press release dated {format(new Date(record.lastRatingDate), 'MMMM dd, yyyy')}.
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-3 bg-muted/50 border rounded-md text-sm text-muted-foreground">Not Applicable</p>
      )}
    </div>
  );
};

const AnyOtherInformationSection = ({ initialData, onRefresh }: { initialData?: AnyOtherInformationData, onRefresh: () => Promise<AnyOtherInformationData | null> }) => {
  const [data, setData] = useState(initialData);
  const [isRefreshing, startRefreshTransition] = useTransition();

  useEffect(() => {
    if (!initialData) {
      handleRefresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleRefresh = () => {
    startRefreshTransition(async () => {
      const refreshedData = await onRefresh();
      setData(refreshedData ?? undefined);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {!data ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : data.directors && data.directors.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Director Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Interest Entity</TableHead>
                <TableHead>Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.directors.map((director, index) => (
                <TableRow key={index}>
                  <TableCell>{director.directorType}</TableCell>
                  <TableCell>{director.name}</TableCell>
                  <TableCell>{director.interestEntity}</TableCell>
                  <TableCell>{director.position}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="p-4 text-center text-muted-foreground italic">Not Applicable</p>
      )}
    </div>
  );
};

const ConsolidatedEntitiesSection = ({ initialData, onUpdate, onRefresh }: { initialData: ConsolidatedEntity[], onUpdate: (data: ConsolidatedEntity[]) => void, onRefresh: () => void }) => {
  const [entities, setEntities] = useState(initialData);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const handleUpdate = (id: string, field: keyof ConsolidatedEntity, value: string) => {
    const updatedEntities = entities.map(entity => 
      entity.id === id ? { ...entity, [field]: value } : entity
    );
    setEntities(updatedEntities);
    onUpdate(updatedEntities);
  };
  
  const handleRefresh = () => {
      startRefreshTransition(async () => {
          onRefresh();
      });
  }

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Name of Company</TableHead>
              <TableHead>Extent of Consolidation</TableHead>
              <TableHead>Rationale / Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.map(entity => (
              <TableRow key={entity.id}>
                <TableCell>{entity.srNo}</TableCell>
                <TableCell>{entity.companyName}</TableCell>
                <TableCell>
                  <Select
                    value={entity.extentOfConsolidation}
                    onValueChange={(value) => handleUpdate(entity.id, 'extentOfConsolidation', value as ExtentOfConsolidation)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full">Full</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Proportionate">Proportionate</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={entity.rationale}
                    onChange={(e) => handleUpdate(entity.id, 'rationale', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const BoardCompositionSection = ({ initialData, onUpdate, onRefresh, tooltipKey }: { initialData: BoardCompositionData, onUpdate: (data: BoardCompositionData) => void, onRefresh: () => void, tooltipKey?: string }) => {
    const [data, setData] = useState(initialData);

    const handleUpdate = (table: 'boardOfDirectors' | 'keyManagementPersonnel', rowId: string, field: keyof BoardMemberData, value: string) => {
        const updatedTable = data[table].map(row => 
            row.id === rowId ? { ...row, [field]: value } : row
        );
        const updatedData = { ...data, [table]: updatedTable };
        setData(updatedData);
        onUpdate(updatedData);
    };

    const handleAddRow = (table: 'boardOfDirectors' | 'keyManagementPersonnel') => {
        const newRow: BoardMemberData = {
            id: `manual-${table}-${Date.now()}`,
            name: '',
            designation: '',
            yearsOfExperience: '',
            briefProfile: '',
            age: '',
            qualification: '',
            isManual: true,
        };
        const updatedTable = [...data[table], newRow];
        const updatedData = { ...data, [table]: updatedTable };
        setData(updatedData);
        onUpdate(updatedData);
    }

    const handleRemoveRow = (table: 'boardOfDirectors' | 'keyManagementPersonnel', rowId: string) => {
        const updatedTable = data[table].filter(row => row.id !== rowId);
        const updatedData = { ...data, [table]: updatedTable };
        setData(updatedData);
        onUpdate(updatedData);
    }
    
    const MemberTable = ({ title, members, tableKey, headers }: { title: string, members: BoardMemberData[], tableKey: 'boardOfDirectors' | 'keyManagementPersonnel', headers: (keyof BoardMemberData)[] }) => (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h4 className="font-semibold">{title}</h4>
                <Button variant="outline" size="sm" onClick={() => handleAddRow(tableKey)}><Plus className="mr-2 h-4 w-4" />Add Row</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map(header => <TableHead key={header}>{header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</TableHead>)}
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map(member => (
                        <TableRow key={member.id}>
                            {headers.map(header => (
                                <TableCell key={header}>
                                    <Input
                                        value={member[header]}
                                        onChange={e => handleUpdate(tableKey, member.id, header, e.target.value)}
                                        readOnly={!member.isManual}
                                        className={cn("h-8", !member.isManual && "bg-muted/50 border-transparent")}
                                    />
                                </TableCell>
                            ))}
                            <TableCell>
                                {member.isManual && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveRow(tableKey, member.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
    
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                 <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="mr-2 h-4 w-4"/>Refresh</Button>
            </div>
            <Accordion type="multiple" defaultValue={['bod']} className="w-full">
                <AccordionItem value="bod">
                    <AccordionTrigger className="font-semibold text-lg">
                        Board of Directors / Partners
                        {tooltipKey && <Tooltip tooltipKey={tooltipKey} />}
                    </AccordionTrigger>
                    <AccordionContent>
                        <MemberTable 
                            title=""
                            members={data.boardOfDirectors}
                            tableKey="boardOfDirectors"
                            headers={['name', 'designation', 'yearsOfExperience', 'briefProfile', 'age', 'qualification']}
                        />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="kmp">
                     <AccordionTrigger className="font-semibold text-lg">
                        Senior Management / Key Management Personnel
                        <Tooltip tooltipKey="kmp.composition" />
                    </AccordionTrigger>
                    <AccordionContent>
                         <MemberTable 
                            title=""
                            members={data.keyManagementPersonnel}
                            tableKey="keyManagementPersonnel"
                            headers={['name', 'designation', 'yearsOfExperience', 'briefProfile', 'age', 'qualification']}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

const GoodwillAssessmentSection = ({ initialData, onUpdate }: { initialData: GoodwillAssessmentData, onUpdate: (data: GoodwillAssessmentData) => void }) => {
    const [data, setData] = useState(initialData);

    const handleRemarkChange = (rowId: string, remarks: string) => {
        const updatedTableRows = data.tableRows.map(row => 
            row.id === rowId ? { ...row, remarks } : row
        );
        const updatedData = { ...data, tableRows: updatedTableRows };
        setData(updatedData);
        onUpdate(updatedData);
    };

    return (
        <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[5%]">Sr No</TableHead>
                            <TableHead className="w-[45%]">Particulars</TableHead>
                            <TableHead className="w-[50%]">Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.tableRows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.srNo}</TableCell>
                                <TableCell className="font-medium">{row.particulars}</TableCell>
                                <TableCell>
                                    <Input
                                        type="text"
                                        value={row.remarks}
                                        onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                                        className="h-8"
                                        placeholder="Enter remarks..."
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const BalanceSheetSection = ({
  initialData,
  onUpdate,
  onRefresh,
  companyName
}: {
  initialData: BalanceSheetData;
  onUpdate: (data: BalanceSheetData) => void;
  onRefresh: () => Promise<TableRowData[]>;
  companyName: string;
}) => {
  const [data, setData] = useState(initialData);

  const getTableHeaders = (rows: TableRowData[]) => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).filter(k => !['id', 'isManual', 'manualEdit', 'mappedAttributeId'].includes(k));
  }

  return (
    <div className="space-y-4">
      <TableSection
        initialRows={data.tableRows}
        headers={getTableHeaders(data.tableRows)}
        onRefresh={onRefresh}
        onAddRow={() => {}} // Read-only
        onUpdateRow={() => {}} // Read-only
        onRemoveRow={() => {}} // Read-only
        allowAddRow={false}
        sectionKey="balance_sheet"
        companyName={companyName}
        readOnly={true}
      />
    </div>
  );
};

const ContingentLiabilitiesSection = ({
  initialData,
  onUpdate,
  onRefresh,
  companyName
}: {
  initialData: ContingentLiabilitiesData;
  onUpdate: (data: ContingentLiabilitiesData) => void;
  onRefresh: () => Promise<ContingentLiabilitiesData | null>;
  companyName: string;
}) => {
  const [data, setData] = useState(initialData);

  const handleUpdate = (field: keyof ContingentLiabilitiesData, value: any) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate(updatedData);
  };
  
  const getTableHeaders = (rows: TableRowData[]) => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).filter(k => !['id', 'isManual', 'manualEdit', 'mappedAttributeId'].includes(k));
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="font-semibold text-lg font-headline">Contingent Liabilities</h3>
       <Select
            value={data.selection}
            onValueChange={(v) => handleUpdate('selection', v as ContingentLiabilitiesData['selection'])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select applicability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applicable">Applicable</SelectItem>
              <SelectItem value="Not Applicable">Not Applicable</SelectItem>
              <SelectItem value="Not Available">Not Available</SelectItem>
            </SelectContent>
        </Select>
      {data.selection === 'Applicable' && (
        <TableSection
            initialRows={data.tableRows}
            headers={getTableHeaders(data.tableRows)}
            onRefresh={async () => {
                const refreshed = await onRefresh();
                return refreshed?.tableRows || [];
            }}
            onAddRow={() => {}}
            onUpdateRow={() => {}}
            onRemoveRow={() => {}}
            allowAddRow={false}
            sectionKey="contingent_liabilities"
            companyName={companyName}
            readOnly={true}
        />
      )}
    </div>
  );
};

const ProfitAndLossSection = ({
  initialData,
  onUpdate,
  onRefresh,
  companyName
}: {
  initialData: ProfitAndLossData;
  onUpdate: (data: ProfitAndLossData) => void;
  onRefresh: () => Promise<TableRowData[]>;
  companyName: string;
}) => {
  const getTableHeaders = (rows: TableRowData[]) => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).filter(k => !['id', 'isManual', 'manualEdit', 'mappedAttributeId'].includes(k));
  }

  return (
    <div className="space-y-4">
      <TableSection
        initialRows={initialData.tableRows}
        headers={getTableHeaders(initialData.tableRows)}
        onRefresh={onRefresh}
        onAddRow={() => {}} // Read-only
        onUpdateRow={() => {}} // Read-only
        onRemoveRow={() => {}} // Read-only
        allowAddRow={false}
        sectionKey="profit_and_loss"
        companyName={companyName}
        readOnly={true}
      />
    </div>
  );
};

const CashFlowStatementSection = ({
  initialData,
  onUpdate,
  onRefresh,
  companyName
}: {
  initialData: CashFlowData;
  onUpdate: (data: CashFlowData) => void;
  onRefresh: () => Promise<TableRowData[]>;
  companyName: string;
}) => {
  const getTableHeaders = (rows: TableRowData[]) => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).filter(k => !['id', 'isManual', 'manualEdit', 'mappedAttributeId'].includes(k));
  }

  return (
    <div className="space-y-4">
      <TableSection
        initialRows={initialData.tableRows}
        headers={getTableHeaders(initialData.tableRows)}
        onRefresh={onRefresh}
        onAddRow={() => {}} // Read-only
        onUpdateRow={() => {}} // Read-only
        onRemoveRow={() => {}} // Read-only
        allowAddRow={false}
        sectionKey="cash_flow_statement"
        companyName={companyName}
        readOnly={true}
      />
    </div>
  );
};

const RatioAnalysisSection = ({
  initialData,
  onUpdate,
  onRefresh,
  companyName
}: {
  initialData: RatioAnalysisData;
  onUpdate: (data: RatioAnalysisData) => void;
  onRefresh: () => Promise<TableRowData[]>;
  companyName: string;
}) => {
  const getTableHeaders = (rows: TableRowData[]) => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).filter(k => !['id', 'isManual', 'manualEdit', 'mappedAttributeId'].includes(k));
  }

  return (
    <div className="space-y-4">
      <TableSection
        initialRows={initialData.tableRows}
        headers={getTableHeaders(initialData.tableRows)}
        onRefresh={onRefresh}
        onAddRow={() => {}} // Read-only
        onUpdateRow={() => {}} // Read-only
        onRemoveRow={() => {}} // Read-only
        allowAddRow={false}
        sectionKey="ratio_analysis"
        companyName={companyName}
        readOnly={true}
      />
    </div>
  );
};

const AddressedQCObservationsSection = ({ initialData, onUpdate }: { initialData: AddressedQCObservationData[], onUpdate: (data: AddressedQCObservationData[]) => void }) => {
    return (
        <TableSection
            initialRows={initialData}
            headers={['Sr. No.', 'QC Observation', 'Comments of Rating Team']}
            allowAddRow={true}
            onRefresh={async () => initialData}
            onAddRow={(row) => onUpdate([...initialData, row as AddressedQCObservationData])}
            onUpdateRow={(updatedRow) => onUpdate(initialData.map(r => r.id === updatedRow.id ? updatedRow as AddressedQCObservationData : r))}
            onRemoveRow={(rowId) => onUpdate(initialData.filter(r => r.id !== rowId))}
            sectionKey="qc_observations"
            companyName=""
        />
    )
};


const PastRatingSensitivitiesSection = ({ initialData, onUpdate, onRefresh }: { initialData: PastRatingSensitivitiesData, onUpdate: (data: PastRatingSensitivitiesData) => void, onRefresh: () => void }) => {
    const [data, setData] = useState(initialData);

    const handleUpdate = (type: 'positiveFactors' | 'negativeFactors', rowId: string, field: 'Remarks / Updates' | 'Status', value: string) => {
        const updatedData = {
            ...data,
            [type]: data[type].map(row => row.id === rowId ? { ...row, [field]: value } : row)
        };
        setData(updatedData);
        onUpdate(updatedData);
    };

    const handleAddRow = (type: 'positiveFactors' | 'negativeFactors') => {
        const newRow: TableRowData = {
            id: `manual-${type}-${Date.now()}`,
            'Factor Description': '',
            'Remarks / Updates': '',
            'Status': 'Ongoing',
            isManual: true,
        };
        const updatedData = { ...data, [type]: [...data[type], newRow] };
        setData(updatedData);
        onUpdate(updatedData);
    };

    const handleRemoveRow = (type: 'positiveFactors' | 'negativeFactors', rowId: string) => {
        const updatedData = { ...data, [type]: data[type].filter(row => row.id !== rowId) };
        setData(updatedData);
        onUpdate(updatedData);
    };
    
    const handleManualFactorChange = (type: 'positiveFactors' | 'negativeFactors', rowId: string, value: string) => {
       const updatedData = {
            ...data,
            [type]: data[type].map(row => row.id === rowId ? { ...row, 'Factor Description': value } : row)
        };
        setData(updatedData);
        onUpdate(updatedData);
    }

    const SensitivityTable = ({ title, factors, type }: { title: string, factors: TableRowData[], type: 'positiveFactors' | 'negativeFactors' }) => (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{title}</h4>
                <Button variant="outline" size="sm" onClick={() => handleAddRow(type)}><Plus className="mr-2 h-4 w-4"/>Add Row</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Factor Description</TableHead>
                        <TableHead>Remarks / Updates</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {factors.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.isManual ? (
                                    <Input value={row['Factor Description']} onChange={(e) => handleManualFactorChange(type, row.id, e.target.value)} />
                                ) : (
                                    row['Factor Description']
                                )}
                            </TableCell>
                            <TableCell>
                                <Input value={row['Remarks / Updates']} onChange={(e) => handleUpdate(type, row.id, 'Remarks / Updates', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <Select value={row['Status']} onValueChange={(v) => handleUpdate(type, row.id, 'Status', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Addressed">Addressed</SelectItem>
                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                {row.isManual && (
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(type, row.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="mr-2 h-4 w-4"/>Refresh</Button>
            </div>
            <SensitivityTable title="Positive Factors / Strengths" factors={data.positiveFactors} type="positiveFactors" />
            <SensitivityTable title="Negative Factors / Weaknesses" factors={data.negativeFactors} type="negativeFactors" />
        </div>
    );
};


const ManagementDiscussionSection = ({ data }: { data: ManagementDiscussionData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 border rounded-md">
          <p className="font-medium text-muted-foreground">Management personnel interacted</p>
          <p>{data.managementPersonnel}</p>
        </div>
        <div className="p-3 border rounded-md">
          <p className="font-medium text-muted-foreground">CARE team members</p>
          <p>{data.careTeamMembers}</p>
        </div>
        <div className="p-3 border rounded-md">
          <p className="font-medium text-muted-foreground">Date of meeting</p>
          <p>{format(new Date(data.meetingDate), 'PPP')}</p>
        </div>
        <div className="p-3 border rounded-md">
          <p className="font-medium text-muted-foreground">Mode of meeting</p>
          <p>{data.meetingMode}</p>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Sr. No.</TableHead>
              <TableHead>Issues raised during discussion</TableHead>
              <TableHead>Management's Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.discussionItems.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.srNo}</TableCell>
                <TableCell>{item.issues}</TableCell>
                <TableCell>{item.response}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const DiscussionWithAuditCommitteeSection = ({ data, onRefresh }: { data: DiscussionWithAuditCommitteeData, onRefresh: () => void }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
            </div>
            {data.records.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Meeting Date</TableHead>
                                <TableHead>Attendees</TableHead>
                                <TableHead>Key Discussion Points</TableHead>
                                <TableHead>Decisions Taken</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{format(new Date(record.meetingDate), 'PPP')}</TableCell>
                                    <TableCell>{record.attendees.join(', ')}</TableCell>
                                    <TableCell>{record.keyDiscussions}</TableCell>
                                    <TableCell>{record.decisions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-muted-foreground p-4 text-center">No records found.</p>
            )}
        </div>
    );
};

const MandateDetailsSection = ({ data, onUpdate }: { data: MandateDetailsData, onUpdate: (data: MandateDetailsData) => void }) => {
    const [localData, setLocalData] = useState(data);

    const handleUpdate = (field: keyof MandateDetailsData, value: any) => {
        const updatedData = { ...localData, [field]: value };
        setLocalData(updatedData);
        onUpdate(updatedData);
    };

    return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
                <Label>Mandate Date</Label>
                <Input value={format(new Date(localData.mandateDate), 'PP')} readOnly className="bg-muted" />
            </div>
             <div className="space-y-1">
                <Label>Constitution</Label>
                <Input value={localData.constitution} readOnly className="bg-muted" />
            </div>
            <div className="space-y-1">
                <Label>CIN</Label>
                <Input value={localData.cin} readOnly className="bg-muted" />
            </div>
            <div className="space-y-1">
                <Label>Status of No Defaults and No Delays</Label>
                <Input value={localData.noDefaultsStatus} readOnly className="bg-muted" />
            </div>
            <div className="space-y-1">
                <Label>Status</Label>
                <Select value={localData.status} onValueChange={v => handleUpdate('status', v)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Initial">Initial</SelectItem>
                        <SelectItem value="Reaffirmed">Reaffirmed</SelectItem>
                        <SelectItem value="Upgraded">Upgraded</SelectItem>
                        <SelectItem value="Downgraded">Downgraded</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const ContactDetailsSection = ({ title, contacts, isBankerSection }: { title: string, contacts: ContactDetails[], isBankerSection?: boolean }) => (
    <div className="space-y-2">
        <h3 className="font-semibold text-lg font-headline">{title}</h3>
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sr. No.</TableHead>
                        {isBankerSection && <TableHead>Bank / Lender Name</TableHead>}
                        <TableHead>Name of the Official</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Email ID</TableHead>
                        <TableHead>Contact Number</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contacts.map((contact, index) => (
                        <TableRow key={contact.id}>
                            <TableCell>{index + 1}</TableCell>
                            {isBankerSection && <TableCell>{contact.bankLenderName}</TableCell>}
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.designation}</TableCell>
                            <TableCell>{contact.address}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.contactNumber}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);

const LastRatingActionSection = ({ data, onRefresh }: { data: LastRatingActionData, onRefresh: () => void }) => (
    <div className="space-y-4">
        <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="mr-2 h-4 w-4"/>Refresh</Button>
            <Button variant="outline" size="sm" className="ml-2"><Download className="mr-2 h-4 w-4"/>Download</Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mandate ID</TableHead>
                        <TableHead>Facilities / Instruments</TableHead>
                        <TableHead>Volume (₹ crore)</TableHead>
                        <TableHead>Existing Rating(s)</TableHead>
                        <TableHead>Agenda Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.actions.map(action => (
                        <TableRow key={action.id}>
                            <TableCell>{action.mandateId}</TableCell>
                            <TableCell>{action.facilitiesInstruments}</TableCell>
                            <TableCell>{action.volume}</TableCell>
                            <TableCell>{action.existingRating}</TableCell>
                            <TableCell>{action.agendaType}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);

const AlmStatementSection = ({ initialData, onUpdate }: { initialData: AlmStatementData, onUpdate: (data: AlmStatementData) => void }) => {
    const [data, setData] = useState(initialData);

    const handleUpdate = (field: keyof AlmStatementData, value: any) => {
        const updatedData = { ...data, [field]: value };
        setData(updatedData);
        onUpdate(updatedData);
    };

    return (
        <div className="space-y-4">
            <div className="w-1/3">
                <Label>Applicability</Label>
                <Select
                    value={data.applicability}
                    onValueChange={(v) => handleUpdate('applicability', v as AlmStatementData['applicability'])}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Applicable">Applicable</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                    </SelectContent>
                </Select>
                 {data.applicability === 'Not Applicable' && <p className="text-sm text-destructive mt-1">This field is mandatory.</p>}
            </div>
            <div>
                <Label>Comments</Label>
                <Textarea
                    value={data.comments}
                    onChange={(e) => handleUpdate('comments', e.target.value)}
                    rows={4}
                    placeholder="Enter your comments for the ALM Statement..."
                />
            </div>
        </div>
    );
};

const QuarterlyCashFlowSection = ({ initialData, onUpdate }: { initialData: QuarterlyCashFlowData, onUpdate: (data: QuarterlyCashFlowData) => void }) => {
    const [data, setData] = useState(initialData);

    const handleUpdate = (field: keyof QuarterlyCashFlowData, value: any) => {
        const updatedData = { ...data, [field]: value };
        setData(updatedData);
        onUpdate(updatedData);
    };

    return (
        <div className="space-y-4">
            <div className="w-1/3">
                <Label>Applicability</Label>
                <Select
                    value={data.applicability}
                    onValueChange={(v) => handleUpdate('applicability', v as QuarterlyCashFlowData['applicability'])}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Applicable">Applicable</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                    </SelectContent>
                </Select>
                 {data.applicability === 'Not Applicable' && <p className="text-sm text-destructive mt-1">This field is mandatory.</p>}
            </div>
            <div>
                <Label>Comments</Label>
                <Textarea
                    value={data.comments}
                    onChange={(e) => handleUpdate('comments', e.target.value)}
                    rows={4}
                    placeholder="Enter your comments for the Quarterly Cash Flow Statement..."
                />
            </div>
        </div>
    );
};

const DetailsOfInstrumentSection = ({ initialData, onUpdate }: { initialData: DetailsOfInstrumentData, onUpdate: (data: DetailsOfInstrumentData) => void }) => {
    const [data, setData] = useState(initialData);

    const totalOutstanding = useMemo(() => {
        return data.outstandingCp.reduce((sum, row) => sum + (Number(row['Amount']) || 0), 0);
    }, [data.outstandingCp]);

    const cpNotIssued = useMemo(() => {
        return data.amountOfCpRated - totalOutstanding;
    }, [data.amountOfCpRated, totalOutstanding]);

    const handleUpdate = (field: keyof DetailsOfInstrumentData, value: any) => {
        const updatedData = { ...data, [field]: value };
        setData(updatedData);
        onUpdate(updatedData);
    };
    
    const handleTableRowChange = (rowId: string, column: string, value: string) => {
        const updatedRows = data.outstandingCp.map(row => 
            row.id === rowId ? { ...row, [column]: value } : row
        );
        handleUpdate('outstandingCp', updatedRows);
    };

    const handleAddRow = () => {
        const newRow: TableRowData = { id: `manual-${Date.now()}`, 'Date': '', 'Amount': '' };
        handleUpdate('outstandingCp', [...data.outstandingCp, newRow]);
    };

    const handleRemoveRow = (rowId: string) => {
        const updatedRows = data.outstandingCp.filter(row => row.id !== rowId);
        handleUpdate('outstandingCp', updatedRows);
    };

    return (
        <div className="space-y-4">
            <div className="w-1/3">
                <Label>Applicability</Label>
                <Select
                    value={data.applicability}
                    onValueChange={(v) => handleUpdate('applicability', v as DetailsOfInstrumentData['applicability'])}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Applicable">Applicable</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {data.applicability === 'Applicable' && (
                <div className="space-y-4">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold bg-muted/50 w-1/3">Amount of CP Rated</TableCell>
                                <TableCell>{data.amountOfCpRated}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-semibold bg-muted/50">Date of last revalidation rating letter</TableCell>
                                <TableCell>{data.dateOfLastRevalidation}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-semibold bg-muted/50">Validity of the above rating letter</TableCell>
                                <TableCell>
                                    <Input value={data.validityOfLetter} onChange={(e) => handleUpdate('validityOfLetter', e.target.value)} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    
                    <h4 className="font-semibold">CP Outstanding as on [•]</h4>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.outstandingCp.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell><Input type="date" value={row['Date']} onChange={(e) => handleTableRowChange(row.id, 'Date', e.target.value)} /></TableCell>
                                        <TableCell><Input type="number" value={row['Amount']} onChange={(e) => handleTableRowChange(row.id, 'Amount', e.target.value)} /></TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(row.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right">
                                        <Button variant="outline" size="sm" onClick={handleAddRow}><Plus className="mr-2 h-4 w-4" /> Add Row</Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                     <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold bg-muted/50 w-1/3">Total</TableCell>
                                <TableCell>{totalOutstanding}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-semibold bg-muted/50">CP not yet issued</TableCell>
                                <TableCell>{cpNotIssued}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-semibold bg-muted/50">Grand Total</TableCell>
                                <TableCell>{data.amountOfCpRated}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};


type SectionWrapperProps = {
  section: TemplateSection;
  note: RatingNote;
  onUpdateSection: (sectionId: string, data: Partial<RatingNote['sections'][string]>) => void;
  onRefreshTable: (tableId: string) => Promise<TableRowData[]>;
};

export default function SectionWrapper({
  section,
  note,
  onUpdateSection,
  onRefreshTable
}: SectionWrapperProps) {
  const sectionData = note.sections[section.id];
  const [applicability, setApplicability] = useState(sectionData.applicable);
  const [tableRows, setTableRows] = useState(sectionData.tableRows);
  const [disclosureData, setDisclosureData] = useState(sectionData.disclosure);
  const [bankFacilitiesData, setBankFacilitiesData] = useState(sectionData.bankFacilities);
  const [analystDetails, setAnalystDetails] = useState(sectionData.analystDetails);
  const [ratingRecommendation, setRatingRecommendation] = useState(sectionData.ratingRecommendation);
  const [qcSpecialists, setQcSpecialists] = useState(sectionData.qcSpecialists);
  const [careAndCrasText, setCareAndCrasText] = useState(
    sectionData.careAndCrasText || "CARE and other CRAs (Click here for their history, sensitivities and key factors)"
  );
  const [summaryHygieneChecks, setSummaryHygieneChecks] = useState(sectionData.summaryHygieneChecks);
  const [aboutCompany, setAboutCompany] = useState(sectionData.aboutCompany);
  const [keyUpdatesContent, setKeyUpdatesContent] = useState(sectionData.keyUpdatesContent);
  const [analyticalApproach, setAnalyticalApproach] = useState(sectionData.analyticalApproach);
  const [modelSummary, setModelSummary] = useState(sectionData.modelSummary);
  const [parentGovSupport, setParentGovSupport] = useState(sectionData.parentGovSupport);
  const [ceChecklist, setCeChecklist] = useState(sectionData.ceChecklist);
  const [linkedRatings, setLinkedRatings] = useState(sectionData.linkedRatings);
  const [boardComposition, setBoardComposition] = useState(sectionData.boardComposition);
  const [financials, setFinancials] = useState(sectionData.financials);
  const [interimResults, setInterimResults] = useState(sectionData.interimResults);
  const [quarterlyFinancials, setQuarterlyFinancials] = useState(sectionData.quarterlyFinancials);
  const [balanceSheet, setBalanceSheet] = useState(sectionData.balanceSheet);
  const [contingentLiabilities, setContingentLiabilities] = useState(sectionData.contingentLiabilities);
  const [profitAndLoss, setProfitAndLoss] = useState(sectionData.profitAndLoss);
  const [cashFlow, setCashFlow] = useState(sectionData.cashFlow);
  const [ratioAnalysis, setRatioAnalysis] = useState(sectionData.ratioAnalysis);
  const [goodwillAssessment, setGoodwillAssessment] = useState(sectionData.goodwillAssessment);
  const [assumptionsForCashFlow, setAssumptionsForCashFlow] = useState(sectionData.assumptionsForCashFlow);
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState(sectionData.sensitivityAnalysis);
  const [gstCalculation, setGstCalculation] = useState(sectionData.gstCalculation);
  const [assumptionsForProjections, setAssumptionsForProjections] = useState(sectionData.assumptionsForProjections);
  const [rationaleAndKeyRatingDrivers, setRationaleAndKeyRatingDrivers] = useState(sectionData.rationaleAndKeyRatingDrivers);
  const [ratingSensitivities, setRatingSensitivities] = useState(sectionData.ratingSensitivities);
  const [detailedDescriptionOfKeyRatingDrivers, setDetailedDescriptionOfKeyRatingDrivers] = useState(sectionData.detailedDescriptionOfKeyRatingDrivers);
  const [liquidity, setLiquidity] = useState(sectionData.liquidity);
  const [esgRisks, setEsgRisks] = useState(sectionData.esgRisks);
  const [statusOfNonCooperation, setStatusOfNonCooperation] = useState(sectionData.statusOfNonCooperation);
  const [anyOtherInformation, setAnyOtherInformation] = useState(sectionData.anyOtherInformation);
  const [consolidatedEntities, setConsolidatedEntities] = useState(sectionData.consolidatedEntities);
  const [previousRCMMinutes, setPreviousRCMMinutes] = useState(sectionData.previousRCMMinutes);
  const [addressedQCObservations, setAddressedQCObservations] = useState(sectionData.addressedQCObservations);
  const [pastRatingSensitivities, setPastRatingSensitivities] = useState(sectionData.pastRatingSensitivities);
  const [managementDiscussion, setManagementDiscussion] = useState(sectionData.managementDiscussion);
  const [discussionWithAuditCommittee, setDiscussionWithAuditCommittee] = useState(sectionData.discussionWithAuditCommittee);
  const [mandateDetails, setMandateDetails] = useState(sectionData.mandateDetails);
  const [contactDetailsEntity, setContactDetailsEntity] = useState(sectionData.contactDetailsEntity);
  const [contactDetailsBankers, setContactDetailsBankers] = useState(sectionData.contactDetailsBankers);
  const [contactDetailsAuditor, setContactDetailsAuditor] = useState(sectionData.contactDetailsAuditor);
  const [lastRatingAction, setLastRatingAction] = useState(sectionData.lastRatingAction);
  const [almStatement, setAlmStatement] = useState(sectionData.almStatement);
  const [quarterlyCashFlow, setQuarterlyCashFlow] = useState(sectionData.quarterlyCashFlow);
  const [detailsOfInstrument, setDetailsOfInstrument] = useState(sectionData.detailsOfInstrument);


  // Mock current user ID. In a real app, this would come from an auth context.
  const currentUserId = 'u_002'; // Changed to u_002 to test secondary analyst view

  const { isEditable, isPrimaryAnalyst, isSecondaryAnalyst } = useMemo(() => {
    const primaryId = note.analysts[0];
    const secondaryId = note.analysts[1];
    const localIsPrimary = currentUserId === primaryId;
    const localIsSecondary = currentUserId === secondaryId;

    let editable = false;
    // For Sector-Agnostic notes, only one person can edit the whole note.
    if (note.template.isAgnostic) {
      // If a secondary is assigned, they are the sole editor.
      if (secondaryId) {
        editable = localIsSecondary;
      } else {
        // Otherwise, the primary is the editor.
        editable = localIsPrimary;
      }
    } else { // For Sectorial notes, we use section-specific assignments
      const assignedTo = (sectionData as any)?.assignedTo;
      if (assignedTo) {
        editable = currentUserId === assignedTo;
      } else {
        // If no secondary analyst is assigned at all, the primary can edit everything
        if (!secondaryId) {
            editable = localIsPrimary;
        } else {
            // If a secondary is present but the section is unassigned, only primary can edit
            editable = localIsPrimary;
        }
      }
    }

    return {
      isEditable: editable,
      isPrimaryAnalyst: localIsPrimary,
      isSecondaryAnalyst: localIsSecondary,
    };
  }, [note, sectionData, currentUserId]);


  const handleTransferToPrimary = () => {
    // In a real app, this would trigger the `transferSectionToPrimary` cloud function.
    console.log(`Simulating transfer of section ${section.id} to Primary Analyst.`);
    alert(`Section "${section.title}" will be reassigned to the Primary Analyst.`);
    // Here, you might optimistically update the UI or wait for a re-fetch.
  };

  useEffect(() => {
    if (section.id === 's1') { // Cover page section
        if (!disclosureData) {
            getDisclosureData(note.companyId).then(data => {
                const newDisclosureData = data || { independentDirectors: 'Not Applicable', managingDirector: 'Not Applicable' };
                setDisclosureData(newDisclosureData);
                onUpdateSection(section.id, { disclosure: newDisclosureData });
            });
        }
        if (!bankFacilitiesData) {
            getBankFacilitiesData(note.companyId).then(data => {
                if (data) {
                    setBankFacilitiesData(data);
                    onUpdateSection(section.id, { bankFacilities: data });
                }
            });
        }
        if (!analystDetails) {
            getAnalystDetails(note.id).then(data => {
                if(data) {
                    setAnalystDetails(data);
                    onUpdateSection(section.id, { analystDetails: data });
                }
            });
        }
        if (!ratingRecommendation) {
            getRatingRecommendation(note.id).then(data => {
                if(data) {
                    setRatingRecommendation(data);
                    onUpdateSection(section.id, { ratingRecommendation: data });
                }
            });
        }
        if (!qcSpecialists) {
            getQCSpecialists(note.id).then(data => {
                if (data) {
                    setQcSpecialists(data);
                    onUpdateSection(section.id, { qcSpecialists: data });
                }
            });
        }
         if (!summaryHygieneChecks) {
            getSummaryHygieneChecksData(note.id).then(data => {
                if (data) {
                    setSummaryHygieneChecks(data);
                    onUpdateSection(section.id, { summaryHygieneChecks: data });
                }
            });
        }
    }
     if (section.id === 's_about_company') {
      if(!aboutCompany) {
        getAboutCompanyData(note.companyId).then(data => {
          if (data) {
            setAboutCompany(data);
            onUpdateSection(section.id, { aboutCompany: data });
          }
        });
      }
    }
    if (section.id === 's_key_updates') {
        if(!keyUpdatesContent) {
            getKeyUpdatesData(note.companyId).then(data => {
                 if (data) {
                    setKeyUpdatesContent(data);
                    onUpdateSection(section.id, { keyUpdatesContent: data });
                }
            })
        }
    }
     if (section.id === 's_analytical_approach') {
        if(!analyticalApproach) {
            getAnalyticalApproachData(note.id).then(data => {
                 if (data) {
                    setAnalyticalApproach(data);
                    onUpdateSection(section.id, { analyticalApproach: data });
                }
            })
        }
    }
    if (section.id === 's_model_summary') {
      if(!modelSummary) {
        getModelSummaryData(note.id).then(data => {
          if (data) {
            setModelSummary(data);
            onUpdateSection(section.id, { modelSummary: data });
          }
        });
      }
    }
    if (section.id === 's_parent_gov_support') {
      if(!parentGovSupport) {
        getParentGovSupportData(note.id).then(data => {
          if (data) {
            setParentGovSupport(data);
            onUpdateSection(section.id, { parentGovSupport: data });
          }
        });
      }
    }
    if(section.id === 's_ce_checklist') {
      if(!ceChecklist) {
        getCEChecklistData(note.id).then(data => {
          if (data) {
            setCeChecklist(data);
            onUpdateSection(section.id, { ceChecklist: data });
          }
        });
      }
    }
    if (section.id === 's_linked_ratings') {
        if(!linkedRatings) {
            // Initially, we might not have a guarantor, so we can't fetch.
            // This might be fetched based on a guarantor selected elsewhere.
            // For now, initializing with empty array.
            getLinkedRatingsData('').then(data => {
              setLinkedRatings(data as any);
              onUpdateSection(section.id, { linkedRatings: data as any });
            })
        }
    }
    if (section.id === 's_board_composition') {
        if (!boardComposition) {
            getBoardCompositionData(note.id).then(data => {
                if (data) {
                    setBoardComposition(data);
                    onUpdateSection(section.id, { boardComposition: data });
                }
            });
        }
    }
    if (section.id === 's_financials_past_projected') {
        if(!financials) {
            getFinancialsPastProjectedData(note.id).then(data => {
                if (data) {
                    setFinancials(data);
                    onUpdateSection(section.id, { financials: data });
                }
            });
        }
    }
    if (section.id === 's_interim_results') {
        if(!interimResults) {
            getInterimResultsData(note.id).then(data => {
                if (data) {
                    setInterimResults(data);
                    onUpdateSection(section.id, { interimResults: data });
                }
            });
        }
    }
    if (section.id === 's_quarterly_financials') {
        if(!quarterlyFinancials) {
            getQuarterlyFinancialsData(note.id).then(data => {
                if (data) {
                    setQuarterlyFinancials(data);
                    onUpdateSection(section.id, { quarterlyFinancials: data });
                }
            });
        }
    }
    if (section.id === 's_balance_sheet') {
      if (!balanceSheet) {
        getBalanceSheetData(note.id).then(data => {
          if (data) {
            setBalanceSheet(data);
            onUpdateSection(section.id, { balanceSheet: data });
          }
        });
      }
      if (!contingentLiabilities) {
        getContingentLiabilitiesData(note.id).then(data => {
            if (data) {
                setContingentLiabilities(data);
                onUpdateSection(section.id, { contingentLiabilities: data });
            }
        });
      }
    }
     if (section.id === 's_profit_loss') {
        if (!profitAndLoss) {
            getProfitAndLossData(note.id).then(data => {
                if (data) {
                    setProfitAndLoss(data);
                    onUpdateSection(section.id, { profitAndLoss: data });
                }
            });
        }
    }
    if (section.id === 's_cash_flow_statement') {
        if (!cashFlow) {
            getCashFlowData(note.id).then(data => {
                if (data) {
                    setCashFlow(data);
                    onUpdateSection(section.id, { cashFlow: data });
                }
            });
        }
    }
    if (section.id === 's_ratio_analysis') {
        if (!ratioAnalysis) {
            getRatioAnalysisData(note.id).then(data => {
                if (data) {
                    setRatioAnalysis(data);
                    onUpdateSection(section.id, { ratioAnalysis: data });
                }
            });
        }
    }
    if (section.id === 's_rcm_minutes') {
        if (!previousRCMMinutes) {
            getPreviousRCMMinutes(note.companyId).then(minutes => {
                const data = {
                    availableMinutes: minutes || [],
                    selectedMinuteIds: [],
                };
                setPreviousRCMMinutes(data);
                onUpdateSection(section.id, { previousRCMMinutes: data });
            });
        }
    }
    if (section.id === 's_qc_observations') {
        if (!addressedQCObservations) {
            getAddressedQCObservations(note.id).then(data => {
                if (data) {
                    setAddressedQCObservations(data);
                    onUpdateSection(section.id, { addressedQCObservations: data });
                }
            });
        }
    }
    if (section.id === 's_past_rating_sensitivities') {
        if (!pastRatingSensitivities) {
            getPastRatingSensitivities(note.companyId).then(data => {
                if (data) {
                    setPastRatingSensitivities(data);
                    onUpdateSection(section.id, { pastRatingSensitivities: data });
                }
            });
        }
    }
     if (section.id === 's_management_discussion') {
      if (!managementDiscussion) {
        getManagementDiscussionData(note.id).then(data => {
          if (data) {
            setManagementDiscussion(data);
            onUpdateSection(section.id, { managementDiscussion: data });
          }
        });
      }
    }
    if (section.id === 's_discussion_audit_committee') {
      if (!discussionWithAuditCommittee) {
        getDiscussionWithAuditCommitteeData(note.id).then(data => {
          if (data) {
            setDiscussionWithAuditCommittee(data);
            onUpdateSection(section.id, { discussionWithAuditCommittee: data });
          }
        });
      }
    }
    if(section.id === 's_rating_sensitivities') {
        if (!ratingSensitivities) {
            const initialData = { positiveFactors: [], negativeFactors: [] };
            setRatingSensitivities(initialData);
            onUpdateSection(section.id, { ratingSensitivities: initialData });
        }
    }
    if (section.id === 's_liquidity') {
        if (!liquidity) {
            getLiquidityData(note.companyId).then(data => {
                if (data) {
                    setLiquidity(data);
                    onUpdateSection(section.id, { liquidity: data });
                }
            });
        }
    }
    if (section.id === 's_alm_statement') {
        if (!almStatement) {
            getAlmStatementData(note.id).then(data => {
                if (data) {
                    setAlmStatement(data);
                    onUpdateSection(section.id, { almStatement: data });
                }
            });
        }
    }
    if (section.id === 's_quarterly_cash_flow') {
        if (!quarterlyCashFlow) {
            getQuarterlyCashFlowData(note.id).then(data => {
                if (data) {
                    setQuarterlyCashFlow(data);
                    onUpdateSection(section.id, { quarterlyCashFlow: data });
                }
            });
        }
    }
    if (section.id === 's_details_of_instrument') {
        if (!detailsOfInstrument) {
            getDetailsOfInstrumentData(note.id).then(data => {
                if (data) {
                    setDetailsOfInstrument(data);
                    onUpdateSection(section.id, { detailsOfInstrument: data });
                }
            });
        }
    }
     if (section.id === 's_non_cooperation_status') {
      if (!statusOfNonCooperation) {
        getStatusOfNonCooperation(note.companyId).then(data => {
          if (data) {
            setStatusOfNonCooperation(data);
            onUpdateSection(section.id, { statusOfNonCooperation: data });
          }
        });
      }
    }
    if (section.id === 's_any_other_info') {
      if (!anyOtherInformation) {
        getAnyOtherInformationData(note.companyId).then(data => {
          if (data) {
            setAnyOtherInformation(data);
            onUpdateSection(section.id, { anyOtherInformation: data });
          }
        });
      }
    }
    if (section.id === 's_consolidated_entities') {
      if (!consolidatedEntities) {
        getConsolidatedEntities(note.companyId).then(data => {
          if (data) {
            setConsolidatedEntities(data);
            onUpdateSection(section.id, { consolidatedEntities: data });
          }
        });
      }
    }
     if (section.id === 's_goodwill_assessment') {
      if (!goodwillAssessment) {
        getGoodwillAssessmentData(note.id).then(data => {
          if (data) {
            setGoodwillAssessment(data);
            onUpdateSection(section.id, { goodwillAssessment: data });
          }
        });
      }
    }
     if (section.id === 's_cpti_mandate_details') {
        if (!mandateDetails) {
            getMandateDetails(note.id).then(data => {
                if(data) {
                    setMandateDetails(data);
                    onUpdateSection(section.id, { mandateDetails: data });
                }
            });
        }
    }
    if (section.id === 's_cpti_contact_entity') {
        if (!contactDetailsEntity) {
            getContactDetailsEntity(note.companyId).then(data => {
                if (data) {
                    setContactDetailsEntity(data);
                    onUpdateSection(section.id, { contactDetailsEntity: data });
                }
            });
        }
    }
    if (section.id === 's_cpti_contact_bankers') {
        if (!contactDetailsBankers) {
            getContactDetailsBankers(note.companyId).then(data => {
                if (data) {
                    setContactDetailsBankers(data);
                    onUpdateSection(section.id, { contactDetailsBankers: data });
                }
            });
        }
    }
    if (section.id === 's_cpti_contact_auditor') {
        if (!contactDetailsAuditor) {
            getContactDetailsAuditor(note.companyId).then(data => {
                if (data) {
                    setContactDetailsAuditor(data);
                    onUpdateSection(section.id, { contactDetailsAuditor: data });
                }
            });
        }
    }
    if (section.id === 's_cpti_last_rating_action') {
        if (!lastRatingAction) {
            getLastRatingActionData(note.id).then(data => {
                if (data) {
                    setLastRatingAction(data);
                    onUpdateSection(section.id, { lastRatingAction: data });
                }
            });
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id, note.companyId, note.id, onUpdateSection]);

  const handleApplicabilityChange = (value: 'Applicable' | 'Not Applicable' | 'Not Available') => {
    setApplicability(value);
    onUpdateSection(section.id, { applicable: value });
  };
  
  const handleSaveComment = (sectionId: string, content: string, attachments: any[]) => {
    onUpdateSection(sectionId, { comments: content, attachments });
  }

  const handleTablePaste = (newRows: TableRowData[]) => {
    const updatedRows = [...tableRows, ...newRows];
    setTableRows(updatedRows);
    onUpdateSection(section.id, { tableRows: updatedRows });
  }

  const handleRowUpdate = (updatedRow: TableRowData) => {
    const updatedRows = tableRows.map(row => row.id === updatedRow.id ? updatedRow : row);
    setTableRows(updatedRows);
    onUpdateSection(section.id, { tableRows: updatedRows });
  }
  
  const handleRowAdd = (newRow: TableRowData) => {
    const updatedRows = [...tableRows, newRow];
    setTableRows(updatedRows);
    onUpdateSection(section.id, { tableRows: updatedRows });
  }

  const handleRowRemove = (rowId: string) => {
    const updatedRows = tableRows.filter(r => r.id !== rowId);
    setTableRows(updatedRows);
    onUpdateSection(section.id, { tableRows: updatedRows });
  }

  const handleSpecialistUpdate = (data: QCSectorSpecialistData[]) => {
    setQcSpecialists(data);
    onUpdateSection(section.id, { qcSpecialists: data });
  };

  const handleCareAndCrasTextChange = (newText: string) => {
    setCareAndCrasText(newText);
    onUpdateSection(section.id, { careAndCrasText: newText });
  };

  const handleHygieneChecksUpdate = (data: SummaryHygieneChecksData) => {
    setSummaryHygieneChecks(data);
    onUpdateSection(section.id, { summaryHygieneChecks: data });
  }

  const handleAboutCompanyUpdate = (data: AboutCompanyData) => {
    setAboutCompany(data);
    onUpdateSection(section.id, { aboutCompany: data });
  }

  const handleAboutCompanyRefresh = (approach: 'Standalone' | 'Consolidated' | 'Combined') => {
    console.log(`Refreshing About Company data for approach: ${approach}`);
    // Simulate re-fetching and updating data
    getAboutCompanyData(note.companyId, true).then(data => {
      if (data) {
        setAboutCompany(data);
        onUpdateSection(section.id, { aboutCompany: data });
      }
    });
  }
  
  const handleKeyUpdatesContentUpdate = (content: any) => {
    setKeyUpdatesContent(content);
    onUpdateSection(section.id, { keyUpdatesContent: content });
  };

  const handleAnalyticalApproachUpdate = (data: AnalyticalApproachData) => {
    setAnalyticalApproach(data);
    onUpdateSection(section.id, { analyticalApproach: data });
  };
  
  const handleKeyUpdatesContentRefresh = async (field: string): Promise<string> => {
    const data = await getKeyUpdatesData(note.companyId, true); // force refresh
    return (data as any)[field] || '';
  }

  const handleModelSummaryUpdate = (data: ModelSummaryRow[]) => {
    setModelSummary(data);
    onUpdateSection(section.id, { modelSummary: data });
  }

  const handleModelSummaryRefresh = () => {
    // Simulate data refresh
    console.log("Refreshing model summary...");
  }
  
  const handleParentGovSupportUpdate = (data: ParentGovSupportData) => {
    setParentGovSupport(data);
    onUpdateSection(section.id, { parentGovSupport: data });
  }

  const handleCEChecklistUpdate = (data: CEChecklistData) => {
    setCeChecklist(data);
    onUpdateSection(section.id, { ceChecklist: data });
  }
  
  const handleFinancialsUpdate = (data: FinancialsPastProjectedData) => {
    setFinancials(data);
    onUpdateSection(section.id, { financials: data });
  }

  const handleFinancialsRefresh = async (table: 'main' | 'quarterly'): Promise<TableRowData[]> => {
    console.log(`Refreshing ${table} financials...`);
    const refreshedData = await getFinancialsPastProjectedData(note.id); // Re-fetch all
    if (!refreshedData) return [];
    
    if (table === 'main') {
        const updatedMain = refreshedData.mainTable.map(row => ({...row, '2025E': (row['2025E'] as number) + 10})); // Simulate change
        handleFinancialsUpdate({...financials!, mainTable: updatedMain});
        return updatedMain;
    } else {
        const updatedQuarterly = refreshedData.quarterlyTable.map(row => ({...row, 'Q2-24': (row['Q2-24'] as number) + 5})); // Simulate change
        handleFinancialsUpdate({...financials!, quarterlyTable: updatedQuarterly});
        return updatedQuarterly;
    }
  }

  const handleInterimResultsUpdate = (data: InterimResultsData) => {
      setInterimResults(data);
      onUpdateSection(section.id, { interimResults: data });
  }
  
  const handleQuarterlyFinancialsUpdate = (data: QuarterlyFinancialsData) => {
      setQuarterlyFinancials(data);
      onUpdateSection(section.id, { quarterlyFinancials: data });
  }

  const handleQuarterlyFinancialsRefresh = async (): Promise<TableRowData[]> => {
      console.log(`Refreshing quarterly financials...`);
      const refreshedData = await getQuarterlyFinancialsData(note.id);
      if (!refreshedData) return [];
      
      const updatedRows = refreshedData.tableRows.map(row => ({...row, 'Q3-24': (row['Q3-24'] as number) + 1})); // Simulate change
      handleQuarterlyFinancialsUpdate({...quarterlyFinancials!, tableRows: updatedRows});
      return updatedRows;
  }

  const handleBalanceSheetUpdate = (data: BalanceSheetData) => {
    setBalanceSheet(data);
    onUpdateSection(section.id, { balanceSheet: data });
  }

  const handleBalanceSheetRefresh = async (): Promise<TableRowData[]> => {
    console.log('Refreshing balance sheet...');
    const refreshedData = await getBalanceSheetData(note.id);
    if (!refreshedData) return [];
    
    const updatedRows = refreshedData.tableRows.map(row => ({...row, '2024P': (row['2024P'] as number) + 10}));
    handleBalanceSheetUpdate({ tableRows: updatedRows });
    return updatedRows;
  }
  
  const handleContingentLiabilitiesUpdate = (data: ContingentLiabilitiesData) => {
    setContingentLiabilities(data);
    onUpdateSection(section.id, { contingentLiabilities: data });
  }

  const handleContingentLiabilitiesRefresh = async (): Promise<ContingentLiabilitiesData | null> => {
      const refreshedData = await getContingentLiabilitiesData(note.id);
      return refreshedData;
  }
  
  const handleProfitAndLossUpdate = (data: ProfitAndLossData) => {
    setProfitAndLoss(data);
    onUpdateSection(section.id, { profitAndLoss: data });
  }

  const handleProfitAndLossRefresh = async (): Promise<TableRowData[]> => {
    console.log('Refreshing P&L...');
    const refreshedData = await getProfitAndLossData(note.id);
    if (!refreshedData) return [];
    
    const updatedRows = refreshedData.tableRows.map(row => ({...row, '2024P': (row['2024P'] as number) + 10}));
    handleProfitAndLossUpdate({ tableRows: updatedRows });
    return updatedRows;
  }
  
  const handleCashFlowUpdate = (data: CashFlowData) => {
    setCashFlow(data);
    onUpdateSection(section.id, { cashFlow: data });
  }

  const handleCashFlowRefresh = async (): Promise<TableRowData[]> => {
    console.log('Refreshing Cash Flow...');
    const refreshedData = await getCashFlowData(note.id);
    if (!refreshedData) return [];
    
    const updatedRows = refreshedData.tableRows.map(row => ({...row, '2024P': (row['2024P'] as number) + 10}));
    handleCashFlowUpdate({ tableRows: updatedRows });
    return updatedRows;
  }

  const handleRatioAnalysisUpdate = (data: RatioAnalysisData) => {
    setRatioAnalysis(data);
    onUpdateSection(section.id, { ratioAnalysis: data });
  }

  const handleRatioAnalysisRefresh = async (): Promise<TableRowData[]> => {
    console.log('Refreshing Ratio Analysis...');
    const refreshedData = await getRatioAnalysisData(note.id);
    if (!refreshedData) return [];
    
    const updatedRows = refreshedData.tableRows.map(row => ({...row, '2024P': (row['2024P'] as number) + 0.1}));
    handleRatioAnalysisUpdate({ tableRows: updatedRows });
    return updatedRows;
  }

  const handlePreviousRCMMinutesUpdate = (data: PreviousRCMMinutesData) => {
    setPreviousRCMMinutes(data);
    onUpdateSection(section.id, { previousRCMMinutes: data });
  }

  const handleAddressedQCObservationsUpdate = (data: AddressedQCObservationData[]) => {
    setAddressedQCObservations(data);
    onUpdateSection(section.id, { addressedQCObservations: data });
  };

  const handlePastRatingSensitivitiesUpdate = (data: PastRatingSensitivitiesData) => {
      setPastRatingSensitivities(data);
      onUpdateSection(section.id, { pastRatingSensitivities: data });
  }

  const handlePastRatingSensitivitiesRefresh = () => {
    getPastRatingSensitivities(note.companyId, true).then(data => {
        if(data) {
            setPastRatingSensitivities(data);
            onUpdateSection(section.id, { pastRatingSensitivities: data });
        }
    })
  }

  const handleDiscussionWithAuditCommitteeRefresh = () => {
    getDiscussionWithAuditCommitteeData(note.id, true).then(data => {
        if(data) {
            setDiscussionWithAuditCommittee(data);
            onUpdateSection(section.id, { discussionWithAuditCommittee: data });
        }
    })
  }

  const handleAssumptionsForCashFlowUpdate = (content: string) => {
    onUpdateSection(section.id, { assumptionsForCashFlow: content });
  };

  const handleSensitivityAnalysisUpdate = (content: string) => {
    onUpdateSection(section.id, { sensitivityAnalysis: content });
  };
  
  const handleGstCalculationUpdate = (content: string) => {
    onUpdateSection(section.id, { gstCalculation: content });
  };

  const handleAssumptionsForProjectionsUpdate = (content: string) => {
    onUpdateSection(section.id, { assumptionsForProjections: content });
  };

  const handleRationaleAndKeyRatingDriversUpdate = (content: string) => {
    onUpdateSection(section.id, { rationaleAndKeyRatingDrivers: content });
  };
  
  const handleRatingSensitivitiesUpdate = (data: RatingSensitivitiesData) => {
    setRatingSensitivities(data);
    onUpdateSection(section.id, { ratingSensitivities: data });
  }

  const handleDetailedDescriptionOfKeyRatingDriversUpdate = (field: 'keyStrengths' | 'keyWeaknesses', content: string) => {
    const updatedValue = { ...detailedDescriptionOfKeyRatingDrivers, [field]: content };
    setDetailedDescriptionOfKeyRatingDrivers(updatedValue);
    onUpdateSection(section.id, { detailedDescriptionOfKeyRatingDrivers: updatedValue });
  };

  const handleLiquidityUpdate = (data: LiquidityData) => {
      setLiquidity(data);
      onUpdateSection(section.id, { liquidity: data });
  }
  
  const handleLiquidityRefresh = async (): Promise<LiquidityData | null> => {
      const refreshedData = await getLiquidityData(note.companyId, true);
      return refreshedData;
  }
  
  const handleAlmStatementUpdate = (data: AlmStatementData) => {
      setAlmStatement(data);
      onUpdateSection(section.id, { almStatement: data });
  }
  
  const handleQuarterlyCashFlowUpdate = (data: QuarterlyCashFlowData) => {
      setQuarterlyCashFlow(data);
      onUpdateSection(section.id, { quarterlyCashFlow: data });
  }

  const handleDetailsOfInstrumentUpdate = (data: DetailsOfInstrumentData) => {
      setDetailsOfInstrument(data);
      onUpdateSection(section.id, { detailsOfInstrument: data });
  }

  const handleEsgRisksUpdate = (content: string) => {
    setEsgRisks(content);
    onUpdateSection(section.id, { esgRisks: content });
  }

  const handleStatusOfNonCooperationRefresh = async (): Promise<StatusOfNonCooperationData | null> => {
    const refreshedData = await getStatusOfNonCooperation(note.companyId, true);
    if(refreshedData){
        setStatusOfNonCooperation(refreshedData);
        onUpdateSection(section.id, { statusOfNonCooperation: refreshedData });
    }
    return refreshedData;
  }

  const handleAnyOtherInformationRefresh = async (): Promise<AnyOtherInformationData | null> => {
    const refreshedData = await getAnyOtherInformationData(note.companyId, true);
    if(refreshedData){
        setAnyOtherInformation(refreshedData);
        onUpdateSection(section.id, { anyOtherInformation: refreshedData });
    }
    return refreshedData;
  }
  
  const handleConsolidatedEntitiesUpdate = (data: ConsolidatedEntity[]) => {
    setConsolidatedEntities(data);
    onUpdateSection(section.id, { consolidatedEntities: data });
  }

  const handleConsolidatedEntitiesRefresh = () => {
    getConsolidatedEntities(note.companyId, true).then(data => {
      if (data) {
        setConsolidatedEntities(data);
        onUpdateSection(section.id, { consolidatedEntities: data });
      }
    });
  }

  const handleBoardCompositionUpdate = (data: BoardCompositionData) => {
      setBoardComposition(data);
      onUpdateSection(section.id, { boardComposition: data });
  };

  const handleBoardCompositionRefresh = () => {
    getBoardCompositionData(note.id).then(data => {
        if(data) {
            setBoardComposition(data);
            onUpdateSection(section.id, { boardComposition: data });
        }
    })
  }

  const handleGoodwillAssessmentUpdate = (data: GoodwillAssessmentData) => {
    setGoodwillAssessment(data);
    onUpdateSection(section.id, { goodwillAssessment: data });
  }

  const handleMandateDetailsUpdate = (data: MandateDetailsData) => {
      setMandateDetails(data);
      onUpdateSection(section.id, { mandateDetails: data });
  }

  const handleLastRatingActionRefresh = () => {
    getLastRatingActionData(note.id, true).then(data => {
      if (data) {
        setLastRatingAction(data);
        onUpdateSection(section.id, { lastRatingAction: data });
      }
    });
  }


  const sectionVisible = applicability === 'Applicable';
  const tableHeaders = sectionData.tableRows.length > 0 ? Object.keys(sectionData.tableRows[0]).filter(k => k !== 'id' && k !== 'isManual' && k !== 'manualEdit' && k !== 'mappedAttributeId') : [];

  const isCoverPage = section.id === 's1';
  const isAboutCompanySection = section.id === 's_about_company';
  const isKeyUpdatesSection = section.id === 's_key_updates';
  const isAnalyticalApproachSection = section.id === 's_analytical_approach';
  const isModelSummarySection = section.id === 's_model_summary';
  const isParentGovSupportSection = section.id === 's_parent_gov_support';
  const isCEChecklistSection = section.id === 's_ce_checklist';
  const isLinkedRatingsSection = section.id === 's_linked_ratings';
  const isBoardCompositionSection = section.id === 's_board_composition';
  const isFinancialsPastProjectedSection = section.id === 's_financials_past_projected';
  const isInterimResultsSection = section.id === 's_interim_results';
  const isQuarterlyFinancialsSection = section.id === 's_quarterly_financials';
  const isBalanceSheetSection = section.id === 's_balance_sheet';
  const isProfitAndLossSection = section.id === 's_profit_loss';
  const isCashFlowStatementSection = section.id === 's_cash_flow_statement';
  const isRatioAnalysisSection = section.id === 's_ratio_analysis';
  const isPreviousRCMMinutesSection = section.id === 's_rcm_minutes';
  const isAddressedQCObservationsSection = section.id === 's_qc_observations';
  const isPastRatingSensitivitiesSection = section.id === 's_past_rating_sensitivities';
  const isManagementDiscussionSection = section.id === 's_management_discussion';
  const isDiscussionWithAuditCommitteeSection = section.id === 's_discussion_audit_committee';
  const isAssumptionsForCashFlowSection = section.id === 's_cash_flow_assumptions';
  const isSensitivityAnalysisSection = section.id === 's_sensitivity_analysis';
  const isGstCalculationSection = section.id === 's_gst_calculation';
  const isAssumptionsForProjectionsSection = section.id === 's_projections_assumptions';
  const isNonInterestIncomeSection = section.id === 's_non_interest_income';
  const isStressedAssetsSection = section.id === 's_stressed_assets';
  const isRationaleDriversSection = section.id === 's_rationale_drivers';
  const isRatingSensitivitiesSection = section.id === 's_rating_sensitivities';
  const isAnalyticalApproachDisplaySection = section.id === 's_analytical_approach_display';
  const isDetailedDriversSection = section.id === 's_detailed_drivers';
  const isLiquiditySection = section.id === 's_liquidity';
  const isAlmStatementSection = section.id === 's_alm_statement';
  const isQuarterlyCashFlowSection = section.id === 's_quarterly_cash_flow';
  const isDetailsOfInstrumentSection = section.id === 's_details_of_instrument';
  const isEsgRisksSection = section.id === 's_esg_risks';
  const isStatusOfNonCooperationSection = section.id === 's_non_cooperation_status';
  const isAnyOtherInformationSection = section.id === 's_any_other_info';
  const isConsolidatedEntitiesSection = section.id === 's_consolidated_entities';
  const isGoodwillAssessmentSection = section.id === 's_goodwill_assessment';
  const isInstrumentDetailsSection = section.id === 's_instrument_details';
  const isMandateDetailsSection = section.id === 's_cpti_mandate_details';
  const isContactDetailsEntitySection = section.id === 's_cpti_contact_entity';
  const isContactDetailsBankersSection = section.id === 's_cpti_contact_bankers';
  const isContactDetailsAuditorSection = section.id === 's_cpti_contact_auditor';
  const isLastRatingActionSection = section.id === 's_cpti_last_rating_action';

  if (sectionData.isReferenceOnly) {
    return (
        <Card id={section.key}>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 border rounded-md bg-muted text-muted-foreground italic">
                    {sectionData.referenceNote}
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card id={section.key}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="font-headline text-2xl">{section.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isSecondaryAnalyst && isEditable && (
             <Button variant="outline" size="sm" onClick={handleTransferToPrimary}>
                <Send className="mr-2 h-4 w-4" />
                Assign to Primary
            </Button>
          )}
          <Select
            value={applicability}
            onValueChange={handleApplicabilityChange}
            disabled={!isEditable}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select applicability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applicable">Applicable</SelectItem>
              <SelectItem value="Not Applicable">Not Applicable</SelectItem>
              <SelectItem value="Not Available">Not Available</SelectItem>
            </SelectContent>
          </Select>
          {section.tooltipKey && !isCoverPage && <Tooltip tooltipKey={section.tooltipKey} sector={note.template.sector} />}
        </div>
      </CardHeader>
      <CardContent>
        {!sectionVisible && !isAnalyticalApproachDisplaySection && (
          <p className="text-muted-foreground p-4 text-center">This section is marked as "{applicability}". Comments can still be added below.</p>
        )}

        {isCoverPage && sectionVisible && (
          <div className="space-y-6">
            {disclosureData && <DisclosureSection disclosure={disclosureData} tooltipKey={section.tooltipKey} sector={note.template.sector} />}
            {summaryHygieneChecks && <Separator />}
            {summaryHygieneChecks && <SummaryHygieneChecks initialData={summaryHygieneChecks} onUpdate={handleHygieneChecksUpdate} />}
            {analystDetails && <Separator />}
            {analystDetails && <AnalystDetailsSection details={analystDetails} />}
            {ratingRecommendation && <Separator />}
            {ratingRecommendation && <RatingRecommendationSection ratings={ratingRecommendation} />}
            {qcSpecialists && <Separator />}
            {qcSpecialists && <QCSectorSpecialistSection specialists={qcSpecialists} onUpdate={handleSpecialistUpdate} />}
            {bankFacilitiesData && <Separator />}
            {bankFacilitiesData && <BankFacilitiesSection facilitiesData={bankFacilitiesData} />}
            <Separator />
            <CareAndCrasSection text={careAndCrasText} onTextChange={handleCareAndCrasTextChange} />
          </div>
        )}

        {isAboutCompanySection && sectionVisible && aboutCompany && (
            <AboutCompanySection
                initialData={aboutCompany}
                onUpdate={handleAboutCompanyUpdate}
                onRefresh={handleAboutCompanyRefresh}
                companyName={note.company.name}
                analyticalApproach={note.financialApproach}
            />
        )}
        
        {isKeyUpdatesSection && sectionVisible && keyUpdatesContent && (
             <KeyUpdatesSection 
                content={keyUpdatesContent}
                onUpdate={handleKeyUpdatesContentUpdate}
                onRefresh={handleKeyUpdatesContentRefresh}
                sector={note.template.sector}
             />
        )}
        
         {isAnalyticalApproachSection && sectionVisible && analyticalApproach && (
          <AnalyticalApproachSection
            data={analyticalApproach}
            onUpdate={handleAnalyticalApproachUpdate}
          />
        )}

        {isAnalyticalApproachDisplaySection && (
           <AnalyticalApproachDisplaySection analyticalApproach={note.sections['s_analytical_approach']?.analyticalApproach} />
        )}

        {isModelSummarySection && sectionVisible && modelSummary && (
          <ModelSummarySection 
            initialData={modelSummary}
            onUpdate={handleModelSummaryUpdate}
            onRefresh={handleModelSummaryRefresh}
          />
        )}

        {isParentGovSupportSection && sectionVisible && parentGovSupport && (
          <ParentGovSupportSection
            initialData={parentGovSupport}
            onUpdate={handleParentGovSupportUpdate}
          />
        )}

        {isCEChecklistSection && sectionVisible && ceChecklist && (
          <CEChecklistSection
            initialData={ceChecklist}
            onUpdate={handleCEChecklistUpdate}
          />
        )}

        {isBoardCompositionSection && sectionVisible && boardComposition && (
            <BoardCompositionSection
                initialData={boardComposition}
                onUpdate={handleBoardCompositionUpdate}
                onRefresh={handleBoardCompositionRefresh}
                tooltipKey={section.tooltipKey}
            />
        )}

        {isFinancialsPastProjectedSection && sectionVisible && financials && (
            <FinancialsPastProjectedSection 
                initialData={financials}
                onUpdate={handleFinancialsUpdate}
                onRefresh={handleFinancialsRefresh}
                companyName={note.company.name}
            />
        )}

        {isInterimResultsSection && sectionVisible && interimResults && (
            <InterimResultReviewsSection 
                initialData={interimResults}
                onUpdate={handleInterimResultsUpdate}
            />
        )}

        {isQuarterlyFinancialsSection && sectionVisible && quarterlyFinancials && (
          <QuarterlyFinancialsSection
            initialData={quarterlyFinancials}
            onUpdate={handleQuarterlyFinancialsUpdate}
            onRefresh={handleQuarterlyFinancialsRefresh}
            companyName={note.company.name}
          />
        )}
        
        {isBalanceSheetSection && sectionVisible && balanceSheet && (
          <>
            <BalanceSheetSection
              initialData={balanceSheet}
              onUpdate={handleBalanceSheetUpdate}
              onRefresh={handleBalanceSheetRefresh}
              companyName={note.company.name}
            />
            {contingentLiabilities && (
              <ContingentLiabilitiesSection 
                initialData={contingentLiabilities}
                onUpdate={handleContingentLiabilitiesUpdate}
                onRefresh={handleContingentLiabilitiesRefresh}
                companyName={note.company.name}
              />
            )}
          </>
        )}
        
        {isProfitAndLossSection && sectionVisible && profitAndLoss && (
          <ProfitAndLossSection
            initialData={profitAndLoss}
            onUpdate={handleProfitAndLossUpdate}
            onRefresh={handleProfitAndLossRefresh}
            companyName={note.company.name}
          />
        )}

        {isCashFlowStatementSection && sectionVisible && cashFlow && (
          <CashFlowStatementSection
            initialData={cashFlow}
            onUpdate={handleCashFlowUpdate}
            onRefresh={handleCashFlowRefresh}
            companyName={note.company.name}
          />
        )}

        {isRatioAnalysisSection && sectionVisible && ratioAnalysis && (
          <RatioAnalysisSection
            initialData={ratioAnalysis}
            onUpdate={handleRatioAnalysisUpdate}
            onRefresh={handleRatioAnalysisRefresh}
            companyName={note.company.name}
          />
        )}
        
        {isPreviousRCMMinutesSection && sectionVisible && previousRCMMinutes && (
          <PreviousRCMMinutesSection
            initialData={previousRCMMinutes}
            onUpdate={handlePreviousRCMMinutesUpdate}
          />
        )}

        {isAddressedQCObservationsSection && sectionVisible && addressedQCObservations && (
             <AddressedQCObservationsSection 
                initialData={addressedQCObservations}
                onUpdate={handleAddressedQCObservationsUpdate}
            />
        )}

        {isPastRatingSensitivitiesSection && sectionVisible && pastRatingSensitivities && (
            <PastRatingSensitivitiesSection
                initialData={pastRatingSensitivities}
                onUpdate={handlePastRatingSensitivitiesUpdate}
                onRefresh={handlePastRatingSensitivitiesRefresh}
            />
        )}

        {isManagementDiscussionSection && sectionVisible && managementDiscussion && (
          <ManagementDiscussionSection data={managementDiscussion} />
        )}
        
        {isDiscussionWithAuditCommitteeSection && sectionVisible && discussionWithAuditCommittee && (
          <DiscussionWithAuditCommitteeSection 
            data={discussionWithAuditCommittee}
            onRefresh={handleDiscussionWithAuditCommitteeRefresh}
           />
        )}


        { isAssumptionsForCashFlowSection && sectionVisible && (
            <Textarea 
                value={sectionData.assumptionsForCashFlow || ''}
                onChange={(e) => handleAssumptionsForCashFlowUpdate(e.target.value)}
                rows={10}
                placeholder="Enter assumptions for cash flow..."
            />
        )}

        { isSensitivityAnalysisSection && sectionVisible && (
            <Textarea 
                value={sectionData.sensitivityAnalysis || ''}
                onChange={(e) => handleSensitivityAnalysisUpdate(e.target.value)}
                rows={10}
                placeholder="Enter sensitivity analysis details..."
            />
        )}

        { isGstCalculationSection && sectionVisible && (
            <Textarea 
                value={sectionData.gstCalculation || ''}
                onChange={(e) => handleGstCalculationUpdate(e.target.value)}
                rows={10}
                placeholder="Enter GST calculation details..."
            />
        )}
        
        { isAssumptionsForProjectionsSection && sectionVisible && (
            <Textarea 
                value={sectionData.assumptionsForProjections || ''}
                onChange={(e) => handleAssumptionsForProjectionsUpdate(e.target.value)}
                rows={10}
                placeholder="Enter assumptions for projections..."
            />
        )}

        { isRationaleDriversSection && sectionVisible && (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor={`rationale-${section.id}`} className="text-base">Rationale and Key Rating Drivers</Label>
                    {section.tooltipKey && <Tooltip tooltipKey={section.tooltipKey} />}
                </div>
                <Textarea 
                    id={`rationale-${section.id}`}
                    value={sectionData.rationaleAndKeyRatingDrivers || ''}
                    onChange={(e) => handleRationaleAndKeyRatingDriversUpdate(e.target.value)}
                    rows={10}
                    placeholder="Enter rationale and key rating drivers..."
                />
            </div>
        )}

        {isRatingSensitivitiesSection && sectionVisible && ratingSensitivities && (
            <RatingSensitivitiesSection 
                initialData={ratingSensitivities}
                onUpdate={handleRatingSensitivitiesUpdate}
            />
        )}
        
        {isLiquiditySection && sectionVisible && liquidity && (
            <LiquiditySection
                initialData={liquidity}
                onUpdate={handleLiquidityUpdate}
                onRefresh={handleLiquidityRefresh}
            />
        )}

        {isAlmStatementSection && sectionVisible && almStatement && (
            <AlmStatementSection
                initialData={almStatement}
                onUpdate={handleAlmStatementUpdate}
            />
        )}

        {isQuarterlyCashFlowSection && sectionVisible && quarterlyCashFlow && (
            <QuarterlyCashFlowSection
                initialData={quarterlyCashFlow}
                onUpdate={handleQuarterlyCashFlowUpdate}
            />
        )}

        {isDetailsOfInstrumentSection && sectionVisible && detailsOfInstrument && (
            <DetailsOfInstrumentSection
                initialData={detailsOfInstrument}
                onUpdate={handleDetailsOfInstrumentUpdate}
            />
        )}
        
        { isDetailedDriversSection && sectionVisible && (
             <div className="space-y-4">
                <div>
                    <Label htmlFor={`detailed-drivers-strengths-${section.id}`} className="text-base font-semibold">Key Strengths</Label>
                    <Textarea 
                        id={`detailed-drivers-strengths-${section.id}`}
                        value={detailedDescriptionOfKeyRatingDrivers?.keyStrengths || ''}
                        onChange={(e) => handleDetailedDescriptionOfKeyRatingDriversUpdate('keyStrengths', e.target.value)}
                        rows={8}
                        placeholder="Enter detailed description of key strengths..."
                    />
                </div>
                <div>
                    <Label htmlFor={`detailed-drivers-weaknesses-${section.id}`} className="text-base font-semibold">Key Weaknesses</Label>
                    <Textarea 
                        id={`detailed-drivers-weaknesses-${section.id}`}
                        value={detailedDescriptionOfKeyRatingDrivers?.keyWeaknesses || ''}
                        onChange={(e) => handleDetailedDescriptionOfKeyRatingDriversUpdate('keyWeaknesses', e.target.value)}
                        rows={8}
                        placeholder="Enter detailed description of key weaknesses..."
                    />
                </div>
            </div>
        )}

        { isEsgRisksSection && sectionVisible && (
            <Textarea
                value={esgRisks || ''}
                onChange={(e) => handleEsgRisksUpdate(e.target.value)}
                rows={10}
                placeholder="Enter ESG-related risks, governance issues, or disclosures..."
            />
        )}

        { isStatusOfNonCooperationSection && sectionVisible && (
          <StatusOfNonCooperationSection 
            initialData={statusOfNonCooperation}
            onRefresh={handleStatusOfNonCooperationRefresh}
          />
        )}

        { isAnyOtherInformationSection && sectionVisible && (
          <AnyOtherInformationSection
            initialData={anyOtherInformation}
            onRefresh={handleAnyOtherInformationRefresh}
          />
        )}

        { isConsolidatedEntitiesSection && sectionVisible && consolidatedEntities && (
            <ConsolidatedEntitiesSection 
                initialData={consolidatedEntities}
                onUpdate={handleConsolidatedEntitiesUpdate}
                onRefresh={handleConsolidatedEntitiesRefresh}
            />
        )}

        { isGoodwillAssessmentSection && sectionVisible && goodwillAssessment && (
            <GoodwillAssessmentSection
                initialData={goodwillAssessment}
                onUpdate={handleGoodwillAssessmentUpdate}
            />
        )}

        { isInstrumentDetailsSection && sectionVisible && (
            <TableSection
                initialRows={tableRows}
                headers={['Instrument', 'Amount', 'Rating']}
                allowAddRow={true}
                instructions={section.instructions}
                sectionKey={section.key}
                companyName={note.company.name}
                onRefresh={async () => []} // No refresh for manual table
                onAddRow={handleRowAdd}
                onUpdateRow={handleRowUpdate}
                onRemoveRow={handleRowRemove}
            />
        )}

        {isMandateDetailsSection && sectionVisible && mandateDetails && (
          <MandateDetailsSection
            data={mandateDetails}
            onUpdate={handleMandateDetailsUpdate}
          />
        )}
        
        {isContactDetailsEntitySection && sectionVisible && contactDetailsEntity && (
            <ContactDetailsSection title="Contact Details - Rated Entity" contacts={contactDetailsEntity} />
        )}
        
        {isContactDetailsBankersSection && sectionVisible && contactDetailsBankers && (
            <ContactDetailsSection title="Contact Details - Bankers / Lenders" contacts={contactDetailsBankers} isBankerSection={true} />
        )}
        
        {isContactDetailsAuditorSection && sectionVisible && contactDetailsAuditor && (
            <ContactDetailsSection title="Contact Details - Auditor" contacts={contactDetailsAuditor} />
        )}

        {isLastRatingActionSection && sectionVisible && lastRatingAction && (
          <LastRatingActionSection 
            data={lastRatingAction} 
            onRefresh={handleLastRatingActionRefresh}
          />
        )}
        
        { !isCoverPage && 
          !isAboutCompanySection &&
          !isKeyUpdatesSection && 
          !isAnalyticalApproachSection &&
          !isAnalyticalApproachDisplaySection &&
          !isModelSummarySection && 
          !isParentGovSupportSection && 
          !isCEChecklistSection &&
          !isBoardCompositionSection &&
          !isFinancialsPastProjectedSection &&
          !isInterimResultsSection &&
          !isQuarterlyFinancialsSection &&
          !isBalanceSheetSection &&
          !isProfitAndLossSection &&
          !isCashFlowStatementSection &&
          !isRatioAnalysisSection &&
          !isPreviousRCMMinutesSection &&
          !isAddressedQCObservationsSection &&
          !isPastRatingSensitivitiesSection &&
          !isManagementDiscussionSection &&
          !isDiscussionWithAuditCommitteeSection &&
          !isAssumptionsForCashFlowSection &&
          !isSensitivityAnalysisSection &&
          !isGstCalculationSection &&
          !isAssumptionsForProjectionsSection &&
          !isNonInterestIncomeSection &&
          !isStressedAssetsSection &&
          !isRationaleDriversSection &&
          !isRatingSensitivitiesSection &&
          !isDetailedDriversSection &&
          !isLiquiditySection &&
          !isAlmStatementSection &&
          !isQuarterlyCashFlowSection &&
          !isDetailsOfInstrumentSection &&
          !isEsgRisksSection &&
          !isStatusOfNonCooperationSection &&
          !isAnyOtherInformationSection &&
          !isConsolidatedEntitiesSection &&
          !isGoodwillAssessmentSection &&
          !isInstrumentDetailsSection &&
          !isMandateDetailsSection &&
          !isContactDetailsEntitySection &&
          !isContactDetailsBankersSection &&
          !isContactDetailsAuditorSection &&
          !isLastRatingActionSection &&
          section.hasTable && 
          sectionVisible && (
          <TableSection
            initialRows={isLinkedRatingsSection ? (linkedRatings || []) : tableRows}
            headers={isLinkedRatingsSection ? ['Name of Company', 'Date', 'Amount Rated', 'Rating'] : tableHeaders}
            allowAddRow={section.allowAddRow ?? false}
            instructions={section.instructions}
            sectionKey={section.key}
            companyName={note.company.name}
            onRefresh={() => onRefreshTable(section.key)}
            onAddRow={handleRowAdd}
            onUpdateRow={handleRowUpdate}
            onRemoveRow={handleRowRemove}
            readOnly={!isEditable}
          />
        )}

        { isNonInterestIncomeSection && sectionVisible && (
           <TableSection
            initialRows={tableRows}
            headers={['Particulars', 'Y-1', 'Y']}
            allowAddRow={true}
            instructions={section.instructions}
            sectionKey={section.key}
            companyName={note.company.name}
            onRefresh={async () => tableRows}
            onAddRow={handleRowAdd}
            onUpdateRow={handleRowUpdate}
            onRemoveRow={handleRowRemove}
            readOnly={!isEditable}
          />
        )}

        { isStressedAssetsSection && sectionVisible && (
           <TableSection
            initialRows={tableRows}
            headers={['Asset Name', 'Original Value', 'Current Value', 'Status']}
            allowAddRow={true}
            instructions={section.instructions}
            sectionKey={section.key}
            companyName={note.company.name}
            onRefresh={async () => tableRows}
            onAddRow={handleRowAdd}
            onUpdateRow={handleRowUpdate}
            onRemoveRow={handleRowRemove}
            readOnly={!isEditable}
          />
        )}

        { !isAnalyticalApproachDisplaySection && !isManagementDiscussionSection && !isDiscussionWithAuditCommitteeSection && (
          <CommentsEditor 
            sectionId={section.id} 
            initialContent={sectionData.comments}
            initialAttachments={sectionData.attachments}
            onSave={handleSaveComment}
            onTablePaste={handleTablePaste}
            disabled={!isEditable}
          />
        )}
      </CardContent>
    </Card>
  );
}

    