# **App Name**: NoteVerse

## Core Features:

- Tooltip Utility: Display tooltips using a global utility component. Tooltip text is categorized by sector and loaded from Firestore or a local JSON file, triggered by info icons associated with a 'tooltipKey' prop.
- Table Refresh: Implement a refresh mechanism for tables that fetches and merges data from Firestore based on mapped attributes, preserving manually added rows and edits.
- Add Row Functionality: Allow users to add rows to tables, marking them as manual and storing them separately. Enforce a limit of 10 additional rows for the Financial table.
- Table Instructions: Render instructional text below tables using data mapped to section IDs.
- Table Export: Implement an Export button that uses SheetJS to export table data to an XLSX file, including both fetched and manual rows.
- Comments Section: Implement a rich text editor for comments, allowing text formatting, image embedding, and attachment uploads. Autosave comments to Firestore with metadata. Implement the ability to extract tables from pasted excel sheets using a tool.
- Section Visibility: Use a dropdown to allow the setting of section state to 'Applicable', 'Not Applicable', or 'Not Available'. If the dropdown is 'Not Applicable' or 'Not Available', then the table for the selected row shall become invisible to the user. This feature will change the behavior of sections of a financial document without modifying its underlying information

## Style Guidelines:

- Primary color: Deep blue (#2962FF) for a professional and trustworthy feel.
- Background color: Light gray (#F5F5F5) for a clean and neutral backdrop.
- Accent color: Teal (#26A69A) to provide highlights without being overly obtrusive.
- Headline font: 'Space Grotesk' (sans-serif) for headings and short amounts of body text. Body font: 'Inter' (sans-serif) for longer passages of body text. The combined effect of this font pairing shall emphasize the functional and technical style of this tool.
- Code font: 'Source Code Pro' for displaying code snippets, a monospace font.
- Use a consistent set of icons for actions like refresh, add, and export.  Icons should be simple and modern.
- Employ a clean, well-organized layout with clear separation between sections, tables, and comments.
- Use subtle animations (e.g., spinners, fade-ins) to provide feedback on actions like refreshing data or saving comments.