
import { z } from 'zod';

// == Helper Functions & Constants ==

const getFiscalYear = (date: Date): number => {
  // The fiscal year is determined by the year of the March month.
  // If the month is January, February, or March (0, 1, 2), the fiscal year is the current calendar year.
  // If the month is April or later (3-11), the fiscal year is the next calendar year.
  return date.getMonth() >= 3 ? date.getFullYear() + 1 : date.getFullYear();
};

const generatePastYears = (count: number) => {
  const currentFiscalYear = getFiscalYear(new Date());
  return Array.from({ length: count }, (_, i) => `FY${(currentFiscalYear - i).toString().slice(-2)}`).reverse();
};

// == Schema Definitions ==

export const TableValidationSchema = z.object({
  required: z.boolean().optional().describe("Whether the field is required."),
  isNumeric: z.boolean().optional().describe("Whether the value must be a number."),
  allowNegative: z.boolean().optional().describe("Whether to allow negative numbers if isNumeric is true."),
});

export const TableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'percent', 'formula', 'actions']),
  editable: z.boolean().describe("Whether this column is editable by the user."),
  isYearColumn: z.boolean().optional().describe("Identifies this column as representing a fiscal year."),
  validation: TableValidationSchema.optional(),
  formula: z.string().optional().describe("Defines the calculation logic for this column (e.g., 'share', 'yoy')."),
  style: z.object({
    italic: z.boolean().optional(),
    bold: z.boolean().optional(),
    textAlign: z.enum(['left', 'right', 'center']).optional(),
  }).optional(),
});

export const TableRowSchema = z.object({
  id: z.string(),
  label: z.string(),
  isParent: z.boolean().optional(),
  parentId: z.string().optional(),
  canAddChild: z.boolean().optional(),
  canDelete: z.boolean().optional(),
  isFixed: z.boolean().optional().describe("If true, the row label cannot be edited and the row cannot be deleted."),
  formula: z.string().optional().describe("Defines calculation for the entire row (e.g., 'subtotal', 'total')."),
  formulaGroup: z.string().optional(),
  sourceTableId: z.string().optional(),
  subTotalRowId: z.string().optional(),
  style: z.object({
    bold: z.boolean().optional(),
    backgroundColor: z.string().optional(),
  }).optional(),
  initialValues: z.record(z.union([z.string(), z.number()])).optional(),
});


export const TableSchema = z.object({
  id: z.string(),
  title: z.string(),
  unit: z.string().optional(),
  developerGuidance: z.array(z.string()).optional(),
  yearGeneration: z.object({
    type: z.literal('past'),
    count: z.number().int().positive(),
  }),
  columns: z.array(TableColumnSchema),
  rows: z.array(TableRowSchema),
});


// == Geography Sales Table Schema ==

export const geographySalesSchema = TableSchema.parse({
  id: '5.2.1_geographyWiseSales',
  title: '5.2.1 Geography wise sales',
  unit: 'Rs. Crore',
  yearGeneration: {
    type: 'past',
    count: 3, // Generates last 3 fiscal years dynamically
  },
  columns: [
    { key: 'region', label: 'Region', type: 'text', editable: true },
    { key: '6mfy25', label: '6MFY25', type: 'number', editable: true, isYearColumn: true },
    // Dynamic year columns will be inserted here by the UI renderer
    // Example: { key: 'FY24', label: 'FY24', type: 'number', editable: true, isYearColumn: true }
    { key: 'share', label: '% Share', type: 'formula', formula: 'share', editable: false, style: { italic: true, textAlign: 'right' } },
    { key: 'yoyGrowth', label: 'Y-o-Y Growth (%)', type: 'formula', formula: 'yoy', editable: false, style: { italic: true, textAlign: 'right' } },
    { key: 'actions', label: 'Actions', type: 'actions', editable: false },
  ],
  rows: [
    {
      id: 'geo-1',
      label: 'Domestic',
      isFixed: false, // Make it editable
      canDelete: false, // But not deletable
      initialValues: { "FY24": 2200, "FY23": 2063, "FY22": 1926, "6mfy25": 1050 },
    },
    {
      id: 'geo-2',
      label: 'Export',
      isFixed: true,
      isParent: true,
      canAddChild: true,
      formula: 'subtotal',
      style: { bold: true, backgroundColor: 'bg-muted/50' },
    },
    {
      id: 'geo-2-1',
      label: 'USA',
      parentId: 'geo-2',
      canDelete: true,
      initialValues: { "FY24": 1730, "FY23": 1572, "FY22": 1666, "6mfy25": 800 },
    },
    {
      id: 'geo-2-2',
      label: 'Rest of the world',
      parentId: 'geo-2',
      canDelete: true,
      initialValues: { "FY24": 600, "FY23": 500, "FY22": 400, "6mfy25": 300 },
    },
    {
      id: 'geo-2-3',
      label: 'Others',
      parentId: 'geo-2',
      canDelete: true,
      initialValues: { "FY24": 452, "FY23": 352, "FY22": 375, "6mfy25": 150 },
    },
    {
      id: 'geo-total',
      label: 'Total Sales',
      isFixed: true,
      formula: 'total',
      style: { bold: true, backgroundColor: 'bg-primary/10' },
    },
  ],
});


export type TTableSchema = z.infer<typeof TableSchema>;
export type TTableRowSchema = z.infer<typeof TableRowSchema>;
export type TTableColumnSchema = z.infer<typeof TableColumnSchema>;
