# CG-Designer Manager (CGDM)

> **Pure Web Application Edition**  
> Client, Project, Graphic Designer, Design Job, Revision, Proof, Approval and Payment Management System.

---

## 1. Project Overview

**CG-Designer Manager (CGDM)** is a web-based management application designed for graphic design and printing businesses.

The system manages the complete workflow from:

**Client → Project → Design Job → Designer → Revision → Proof → Approval → Completion → Payment**

The application is designed as a **pure web application** and does not depend on a desktop wrapper.

### Primary goals

- Centralize client information.
- Organize work into projects.
- Create and assign graphic design jobs.
- Track design prices manually.
- Track designer workload.
- Manage revisions.
- Manage proofs and approvals.
- Maintain project and job history.
- Track financial/payment states.
- Provide role-based access.
- Provide dashboards and reports.
- Work on desktop, tablet and mobile browsers.
- Keep the frontend simple and maintainable using standard web technologies.

---

# 2. Technology Stack

The new application intentionally uses a traditional web stack.

## Frontend

- HTML5
- CSS3
- JavaScript ES6+
- Bootstrap 5
- Bootstrap Icons
- Fetch API
- Browser APIs
- Optional Chart.js for reporting/visualization

## Backend

Recommended:

- Node.js
- Express.js
- REST API
- JWT or secure session authentication
- Server-side validation

## Database

Recommended:

- PostgreSQL

Alternative:

- MySQL / MariaDB

The production application should use a server-side relational database.

## File Storage

Recommended:

- Local server storage for development
- S3-compatible object storage for production

Examples:

- Amazon S3
- Cloudflare R2
- DigitalOcean Spaces
- Other S3-compatible storage

## Deployment

Frontend can be deployed through:

- Nginx
- Apache
- Cloud hosting
- Static hosting when separated from the API

Backend can be deployed on:

- VPS
- Cloud server
- Docker
- Managed Node.js hosting

---

# 3. Important Architecture Decision

This version is a **pure web application**.

The project does **NOT** use:

- React
- React Router
- TypeScript
- Vite
- Tauri
- Rust
- Local SQLite as the production database
- Desktop-only APIs

The application is built using:

```text
HTML
CSS
JavaScript
Bootstrap
REST API
PostgreSQL
```

Architecture:

```text
┌─────────────────────────────────────────┐
│              WEB BROWSER                │
│                                         │
│  HTML5 + CSS3 + Bootstrap + JavaScript │
└────────────────────┬────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────┐
│                 REST API                │
│                                         │
│ Node.js + Express                       │
│ Authentication                          │
│ Authorization                           │
│ Validation                              │
│ Business Services                       │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│               DATABASE                  │
│                                         │
│ PostgreSQL                              │
│ Clients                                 │
│ Projects                                │
│ Design Jobs                             │
│ Revisions                               │
│ Proofs                                  │
│ Approvals                               │
│ Payments                                │
│ Users                                   │
│ Activity Logs                           │
└─────────────────────────────────────────┘

                     │
                     ▼
┌─────────────────────────────────────────┐
│             FILE STORAGE                │
│                                         │
│ Design files                            │
│ Proof files                             │
│ Reference files                         │
│ Approved artwork                        │
└─────────────────────────────────────────┘
```

---

# 4. Core Business Workflow

CGDM follows a relational workflow.

```text
CLIENT
   │
   ▼
PROJECT
   │
   ▼
DESIGN JOB
   │
   ├── Designer
   ├── Design Type
   ├── Priority
   ├── Price
   └── Deadline
        │
        ▼
     REVISION
        │
        ▼
       PROOF
        │
        ▼
     APPROVAL
        │
        ▼
    COMPLETED
        │
        ▼
      PAYMENT
```

A client can have multiple projects.

A project can have multiple design jobs.

A design job can have multiple revisions.

A design job can have multiple proofs.

A proof can have an approval/rejection result.

A project can contain multiple financial transactions.

---

# 5. User Roles

## 5.1 Admin

Admin has full management access.

Admin can:

- Create clients.
- Edit clients.
- Deactivate clients.
- Create projects.
- Edit projects.
- Create design jobs.
- Assign designers.
- Change design prices.
- Change priority.
- Change deadlines.
- Manage revisions.
- Upload proofs.
- Request approval.
- Approve/reject workflows where permitted.
- Manage payments.
- View reports.
- Manage users.
- View activity logs.
- Configure application settings.

---

## 5.2 Designer

Designer access is intentionally restricted.

Designer can:

- View assigned design jobs.
- View project information relevant to assigned work.
- Update permitted workflow states.
- Add design notes.
- Upload design/proof files.
- Submit work for review.
- Respond to revision requests.
- View revision history.

Designer cannot:

- Change design price.
- Reassign the job.
- Modify another designer's job.
- Delete historical records.
- Cancel jobs unless explicitly authorized.
- Access unrestricted financial information.
- Access unrelated client records.

---

## 5.3 Future Roles

Possible future roles:

```text
ADMIN
MANAGER
DESIGNER
ACCOUNTANT
CLIENT
VIEWER
```

The authorization system should be designed so additional roles can be introduced without rewriting the application.

---

# 6. Main Modules

## 6.1 Dashboard

The dashboard provides an overview of business activity.

Possible cards:

- Total Clients
- Active Clients
- Total Projects
- Active Projects
- Total Design Jobs
- New Jobs
- In Progress
- In Review
- Revision Required
- Ready for Approval
- Completed
- Overdue
- Pending Payments

The dashboard should support role-specific information.

---

# 7. Client Management

Client management stores customer/business information.

### Client fields

```text
Client ID
Client Code
Client Name
Company Name
Phone
WhatsApp
Email
Address
City
State
Postal Code
Notes
Status
Created At
Updated At
```

### Client status

```text
ACTIVE
INACTIVE
```

Inactive clients should remain in historical records but should not be selectable for new work unless an authorized user explicitly enables it.

### Client profile

A client profile should show:

- Client information
- Active projects
- Completed projects
- Design jobs
- Pending jobs
- Payment summary
- Activity history

---

# 8. Project Management

Projects organize a client's work.

### Project ID

Use permanent sequential IDs:

```text
PRJ-000001
PRJ-000002
PRJ-000003
```

The Project ID should never change after creation.

### Project fields

```text
Project ID
Client
Project Name
Description
Project Type
Priority
Status
Start Date
Deadline
Completed At
Notes
Created By
Created At
Updated At
```

### Project types

Examples:

```text
PRINT
BRANDING
MARKETING
EVENT
DIGITAL
SOCIAL_MEDIA
ADVERTISEMENT
OTHER
```

### Project priority

```text
LOW
NORMAL
HIGH
URGENT
```

### Project status

```text
PLANNING
ACTIVE
ON_HOLD
COMPLETED
CANCELLED
```

---

# 9. Design Job Management

Design Jobs are the actual graphic design tasks performed by designers.

### Design Job ID

Use permanent sequential IDs:

```text
DSN-000001
DSN-000002
DSN-000003
```

The ID must remain permanent.

### Design Job fields

```text
Design Job ID
Project
Client
Job Title
Design Type
Description
Designer
Price
Priority
Status
Start Date
Deadline
Completed At
Notes
Created By
Created At
Updated At
```

---

# 10. Design Types

Supported design categories can include:

```text
PRINT DESIGN
BANNER
POSTER
FLYER
BROCHURE
VISITING CARD
INVITATION
SOCIAL MEDIA
ADVERTISEMENT
LOGO
BRANDING
CATALOGUE
PACKAGING
OTHER
```

The system should allow administrators to extend this list later.

---

# 11. Design Job Status Workflow

Recommended workflow:

```text
NEW
  ↓
ASSIGNED
  ↓
IN_PROGRESS
  ↓
IN_REVIEW
  ↓
READY_FOR_APPROVAL
  ↓
APPROVED
  ↓
COMPLETED
```

Revision path:

```text
IN_REVIEW
    ↓
REVISION
    ↓
IN_PROGRESS
    ↓
IN_REVIEW
```

Cancellation:

```text
NEW / ASSIGNED / IN_PROGRESS / IN_REVIEW
                  ↓
              CANCELLED
```

The backend must validate status transitions.

The frontend must not be the only security layer.

---

# 12. Manual Design Pricing

Design prices are manually entered.

Example:

```text
Design Price: ₹1,500
```

Pricing should support:

- Decimal values.
- Zero-price jobs when permitted.
- Indian Rupee formatting.
- Price history.
- Authorized price updates.

Display format:

```text
₹1,500.00
```

The database should store the numeric amount, not the formatted currency string.

Example:

```text
1500.00
```

---

# 13. Designer Management

Designer profiles should contain:

```text
Designer ID
Name
Email
Phone
Role
Status
Joined Date
Notes
```

Designer status:

```text
ACTIVE
INACTIVE
```

Only active designers should normally appear in new assignment selectors.

---

# 14. Designer Workload

Designer workload should provide:

```text
Designer
Assigned Jobs
New
In Progress
In Review
Revision
Completed
Overdue
```

Example:

```text
Designer A
Assigned: 12
In Progress: 4
In Review: 3
Revision: 2
Completed: 8
Overdue: 1
```

This allows management to distribute work efficiently.

---

# 15. Revision Management

A design job can have multiple revisions.

Each revision must be preserved as historical data.

### Revision fields

```text
Revision ID
Design Job ID
Revision Number
Requested By
Reason
Instructions
Status
Created At
Updated At
Completed At
```

### Revision status

```text
REQUESTED
IN_PROGRESS
SUBMITTED
ACCEPTED
CANCELLED
```

Revision numbers should be sequential per design job:

```text
Revision 1
Revision 2
Revision 3
```

Do not overwrite previous revisions.

---

# 16. Proof Management

Proofs represent versions submitted for review or approval.

### Proof fields

```text
Proof ID
Design Job ID
Revision ID
Version Number
File URL
Preview URL
Uploaded By
Notes
Status
Created At
```

### Proof status

```text
DRAFT
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
SUPERSEDED
```

A new proof should not destroy the previous proof.

---

# 17. Approval Management

Approval records provide a permanent history of approval decisions.

### Approval fields

```text
Approval ID
Design Job ID
Proof ID
Requested By
Approved By
Status
Comments
Created At
Approved At
```

### Approval status

```text
PENDING
APPROVED
REJECTED
```

Approval should record who made the decision and when.

---

# 18. Payment Management

Payment management tracks financial transactions.

The system should support:

```text
Advance
Half Paid
Paid Full
Pending
Partial
Refunded
```

Recommended transaction structure:

```text
Payment ID
Project ID
Design Job ID
Client ID
Amount
Payment Type
Payment Method
Reference Number
Notes
Paid At
Created By
```

Payment status should be calculated from transactions where possible instead of manually overwriting financial history.

---

# 19. Three-Stage Designer Payment State

The design management workflow can also support designer payment states:

```text
ADVANCE
HALF_PAID
PAID_FULL
```

The design price remains separate from the payment records.

Example:

```text
Design Price: ₹5,000

Advance: ₹1,500
Half Paid: ₹2,500
Balance: ₹2,500
Status: PARTIAL
```

The system should never use payment status as a replacement for transaction history.

---

# 20. Search

Global/module search should support relevant fields.

### Client search

```text
Client ID
Client Code
Client Name
Company
Phone
Email
```

### Project search

```text
Project ID
Project Name
Client
```

### Design Job search

```text
Design Job ID
Job Title
Project ID
Project Name
Client
Designer
```

Search requests should be handled safely by the backend.

---

# 21. Filters

Design Jobs should support:

```text
Status
Priority
Design Type
Designer
Deadline
Project
Client
```

Projects should support:

```text
Status
Priority
Project Type
Client
Deadline
```

---

# 22. Sorting

Sorting must use an allowlist.

Example allowed fields:

```text
created_at
updated_at
deadline
priority
status
price
project_id
design_job_id
```

Do not directly insert user-provided sort strings into SQL.

---

# 23. Deadline Management

The application should distinguish:

```text
Upcoming
Due Soon
Due Today
Overdue
Completed
```

Overdue work should be visually obvious.

Example:

```text
Deadline: 31 Aug 2026
Status: Overdue
```

The backend should calculate deadline-related states using a consistent server timezone.

---

# 24. Timezone

Default application timezone:

```text
Asia/Kolkata
```

The application should use a configured timezone rather than depending on the user's browser timezone for business rules.

Store timestamps consistently in the database and convert them for display.

---

# 25. Activity Logging

Important business actions should create audit records.

Examples:

```text
CLIENT_CREATED
CLIENT_UPDATED
CLIENT_DEACTIVATED

PROJECT_CREATED
PROJECT_UPDATED
PROJECT_STATUS_CHANGED

DESIGN_JOB_CREATED
DESIGNER_ASSIGNED
DESIGN_PRICE_UPDATED
DESIGN_STATUS_CHANGED
DESIGN_JOB_CANCELLED

REVISION_CREATED
REVISION_UPDATED

PROOF_UPLOADED
PROOF_SUBMITTED

APPROVAL_REQUESTED
APPROVAL_APPROVED
APPROVAL_REJECTED

PAYMENT_CREATED
PAYMENT_UPDATED
```

Audit records should contain:

```text
Actor
Action
Entity
Entity ID
Timestamp
Previous Value
New Value
IP where appropriate
```

---

# 26. Database Architecture

Recommended PostgreSQL tables:

```text
users
clients
projects
design_jobs
revisions
proofs
approvals
revision_requests
payments
payment_allocations
activity_logs
files
notifications
settings
```

---

# 27. Database Relationships

```text
users
 │
 ├────────────── projects.created_by
 ├────────────── design_jobs.created_by
 ├────────────── design_jobs.designer_id
 ├────────────── revisions.requested_by
 ├────────────── proofs.uploaded_by
 ├────────────── approvals.approved_by
 └────────────── payments.created_by


clients
 │
 └── projects
       │
       └── design_jobs
             │
             ├── revisions
             │     └── proofs
             │
             ├── proofs
             │
             ├── approvals
             │
             └── payments
```

Foreign keys should enforce relational integrity.

---

# 28. Recommended Project Structure

```text
cg-designer-manager/
│
├── index.html
│
├── pages/
│   ├── login.html
│   ├── dashboard.html
│   ├── clients.html
│   ├── client-profile.html
│   ├── projects.html
│   ├── project-profile.html
│   ├── design-jobs.html
│   ├── design-job-profile.html
│   ├── designers.html
│   ├── revisions.html
│   ├── proofs.html
│   ├── approvals.html
│   ├── payments.html
│   ├── reports.html
│   └── settings.html
│
├── components/
│   ├── navbar.html
│   ├── sidebar.html
│   ├── footer.html
│   ├── modal.html
│   ├── toast.html
│   ├── loading.html
│   └── empty-state.html
│
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── bootstrap-icons.css
│   │   ├── app.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── forms.css
│   │   ├── tables.css
│   │   ├── dashboard.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── router.js
│   │   ├── state.js
│   │   ├── permissions.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── notifications.js
│   │   └── utils.js
│   │
│   └── images/
│
├── modules/
│   ├── dashboard/
│   │   ├── dashboard.js
│   │   └── dashboard.css
│   │
│   ├── clients/
│   │   ├── client-list.js
│   │   ├── client-form.js
│   │   ├── client-profile.js
│   │   └── client.css
│   │
│   ├── projects/
│   │   ├── project-list.js
│   │   ├── project-form.js
│   │   ├── project-profile.js
│   │   └── project.css
│   │
│   ├── design-jobs/
│   │   ├── design-job-list.js
│   │   ├── design-job-form.js
│   │   ├── design-job-profile.js
│   │   ├── designer-workload.js
│   │   └── design-job.css
│   │
│   ├── revisions/
│   ├── proofs/
│   ├── approvals/
│   ├── payments/
│   └── reports/
│
├── api/
│   └── README.md
│
├── server/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   │
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── validators/
│   │   └── utils/
│   │
│   ├── migrations/
│   └── seeds/
│
├── database/
│   ├── schema.sql
│   └── migrations/
│       ├── 001_foundation.sql
│       ├── 002_clients.sql
│       ├── 003_projects.sql
│       ├── 004_design_jobs.sql
│       ├── 005_revisions_approvals.sql
│       └── 006_payments.sql
│
├── uploads/
│   └── .gitkeep
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── AUTHENTICATION.md
│   ├── UI-UX.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 29. Frontend Architecture

The frontend should be modular without introducing a frontend framework.

Recommended pattern:

```text
HTML
 ↓
Page Controller
 ↓
Module JavaScript
 ↓
API Client
 ↓
REST API
```

Example:

```text
design-jobs.html
      ↓
design-job-list.js
      ↓
api.js
      ↓
GET /api/design-jobs
      ↓
Express
      ↓
designJobService
      ↓
designJobRepository
      ↓
PostgreSQL
```

---

# 30. Why HTML/CSS/JavaScript/Bootstrap?

The purpose of this version is to use a straightforward web stack.

## HTML

HTML provides:

- Page structure.
- Semantic markup.
- Forms.
- Tables.
- Navigation.
- Accessibility structure.

## CSS

CSS provides:

- Application branding.
- Layout.
- Responsive behavior.
- Custom components.
- Animation.
- Theme customization.

## JavaScript

JavaScript provides:

- API communication.
- Dynamic tables.
- Forms.
- Validation feedback.
- Modals.
- Search.
- Filters.
- State management.
- Navigation.
- UI updates.

## Bootstrap

Bootstrap provides:

- Responsive grid.
- Forms.
- Buttons.
- Cards.
- Tables.
- Modals.
- Dropdowns.
- Alerts.
- Utilities.

Bootstrap reduces repetitive CSS work while custom CSS keeps CGDM's visual identity.

---

# 31. Why Not React?

React is not required for this project.

The application primarily contains:

- Forms
- Tables
- Dashboards
- CRUD screens
- Modals
- Search/filter interfaces

These can be implemented effectively using modern JavaScript.

Using plain JavaScript also means:

- No JSX.
- No TypeScript compilation.
- No React runtime.
- No Vite requirement.
- Easier deployment.
- Easier inspection in the browser.
- Easier onboarding for traditional web developers.

The project should still maintain modular JavaScript architecture to avoid turning the application into one large script.

---

# 32. Why Not Tauri?

Tauri is designed to package web applications as desktop applications.

This version is specifically a **pure web application**.

Therefore:

```text
Browser
   ↓
HTTPS
   ↓
Web Server / API
   ↓
Database
```

There is no need for:

```text
Browser
   ↓
Tauri
   ↓
Rust
   ↓
Local SQLite
```

A desktop version can be created later if required.

---

# 33. API Architecture

Recommended API base:

```text
/api
```

Authentication:

```text
/api/auth
```

Clients:

```text
/api/clients
/api/clients/:id
```

Projects:

```text
/api/projects
/api/projects/:id
```

Design jobs:

```text
/api/design-jobs
/api/design-jobs/:id
```

Revisions:

```text
/api/design-jobs/:id/revisions
/api/revisions/:id
```

Proofs:

```text
/api/design-jobs/:id/proofs
/api/proofs/:id
```

Approvals:

```text
/api/design-jobs/:id/approvals
/api/approvals/:id
```

Payments:

```text
/api/payments
/api/payments/:id
```

Reports:

```text
/api/reports/dashboard
/api/reports/designers
/api/reports/projects
/api/reports/payments
```

---

# 34. REST API Standards

Use standard HTTP methods.

```text
GET     Read
POST    Create
PUT     Replace
PATCH   Partial update
DELETE  Delete where permitted
```

Example:

```http
GET /api/design-jobs
```

```http
POST /api/design-jobs
```

```http
GET /api/design-jobs/DSN-000001
```

```http
PATCH /api/design-jobs/DSN-000001
```

---

# 35. API Response Format

Recommended success response:

```json
{
  "success": true,
  "data": {},
  "message": "Design job created successfully."
}
```

Recommended error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Deadline must be after start date."
  }
}
```

---

# 36. Authentication

Authentication must be implemented on the server.

Recommended:

```text
Login
  ↓
Server validates credentials
  ↓
Session / secure token
  ↓
Authenticated requests
```

Passwords must never be stored as plain text.

Use a modern password hashing algorithm such as Argon2 or bcrypt.

Production authentication should include:

- Secure cookies or secure token handling.
- HTTPS.
- Session expiration.
- Logout.
- Password reset.
- Rate limiting.
- Account status checks.

---

# 37. Authorization

Authorization must be enforced server-side.

Example:

```text
Admin
  → Full access

Designer
  → Assigned jobs only
  → No price modification
  → No reassignment
  → No unrestricted financial access
```

Hiding a button in HTML is not security.

The API must reject unauthorized requests even when someone manually calls the endpoint.

---

# 38. Security Requirements

The application should implement:

- Parameterized database queries.
- Input validation.
- Output encoding.
- Authentication.
- Authorization.
- CSRF protection where cookie sessions are used.
- Rate limiting.
- Secure HTTP headers.
- HTTPS.
- Password hashing.
- File upload validation.
- File size limits.
- MIME validation.
- Audit logging.
- Secure environment variables.
- Database least-privilege accounts.

Never commit:

```text
.env
database passwords
API keys
JWT secrets
cloud storage credentials
private certificates
```

---

# 39. File Upload Security

Design files and proofs require special care.

Allowed file types should be explicitly configured.

Example:

```text
PDF
JPG
JPEG
PNG
WEBP
SVG
AI
PSD
```

Depending on business requirements, large source files can be stored in object storage instead of directly on the application server.

Security controls:

- Maximum file size.
- MIME validation.
- Extension validation.
- Random storage filenames.
- Authentication before download.
- Authorization before access.
- Malware scanning where appropriate.
- No executable uploads.
- Private storage by default.

---

# 40. UI/UX Design System

CGDM should have a professional business application interface.

Design principles:

- Desktop-first productivity layout.
- Responsive mobile behavior.
- Clear navigation.
- Consistent spacing.
- Strong visual hierarchy.
- Minimal unnecessary decoration.
- Fast access to common actions.
- Clear status indicators.
- Clear confirmation dialogs.
- Useful empty states.
- Loading states.
- Error states.

---

# 41. Application Layout

Recommended desktop layout:

```text
┌─────────────────────────────────────────────────────┐
│                    TOP NAVBAR                       │
├───────────────┬─────────────────────────────────────┤
│               │                                     │
│   SIDEBAR     │            MAIN CONTENT             │
│               │                                     │
│ Dashboard     │  Page Header                        │
│ Clients       │  Filters                            │
│ Projects      │  Content                            │
│ Design Jobs   │                                     │
│ Designers     │                                     │
│ Revisions     │                                     │
│ Proofs        │                                     │
│ Approvals     │                                     │
│ Payments      │                                     │
│ Reports       │                                     │
│ Settings      │                                     │
│               │                                     │
└───────────────┴─────────────────────────────────────┘
```

---

# 42. Design Tokens

Example base colors:

```css
--cgdm-primary: #0d6efd;
--cgdm-success: #198754;
--cgdm-warning: #ffc107;
--cgdm-danger: #dc3545;
--cgdm-info: #0dcaf0;
--cgdm-dark: #212529;
--cgdm-light: #f8f9fa;
```

These are starting values and can be refined during UI design.

---

# 43. Status Color Rules

Status colors should be consistent.

Example:

```text
NEW                → Neutral
ASSIGNED           → Info
IN_PROGRESS        → Primary
IN_REVIEW          → Warning
REVISION           → Warning/Danger
READY_FOR_APPROVAL → Info
APPROVED           → Success
COMPLETED          → Success
CANCELLED          → Danger
```

Do not rely on color alone.

Always include text labels/icons where appropriate.

---

# 44. Responsive Design

The web application must work on:

```text
Desktop
Laptop
Tablet
Mobile
```

Bootstrap breakpoints can be used as the baseline.

Tables should support:

- Horizontal scrolling.
- Responsive columns.
- Compact mobile layouts.
- Detail pages optimized for small screens.

---

# 45. Accessibility

The application should target good accessibility practices.

Requirements:

- Semantic HTML.
- Labels for form controls.
- Keyboard navigation.
- Visible focus states.
- Sufficient color contrast.
- Accessible modal behavior.
- `aria-*` attributes where required.
- Text alternatives for icons.
- Do not communicate important information only through color.

---

# 46. Notifications

Use consistent toast/alert messages.

Examples:

```text
Client created successfully.
Project updated successfully.
Design job assigned successfully.
Revision requested.
Proof uploaded.
Approval completed.
Payment recorded.
```

Errors should explain what the user needs to correct.

---

# 47. Form Validation

Validation must exist at two levels.

## Frontend

Used for immediate user feedback.

Examples:

```text
Required field
Invalid email
Invalid amount
Invalid date
```

## Backend

Used for actual security and business rules.

Examples:

```text
Client must exist.
Designer must be active.
Project cannot be cancelled.
Price cannot be negative.
Deadline cannot precede start date.
Unauthorized role cannot modify price.
```

Backend validation is authoritative.

---

# 48. Data Integrity

Important business records should not be physically deleted without a strong reason.

Prefer:

```text
ACTIVE
INACTIVE
ARCHIVED
CANCELLED
```

for business entities where historical information matters.

Financial and approval history should generally be immutable.

Corrections should create new records or audit events rather than silently rewriting history.

---

# 49. Migration Strategy

Database migrations should be numbered.

Example:

```text
001_foundation.sql
002_clients.sql
003_projects.sql
004_design_jobs.sql
005_revisions_approvals.sql
006_payments.sql
007_activity_logs.sql
008_files.sql
```

Each migration should be:

- Repeatable in deployment tooling where supported.
- Versioned in Git.
- Tested before production.
- Backward-aware where possible.

---

# 50. Development Setup

## Requirements

Install:

```text
Node.js LTS
npm
PostgreSQL
Git
A modern web browser
```

Optional:

```text
VS Code
Postman / Insomnia
Docker
```

---

# 51. Environment Variables

Example `.env.example`:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL=postgresql://username:password@localhost:5432/cgdm

SESSION_SECRET=change-this-secret

APP_TIMEZONE=Asia/Kolkata

UPLOAD_MAX_SIZE_MB=50

STORAGE_PROVIDER=local
STORAGE_PATH=./uploads
```

Never put production secrets into Git.

---

# 52. Local Development

Example:

```bash
git clone <repository>
cd cg-designer-manager
npm install
```

Configure:

```text
.env
```

Create the PostgreSQL database.

Run migrations:

```bash
npm run db:migrate
```

Start backend:

```bash
npm run server
```

Open:

```text
http://localhost:3000
```

If frontend and API run separately:

```text
Frontend:
http://localhost:5173

API:
http://localhost:3000
```

The exact development ports can be configured later.

---

# 53. Useful npm Scripts

Recommended scripts:

```json
{
  "scripts": {
    "dev": "node server/src/server.js",
    "start": "node server/src/server.js",
    "db:migrate": "node server/scripts/migrate.js",
    "db:seed": "node server/scripts/seed.js",
    "test": "node --test",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

The final implementation can adjust these scripts according to the selected backend tooling.

---

# 54. Browser Preview

Because this is a pure web application, development preview is simple.

Recommended:

```text
npm run dev
```

Then open the local application in Chrome/Edge/Firefox.

For static-only frontend work, a local development server should be used instead of opening HTML files directly with:

```text
file:///
```

This avoids problems with:

- Fetch requests.
- Modules.
- CORS.
- Routing.
- API communication.

---

# 55. Production Architecture

Recommended:

```text
                    INTERNET
                        │
                      HTTPS
                        │
                        ▼
                  ┌──────────┐
                  │  NGINX   │
                  └────┬─────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
    Static Frontend             Node.js API
                                  │
                                  ▼
                             PostgreSQL
                                  │
                                  ▼
                           Object Storage
```

---

# 56. Production Deployment

Recommended production components:

```text
Nginx
Node.js
PostgreSQL
HTTPS
Object Storage
Backup System
Monitoring
```

A production deployment should include:

- Environment variables.
- Database backups.
- SSL/TLS.
- Log rotation.
- Monitoring.
- Health checks.
- Process management.
- Automatic restart.
- Security updates.

---

# 57. Health Check

Recommended API endpoint:

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "status": "healthy"
}
```

The endpoint can also verify required dependencies where appropriate.

---

# 58. Backup Strategy

Database backups should be automated.

Minimum:

```text
Daily database backup
Weekly retained backup
Off-server backup
```

Important files should also be backed up if local file storage is used.

For production, object storage versioning and lifecycle policies should be considered.

---

# 59. Logging

Application logs should record:

```text
Timestamp
Level
Request
User
Route
Response status
Error
Duration
```

Do not log:

```text
Passwords
Authentication tokens
Private secrets
Full payment credentials
Sensitive file contents
```

---

# 60. Testing Strategy

Testing should cover:

## Unit tests

Services and business rules.

## Integration tests

API + database.

## Authorization tests

Admin vs Designer permissions.

## Workflow tests

Status transitions.

## UI tests

Critical user flows.

---

# 61. Critical QA Scenarios

### Client

```text
Create
Edit
Deactivate
Search
View profile
```

### Project

```text
Create
Edit
Search
Filter
Change status
View client relationship
```

### Design Job

```text
Create
Assign
Change price
Change status
Search
Filter
Sort
View profile
```

### Revision

```text
Create
Request
Submit
Accept
Track history
```

### Proof

```text
Upload
Submit
Review
Approve
Reject
Supersede
```

### Payment

```text
Create transaction
View balance
Track status
View history
```

---

# 62. Phase Roadmap

## Phase 1 — Foundation

- Project setup
- Authentication foundation
- Database
- Application layout
- Role system
- Common components

## Phase 2 — Client Management

- Client CRUD
- Client profile
- Client search
- Client status
- Client activity

## Phase 3 — Project Management

- Project CRUD
- Project/client relationship
- Project status
- Priority
- Deadline
- Dashboard statistics

## Phase 4 — Design Job Management

- Design Job CRUD
- Designer assignment
- Manual pricing
- Design types
- Priority
- Status workflow
- Designer workload
- Role restrictions

## Phase 5 — Revision, Proof & Approval

- Revision records
- Revision history
- Proof uploads
- Proof versions
- Approval workflow
- Approval history

## Phase 6 — Payments

- Project payments
- Design job payments
- Advance
- Half paid
- Paid full
- Balance calculation
- Payment history

## Phase 7 — File Management

- File library
- Secure uploads
- Preview
- Downloads
- File versions
- Object storage

## Phase 8 — Notifications

- In-app notifications
- Email notifications
- Revision alerts
- Approval alerts
- Deadline alerts

## Phase 9 — Reports

- Project reports
- Designer workload
- Revenue
- Pending payments
- Completion reports
- Overdue reports

## Phase 10 — Client Portal

Potential future functionality:

```text
Client Login
View Projects
View Proofs
Request Revision
Approve Proof
View Payment Status
Download Final Files
```

---

# 63. Future Features

Possible future additions:

- WhatsApp integration.
- Email notifications.
- Calendar scheduling.
- Client portal.
- Online approval links.
- E-signature.
- Invoice generation.
- Payment gateway integration.
- Advanced analytics.
- Product catalogue.
- Printing calculation.
- Multi-language support.
- Tamil language.
- PWA support.
- Custom domains.
- White-label deployment.
- Multiple companies/branches.
- Multi-tenant architecture.

---

# 64. Multi-Tenant Consideration

If CGDM will eventually be sold to multiple businesses, the database should be designed with tenancy in mind.

Future structure:

```text
organizations
users
clients
projects
design_jobs
...
```

Business records can then be associated with:

```text
organization_id
```

This should be considered before production if SaaS functionality is planned.

---

# 65. API Versioning

For a growing production system, use:

```text
/api/v1/
```

Example:

```text
/api/v1/clients
/api/v1/projects
/api/v1/design-jobs
```

This makes future API changes safer.

---

# 66. Business Rules

The backend should enforce the following core rules.

### Client

```text
Inactive clients cannot normally receive new projects.
```

### Project

```text
Project must belong to an existing client.
Deadline must be valid.
Completed/cancelled projects should restrict new work.
```

### Design Job

```text
Design Job must belong to an existing project.
Assigned designer must be active.
Price cannot be negative.
Deadline must be valid.
Completed/cancelled projects cannot normally receive new jobs.
```

### Designer

```text
Designer can only access authorized jobs.
Designer cannot modify price.
Designer cannot reassign jobs unless authorized.
```

### Revision

```text
Revision belongs to a design job.
Revision history must be preserved.
```

### Proof

```text
Proof belongs to a design job.
Proof versions must remain historically traceable.
```

### Approval

```text
Approval belongs to a proof.
Approval must record decision maker and timestamp.
```

### Payment

```text
Payment belongs to a project and/or design job.
Payment records must remain auditable.
```

---

# 67. Permanent Identifiers

The system should use human-readable IDs.

Examples:

```text
Client:
CLI-000001

Project:
PRJ-000001

Design Job:
DSN-000001

Revision:
REV-000001

Proof:
PRF-000001

Approval:
APR-000001

Payment:
PAY-000001
```

Database numeric primary keys can still be used internally.

Human-readable IDs should be unique and permanent.

---

# 68. Database ID vs Business ID

Example:

```text
id = 127
project_id = PRJ-000127
```

The numeric database ID is internal.

The business ID is used by users and displayed throughout the application.

Never expose internal database assumptions as business identifiers.

---

# 69. Data Ownership

Every important record should identify:

```text
created_by
created_at
updated_at
```

Where required:

```text
updated_by
deleted_by
completed_by
approved_by
```

This supports auditability.

---

# 70. Soft Delete

Where deletion is allowed, consider:

```text
deleted_at
deleted_by
```

Instead of permanently removing the record.

Financial records, approvals and important workflow history should generally not be hard deleted.

---

# 71. Performance

The application should remain responsive with growing data.

Recommended:

- Database indexes.
- Pagination.
- Server-side filtering.
- Server-side sorting.
- Search limits.
- Efficient joins.
- Lazy loading where appropriate.
- Optimized file storage.
- API response limits.

Do not load thousands of records into the browser unnecessarily.

---

# 72. Pagination

Example:

```http
GET /api/design-jobs?page=1&limit=25
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 240,
    "totalPages": 10
  }
}
```

---

# 73. Error Handling

Errors should be categorized.

Examples:

```text
VALIDATION_ERROR
AUTHENTICATION_ERROR
AUTHORIZATION_ERROR
NOT_FOUND
CONFLICT
DATABASE_ERROR
FILE_UPLOAD_ERROR
INTERNAL_ERROR
```

Users should receive useful messages without exposing internal stack traces.

---

# 74. Conflict Handling

Examples:

```text
Client already exists.
Project ID already exists.
Design Job ID already exists.
Designer is inactive.
Project is already completed.
Proof has already been approved.
Payment reference already exists.
```

Return appropriate HTTP status codes.

---

# 75. Git Workflow

Recommended branches:

```text
main
develop
feature/*
fix/*
release/*
```

Example:

```bash
git checkout -b feature/revision-management
```

Commit style:

```text
feat: add design job management
feat: add revision workflow
fix: prevent inactive designer assignment
docs: update deployment guide
refactor: simplify client API service
```

---

# 76. Git Safety

Never commit:

```text
.env
node_modules/
uploads/
database production files
secrets
private keys
logs
temporary build files
```

Example `.gitignore`:

```gitignore
node_modules/
.env
.env.*
!.env.example

uploads/*
!uploads/.gitkeep

logs/
*.log

coverage/
dist/
build/

.DS_Store
Thumbs.db
.vscode/
```

Adjust this according to the final deployment strategy.

---

# 77. Development Principles

The implementation should follow:

### Separation of concerns

```text
UI
↓
Controller
↓
Service
↓
Repository
↓
Database
```

### Do not put business rules inside HTML.

### Do not put SQL directly into frontend JavaScript.

### Do not trust frontend permissions.

### Do not duplicate business logic across pages.

### Do not overwrite historical workflow data.

---

# 78. Frontend Coding Rules

Use modern JavaScript modules.

Example:

```html
<script type="module" src="/assets/js/app.js"></script>
```

Avoid one giant:

```text
app.js
```

Instead use focused modules.

Example:

```text
api.js
auth.js
permissions.js
formatters.js
clients.js
projects.js
design-jobs.js
```

---

# 79. Bootstrap Usage Rules

Bootstrap should provide common UI primitives.

Use Bootstrap for:

```text
Grid
Container
Cards
Tables
Forms
Buttons
Modals
Dropdowns
Alerts
Badges
Navbar
Offcanvas
Pagination
```

Use custom CSS for:

```text
CGDM branding
Special dashboards
Complex workflow components
Business-specific status presentation
Custom animations
Fine visual adjustments
```

Do not override Bootstrap globally without a clear reason.

---

# 80. Browser Compatibility

Target modern versions of:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

The application should use progressive enhancement where practical.

---

# 81. SEO

The main application is authenticated/business software, so SEO is not a major requirement.

For public pages, if introduced later:

- Proper `<title>`.
- Meta description.
- Semantic HTML.
- Open Graph metadata.
- Structured URLs.

---

# 82. Internationalization

The initial language can be:

```text
English
```

Future:

```text
Tamil
```

UI text should ideally be structured so translation can be added later.

Avoid scattering critical business text throughout JavaScript without a way to centralize translations.

---

# 83. Currency

Default currency:

```text
INR
```

Display:

```text
₹1,500.00
```

Store:

```text
1500.00
```

The currency format should be configurable in future multi-country versions.

---

# 84. Date Formatting

Display dates consistently.

Example:

```text
31 Aug 2026
```

Date/time:

```text
31 Aug 2026, 07:30 PM
```

Internal storage should use a consistent database timestamp format.

---

# 85. Dashboard KPIs

Suggested dashboard KPIs:

```text
Clients
Projects
Design Jobs
Active Jobs
In Review
Revision Required
Approval Pending
Overdue
Completed
Revenue
Pending Payment
```

Managers should be able to identify bottlenecks quickly.

---

# 86. Workflow Bottleneck Reporting

Future reports should identify:

```text
Jobs waiting for designer
Jobs waiting for review
Jobs waiting for revision
Jobs waiting for client approval
Jobs overdue
Jobs pending payment
```

This is more useful than only displaying raw totals.

---

# 87. Notification Workflow

Example:

```text
Designer submits proof
        ↓
System creates notification
        ↓
Manager receives notification
        ↓
Manager reviews proof
        ↓
Approval / Revision
        ↓
Designer receives notification
```

---

# 88. Client Approval Workflow

Future client portal:

```text
Client receives secure approval link
              ↓
Views proof
              ↓
Approves OR requests revision
              ↓
Server records decision
              ↓
Design Job updated
              ↓
Activity log created
```

Approval links should use secure, expiring tokens.

---

# 89. File Versioning

A design job may have:

```text
Original
Revision 1
Proof 1
Revision 2
Proof 2
Final
```

Files should not be silently overwritten.

Recommended metadata:

```text
version
parent_file_id
uploaded_by
uploaded_at
status
```

---

# 90. Final Artwork

When a proof is approved, the system can mark a final artwork version:

```text
FINAL
```

The final artwork should remain accessible even when later administrative records are changed.

---

# 91. Reporting

Reports should support filtering by:

```text
Date range
Client
Project
Designer
Design type
Status
Payment status
```

Possible reports:

```text
Project Completion
Designer Productivity
Design Job Revenue
Pending Payments
Overdue Jobs
Revision Frequency
Approval Time
Client Activity
```

---

# 92. Revision Analytics

Useful metrics:

```text
Average revisions per job
Jobs with most revisions
Designer revision rate
Client revision rate
Average approval time
```

These can help identify workflow problems.

---

# 93. Approval Analytics

Track:

```text
Approval requested
Approval pending
Approval approved
Approval rejected
Average approval time
```

This can expose delays in the client approval process.

---

# 94. Payment Analytics

Track:

```text
Total billed
Total received
Outstanding
Advance received
Partial payments
Fully paid
```

Financial reporting should use transaction records as the source of truth.

---

# 95. Recommended Initial Repository Milestones

After creating the new repository:

```text
01 — Repository foundation
02 — HTML layout
03 — Bootstrap design system
04 — Authentication
05 — Database foundation
06 — Client module
07 — Project module
08 — Design Job module
09 — Revision module
10 — Proof module
11 — Approval module
12 — Payment module
13 — Reports
14 — Security hardening
15 — Production deployment
```

---

# 96. Migration From Existing CGDM

The existing CGDM functionality can be migrated conceptually.

## Existing architecture

```text
React
TypeScript
Vite
Tauri
Rust
SQLite
```

## New architecture

```text
HTML
CSS
JavaScript
Bootstrap
Node.js
Express
PostgreSQL
```

Business logic should be preserved where possible.

The UI and data-access implementation should be rewritten for the web architecture rather than mechanically converting TSX into HTML.

---

# 97. What Should Be Preserved During Migration?

Preserve:

```text
Client relationships
Project relationships
Design Job relationships
Permanent IDs
Status workflows
Priority values
Design types
Designer restrictions
Manual pricing
Revision history
Proof history
Approval history
Payment history
Audit requirements
```

Rewrite:

```text
React components
React state
TSX
Tauri commands
Rust database bridge
SQLite-specific access
```

---

# 98. Migration Principle

The migration should follow:

```text
BUSINESS LOGIC
     │
     │ preserve
     ▼
NEW WEB ARCHITECTURE
```

not:

```text
OLD SOURCE CODE
     │
     │ blindly convert
     ▼
NEW SOURCE CODE
```

This prevents old framework-specific assumptions from entering the new application.

---

# 99. Definition of Done

A module is complete only when:

```text
Database
    ✓

Repository
    ✓

Service
    ✓

API
    ✓

Validation
    ✓

Authorization
    ✓

HTML UI
    ✓

JavaScript controller
    ✓

Bootstrap styling
    ✓

Loading state
    ✓

Empty state
    ✓

Error state
    ✓

Success feedback
    ✓

Search
    ✓

Filtering
    ✓

Sorting
    ✓

Responsive behavior
    ✓

Audit logging
    ✓

Tests
    ✓
```

---

# 100. Production Checklist

Before production:

```text
[ ] HTTPS enabled
[ ] Database backups enabled
[ ] Environment variables configured
[ ] Secrets removed from repository
[ ] Authentication tested
[ ] Authorization tested
[ ] SQL injection tests completed
[ ] File upload security tested
[ ] Rate limiting enabled
[ ] Error handling verified
[ ] Activity logs verified
[ ] Database migrations verified
[ ] Responsive UI tested
[ ] Browser testing completed
[ ] Backup restoration tested
[ ] Health endpoint verified
[ ] Production logging enabled
[ ] Monitoring configured
```

---

# 101. Final Architecture

The final target architecture is:

```text
                    CG-DESIGNER MANAGER
                           │
                           ▼
                    ┌──────────────┐
                    │   Browser    │
                    │              │
                    │ HTML5        │
                    │ CSS3         │
                    │ JavaScript   │
                    │ Bootstrap 5  │
                    └──────┬───────┘
                           │
                         HTTPS
                           │
                           ▼
                    ┌──────────────┐
                    │   REST API   │
                    │              │
                    │ Node.js      │
                    │ Express      │
                    │ Auth         │
                    │ Services     │
                    │ Validation   │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌──────────────┐          ┌──────────────┐
       │ PostgreSQL   │          │ File Storage │
       │              │          │              │
       │ Clients      │          │ Designs      │
       │ Projects     │          │ Proofs       │
       │ Jobs         │          │ Revisions    │
       │ Revisions    │          │ Final Files  │
       │ Approvals    │          │              │
       │ Payments     │          └──────────────┘
       │ Users        │
       │ Logs         │
       └──────────────┘
```

---

# 102. Project Vision

CGDM should become a reliable digital operating system for a graphic design and printing business.

The system should answer:

```text
Who is the client?
        ↓
What project are they working on?
        ↓
What design jobs are required?
        ↓
Who is designing them?
        ↓
How much is each design worth?
        ↓
What is the deadline?
        ↓
How many revisions happened?
        ↓
Which proof is current?
        ↓
Has it been approved?
        ↓
Is the work completed?
        ↓
How much has been paid?
        ↓
What is still pending?
```

The objective is not simply to create CRUD screens.

The objective is to create a **complete, traceable, role-controlled design production workflow**.

---

# 103. Current Target

The new pure-web repository should ultimately provide:

```text
✓ Client Management
✓ Project Management
✓ Design Job Management
✓ Designer Management
✓ Designer Workload
✓ Manual Design Pricing
✓ Revision Management
✓ Proof Management
✓ Approval Management
✓ Payment Management
✓ Dashboard
✓ Search
✓ Filters
✓ Sorting
✓ Deadline Tracking
✓ Activity Logs
✓ Role-Based Access
✓ File Management
✓ Responsive UI
✓ REST API
✓ PostgreSQL
✓ Secure Deployment
```

---

# 104. Important Implementation Rule

Do not begin by converting every old React component.

Build the new repository in vertical slices.

Recommended order:

```text
Foundation
   ↓
Authentication
   ↓
Clients
   ↓
Projects
   ↓
Design Jobs
   ↓
Revisions
   ↓
Proofs
   ↓
Approvals
   ↓
Payments
   ↓
Reports
```

Each slice should be fully functional before moving to the next.

---

# 105. Repository Documentation

The repository should maintain:

```text
README.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/API.md
docs/AUTHENTICATION.md
docs/UI-UX.md
docs/DEVELOPMENT.md
docs/DEPLOYMENT.md
```

This prevents project knowledge from being stored only inside source code or developer memory.

---

# 106. License

Choose a license appropriate for the project's ownership and distribution model.

Example:

```text
Copyright © CG-Designer Manager

All rights reserved.
```

Do not publish proprietary business logic under an open-source license without confirming the intended ownership and distribution model.

---

# 107. Final Statement

**CG-Designer Manager — Pure Web Application**

Technology:

```text
HTML5
CSS3
JavaScript ES6+
Bootstrap 5
Node.js
Express.js
PostgreSQL
REST API
Object/File Storage
HTTPS
```

Architecture:

```text
Browser
   ↓
Frontend
   ↓
REST API
   ↓
Business Services
   ↓
Repository
   ↓
PostgreSQL
```

The system is designed to be:

```text
Web-first
Responsive
Maintainable
Secure
Modular
Scalable
Auditable
Business-focused
```

**CGDM is not just a client/project tracker. It is intended to manage the complete graphic design production lifecycle from client request through final approval and payment.**
