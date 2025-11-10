# User Stories: Note Workspace (Execution)

This document outlines the user stories for the main workspace where analysts prepare and edit the Rating Note.

---

### Section-wise Data Entry

- **UW-1.1**: As a Rating Analyst, I want to view the Rating Note as a series of sequential, collapsible sections (accordions) so that I can focus on one part at a time.

- **UW-1.2**: As a Rating Analyst, for each section, I want to set its status as "Applicable," "Not Applicable," or "Not Available" to control its visibility in the final report.

- **UW-1.3**: As a Rating Analyst, I want the system to automatically hide the main content (like tables) of sections marked "Not Applicable" or "Not Available" to keep the workspace clean.

---

### Table and Data Management

- **UW-2.1**: As a Rating Analyst, I want the tables in each section to be pre-populated with the latest available financial data when I first open the note.

- **UW-2.2**: As a Rating Analyst, I want to click a "Refresh" button for any table to fetch the most recent data from the database without losing any manually entered data.

- **UW-2.3**: As a Rating Analyst, I want to add new, empty rows to specific tables (as permitted by the template) to include supplementary data that is not in the master database.

- **UW-2.4**: As a Rating Analyst, I want to be able to edit the data within manually added rows.

- **UW-2.5**: As a Rating Analyst, I want to be able to delete rows that I have added manually.

- **UW-2.6**: As a Rating Analyst, I want to export the data from any table into an XLSX file for offline analysis.

---

### Comments and Collaboration

- **UW-3.1**: As a Rating Analyst, I want a rich text editor for each section so that I can write detailed comments with formatting like bold, italics, lists, and hyperlinks.

- **UW-3.2**: As a Rating Analyst, I want my comments to be autosaved periodically as I type, so I don't lose my work.

- **UW-3.3**: As a Rating Analyst, I want to be able to upload and attach supporting documents (like PDFs, images, or spreadsheets) to my comments in each section.

- **UW-3.4**: As a Secondary Analyst, I want to work on sections assigned to me and then assign them back to the Primary Analyst once my work is complete.

---

### Global Actions

- **UW-4.1**: As a Rating Analyst, I want a "Master Refresh" button that updates all the data in all tables across all sections of the note in a single action.

- **UW-4.2**: As a Rating Analyst, I want to navigate quickly between different sections of the note using a sticky navigation bar or a table of contents.
