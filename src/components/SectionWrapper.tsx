'use client';
import { useState, useEffect } from 'react';
import type { RatingNote, TableRowData, TemplateSection, BankFacilitiesData, AnalystDetails, RatingRecommendation, QCSectorSpecialistData, SummaryHygieneChecksData, RichTextContent, Attachment, AnalyticalApproachData } from '@/types';
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
import { getDisclosureData, getBankFacilitiesData, getAnalystDetails, getRatingRecommendation, getQCSpecialists, getSummaryHygieneChecksData, getAboutCompanyData, getKeyUpdatesData, getAnalyticalApproachData } from '@/lib/data';
import { Separator } from './ui/separator';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Trash2, RefreshCw, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Label } from './ui/label';
import SummaryHygieneChecks from './SummaryHygieneChecks';
import { Textarea } from './ui/textarea';


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
        <Label className="font-medium">Comments</Label>
        <Textarea
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          rows={4}
          className="w-full"
          placeholder="Add your comments here..."
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
  }, [section.id, disclosureData, bankFacilitiesData, analystDetails, ratingRecommendation, qcSpecialists, summaryHygieneChecks, keyUpdatesContent, analyticalApproach, note.companyId, note.id, onUpdateSection]);

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

  const sectionVisible = applicability === 'Applicable';
  const tableHeaders = sectionData.tableRows.length > 0 ? Object.keys(sectionData.tableRows[0]).filter(k => k !== 'id' && k !== 'isManual' && k !== 'manualEdit' && k !== 'mappedAttributeId') : [];

  const isCoverPage = section.id === 's1';
  const isKeyUpdatesSection = section.id === 's_key_updates';
  const isAnalyticalApproachSection = section.id === 's_analytical_approach';

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
        
        {!isCoverPage && !isKeyUpdatesSection && !isAnalyticalApproachSection && section.hasTable && sectionVisible && (
          <TableSection
            initialRows={tableRows}
            headers={tableHeaders}
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
        <CommentsEditor 
          sectionId={section.id} 
          initialContent={sectionData.comments}
          initialAttachments={sectionData.attachments}
          onSave={handleSaveComment}
          onTablePaste={handleTablePaste}
        />
      </CardContent>
    </Card>
  );
}
