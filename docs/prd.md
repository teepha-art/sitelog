# SiteLog — Product Requirements Document

**MVP Version 2.0 — Solo Capstone Build**
Construction Site Reporting & Issue Tracking Platform

---

## 1. Executive Summary
### 1.1 The Problem
Construction project managers have no reliable, structured way to
monitor what is happening across their sites. The current workflow —
WhatsApp messages, phone calls, spreadsheets, and paper site diaries —
produces fragmented, delayed, and often missing information.

The consequences are measurable: project delays from issues reported too
late, material shortages from requests that arrived too late, and
accountability gaps where no record exists of who reported what and
when.

### 1.2 The Solution
SiteLog is a web-based construction site reporting and issue tracking
platform. It provides two connected interfaces: a mobile-first reporting
tool for site supervisors and a multi-project monitoring dashboard for
project managers. All communication is structured, timestamped, and
searchable.

### 1.3 Product at a Glance
| **Attribute**          | **Detail**                                                                       |
|------------------------|----------------------------------------------------------------------------------|
| Product name           | SiteLog                                                                          |
| Product type           | B2B SaaS — Web application                                                       |
| Primary user           | Project Managers at construction firms                                           |
| Secondary user         | Site Supervisors on active construction sites                                    |
| Platform               | Web — mobile-first, no app install required                                      |
| MVP scope              | Daily reporting, issue tracking, material requests, dashboard, role-based access |
| Business model         | B2B SaaS subscription (post-MVP)                                                 |
| Core value proposition | Operational visibility with minimum reporting friction                           |
| Target market          | SMB construction firms (10-200 employees)                                        |
| Build context          | Solo capstone project                                                            |

### 1.4 What SiteLog Replaces
| **Current Tool**   | **Problem It Creates**                                         | **SiteLog Replacement**                                    |
|--------------------|----------------------------------------------------------------|------------------------------------------------------------|
| WhatsApp groups    | Updates lost in chat history. No structure. No accountability. | Structured reports with timestamps and project assignment. |
| Phone calls        | No record. Relies on memory. Cannot be searched.               | Issue tracking with full status history and assignees.     |
| Spreadsheets       | Manual, error-prone, not real-time. Hard to share.             | Live dashboard updated on every report submission.         |
| Paper site diaries | Cannot be searched or shared. Easily lost.                     | Digital daily reports stored and accessible instantly.     |
| Email chains       | Slow, fragmented, no status tracking.                          | Material request workflow with approval and notification.  |

### 1.5 MVP Success Criteria
- A site supervisor can submit a complete daily report in under 3
  minutes on a mobile device

- A project manager can see the status of all active projects without
  making a single phone call

- Issues are created, assigned, and resolved inside SiteLog rather than
  over WhatsApp

- Material requests are submitted and actioned with a full audit trail

## 2. Market Intelligence
### 2.1 Market Overview
The global construction project management software market was valued at
approximately USD 8.5 billion in 2024 and is projected to grow at a CAGR
of 8-10% through 2030. Growth is driven by the accelerating digital
transformation of construction operations globally, the increasing cost
of project delays, and rapid mobile adoption by field workers in
emerging markets.

| **Market Segment**                        | **2024 Value**                | **Growth Driver**                                             | **SiteLog Relevance**      |
|-------------------------------------------|-------------------------------|---------------------------------------------------------------|----------------------------|
| Global construction PM software           | USD 8.5B                      | Digital transformation across all firm sizes                  | Total addressable market   |
| SMB construction firms (10-500 employees) | USD 2.1B                      | Moving off paper and WhatsApp; cannot afford enterprise tools | Primary serviceable market |
| Mobile-first field operations tools       | 30%+ of market growth         | Smartphone penetration among field workers                    | Core product positioning   |
| Africa & emerging markets                 | Fast-growing, underpenetrated | Construction boom + leapfrog mobile adoption                  | High-opportunity expansion |

The critical market dynamic is the gap between enterprise platforms
(Procore, Autodesk) and informal tools (WhatsApp, spreadsheets). SMB
construction firms are actively searching for a middle path — structured
enough to replace paper, simple enough that a non-technical supervisor
will actually use it.

### 2.2 Customer Insights
**Primary Buyer: Project Manager**

| **Attribute**     | **Detail**                                                                                                                 |
|-------------------|----------------------------------------------------------------------------------------------------------------------------|
| Company profile   | 10-200 employees. Managing 2-10 active projects simultaneously.                                                            |
| Current tools     | WhatsApp groups, Excel/Google Sheets, phone calls, paper site diaries.                                                     |
| Daily reality     | Starts the day messaging supervisors for updates. Spends 30-60 minutes chasing information that should already be visible. |
| Core pain         | No structured visibility. Entirely dependent on supervisors remembering to send updates.                                   |
| What they want    | One place to see all project status at a glance. No chasing. No WhatsApp scrolling.                                        |
| Buying trigger    | A costly delay or missed issue that could have been caught earlier with better visibility.                                 |
| Decision criteria | Ease of use for field team, mobile reliability, clear reporting structure, affordable price.                               |
| Adoption risk     | Will not buy if supervisors refuse to use it. Supervisor adoption is the gating factor.                                    |

**Secondary User: Site Supervisor**

| **Attribute**        | **Detail**                                                                               |
|----------------------|------------------------------------------------------------------------------------------|
| Technical level      | Non-technical. Comfortable with WhatsApp and basic smartphone use.                       |
| Device               | Primarily Android or iPhone. Often mid-range devices.                                    |
| Connectivity         | Frequently poor on site. 3G or intermittent Wi-Fi.                                       |
| Daily reality        | Busy. On their feet. Often in bright sunlight or wearing gloves.                         |
| Core need            | Submit updates fast and get back to work. No tolerance for complexity.                   |
| Adoption risk        | Will abandon any tool that is slower or harder than sending a WhatsApp message.          |
| What makes them stay | Speed. Under 2 minutes per report = they stay. Over 5 minutes = they revert to WhatsApp. |

### 2.3 Competitor Analysis
No direct competitor owns the specific positioning of: simple daily
reporting + issue tracking + material requests at an SMB price point.

| **Competitor**     | **Category**       | **Weakness vs SiteLog**                                                                    | **Pricing**          |
|--------------------|--------------------|--------------------------------------------------------------------------------------------|----------------------|
| Procore            | Enterprise         | Too expensive and complex for SMBs. Requires implementation. Overkill for daily reporting. | USD 375+/month       |
| Autodesk Build     | Enterprise         | Complex implementation. Not suited to SMB or field-first workflows.                        | USD 500+/month       |
| Fieldwire          | Mid-market         | No daily reporting. Limited dashboard. No material requests.                               | USD 29-54/user/month |
| Buildertrend       | SMB (residential)  | Residential-only. No multi-project operational dashboard.                                  | USD 99-399/month     |
| PlanGrid           | Enterprise         | Document-focused, not reporting-focused. Enterprise pricing.                               | Enterprise           |
| Monday.com / Asana | Generic PM         | No construction-specific workflows. Supervisors will not use generic PM tools.             | USD 10-24/user/month |
| WhatsApp + Sheets  | Informal incumbent | No structure, searchability, or accountability. This is the problem SiteLog solves.        | Free                 |

### 2.4 Market Gaps & Opportunity
| **Gap**                                          | **Current State**                                                                 | **SiteLog Opportunity**                                                   |
|--------------------------------------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Affordable structured reporting for SMBs         | Enterprise tools too expensive. WhatsApp has no structure.                        | Structured daily reporting at an SMB-accessible price point.              |
| Mobile-first field UX                            | Enterprise tools are desktop-first. Generic tools not built for field conditions. | Mobile-first design for outdoor, unstable-connection, one-handed use.     |
| Single tool: report + issue + material           | No tool combines all three simply at SMB pricing.                                 | One platform for the three core daily operational workflows.              |
| WhatsApp replacement with zero learning curve    | All structured tools require training. Supervisors resist complexity.             | Form-based workflows as fast as WhatsApp. No training required.           |
| Multi-project visibility without enterprise cost | Procore provides this at USD 375+/month with full implementation.                 | Multi-project dashboard at a fraction of the cost, deployable in minutes. |

## 3. SWOT Analysis
Strategic assessment of SiteLog's position entering the construction
site operations market.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>STRENGTHS</strong></p>
<p>• Purpose-built for the WhatsApp-to-structured-data transition</p>
<p>• Mobile-first UX designed for field conditions</p>
<p>• Single platform: reporting, issues, and material requests</p>
<p>• No installation required — accessible from any browser</p>
<p>• Structured, searchable, timestamped data from day one</p>
<p>• Simple enough for non-technical supervisors to adopt
immediately</p>
<p>• Land-and-expand model: one PM signs up, supervisors follow</p></td>
<td><p><strong>WEAKNESSES</strong></p>
<p>• New entrant — no existing user base or brand recognition</p>
<p>• Two user roles only in MVP — no admin or owner tier</p>
<p>• No offline mode — requires internet connection to submit</p>
<p>• No integrations with ERP, accounting, or BIM in MVP</p>
<p>• Entirely dependent on supervisor adoption for PM value</p>
<p>• Progressive web app may feel less native than installed
apps</p></td>
</tr>
<tr class="even">
<td><p><strong>OPPORTUNITIES</strong></p>
<p>• Large underserved SMB construction market globally</p>
<p>• WhatsApp-dependent firms actively seeking alternatives</p>
<p>• Construction growth in emerging markets creating new demand</p>
<p>• Land-and-expand: one project grows to many within same firm</p>
<p>• Future premium features: analytics, integrations, offline mode</p>
<p>• Category creation: the WhatsApp replacement for
construction</p></td>
<td><p><strong>THREATS</strong></p>
<p>• Enterprise tools could add lower-cost SMB tiers</p>
<p>• WhatsApp itself could add structured workflow features</p>
<p>• Low switching cost if supervisors revert to WhatsApp</p>
<p>• Construction industry traditionally slow to adopt new software</p>
<p>• Generic PM tools increasingly customisable for construction</p>
<p>• Data privacy concerns around cloud storage of site photos</p></td>
</tr>
</tbody>
</table>

## 4. Product Overview
### 4.1 Problem Statement
| **Consequence**     | **Root Cause**                                      | **Business Impact**                                       |
|---------------------|-----------------------------------------------------|-----------------------------------------------------------|
| Project delays      | Issues reported too late via WhatsApp or not at all | Cost overruns, contract penalties, client dissatisfaction |
| Material shortages  | Requests made informally, lost in chat history      | Work stoppages, emergency procurement at higher cost      |
| Accountability gaps | No structured record of who reported what and when  | Disputes, no data for future project planning             |

### 4.2 Solution
| **Interface**               | **Primary User** | **Core Function**                                                                                                            |
|-----------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------|
| Mobile-first reporting tool | Site Supervisor  | Submit daily reports, log issues, request materials in under 3 minutes — from a phone, on site, on a slow connection.        |
| Multi-project dashboard     | Project Manager  | Real-time visibility across all active projects. Issue tracking, material approvals, and a recent activity view per project. |

### 4.3 MVP Scope
**In Scope**

- Daily site reporting with browser-based draft preservation and
  duplicate prevention

- Multi-project monitoring dashboard with 5 KPI cards + Recent Activity
  section

- Project detail page with reports, issues, requests, and activity per
  project

- Issue and snag tracking with priority levels and status workflow

- Material request tracking with approval and rejection flow

- Role-based access control — Project Manager and Site Supervisor

- In-app notifications for 3 core triggers (bell icon with count and
  dropdown)

- A single image attachment per report and per issue

**Explicitly Out of Scope**

| **Excluded Feature**              | **Reason**                                          |
|-----------------------------------|-----------------------------------------------------|
| Payroll / accounting / ERP        | Financial systems are a separate product category   |
| BIM or Gantt chart integration    | Engineering tools beyond MVP complexity             |
| Procurement or equipment tracking | Separate operational domain                         |
| AI assistant features             | Post-MVP enhancement                                |
| Live chat                         | Notifications cover MVP communication needs         |
| Native mobile app (iOS/Android)   | Progressive web app covers MVP field use case       |
| Invitation / onboarding workflows | Direct assignment replaces invitation system in MVP |
| AuditLog / security event logging | Post-MVP security infrastructure                    |
| Comment system                    | Post-MVP — core workflows do not require it         |
| Multi-file attachments            | One image per entity keeps upload simple for MVP    |
| Dark mode                         | Light mode only for MVP                             |

## 5. User Roles
### 5.1 Project Manager (Primary)
| **Attribute** | **Detail**                                                                                                                 |
|---------------|----------------------------------------------------------------------------------------------------------------------------|
| Goals         | Monitor project progress, track delays and unresolved issues, reduce communication chaos, maintain centralised visibility. |
| Pain points   | Missing information, delayed reporting, scattered WhatsApp communication, no structured operational data.                  |
| Behaviour     | Switches between projects frequently. Reviews on desktop and mobile. Needs fast visibility. Often under time pressure.     |
| Interface     | Desktop-first dashboard with full mobile support.                                                                          |
| Failure mode  | Reverts to calling supervisors directly when SiteLog does not surface information fast enough.                             |

### 5.2 Site Supervisor (Secondary)
| **Attribute** | **Detail**                                                                                                      |
|---------------|-----------------------------------------------------------------------------------------------------------------|
| Goals         | Submit reports quickly, upload site evidence, report issues and material needs, avoid repetitive communication. |
| Pain points   | Excessive manual reporting, repeating updates across channels, slow approvals, poor issue follow-up.            |
| Behaviour     | Primarily mobile. Works in unstable network conditions. Limited time for input. Needs low-friction workflows.   |
| Interface     | Mobile-first. Minimal navigation. Fast form completion.                                                         |
| Failure mode  | Abandons SiteLog if any workflow takes more than 2-3 minutes or requires too many steps.                        |

## 6. Information Architecture
Both roles log in through the same page but see different navigation
after login. The sidebar is the primary navigation on desktop; on mobile
it collapses to a bottom navigation bar.

### 6.1 Project Manager Navigation
The PM sees a full sidebar with these items, in this order:

| **Nav Item**      | **Destination**                                     | **Badge / Indicator**     |
|-------------------|-----------------------------------------------------|---------------------------|
| Dashboard         | The 5 KPI cards + Recent Activity section           | None                      |
| Projects          | List of all assigned projects, filterable by status | Count of delayed projects |
| Reports           | All submitted reports across all projects           | None                      |
| Issues            | All issues across all projects                      | Count of open issues      |
| Material Requests | All material requests across all projects           | Count of pending requests |
| Notifications     | Full notification list                              | Unread count              |
| Team              | List of supervisors and their project assignments   | None                      |
| Settings          | Profile and account settings                        | None                      |

### 6.2 Site Supervisor Navigation
The supervisor sees a simpler navigation with fewer items:

| **Nav Item**  | **Destination**                                            | **Notes**                               |
|---------------|------------------------------------------------------------|-----------------------------------------|
| My Projects   | List of projects they are assigned to                      | Only their projects, not all projects   |
| Submit Report | Report form — auto-selects project if assigned to one only | Primary action, most prominent nav item |
| My Reports    | List of their own submitted reports                        | Filtered to own reports only            |
| My Issues     | Issues they created or were assigned to                    | Not all project issues                  |
| My Requests   | Material requests they submitted                           | Filtered to own requests only           |
| Notifications | Notification list                                          | Unread count                            |
| Profile       | Name, email, profile image                                 | No settings beyond profile              |

*The supervisor never sees the Dashboard, Team, or Settings nav items.
They see only their own data, scoped by their project assignments.*

## 7. Core Features & Behaviour
### 7.1 Authentication & Onboarding
**Authentication**

- Sign up with email and password

- During sign-up, user selects their role: Project Manager or Site
  Supervisor

- Log in with email and password

- Password reset (forgot password): a logged-out user who cannot sign in enters their email and receives a 6-digit reset code by email (sent via Nodemailer over SMTP). They enter the code back in the app (the flow stays in the app — no external reset link), and on success set a new password. The code is single-use and expires after 15 minutes. For security, the app responds the same way whether or not the email is registered. (A logged-in user changing their password in Settings provides their current password instead — no code.)

- All access scoped by role and project assignment via ProjectMembership

- Session expiration with graceful re-authentication — user does not
  lose form data

**First-Time Experience After Sign-Up**

What the user sees immediately after creating their account depends on
their role:

| **Role**        | **First Screen**       | **What They See**                                                                                            | **Guided Action**                                                                                                                                           |
|-----------------|------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Project Manager | Empty Dashboard        | All 5 KPI cards showing zero. Recent Activity section empty.                                                 | A prominent 'Create Your First Project' button in the centre of the page. The KPI cards are visible but greyed/empty to show what will eventually populate. |
| Site Supervisor | Empty My Projects page | A message: 'You have not been assigned to any projects yet. Your project manager will add you to a project.' | No action to take — the supervisor waits to be assigned. The page should feel reassuring, not broken.                                                       |

| **State**           | **Behaviour**                                                      |
|---------------------|--------------------------------------------------------------------|
| Loading             | Spinner on submit. Form fields remain populated.                   |
| Invalid credentials | 'Incorrect email or password. Please try again.'                   |
| Account inactive    | 'Your account is not active. Please contact your project manager.' |
| Sign-up success     | Redirect to the role-appropriate first screen above.               |

### 7.2 Project Dashboard (Project Manager Only)
The dashboard is the PM's home screen. It answers the five most
important questions every morning: how many projects are running, are
any delayed, are there open issues, are there pending requests, and did
supervisors report today.

**5 KPI Cards (top of page, in a row)**

Each card is a small tile showing one number and one label. Each card is
tappable — tapping it navigates to the relevant list with a pre-applied
filter.

| **KPI Card**     | **Data Displayed**                                   | **Taps To**                           |
|------------------|------------------------------------------------------|---------------------------------------|
| Active Projects  | Count of projects with status = active               | Projects list filtered to active      |
| Delayed Projects | Count of projects with status = delayed              | Projects list filtered to delayed     |
| Open Issues      | Count of unresolved issues across all projects       | Issues list filtered to open          |
| Pending Requests | Count of material requests with status = pending     | Material requests filtered to pending |
| Reports Today    | Count of reports submitted today across all projects | Reports list filtered to today        |

**Recent Activity Section (below the KPI cards)**

Below the 5 KPI cards, a 'Recent Activity' section shows the most recent
actions across all the PM's projects. This is a short list, not a KPI
card.

| **What counts as an activity item** | **What each item displays**                                         |
|-------------------------------------|---------------------------------------------------------------------|
| A daily report was submitted        | Supervisor name + project name + 'submitted a report' + timestamp   |
| An issue was created                | Creator name + project name + issue title + priority + timestamp    |
| An issue was resolved               | Resolver name + project name + issue title + 'resolved' + timestamp |
| A material request was approved     | PM name + project name + material name + 'approved' + timestamp     |

*Show the 5 most recent items, sorted newest first. Each item is
tappable — tapping navigates to the relevant report, issue, or request
detail view.*

| **State**                | **Behaviour**                                                                                |
|--------------------------|----------------------------------------------------------------------------------------------|
| Loading                  | Skeleton loaders on each KPI card and the activity list. Navigation remains active.          |
| Empty — no projects      | 'No active projects yet. Create your first project to get started.' + Create Project button. |
| Empty — no reports today | KPI card shows '0'. Not an error — just informational.                                       |
| Empty — no activity      | 'No recent activity across your projects.'                                                   |
| Error                    | 'Unable to load dashboard data. Please refresh.'                                             |

### 7.3 Project Detail Page
When the PM taps on a project from the Projects list or from a KPI card,
they land on the Project Detail Page. This is where the PM spends most
of their time — reviewing a specific project's reports, issues, and
requests.

**Page Structure**

The project name and status are shown at the top. Below that, the page
has four tabs or sections that the PM can switch between:

| **Tab**           | **What It Shows**                                                                                   | **Default Sort**                     |
|-------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------|
| Reports           | All submitted reports for this project                                                              | Newest first by report_date          |
| Issues            | All issues for this project, with status and priority visible                                       | Open first, then by creation date    |
| Material Requests | All material requests for this project                                                              | Pending first, then by creation date |
| Recent Activity   | Activity feed for this specific project (same format as dashboard, but scoped to this project only) | Newest first                         |

**Project Header (visible on all tabs)**

| **Field**         | **Source**                                          |
|-------------------|-----------------------------------------------------|
| Project name      | project_name                                        |
| Project code      | project_code                                        |
| Status            | status (shown as a status chip with text label)     |
| Location          | location                                            |
| Start date        | start_date                                          |
| Expected end date | expected_end_date                                   |
| Assigned PM       | assigned_project_manager (show full_name)           |
| Team size         | Count of supervisors assigned via ProjectMembership |

| **State**               | **Behaviour**                                                               |
|-------------------------|-----------------------------------------------------------------------------|
| Loading                 | Skeleton loader for the header, skeleton rows for the active tab's content. |
| Empty — no reports tab  | 'No reports submitted yet for this project.'                                |
| Empty — no issues tab   | 'No issues logged for this project.'                                        |
| Empty — no requests tab | 'No material requests submitted for this project.'                          |
| Empty — no activity tab | 'No recent activity for this project.'                                      |
| Error                   | 'Unable to load project data. Please refresh.'                              |

### 7.4 Project Creation (Project Manager Only)
The PM creates a new project from the Projects page or from the empty
dashboard prompt. The form collects the minimum information needed to
start a project.

**Project Creation Form**

| **Field**         | **Type**    | **Required** | **Notes**                                                                 |
|-------------------|-------------|--------------|---------------------------------------------------------------------------|
| Project name      | Text input  | Yes          | The display name shown everywhere                                         |
| Project code      | Text input  | Yes          | A short unique code (e.g. 'PRJ-001'). Must be unique across all projects. |
| Description       | Text area   | No           | Optional project description                                              |
| Location          | Text input  | Yes          | Physical location of the construction site                                |
| Start date        | Date picker | Yes          | When the project starts                                                   |
| Expected end date | Date picker | Yes          | Target completion date                                                    |

*On submission, the project status defaults to 'active' and the creating
PM is automatically set as the assigned_project_manager and created_by.*

| **State**              | **Behaviour**                                                                |
|------------------------|------------------------------------------------------------------------------|
| Loading                | Submit button shows spinner. Form fields disabled during submission.         |
| Validation error       | 'Please complete all required fields before submitting.'                     |
| Duplicate project code | 'A project with this code already exists. Please choose a different code.'   |
| Success                | 'Project created successfully.' — redirect to the new project's detail page. |
| Error                  | 'Unable to create project. Please try again.'                                |

### 7.5 Supervisor Assignment (Project Manager Only)
The PM assigns supervisors to a project from the project detail page.
Supervisors sign up for their own accounts (same sign-up page, selecting
'Site Supervisor' as their role). The PM then finds them and adds them
to the project.

**How It Works**

1.  PM opens a project's detail page

2.  PM clicks 'Add Team Member' or similar action

3.  A search field appears — PM types a supervisor's name or email

4.  System shows matching supervisors who are not already assigned to
    this project

5.  PM selects the supervisor and confirms

6.  A ProjectMembership row is created linking the supervisor to the
    project

7.  The supervisor's 'My Projects' page now includes this project

*There is no invitation email, no token, no link to click. The
supervisor's account must already exist. The PM simply searches and
assigns.*

| **State**           | **Behaviour**                                                                                    |
|---------------------|--------------------------------------------------------------------------------------------------|
| Search — no results | 'No supervisors found matching that name or email.'                                              |
| Already assigned    | 'This supervisor is already assigned to this project.'                                           |
| Success             | Supervisor appears in the project's team list immediately.                                       |
| Remove              | PM can remove a supervisor from the project. The supervisor loses access to that project's data. |

### 7.6 Daily Site Reporting
**Site Supervisor Actions**

- Select assigned project from dropdown (auto-selected if assigned to
  only one project)

- Enter completed work description (text, required)

- Set progress percentage — 0 to 100 (required)

- Upload a single site image (JPEG, PNG, WebP, PDF, max 5MB)

- Report delays and site conditions (text, optional)

- Add weather condition notes (text, optional)

- Submit report — form input is auto-preserved in the browser
  (localStorage) until submitted

**Project Manager Actions**

- Review submitted reports per project

- Filter and search reports

- Monitor reporting consistency — see which supervisors have and have
  not reported today

*Draft handling: form input is preserved in the browser (localStorage)
so a supervisor never loses work. There is no database draft state.
Duplicate prevention: one submitted report per supervisor per project
per date.*

**Report List Filters**

| **Filter** | **Type**                                                 | **Available To**                           |
|------------|----------------------------------------------------------|--------------------------------------------|
| Date range | Date picker — single date or start/end range             | Both roles                                 |
| Project    | Dropdown of projects                                     | PM only (supervisor sees own project only) |
| Supervisor | Dropdown of supervisors assigned to the selected project | PM only                                    |

**Report Detail View**

When a PM or supervisor taps on a report in the list, they see the full
report detail:

| **Field**           | **Display**                                    |
|---------------------|------------------------------------------------|
| Project name        | Shown at top with project code                 |
| Submitted by        | Supervisor's full name                         |
| Report date         | Formatted date                                 |
| Completed work      | Full text, no truncation                       |
| Progress percentage | Shown as a number and a simple progress bar    |
| Delays              | Full text if provided, or 'No delays reported' |
| Weather condition   | Shown if provided                              |
| Notes               | Full text if provided                          |
| Attached image      | Shown full-width if an image was uploaded      |
| Submitted at        | Timestamp of when the report was created       |

| **State**       | **Behaviour**                                                             |
|-----------------|---------------------------------------------------------------------------|
| Loading (form)  | Submit button shows spinner. All form fields disabled.                    |
| Loading (list)  | Skeleton rows in the report list.                                         |
| Empty (list)    | 'No reports submitted yet for this project.'                              |
| Draft preserved | Form fields auto-populate from localStorage on return.                    |
| Duplicate       | 'A report for this project and date has already been submitted.'          |
| Network loss    | 'Connection lost. Please try again. Your entered data is preserved.'      |
| Upload failure  | 'Image upload failed. Please try again. Your other fields are preserved.' |
| Success         | 'Report submitted successfully.' — returns to project reports list.       |

### 7.7 Issue / Snag Tracking
**Capabilities by Role**

| **Capability**              | **Project Manager** | **Site Supervisor** |
|-----------------------------|---------------------|---------------------|
| Create issue                | Yes                 | Yes                 |
| Upload one issue image      | Yes                 | Yes                 |
| View issue status           | Yes                 | Yes                 |
| Assign issue to team member | Yes                 | No                  |
| Update issue status         | Yes                 | No                  |
| View all project issues     | Yes                 | Yes                 |

| **Issue Statuses** | **Priority Levels** |
|--------------------|---------------------|
| Open               | Low                 |
| In Progress        | Medium              |
| Resolved           | High                |
|                    | Critical            |

**Issue List Filters**

| **Filter**   | **Type**                                         | **Available To** |
|--------------|--------------------------------------------------|------------------|
| Status       | Dropdown: Open / In Progress / Resolved          | Both roles       |
| Priority     | Dropdown: Low / Medium / High / Critical         | Both roles       |
| Assignee     | Dropdown of team members assigned to the project | PM only          |
| Date created | Date picker — single date or range               | Both roles       |

**Issue Detail View**

When a user taps on an issue in the list, they see the full issue
detail:

| **Field**      | **Display**                                                    |
|----------------|----------------------------------------------------------------|
| Title          | Shown prominently at top                                       |
| Status         | Status chip (Open / In Progress / Resolved) with text label    |
| Priority       | Priority chip (Low / Medium / High / Critical) with text label |
| Description    | Full text                                                      |
| Created by     | Supervisor or PM full name                                     |
| Assigned to    | Supervisor full name, or 'Unassigned'                          |
| Project        | Project name and code                                          |
| Attached image | Shown if uploaded                                              |
| Created at     | Timestamp                                                      |
| Resolved at    | Timestamp if resolved, otherwise not shown                     |
| PM actions     | Assign button + status update dropdown (PM only)               |

| **State**        | **Behaviour**                                                                  |
|------------------|--------------------------------------------------------------------------------|
| Loading (list)   | Skeleton rows in the issues table.                                             |
| Empty (list)     | 'No issues logged for this project. Issues reported on site will appear here.' |
| Loading (detail) | Skeleton layout for the detail view.                                           |
| Error            | 'Unable to load issues. Please refresh.'                                       |

### 7.8 Material Request Tracking
**Capabilities by Role**

| **Action**                                       | **Project Manager** | **Site Supervisor** |
|--------------------------------------------------|---------------------|---------------------|
| Submit request with quantity, urgency, and notes | No                  | Yes                 |
| Approve request                                  | Yes                 | No                  |
| Reject request                                   | Yes                 | No                  |
| Mark as fulfilled                                | Yes                 | No                  |
| View requests                                    | Yes (all)           | Yes (own only)      |

*Request statuses: Pending -\> Approved / Rejected -\> Fulfilled*

*Note: material requests do not have image attachments in MVP. The
Attachment schema includes material_request in the entity_type enum for
future extensibility, but no image upload UI is shown on the material
request form.*

**Material Request List Filters**

| **Filter**     | **Type**                                            | **Available To** |
|----------------|-----------------------------------------------------|------------------|
| Status         | Dropdown: Pending / Approved / Rejected / Fulfilled | Both roles       |
| Urgency        | Dropdown: Low / Medium / High / Critical            | Both roles       |
| Date submitted | Date picker — single date or range                  | Both roles       |

**Material Request Detail View**

When a user taps on a request in the list:

| **Field**            | **Display**                                                                |
|----------------------|----------------------------------------------------------------------------|
| Material name        | Shown prominently at top                                                   |
| Quantity             | Displayed next to material name                                            |
| Urgency level        | Urgency chip with text label                                               |
| Status               | Status chip: Pending / Approved / Rejected / Fulfilled                     |
| Notes                | Full text if provided                                                      |
| Requested by         | Supervisor full name                                                       |
| Project              | Project name and code                                                      |
| Created at           | Timestamp                                                                  |
| Approved/Rejected by | PM full name and timestamp (if actioned)                                   |
| Fulfilled at         | Timestamp (if fulfilled)                                                   |
| PM actions           | Approve / Reject buttons (if pending), Mark Fulfilled button (if approved) |

| **State**      | **Behaviour**                                                                    |
|----------------|----------------------------------------------------------------------------------|
| Loading (list) | Skeleton rows in the requests table.                                             |
| Empty (list)   | 'No material requests submitted for this project.'                               |
| Post-approval  | Supervisor sees notification: 'Your request for \[material\] has been approved.' |
| Post-rejection | Supervisor sees notification: 'Your request for \[material\] has been rejected.' |
| Error          | 'Unable to update request. Please try again.'                                    |

### 7.9 Notifications UI
Notifications appear as a bell icon in the top navigation bar, visible
to both roles. The bell shows a count badge when there are unread
notifications.

**Bell Icon Behaviour**

- The bell icon is always visible in the top bar on every page

- A small count badge appears on the bell when there are new
  notifications (e.g. '3')

- Tapping the bell opens a dropdown list showing recent notifications

**Dropdown Content**

Each notification item in the dropdown shows:

| **Element**  | **Example**                                                                                              |
|--------------|----------------------------------------------------------------------------------------------------------|
| Message text | 'John submitted a report for Lekki Phase 2 Project.'                                                     |
| Timestamp    | '2 hours ago' or a formatted date for older items                                                        |
| Tappable     | Tapping a notification navigates to the relevant entity (the report, the issue, or the material request) |

*The dropdown shows the 10 most recent notifications, sorted newest
first. A 'View All' link at the bottom opens the full Notifications page
from the sidebar.*

**The 3 MVP Notification Triggers**

| **Trigger**                | **Recipient**   | **Message Template**                                                                     |
|----------------------------|-----------------|------------------------------------------------------------------------------------------|
| Report submitted           | Project Manager | \[Supervisor name\] submitted a report for \[Project name\].                             |
| Issue created              | Project Manager | A new \[Priority\] issue was created on \[Project name\]: \[Issue title\].               |
| Material request submitted | Project Manager | \[Supervisor name\] submitted a material request on \[Project name\]: \[Material name\]. |

- Delivery: in-app only. Email notifications are Post-MVP.

- No read/unread tracking per item in MVP — the count badge clears when
  the dropdown is opened.

| **State**         | **Behaviour**                                                              |
|-------------------|----------------------------------------------------------------------------|
| No notifications  | Bell icon visible, no count badge. Dropdown shows: 'No notifications yet.' |
| New notifications | Count badge appears on the bell.                                           |
| Dropdown loading  | Brief spinner inside the dropdown.                                         |
| Error loading     | 'Unable to load notifications.' inside the dropdown.                       |

*Post-MVP triggers (future): material request approved/rejected to
Supervisor, issue status updated to Supervisor, delayed activity flagged
to PM.*

### 7.10 Settings
Settings is available to the Project Manager only. It contains basic
account and profile management. For the MVP, settings is a simple,
single-page form.

**Settings Contents**

| **Section** | **Fields**                      | **Editable**                                                       |
|-------------|---------------------------------|--------------------------------------------------------------------|
| Profile     | Full name, email, profile image | Yes — name and image editable, email shown but not editable in MVP |
| Password    | Change password                 | Yes — requires current password to change                          |
| Account     | Role (shown as read-only label) | No — role is set at sign-up                                        |

*The supervisor sees a simpler 'Profile' page (not 'Settings')
accessible from their nav, which allows editing their name and profile
image only.*

| **State**        | **Behaviour**                                         |
|------------------|-------------------------------------------------------|
| Loading          | Skeleton fields while profile data loads.             |
| Save success     | 'Profile updated successfully.'                       |
| Password changed | 'Password changed successfully. Please log in again.' |
| Error            | 'Unable to update profile. Please try again.'         |

## 8. User Flows
### 8.1 New User Onboarding
**Project Manager First Use**

8.  PM visits SiteLog and signs up with email, password, and selects
    'Project Manager' role

9.  PM lands on empty dashboard — sees 5 KPI cards at zero and a 'Create
    Your First Project' prompt

10. PM creates their first project (fills in name, code, location,
    dates)

11. PM is redirected to the new project's detail page

12. PM assigns supervisors to the project by searching for them by name
    or email

13. Project is live — PM can now monitor incoming reports, issues, and
    requests

**Site Supervisor First Use**

14. Supervisor visits SiteLog and signs up with email, password, and
    selects 'Site Supervisor' role

15. Supervisor lands on 'My Projects' page — sees a message: 'You have
    not been assigned to any projects yet.'

16. The PM assigns them to a project (see Section 7.5)

17. Supervisor's 'My Projects' page now shows the assigned project

18. Supervisor can now submit reports, log issues, and request materials
    for that project

### 8.2 Daily Report Submission
19. Supervisor logs in and selects assigned project

20. Opens report form for today's date

21. Enters completed work description and progress percentage

22. Uploads a single site image (optional)

23. Adds delay and site condition notes (optional)

24. Form input is auto-preserved in the browser as they type

25. Taps Submit

26. System validates required fields and checks for duplicate report

27. Report stored; in-app notification dispatched to Project Manager

28. Dashboard KPI card for Reports Today increments

### 8.3 Issue Creation & Resolution
29. Supervisor or PM creates issue: title, description, priority, one
    image

30. Issue saved with status: Open

31. PM receives in-app notification (issue created)

32. PM opens the issue detail view, assigns it to a supervisor, updates
    status to In Progress

33. Work carried out on site

34. PM marks issue as Resolved — resolved_at timestamp recorded

35. Issue appears in the project's Recent Activity

### 8.4 Material Request Approval
36. Supervisor submits request: material name, quantity, urgency, notes

37. Request status set to Pending

38. PM receives in-app notification (material request submitted)

39. PM opens the request detail view, reviews, and approves or rejects

40. approved_by or rejected_by and timestamp recorded

41. If approved: PM marks as Fulfilled when materials arrive —
    fulfilled_at recorded

42. Approved request appears in the project's Recent Activity

## 9. Data Models & Schemas
*Eight schemas. Comment, AuditLog, and ProjectActivity are excluded from
MVP. The 'Recent Activity' view is a query across existing tables, not a
stored table.*

### 9.1 User
id uuid, primary key

full_name string, required

email string, unique, required

password_hash string, required

role enum: \[project_manager, site_supervisor\]

profile_image_url string, nullable

is_active boolean, default true

last_login_at timestamp, nullable

created_at timestamp

updated_at timestamp

### 9.2 Project
id uuid, primary key

project_name string, required

project_code string, unique, required

description text, nullable

location string, required

status enum: \[active, delayed, on_hold, completed\]

start_date date, required

expected_end_date date, required

assigned_project_manager uuid, foreign key -\> User.id

created_by uuid, foreign key -\> User.id

updated_by uuid, foreign key -\> User.id, nullable

created_at timestamp

updated_at timestamp

### 9.3 ProjectMembership
id uuid, primary key

project_id uuid, foreign key -\> Project.id

user_id uuid, foreign key -\> User.id

role_in_project enum: \[project_manager, site_supervisor\]

assigned_at timestamp

*Junction table. PM assigns supervisors to projects directly. No
invitation workflow.*

### 9.4 DailyReport
id uuid, primary key

project_id uuid, foreign key -\> Project.id

submitted_by uuid, foreign key -\> User.id

report_date date, required

completed_work text, required

progress_percentage integer, 0-100, required

delays text, nullable

weather_condition string, nullable

notes text, nullable

created_at timestamp

updated_at timestamp

*Unique constraint on (project_id, submitted_by, report_date). Drafts
live in browser localStorage, not the database.*

### 9.5 Issue
id uuid, primary key

project_id uuid, foreign key -\> Project.id

title string, required

description text, required

priority enum: \[low, medium, high, critical\]

status enum: \[open, in_progress, resolved\]

created_by uuid, foreign key -\> User.id

assigned_to uuid, foreign key -\> User.id, nullable

updated_by uuid, foreign key -\> User.id, nullable

created_at timestamp

updated_at timestamp

resolved_at timestamp, nullable

### 9.6 MaterialRequest
id uuid, primary key

project_id uuid, foreign key -\> Project.id

requested_by uuid, foreign key -\> User.id

material_name string, required

quantity string, required

urgency_level enum: \[low, medium, high, critical\]

notes text, nullable

status enum: \[pending, approved, rejected, fulfilled\]

approved_by uuid, foreign key -\> User.id, nullable

approved_at timestamp, nullable

rejected_by uuid, foreign key -\> User.id, nullable

rejected_at timestamp, nullable

fulfilled_at timestamp, nullable

created_at timestamp

updated_at timestamp

### 9.7 Attachment
id uuid, primary key

entity_type enum: \[daily_report, issue\]

entity_id uuid, references the parent entity

uploaded_by uuid, foreign key -\> User.id

file_url string, required

file_name string, required

file_size_bytes integer, required

mime_type string, required

is_deleted boolean, default false

created_at timestamp

*One image per parent entity (one per report, one per issue). Max 5MB.
Accepted: JPEG, PNG, WebP, PDF. Soft delete only. Material requests do
not have image attachments in MVP — the entity_type enum is limited to
daily_report and issue.*

### 9.8 Notification
id uuid, primary key

recipient_id uuid, foreign key -\> User.id

type enum: \[report_submitted, issue_created,

material_request_submitted\]

message string, required

read_status boolean, default false

related_entity_id uuid, nullable

related_entity_type enum: \[daily_report, issue, material_request\],
nullable

created_at timestamp

*Three notification types only, matching the three MVP triggers.*

## 10. Roles & Permissions Matrix
All permissions enforced server-side. Client-side UI hiding is
supplementary only.

| **Action**                     | **Project Manager** | **Site Supervisor** |
|--------------------------------|---------------------|---------------------|
| Create project                 | Yes                 | No                  |
| View all assigned projects     | Yes                 | Yes                 |
| Assign supervisors to projects | Yes                 | No                  |
| Submit daily report            | No                  | Yes                 |
| View daily reports             | Yes (all)           | Yes (own only)      |
| Create issue                   | Yes                 | Yes                 |
| Assign issue to team member    | Yes                 | No                  |
| Update issue status            | Yes                 | No                  |
| View issues                    | Yes                 | Yes                 |
| Submit material request        | No                  | Yes                 |
| Approve / reject request       | Yes                 | No                  |
| Mark request as fulfilled      | Yes                 | No                  |
| View material requests         | Yes (all)           | Yes (own only)      |
| View notifications             | Yes                 | Yes                 |
| Access settings                | Yes                 | No                  |
| Edit own profile               | Yes                 | Yes                 |

## 11. Error Handling
### 11.1 Edge Cases the Product Must Handle
- Slow or lost internet during form submission

- Duplicate report submission for the same project and date

- Failed or oversized image upload mid-form

- Missing required fields on submission

- Empty projects with no reports, issues, or requests yet

- Unauthorised access to projects not in user's membership

- Session expiry mid-workflow — user must not lose form data

- Image exceeds 5MB limit

- Duplicate project code during project creation

- Supervisor search returns no results during assignment

### 11.2 User-Facing Error Messages
| **Scenario**              | **Message**                                                                |
|---------------------------|----------------------------------------------------------------------------|
| Missing required fields   | 'Please complete all required fields before submitting.'                   |
| Image upload failure      | 'Image upload failed. Please try again. Your other fields are preserved.'  |
| File too large            | 'This file exceeds the 5MB limit. Please choose a smaller file.'           |
| Network loss              | 'Connection lost. Please try again. Your entered data is preserved.'       |
| Report submission failure | 'Unable to submit report. Please try again.'                               |
| Unauthorised access       | 'You do not have permission to access this resource.'                      |
| Project load failure      | 'Unable to load project data. Please refresh.'                             |
| Duplicate report          | 'A report for this project and date has already been submitted.'           |
| Duplicate project code    | 'A project with this code already exists. Please choose a different code.' |
| Unknown error             | 'Something went wrong. Please try again later.'                            |

*All error messages must be non-technical, guide recovery, and preserve
user progress.*

## 12. Mobile Requirements
Site supervisor workflows are the primary mobile use case. If the mobile
experience fails, the product fails.

| **Requirement**         | **Standard**                                                                        |
|-------------------------|-------------------------------------------------------------------------------------|
| One-handed usage        | All primary actions reachable with thumb. No pinch-to-zoom required for core flows. |
| Minimal keyboard input  | Dropdowns, selects, and toggles preferred over free text where possible.            |
| Image upload prominence | Camera access must be fast. Upload button must be visually prominent.               |
| Outdoor readability     | Minimum contrast ratio 4.5:1 for readability in direct sunlight.                    |
| Connectivity resilience | Forms must not lose entered data on network drop (auto-preserved in browser).       |
| Tap target size         | Minimum 44x44px on all interactive elements.                                        |
| Zoom                    | Pinch-to-zoom must not be disabled.                                                 |
| Loading feedback        | Every async action shows a loading indicator. No silent waiting.                    |
| Navigation              | Sidebar collapses to bottom navigation bar on mobile.                               |

## 13. Build Priority
This section defines the product scope tiers for the capstone build.

**MUST SHIP**

*The product does not exist without these features.*

| **Feature**                                                                                          | **Why It Must Ship**                                                            |
|------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| Authentication + onboarding — sign up, login, password reset, role assignment, first-time experience | Nothing else works without identity and access control.                         |
| Project creation and listing                                                                         | No context for reports, issues, or requests without projects.                   |
| Supervisor assignment to projects                                                                    | Access control and data scoping depend on this.                                 |
| Project dashboard with 5 KPI cards + Recent Activity section                                         | Core PM visibility. Without this the PM has no reason to use the product daily. |
| Project detail page with Reports, Issues, Requests, and Activity tabs                                | Where the PM spends most of their time.                                         |
| Daily report — form, browser draft preservation, submit, detail view                                 | The primary supervisor workflow. The core product value.                        |
| Report list — view and filter by date                                                                | PM must be able to review submitted reports.                                    |
| Issue creation, assignment, status tracking, and detail view                                         | The second core workflow.                                                       |
| Material request submission, approval, rejection, fulfilment, and detail view                        | The third core workflow.                                                        |
| Role-based permissions (server-side)                                                                 | Security and data integrity. Cannot ship without this.                          |
| Three in-app notifications (bell + count + dropdown)                                                 | Core PM alerting.                                                               |
| Settings and profile pages                                                                           | Basic account management.                                                       |

**SHIP IF TIME ALLOWS**

*Core product works without these. Build only after Must Ship is
complete and tested.*

| **Feature**                                  | **Risk If Skipped**                           |
|----------------------------------------------|-----------------------------------------------|
| Single image attachment per report and issue | Reports and issues lose evidential value.     |
| Empty and error states across all views      | Rough edges in unusual states.                |
| Report filtering by supervisor (PM only)     | PM must scroll more to find specific reports. |
| Issue and request filtering refinements      | Less efficient navigation of longer lists.    |

**POST-MVP**

*Do not build in this version. Documented for future reference only.*

| **Feature**                              | **Target Version** |
|------------------------------------------|--------------------|
| Comment system on reports and issues     | V1 SaaS release    |
| Email notifications                      | V1 SaaS release    |
| AuditLog (security event logging)        | V1 SaaS release    |
| Invitation and team management workflows | V1 SaaS release    |
| Multi-file attachments                   | V1 SaaS release    |
| Advanced analytics dashboard             | V1 SaaS release    |
| Material request image attachments       | V1 SaaS release    |
| Dark mode                                | V1 SaaS release    |
| Offline mode with background sync        | V2                 |
| Native mobile app (iOS / Android)        | V2                 |
| ERP or accounting integrations           | V3                 |
| BIM integration                          | V3                 |

## 14. Future Monetisation Readiness
Monetisation is a future consideration only. No billing, payments,
subscriptions, plan management, usage metering, or feature flags are
built in the MVP. The MVP must simply avoid architectural decisions that
would block these later.

| **Future Consideration**   | **Forward-Compatibility Note**                                                                                                                 |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Organisations / Workspaces | The data model should allow later adding an Organisation that owns Projects (e.g. a nullable organization_id on Project). Do not build it now. |
| Subscription Plans         | Plan tiers can be layered on later. No Plan or Subscription entity in MVP.                                                                     |
| Project Limits             | Project counts can be capped per account later. No limit enforcement in MVP.                                                                   |
| Team Limits                | Team-size limits can be added later. No enforcement in MVP.                                                                                    |
| Premium Analytics          | Advanced analytics can become a paid tier later. Not built in MVP.                                                                             |

**Excluded from MVP: billing, payment processing, subscriptions,
invoicing, plan management, usage metering, quota enforcement, feature
flags. No billing, pricing, or plan-selection UI of any kind.**

## 15. Success Metrics
| **Metric**                  | **Definition of Success**                                                              |
|-----------------------------|----------------------------------------------------------------------------------------|
| Report submission rate      | Supervisors submit reports on more working days than not across active projects        |
| Report submission speed     | Full submission completed in under 3 minutes on a mobile device                        |
| Issue resolution rate       | Issues move from Open to Resolved within a reasonable timeframe after creation         |
| Material request adoption   | Requests submitted and actioned inside SiteLog rather than via WhatsApp                |
| PM dashboard engagement     | Project managers review their dashboard daily without being prompted                   |
| Communication fragmentation | Measurable reduction in operational WhatsApp messages from active users                |
| Supervisor retention        | Supervisors continue submitting reports after the first two weeks without being chased |

---

## 16. UI Layout Reference

This section holds the detailed page-by-page layout specifications. The design system rules (token usage, spacing, color roles, components) live in `.agent/rules/design-system.md`; this section is the detailed visual structure the agent builds each screen to. Read both.

### App Shell (every authenticated page)

Authenticated pages render inside a persistent shell, defined once in a shared layout:

- **Sidebar** (desktop): fixed on the left, ~240px wide, `--color-surface-container` background, with the SiteLog logo at the top and the nav items below (PM or supervisor set — see agents.md). The active item is highlighted with `--color-primary`. The sidebar does not scroll away or reload when navigating.
- **Top bar**: a slim bar across the top of the content area showing the current page title (Space Grotesk, `--font-headline-*` or `--font-title-large`), and on the right the notification bell with its count badge and a simple user menu (name + avatar).
- **Content area**: the page content, in a max-width container (around 1200px for the dashboard, narrower for forms and detail views), with `24px` padding on desktop and `16px` on mobile, against `--color-background`.
- **Mobile**: the sidebar collapses to a bottom navigation bar. Primary nav items become bottom-bar icons with labels. The top bar keeps the page title and the notification bell.

When the user navigates between sidebar items, only the content area changes. The sidebar and top bar stay mounted. Never rebuild the whole shell on navigation.

### Landing Page (`/`, public)

A logged-out marketing page. Build it — the app does not start at the dashboard. Structure, top to bottom:
1. **Header**: logo on the left. On the right, a "Log In" text link (for returning users) and a primary "Get Started" button. Use "Get Started" as the primary call to action throughout — not "Sign Up". "Sign Up" only appears on the auth page itself.
2. **Hero**: a strong headline (`--font-display-*`, Space Grotesk), a one-line subheading explaining SiteLog, a primary "Get Started" button, and a clean product visual (a dashboard mockup or screenshot).
3. **Problem section**: three short cards naming the pain (issues reported too late, material requests lost in chat, no record of anything).
4. **Solution / how it works**: the three core workflows (Daily Reporting, Issue Tracking, Material Requests), one row each with a short description and a supporting visual.
5. **Dashboard preview**: a section showing the multi-project dashboard, "every site at a glance".
6. **Built-for-the-field section**: speaks to supervisor adoption — works on any phone, no install, readable outdoors, survives a dropped connection.
7. **Pricing section**: see Pricing Section below.
8. **Final call to action**: a closing headline and a "Get Started" button.
9. **Footer**: logo, the tagline, simple links, copyright.

Every "Get Started" button navigates to the auth page (which opens on the sign-up form). The "Log In" link navigates to the auth page on the login form. Keep it flat, fast, and content-first. One tasteful product visual in the hero is enough — no heavy 3D on the critical path.

### Pricing Section

Presentational only, and a Phase 2 item. Marketing UI — it shows plans and prices but enforces nothing. Do not build billing, payments, subscriptions, plan entities, or limit enforcement. Every button says "Get Started" and goes to the auth page regardless of plan. Plan limits are described as text; the app does not enforce them in MVP.

Layout: three cards in a row, with two toggles.

**Billing toggle** (top of the section, applies to all cards): a Monthly / Yearly switch. Yearly is cheaper — priced at roughly two months free (yearly = monthly × 10). Toggling updates all displayed prices. UI state only.

**The three cards:**

- **Card 1 — Free — $0**: 1 Project Manager, 1 site supervisor, 1 active project, core daily reporting/issues/material requests. Positioned as: enough to try SiteLog, not to run a real operation.
- **Card 2 — Starter / Premium** (the highlighted "most popular" card): has its own internal toggle to flip between two plans. Opens showing Starter; user clicks to switch to Premium.
  - *Starter*: $19/mo (or $190/yr) — 1 Project Manager, up to 3 site supervisors, up to 2 active projects, photo attachments.
  - *Premium*: $49/mo (or $490/yr) — 1 Project Manager, up to 15 site supervisors, unlimited active projects, everything in Starter plus priority support.
  - The Starter/Premium switch is UI state only and must be visually obvious (a clear two-option switch at the top of the card).
- **Card 3 — Business — $149/mo (or $1,490/yr)**: multiple Project Managers, unlimited supervisors, unlimited projects, everything in Premium plus advanced reporting & analytics and dedicated support.

Build the two toggles as React state in client components. The rest is static. Style the cards with the design tokens (`--color-surface`, `12px` radius, `--color-outline` border); give the highlighted card a `--color-primary` accent and a "Most popular" badge.

### Auth Page (one page, conditional forms)

A single auth screen holds the login, sign-up, and password-reset forms, rendered conditionally. Switching between them swaps the form in place — no navigation, no reload. A clean centered card on a simple background: logo at the top, the active form (labeled inputs stacked vertically, full-width primary submit button), and a link to switch mode ("Don't have an account? Sign up"). Sign-up includes the role selector (Project Manager / Site Supervisor).

### Dashboard Layout (PM)

- Page title at the top ("Dashboard").
- **5 KPI cards in a row** across the top (Active Projects, Delayed Projects, Open Issues, Pending Requests, Reports Today). Desktop: a single row of 5; tablet: wrap to 2–3 per row; mobile: 2 per row. Each card: label (`--font-label-*`), large number (`--font-headline-*` or `--font-display-small`, Space Grotesk), `--color-surface` background, `12px` radius, subtle `--color-outline` border, tappable.
- **Recent Activity** section below the cards: a section heading then a list of the 5 most recent items, each a row with an icon, the activity text (`--font-body-medium`), and a timestamp (`--font-body-small`, `--color-on-surface-variant`). Each row tappable.

### List Pages (reports, issues, material requests)

- Page title at the top.
- A **filter bar** below the title (filters defined per feature in Section 7) — a client component.
- The list: a table on desktop, stacked cards on mobile. Each row shows the key fields plus a status/priority chip. Each row tappable to the detail view.
- Empty, loading, and error states as specified in Section 17.

### Detail Pages (report, issue, material request)

- A back affordance to the list.
- The entity's fields laid out clearly with labels (`--font-label-*`) and values (`--font-body-medium`), grouped in a card on `--color-surface`.
- Status/priority chips where relevant.
- PM-only actions (assign, update status, approve, reject, mark fulfilled) as buttons, shown only to the PM.
- The attached image (report, issue) shown full-width if present.

### Project Detail Page

- Project header card: name (`--font-headline-*`), code, status chip, location, dates, team size.
- Four tabs below: Reports, Issues, Material Requests, Recent Activity. Tabs swap the content below them; the header stays. Each tab uses the list layout above, scoped to this project.

### Forms (report, issue, material request, project creation)

- Single column, labels above inputs (never placeholder-as-label).
- Inputs at least 44px tall, `8px` radius, `--color-outline` border, `--color-primary` focus ring.
- Required fields validated on submit; error text below the field in `--color-error` with the copy from Section 17.
- Primary submit button full-width on mobile.
- The report form auto-preserves input to localStorage as the user types.

## 17. Exact State Copy

Use verbatim. Every data view implements loading, empty, and error states.

**Authentication**
- Invalid credentials: "Incorrect email or password. Please try again."
- Account inactive: "Your account is not active. Please contact your project manager."

**Password reset**
- After requesting (always shown, whether or not the email exists): "If an account exists for that email, a reset code has been sent."
- Code sent confirmation: "We've sent a 6-digit code to your email. Enter it below."
- Invalid code: "That code is incorrect. Please check and try again."
- Expired code: "That code has expired. Please request a new one."
- Reset success: "Your password has been reset. You can now log in."
- Change password (logged in) wrong current password: "Your current password is incorrect."
- Change password success: "Your password has been updated."

**Dashboard**
- Empty, no projects: "No active projects yet. Create your first project to get started." + Create Project button
- Empty activity: "No recent activity across your projects."
- Error: "Unable to load dashboard data. Please refresh."

**First-time experience**
- New PM: empty dashboard, KPI cards at zero, prominent "Create Your First Project" button.
- New supervisor: "You have not been assigned to any projects yet. Your project manager will add you to a project."

**Daily Reporting**
- Empty list: "No reports submitted yet for this project."
- Duplicate: "A report for this project and date has already been submitted."
- Network loss: "Connection lost. Please try again. Your entered data is preserved."
- Upload failure: "Image upload failed. Please try again. Your other fields are preserved."
- Success: "Report submitted successfully."

**Issues**
- Empty: "No issues logged for this project. Issues reported on site will appear here."
- Error: "Unable to load issues. Please refresh."

**Material Requests**
- Empty: "No material requests submitted for this project."
- Approved (to supervisor): "Your request for [material] has been approved."
- Rejected (to supervisor): "Your request for [material] has been rejected."
- Error: "Unable to update request. Please try again."

**Project Creation**
- Validation: "Please complete all required fields before submitting."
- Duplicate code: "A project with this code already exists. Please choose a different code."
- Success: "Project created successfully."

**Supervisor assignment**
- No search results: "No supervisors found matching that name or email."
- Already assigned: "This supervisor is already assigned to this project."

**Global**
- Missing fields: "Please complete all required fields before submitting."
- File too large: "This file exceeds the 5MB limit. Please choose a smaller file."
- Unauthorised: "You do not have permission to access this resource."
- Unknown: "Something went wrong. Please try again later."