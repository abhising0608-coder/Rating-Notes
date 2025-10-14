'use client';
import { useState, useEffect, useMemo, useTransition } from 'react';
import type { RatingNote, TableRowData, TemplateSection, BankFacilitiesData, AnalystDetails, RatingRecommendation, QCSectorSpecialistData, SummaryHygieneChecksData, RichTextContent, Attachment, AnalyticalApproachData, ModelSummaryRow, ParentGovSupportData, GovernmentSupportFrameworkRow, CEChecklistData, CERatingTableRow, LinkedRatingsData, FinancialsPastProjectedData, InterimResultsData, QuarterlyFinancialsData, RatingSensitivitiesData, LiquidityData } from '@/types';
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
import { getDisclosureData, getBankFacilitiesData, getAnalystDetails, getRatingRecommendation, getQCSpecialists, getSummaryHygieneChecksData, getAboutCompanyData, getKeyUpdatesData, getAnalyticalApproachData, getModelSummaryData, getParentGovSupportData, getCEChecklistData, getLinkedRatingsData, getFinancialsPastProjectedData, getInterimResultsData, getQuarterlyFinancialsData, getLiquidityData } from '@/lib/data';
import { Separator } from './ui/separator';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Trash2, RefreshCw, Upload, Loader2, MessageSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Label } from './ui/label';
import SummaryHygieneChecks from './SummaryHygieneChecks';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';


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
                        <th className="p-2 text-left font-medium">Group Head</th>
                        <th className="p-2 text-left font-medium">Rating Head</th>
                        <th className="p-2 text-left font-medium">QC Head</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    <tr className="divide-x hover:bg-muted/50">
                        <td className="p-2">{details.analyst1 || 'Not Available'}</td>
                        <td className="p-2">{details.groupHead || 'Not Available'}</td>
                        <td className="p-2">{details.ratingHead || 'Not Available'}</td>
                        <td className="p-2">{details.qcHead || 'Not Available'}</td>
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
                        <th className="p-2 text-left font-medium">Long Term Rating</th>
                        <th className="p-2 text-left font-medium">Short Term Rating</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    <tr className="hover:bg-muted/50 divide-x">
                        <td className="p-2">Ratings</td>
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
                        <td className="p-2">Unsupported Ratings if any</td>
                        <td className="p-2">{ratings.unsupported}</td>
                        <td className="p-2">{ratings.unsupported}</td>
                    </tr>
                    <tr className="hover:bg-muted/50 divide-x">
                        <td className="p-2">Rating in absence of pending steps/documents</td>
                        <td className="p-2">{ratings.pendingSteps}</td>
                        <td className="p-2">{ratings.pendingSteps}</td>
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
  const [keyUpdatesContent, setKeyUpdatesContent] = useState(sectionData.keyUpdatesContent);
  const [analyticalApproach, setAnalyticalApproach] = useState(sectionData.analyticalApproach);
  const [modelSummary, setModelSummary] = useState(sectionData.modelSummary);
  const [parentGovSupport, setParentGovSupport] = useState(sectionData.parentGovSupport);
  const [ceChecklist, setCeChecklist] = useState(sectionData.ceChecklist);
  const [linkedRatings, setLinkedRatings] = useState(sectionData.linkedRatings);
  const [financials, setFinancials] = useState(sectionData.financials);
  const [interimResults, setInterimResults] = useState(sectionData.interimResults);
  const [quarterlyFinancials, setQuarterlyFinancials] = useState(sectionData.quarterlyFinancials);
  const [ratingSensitivities, setRatingSensitivities] = useState(sectionData.ratingSensitivities);
  const [detailedDescriptionOfKeyRatingDrivers, setDetailedDescriptionOfKeyRatingDrivers] = useState(sectionData.detailedDescriptionOfKeyRatingDrivers);
  const [liquidity, setLiquidity] = useState(sectionData.liquidity);
  const [esgRisks, setEsgRisks] = useState(sectionData.esgRisks);



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
              setLinkedRatings(data);
              onUpdateSection(section.id, { linkedRatings: data as any });
            })
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
  }, [section.id, disclosureData, bankFacilitiesData, analystDetails, ratingRecommendation, qcSpecialists, summaryHygieneChecks, keyUpdatesContent, analyticalApproach, modelSummary, parentGovSupport, ceChecklist, linkedRatings, financials, interimResults, quarterlyFinancials, ratingSensitivities, liquidity, note.companyId, note.id, onUpdateSection]);

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
    const updatedRows = tableRows.filter(row => row.id !== rowId);
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

  const handleEsgRisksUpdate = (content: string) => {
    setEsgRisks(content);
    onUpdateSection(section.id, { esgRisks: content });
  }


  const sectionVisible = applicability === 'Applicable';
  const tableHeaders = sectionData.tableRows.length > 0 ? Object.keys(sectionData.tableRows[0]).filter(k => k !== 'id' && k !== 'isManual' && k !== 'manualEdit' && k !== 'mappedAttributeId') : [];

  const isCoverPage = section.id === 's1';
  const isKeyUpdatesSection = section.id === 's_key_updates';
  const isAnalyticalApproachSection = section.id === 's_analytical_approach';
  const isModelSummarySection = section.id === 's_model_summary';
  const isParentGovSupportSection = section.id === 's_parent_gov_support';
  const isCEChecklistSection = section.id === 's_ce_checklist';
  const isLinkedRatingsSection = section.id === 's_linked_ratings';
  const isFinancialsPastProjectedSection = section.id === 's_financials_past_projected';
  const isInterimResultsSection = section.id === 's_interim_results';
  const isQuarterlyFinancialsSection = section.id === 's_quarterly_financials';
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
  const isEsgRisksSection = section.id === 's_esg_risks';


  return (
    <Card id={section.key}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">{section.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={applicability}
            onValueChange={handleApplicabilityChange}
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
        
        { !isCoverPage && 
          !isKeyUpdatesSection && 
          !isAnalyticalApproachSection &&
          !isAnalyticalApproachDisplaySection &&
          !isModelSummarySection && 
          !isParentGovSupportSection && 
          !isCEChecklistSection && 
          !isFinancialsPastProjectedSection &&
          !isInterimResultsSection &&
          !isQuarterlyFinancialsSection &&
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
          !isEsgRisksSection &&
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
          />
        )}

        { !isAnalyticalApproachDisplaySection && (
          <CommentsEditor 
            sectionId={section.id} 
            initialContent={sectionData.comments}
            initialAttachments={sectionData.attachments}
            onSave={handleSaveComment}
            onTablePaste={handleTablePaste}
          />
        )}
      </CardContent>
    </Card>
  );
}
