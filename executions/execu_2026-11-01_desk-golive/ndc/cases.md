# Wave 1 — open cases rerun on NDC-Staging (2 Nov 2026)

Tenant NDC-Staging ("Wonder Travel"), staging-desk.taviportal.com. Owner ndc-staging-owner@; agent fedelav803@ (Desk Agent, Customer Support only); supervisor pacox68754@ (Desk Supervisor, Tech only). Anyware-Staging is paused (not touched). Test data prefix `QA GL N `. Same ids as wave1/cases.md.

| Id | Row | Screen / API | Steps | Expected (TAVI spec + Zoho behaviour) | Lens | Plane |
|---|---|---|---|---|---|---|
| W1-12 | O-03 | DELETE default business hours (API) | DELETE /iam/tenant/business-hours/profiles/{default} | Refused with a message; default stays | NEG | |
| W1-20 | O-05 | Departments list | Open the list, look at badge and columns | "Default" badge on the default department; Zoho list: name, Help Center display name, visibility, state, created by, created time | UI | |
| W1-22 | O-05 | Department "Display in Help Center" | Tick the switch on QA GL N Dept in the form, Save, GET; untick, Save | Visibility becomes public then private; Zoho: same switch on the department edit form | UI | |
| W1-29 | A-01 | Invite agent | Invite mahmoud.mmohamedsamy+qagln@gmail.com as Desk Agent | 2xx; listed as Invited with expiry | API | |
| W1-30 | A-01 | Duplicate invite | Invite the same address again; invite mmohamed@anyware.software (already an active user) | Refused or idempotent — never a second user for one email | NEG | |
| W1-32 | A-01 | Resend / cancel invitation | Resend, then cancel | Expiry refreshed; invitation removed | API | |
| W1-33 | A-01 | Agent view | Sign in as a Desk Agent; try admin writes (department, profiles, invite, business hours, holiday list, team, branding) by API; open admin settings pages | Admin writes refused (403); admin-only pages do not let the agent change anything | PERM | |
| W1-36 | A-02 | Delete a role in use | Create QA GL N Role, move the agent into it, delete the role, move the agent back | Delete refused while the role has users | NEG | |
| W1-41 | A-03 | Rename built-in profile | PATCH "Desk Agent" → "Desk Agent QA" (and back if it worked) | Refused, built-in profiles keep their name (CRM equivalent bug NDC-2543) | NEG | NDC-2543 (CRM) |
| W1-51 | A-06 | Ticket statuses | Add status "QA GL N status" (open), check it is offered for tickets, add it again as another type, remove it | Added and offered; duplicate refused; removed | API | |
| W1-58 | Q-04 | My signatures | Create, edit and delete the owner's all-departments signature | Each step saved and read back; list shows it | API+UI | |
| W1-52 | A-06 | NDC-2303 retest | Share a Customer Support QA ticket with Tech at Read only, Restricted, Full; a Tech-only Desk Supervisor PATCHes priority | Read only / Restricted refused, priority unchanged; Full allowed | PERM | NDC-2303 (RFT) |
| W1-53 | A-07 | NDC-2387 retest | QA module with a required field; field permission hidden and read_only for Desk Agent | Both refused with a clear message | NEG | NDC-2387 (RFT) |
| W1-B1 | O-01 | Company profile validation (screen + API) | Website "not a url"; phone 300 and 40 digits; on screen and by API | Invalid values refused with a field message; no server error. Zoho: phone limited to 20 characters, website 50 | NEG | |
| W1-B2 | O-05 | Department lost update (two tabs) | Tab A turns CC off and saves; stale tab B changes the Help Center name and saves; reload | Tab B told the department changed, or tab A's change kept | CONC | |
