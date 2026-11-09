# Wave 1 — Organisation & access: test cases (TAVI Desk go-live, 1 Nov 2026)

Host https://staging-desk.taviportal.com, org Anyware, owner account. Reference: Zoho Desk Enterprise (reference/zoho-desk-inventory.md sections 11 ZO, 12 ZG, 15 ZE) and the live Zoho org techsolutionsegypt.
Built from the screen strings (locales desk.json: organization, departments, holidays, businessHours, userManagement, settings.teams, settings.ticketAccess, mySignatures, profile; iam.json; audit.json) and the live API (wave1/baseline).
Test data prefix `QA GL `. Every created id goes to `after/created.jsonl`; every changed setting is set back at once; final GET diff in `after/diff.txt`.
Lens: UI · API · PERM (permission) · NEG (negative/validation) · I18N (Arabic/RTL) · A11Y · CONC (concurrency/lost update) · AUDIT.

| Id | Row | Screen / API | Steps | Expected (TAVI spec + Zoho behaviour) | Lens | Plane |
|---|---|---|---|---|---|---|
| W1-01 | O-01 | Company page | Open /settings/organization/company | Page loads with name, alias, website, phone, time zone, locale; no raw keys. Zoho: Company page shows name, contact, time zone, language, currency. | UI | |
| W1-02 | O-01 | GET /iam/tenant/company-profile | Read | 200, name "Anyware", time zone set | API | |
| W1-03 | O-01 | PUT company-profile | Set website to "https://qa-gl.example" then back to null | Saved, read back, restored. Name/time zone untouched. | API | |
| W1-04 | O-01 | PUT company-profile | Website "not a url", phone 300 chars | 4xx with field error, nothing saved | NEG | |
| W1-05 | O-01 | Personal time zone/date format | Look for personal time zone/date-format setting | Zoho: per-agent time zone + date/time format in My Information. Gap check: Pass if TAVI has the same setting, Fail (gap) if it does not | UI | NDC-1970 |
| W1-06 | O-02 | Rebranding page | Open /settings/rebranding/company-logo | Logo upload with type/size hint, favicon, link-back URL; current values shown | UI | NDC-1992 |
| W1-07 | O-02 | PUT company-profile/branding | Set logo_linkback_url to QA URL, then back to null | Saved and restored | API | |
| W1-08 | O-03 | Business Hours page | Open list | Default "24 hours · 7 days", time zone Africa/Cairo, holiday list column, actions Edit / Make default / Delete; default cannot be deleted | UI | |
| W1-09 | O-03 | POST business-hours profile | Create "QA GL BH" Mon–Fri 09:00–17:00, Africa/Cairo | 201, listed with summary "Mon–Fri · 09:00–17:00" | API+UI | |
| W1-10 | O-03 | Multi-block day | Create/edit QA GL BH with two blocks on one day (09–13, 14–18) and one block past midnight | Zoho: multi-block per day and overnight block supported (help article "Multi-blocks in Business Hours"). Gap check: Pass if TAVI saves both, Fail (gap) if it refuses either | API | NDC-2266 |
| W1-11 | O-03 | Business hours validation | End before start; empty name; unknown time zone | 4xx with clear message; nothing saved | NEG | |
| W1-12 | O-03 | Default protection | DELETE the default profile (API) | Refused (4xx) with message; default stays | NEG | |
| W1-13 | O-03 | Delete QA GL BH | Delete via API | Deleted; list back to baseline | API | |
| W1-14 | O-04 | Holidays page | Open list, tabs Active/Inactive, banner open/closed now | Banner shows "Always open · 24/7"; lists tert, tretre | UI | |
| W1-15 | O-04 | Holiday list CRUD | Create "QA GL Holidays" (recurring), add holiday 25 Dec, edit it, remove it | Each step 2xx and read back; count updates | API | |
| W1-16 | O-04 | Holiday list associate | Associate QA GL Holidays with QA GL BH | BH shows the list; holiday list shows "Associated" | API | |
| W1-17 | O-04 | Deactivate / activate | Deactivate then activate QA GL Holidays | Moves Inactive ↔ Active; holidays kept ("Its holidays were kept.") | API | |
| W1-18 | O-04 | Holiday validation | Holiday with no date, duplicate date, name 300 chars | 4xx, nothing saved | NEG | |
| W1-19 | O-04 | Delete holiday list | Delete QA GL Holidays | Gone from both tabs | API | |
| W1-20 | O-05 | Departments page | Open list | Columns Name / Help Center Display Name / Type / Created / Status; Default badge on techSupport | UI | |
| W1-21 | O-05 | Create department | POST "QA GL Dept" private, owner as agent | 201; listed; channels auto-created | API+UI | |
| W1-22 | O-05 | Department form settings | PATCH QA GL Dept: cc_enabled off, send_as_email off, scheduled replies on, help center name | Saved and read back | API | |
| W1-23 | O-05 | Department name rules | Duplicate name "techSupport"; empty name; 300 chars | 4xx / unique error | NEG | |
| W1-24 | O-05 | Default cannot be disabled | POST /desk/departments/{default}/disable | Refused "The default department cannot be disabled." | NEG | |
| W1-25 | O-05 | Disable / enable | Disable QA GL Dept (no tickets), then enable | Inactive then active; Zoho: disable asks where to move agents/tickets | API | |
| W1-26 | O-05 | Delete department | Soft delete QA GL Dept | Removed from list (or Recycle Bin) | API | |
| W1-27 | O-05 | Lost update | Two PATCHes on QA GL Dept from stale reads | Second stale write refused (409) ; if the stale write silently wins, that is a bug | CONC | |
| W1-28 | A-01 | Agents page | Open /settings/users-control/agents | Lists active + invited agents, filters, status, profile, departments | UI | |
| W1-29 | A-01 | Invite agent | POST /iam/users/invite mmohamed@anyware.software, Desk Agent profile, then PUT departments = QA WF Dept R | 2xx; listed as Invited with expiry; department set | API | |
| W1-30 | A-01 | Duplicate invite | Invite the same address again | Refused or idempotent, never two users | NEG | |
| W1-31 | A-01 | Invalid invite | Bad email; unknown profile id | 4xx | NEG | |
| W1-32 | A-01 | Resend invitation | POST resend | 2xx, expiry refreshed | API | |
| W1-33 | A-01 | Agent view (needs accepted invite) | Sign in as the agent; check menus, department scope, no settings access | Agent sees only Desk work in QA WF Dept R; settings hidden / 403 | PERM | NDC-2736 |
| W1-34 | A-02 | Roles page | Open roles; Desk tree CEO › Manager › Agent | Tree shown, add/rename/delete actions | UI | |
| W1-35 | A-02 | Role CRUD | Create "QA GL Role" under Agent, rename, delete | 2xx each; tree back to baseline | API | |
| W1-36 | A-02 | Role delete with users | Try deleting role Agent (has users) via API | Refused with message (Zoho: must move users first) | NEG | |
| W1-37 | A-03 | Profiles page | Open profiles; Desk profiles Administrator/Agent/Light Agent/Reviewer/Supervisor | Listed, system ones marked, Clone available | UI | |
| W1-38 | A-03 | Clone profile | Create "QA GL Profile" from Desk Agent (source_profile_id) | 201; effective permissions equal to source | API | NDC-2305 |
| W1-39 | A-03 | Child profile inherits | Create "QA GL Child" with parent QA GL Profile | Child gets parent's permissions | API | NDC-2305 |
| W1-40 | A-03 | Edit permission | Add/remove one Desk permission on QA GL Profile | Saved; effective endpoint reflects it | API | |
| W1-41 | A-03 | Built-in protected | PATCH rename of "Desk Agent" (system) | Refused | NEG | NDC-2702 |
| W1-42 | A-03 | Delete profile | Delete QA GL Child, QA GL Profile | Gone | API | |
| W1-43 | A-04 | Teams page | Open /settings/users-control/teams | Lists team "test", colour/icon, department | UI | NDC-1953 |
| W1-44 | A-04 | Team CRUD | Create "QA GL Team" in QA WF Dept R with owner, colour blue icon star; update; delete | 2xx each | API | |
| W1-45 | A-04 | Team validation | Duplicate name in same dept, empty name, unknown member | 4xx | NEG | |
| W1-46 | A-04 | Team workload before delete | GET /desk/teams/{id}/workload | Counts returned (0) | API | |
| W1-47 | A-04 | Team Queue tab | Open Team Queue | Team listed for its members | UI | |
| W1-48 | A-05 | Data Sharing page | Open /settings/users-control/data-sharing | Per-module default access shown (Private / Public Read Only / Public R/W/D) | UI | |
| W1-49 | A-06 | Ticket Access page | Open; sections data sharing, public scope, peers, status types, help center names | All sections load; no raw keys | UI | |
| W1-50 | A-06 | Ticket access settings API | GET /desk/ticket-access/settings, PUT same body back | 200; unchanged | API | |
| W1-51 | A-06 | Status types rule | PUT ticket-statuses with no Open type | Refused "Keep at least one status of type Open." | NEG | |
| W1-52 | A-06 | Shared ticket read-only edit | (retest) dept with read-only share edits ticket | Must be refused | PERM | NDC-2303 (In Progress — skip) |
| W1-53 | A-07 | Field permissions | GET field permissions for tickets module | Returned per profile | API | NDC-2387 (In Progress — skip edit) |
| W1-54 | A-08 | Sign-in security | Look for SSO/SAML, 2FA, IP allow list, password policy | Zoho: SAML, 2FA, IP restrictions (Zoho Directory). Gap check: Pass if TAVI has these, Fail (gap) if it does not | UI | NDC-1977 |
| W1-55 | A-09 | Audit log page | Open; filters actor/action/entity/date; export | Loads; our QA GL changes appear with actor | UI+AUDIT | |
| W1-56 | A-09 | Audit of our writes | GET /audit/events after W1 writes | Department, team, profile, role, holiday, BH changes are logged | AUDIT | NDC-2511 |
| W1-57 | Q-04 | My profile | Open profile menu → My profile / /settings/my-profile | Personal info, photo, language, time zone | UI | NDC-1970 |
| W1-58 | Q-04 | My signatures | Open signatures page; create "QA GL Sig", edit, delete | Saved per department; deleted | UI+API | |
| W1-59 | all | Arabic / RTL | Switch to AR, open Departments, Business Hours, Holidays, Teams, Ticket Access | Text Arabic, layout RTL, no raw keys or cut text | I18N | |
| W1-60 | all | Keyboard / labels | Tab through Departments form and Holidays dialog | Visible focus, labelled controls | A11Y | |
| W1-61 | all | API without token | GET /desk/departments without auth | 401 | PERM | |
| W1-62 | all | Settings hub links | Each Wave 1 hub link opens its page (no redirect to /hq) | All open | UI | |
