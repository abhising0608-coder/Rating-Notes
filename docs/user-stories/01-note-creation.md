# User Stories: Note Creation (Initiation Wizard)

This document outlines the user stories for the 4-step process of creating a new Rating Note.

---

### Step 1: Template Selection

- **UC-1.1**: As a Rating Analyst, I want to search for and select a company from a master list so that I can initiate a new Rating Note for that specific entity.

- **UC-1.2**: As a Rating Analyst, I want the system to automatically suggest recommended templates based on the selected company's industry so that I can quickly choose the most relevant format.

- **UC-1.3**: As a Rating Analyst, I want the first recommended template to be selected by default to speed up the process.

- **UC-1.4**: As a Rating Analyst, I want the ability to view and select from a list of all available templates if the recommended ones are not suitable.

---

### Step 2: Analyst Assignment

- **UC-2.1**: As a Rating Analyst, I want my role as the Primary Analyst to be automatically assigned and clearly displayed.

- **UC-2.2**: As a Rating Analyst, I want the option to assign one or more Secondary Analysts from a list of users to collaborate on the note.

- **UC-2.3**: As a Rating Analyst, I want to add optional remarks to clarify the roles and responsibilities between the primary and secondary analysts.

---

### Step 3: Detailed Configuration

- **UC-3.1**: As a Rating Analyst, I want to define the analytical approach for financial data (e.g., Standalone, Consolidated, Combined) to ensure the correct data is fetched and processed.

- **UC-3.2**: As a Rating Analyst, I want to set the financial and operational year ranges so that the note focuses on the correct historical and projected periods.

- **UC-3.3**: As a Rating Analyst, I want to configure formatting options like currency, scale (e.g., Crores, Millions), and decimal precision to ensure consistency throughout the note.

- **UC-3.4**: As a Rating Analyst, I want to define policies for handling rows and columns with zero values (e.g., Delete or Keep) to control the table display.

- **UC-3.5**: As a Rating Analyst, I want to select all applicable rating criteria from a pre-filtered list based on the chosen template's sector.

---

### Step 4: Preview and Creation

- **UC-4.1**: As a Rating Analyst, I want to review a summary of all my configuration choices on a final preview screen before creating the note.

- **UC-4.2**: As a Rating Analyst, I want to click a button to finalize the setup, create the Rating Note document, and be taken directly into the note workspace to begin my work.
