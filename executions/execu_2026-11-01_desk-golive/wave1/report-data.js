module.exports = {
 "title": "Desk Go-Live Wave 1",
 "heading": "TAVI Desk go-live: Wave 1, organisation and access",
 "meta": "First run 1–2 Nov 2026 on Anyware-Staging (owner, UI + API). The open cases were rerun on 2 Nov on NDC-Staging (Wonder Travel tenant) with an owner, a Desk Agent and a Desk Supervisor; Anyware-Staging is now paused. Compared with Zoho Desk Enterprise (help centre + live trial org techsolutionsegypt). Covers inventory rows O-01..O-05, A-01..A-09 and Q-04. Wave 1 is closed: 4 bugs filed (NDC-2776..2779), NDC-2303 and NDC-2387 moved to Done.",
 "decisions": [
  "**Filed 2 Nov (user approved):** NDC-2776 (W1-B1, Low), NDC-2777 (W1-B2, Medium), NDC-2778 (W1-B3, Medium), NDC-2779 (W1-B4, Low) — state Bug, MahmoudMohamed + mfathy + Hegazy + eahmed, module Desk, Sprint 14, annotated TAVI-vs-Zoho image attached to each.",
  "**Moved to Done 2 Nov:** NDC-2303 and NDC-2387, each with a retest comment and an annotated retest image (evidence/annotated/NDC-2303-retest.png, NDC-2387-retest.png).",
  "**Still open:** NDC-2305 passed on Anyware (1 Nov) while In Progress — comment and move it when it reaches Ready For Test.",
  "**Next:** Wave 2 (ticket daily work) on NDC-Staging — see PROGRESS.md."
 ],
 "bugs": [
  {
   "id": "W1-B1",
   "sev": "Low",
   "title": "NDC-2776 · Company profile | A long phone number gives \"An unexpected error occurred\", and the API saves any phone or website",
   "cases": "W1-04",
   "where": "Setup › General › Company › Edit; API `PUT /iam/tenant/company-profile`",
   "steps": [
    "Open Setup › Company and press Edit.",
    "Type a 300-digit number in Phone and press Save.",
    "Edit again, type a 40-digit number in Phone and press Save.",
    "By API, PUT /iam/tenant/company-profile with website \"not a url\"."
   ],
   "expected": "Phone is limited to a sensible length (Zoho Desk: 20 characters) and checked on the server too; the website is checked by the server as it is on screen. No server error.",
   "actual": "300 digits: toast **\"An unexpected error occurred.\"** (HTTP 500 INTERNAL_ERROR), nothing saved. 40 digits: saved. Website: the screen refuses \"not a url\" (\"Enter a valid website URL\", Save disabled), but the API saves it (200). Reproduced on Anyware (API) and NDC-Staging (screen + API); values set back each time.",
   "request": "PUT /iam/tenant/company-profile {…, \"website\": \"not a url\"}  →  200, website saved as \"not a url\"\nPUT /iam/tenant/company-profile {…, \"phone\": \"<40 digits>\"}  →  200\nPUT /iam/tenant/company-profile {…, \"phone\": \"<300 digits>\"}  →  500 {\"code\":\"INTERNAL_ERROR\",\"message\":\"An unexpected error occurred.\"}",
   "zoho": "Checked on the Zoho trial org: the Phone field stops at **20 characters** (maxlength 20) and saves with no error; the Website field has no format check (saved \"http://not a url\", 50 characters max). Both were set back right away.",
   "evidence": "Annotated image below (TAVI left, Zoho right). Raw: `evidence/raw/bugs/W1-B1-*.png`, `zoho-B1-*.png`; API output `wave1/raw/w1-a.json`, `w1-l.json`, `ndc/raw/n-e3.json`.",
   "images": [
    "evidence/annotated/W1-B1-vs-zoho.png"
   ]
  },
  {
   "id": "W1-B2",
   "sev": "Medium",
   "title": "NDC-2777 · Departments | Saving a department from an older copy of the page silently undoes another admin's change",
   "cases": "W1-27",
   "where": "Setup › General › Departments › edit department; API `PATCH /desk/departments/{id}`",
   "steps": [
    "Open the same department (Setup › Departments) in two tabs, A and B.",
    "In tab A untick \"Allow copied addresses (CC) on tickets\" and press Save.",
    "In tab B (still showing CC ticked) type a \"Display Name in Help Center\" and press Save.",
    "Reload the department."
   ],
   "expected": "Tab B is told the department changed since it was opened (\"Reload to see the latest\") and nothing is overwritten. The same protection is asked for on modules and layouts in NDC-2238 / NDC-2241.",
   "actual": "Tab B saves without any message and **CC is back on**; tab A's change is lost. The department has no version check (GET has no version field, PATCH takes no If-Match). Reproduced 3 times: twice by API on Anyware, once on screen on NDC-Staging.",
   "request": "PATCH /desk/departments/<qa dept> {… \"cc_enabled\": false}  →  200 (tab A)\nPATCH /desk/departments/<qa dept> {… \"cc_enabled\": true, \"description\": \"QA GL changed in tab B\"}  →  200 (tab B, stale)\nGET  /desk/departments/<qa dept>  →  cc_enabled: true, description: \"QA GL changed in tab B\"",
   "zoho": "Not checked: in the Zoho trial org the department edit form does not save (\"Unable to process your request\"), so the two-tab test could not run. Nothing was changed in Zoho.",
   "evidence": "Annotated image below. Raw screens `evidence/raw/bugs/W1-B2-1..5-*.png`, API output `wave1/raw/w1-c2.json`, `w1-k.json`, `ndc/raw/n-b2.json`.",
   "images": [
    "evidence/annotated/W1-B2-vs-zoho.png"
   ]
  },
  {
   "id": "W1-B3",
   "sev": "Medium",
   "title": "NDC-2778 · Agents | Inviting an email that already belongs to an active user creates a second, pending user for the same email",
   "cases": "W1-30 (NDC rerun)",
   "where": "Setup › User Management › Agents › Invite user; API `POST /iam/users/invite`",
   "steps": [
    "Pick a user who is active but has no Desk profile (mmohamed@anyware.software, CRM Admin).",
    "Invite that email as Desk Agent.",
    "Open All Agents and search for the email; look at GET /iam/users."
   ],
   "expected": "The existing user gets the Desk profile, or the invite is refused (\"already a user\"). One email = one user.",
   "actual": "Accepted with no warning. Agents shows a new **Pending · Desk Agent · Invited** row; /iam/users has **two rows** for the email (Invited / Desk Agent with empty user id, and the active CRM Admin). The test invitation was cancelled.",
   "request": "POST /iam/users/invite {email: mmohamed@anyware.software, profile: Desk Agent}  →  200\nGET /iam/users  →  [Invited · Desk Agent · userId 00000000…], [active · CRM Admin · 7e5e7c27…]",
   "zoho": "The New Agent form takes an existing agent's email with no message while typing; Zoho checks only on Save, which was not pressed — final behaviour not checked.",
   "evidence": "Annotated image below. Raw: `evidence/raw/bugs/W1-B3-2-agents-invited-row.png`, `W1-B3-3-api-two-rows.png`, `zoho-B3-3-existing-email-typed.png`; API output `ndc/raw/n-f1.json`.",
   "images": [
    "evidence/annotated/W1-B3-vs-zoho.png"
   ]
  },
  {
   "id": "W1-B4",
   "sev": "Low",
   "title": "NDC-2779 · Audit Log | Saving the company profile logs \"time zone from blank value to UTC\" although the time zone was not changed",
   "cases": "W1-04 audit note (NDC rerun)",
   "where": "Setup › Audit Log; Setup › Company; API `GET /iam/tenant/company-profile`",
   "steps": [
    "Setup › Company › Edit, change only Website or Phone, Save.",
    "Open Setup › Audit Log.",
    "Open Setup › Company and read Time zone."
   ],
   "expected": "Only the changed fields are logged; no time zone entry when the time zone was not touched.",
   "actual": "Audit Log: \"updated Wonder Travel's **time zone from blank value to UTC**\" next to each website save; the Company page still shows **Africa/Cairo**. The API read the same unchanged record once as UTC (version 0) and then as Africa/Cairo (version 1).",
   "request": "GET /iam/tenant/company-profile (×3, nothing saved)  →  UTC/v0, Africa/Cairo/v1, Africa/Cairo/v1 — same updated_at",
   "zoho": "Zoho's Audit Log has no entry for the company edits made the same day, so a time zone entry cannot be compared.",
   "evidence": "Annotated image below. Raw: `evidence/raw/bugs/W1-B4-1-audit-list.png`, `W1-B4-3-company-page.png`, `zoho-B4-1-audit.png`; API `ndc/raw/n-f2.json`, `n-f4.json`.",
   "images": [
    "evidence/annotated/W1-B4-vs-zoho.png"
   ]
  }
 ],
 "gaps": [
  "**Overnight business hours (new):** a time block that runs past midnight is refused with \"slots cannot cross midnight\". Two blocks in one day work (Mon 09–13 + 14–18 saved). Zoho allows overnight blocks (help: \"Multi-blocks in Business Hours\"). Added to the gap ticket draft as item 4.",
  "**Personal time zone and date format:** still missing. My Profile › Account information has name, alias, date of birth, contact and address only. Already filed: NDC-1970.",
  "**Agent sign-in security:** still missing. No page for SSO/SAML, two-factor, an IP allow list or a password policy. Already filed: NDC-1977."
 ],
 "tickets": [
  "**NDC-2303 → Done (2 Nov):** a Tech-only Desk Supervisor is refused (403) at Read only and Restricted, priority unchanged; Full access allowed. Comment + image posted.",
  "**NDC-2387 → Done (2 Nov):** hidden and read-only on a required field are both refused (422) with clear messages; nothing stored. Comment + image posted.",
  "**NDC-2305 passes** (Anyware run, 1 Nov). Not moved, no comment (was In Progress).",
  "Still In Progress, not retested: NDC-2736, NDC-2733.",
  "Seen in passing: the Anyware invite refusal returns the raw key `iam.subscription.seat_limit_reached` (like CRM NDC-2658)."
 ],
 "inconclusive": [
  "None left open. Every case that was inconclusive or not run on Anyware was rerun on NDC-Staging (table above), and all passed."
 ],
 "shots": [
  {
   "file": "evidence/raw/wave1/W1-05-account-info.png",
   "alt": "My Profile account information without time zone",
   "caption": "**W1-05:** My Profile › Account information. No personal time zone or date format (NDC-1970)."
  }
 ],
 "cleanup": [
  "Created with the prefix \"QA GL \" and deleted at the end: 1 business-hours profile, 1 holiday list, 2 departments (now in the Recycle Bin), 1 team, 1 role, 2 profiles. Ledger: `wave1/after/created.jsonl`.",
  "Company website, phone, access URL and logo link were set back to their starting values.",
  "Final check `wave1/after/diff.txt`: company, branding, business hours, shifts, holidays, departments, teams, users, roles and ticket access are the same as the start. Profiles differ only in list order.",
  "No invite exists, so there is nothing to remove for mmohamed@anyware.software.",
  "Staging signed the owner out once; the lane signed in again once.",
  "NDC-Staging: created and deleted QA GL N department, QA GL N role, QA GL N RT module (with its field), one QA ticket (shared, then unshared and deleted), the QA ticket status, the owner signature, and two invitations (both cancelled). Ledger `ndc/after/created.jsonl`; final diff `ndc/after/diff.txt`: company, departments, teams, business hours, holidays, statuses, modules, profiles and signatures unchanged.",
  "NDC-Staging differences not made by this run: CRM roles/profiles of six users and CRM org units \"Team 1/2/3\" changed around 09:45 by \"test user 1\" and \"test user 2\" (another session). Not touched.",
  "Zoho trial org: company website and phone were changed for the W1-B1 check and set back at once (phone 1099130163, website empty). Department \"Marketing\" unchanged.",
  "Close-out (2 Nov): for W1-B3 evidence the invite to mmohamed@anyware.software was sent once more and cancelled (only the active CRM Admin user remains); for NDC-2387 evidence a QA module \"QA GL N FP\" was created and deleted (204). No setting changed."
 ],
 "gapTicket": null,
 "rerun": {
  "file": "../ndc/results.md",
  "title": "Rerun on NDC-Staging (2 Nov)",
  "meta": "Open Wave 1 cases rerun on NDC-Staging with owner ndc-staging-owner@, agent fedelav803@ (Desk Agent) and supervisor pacox68754@ (Desk Supervisor). Anyware-Staging was not touched.",
  "cases": {
   "W1-12": [
    "W1-12",
    "O-03",
    "DELETE default business hours (API)",
    "DELETE /iam/tenant/business-hours/profiles/{default}",
    "Refused with a message; default stays",
    "NEG",
    ""
   ],
   "W1-20": [
    "W1-20",
    "O-05",
    "Departments list",
    "Open the list, look at badge and columns",
    "\"Default\" badge on the default department; Zoho list: name, Help Center display name, visibility, state, created by, created time",
    "UI",
    ""
   ],
   "W1-22": [
    "W1-22",
    "O-05",
    "Department \"Display in Help Center\"",
    "Tick the switch on QA GL N Dept in the form, Save, GET; untick, Save",
    "Visibility becomes public then private; Zoho: same switch on the department edit form",
    "UI",
    ""
   ],
   "W1-29": [
    "W1-29",
    "A-01",
    "Invite agent",
    "Invite mahmoud.mmohamedsamy+qagln@gmail.com as Desk Agent",
    "2xx; listed as Invited with expiry",
    "API",
    ""
   ],
   "W1-30": [
    "W1-30",
    "A-01",
    "Duplicate invite",
    "Invite the same address again; invite mmohamed@anyware.software (already an active user)",
    "Refused or idempotent — never a second user for one email",
    "NEG",
    ""
   ],
   "W1-32": [
    "W1-32",
    "A-01",
    "Resend / cancel invitation",
    "Resend, then cancel",
    "Expiry refreshed; invitation removed",
    "API",
    ""
   ],
   "W1-33": [
    "W1-33",
    "A-01",
    "Agent view",
    "Sign in as a Desk Agent; try admin writes (department, profiles, invite, business hours, holiday list, team, branding) by API; open admin settings pages",
    "Admin writes refused (403); admin-only pages do not let the agent change anything",
    "PERM",
    ""
   ],
   "W1-36": [
    "W1-36",
    "A-02",
    "Delete a role in use",
    "Create QA GL N Role, move the agent into it, delete the role, move the agent back",
    "Delete refused while the role has users",
    "NEG",
    ""
   ],
   "W1-41": [
    "W1-41",
    "A-03",
    "Rename built-in profile",
    "PATCH \"Desk Agent\" → \"Desk Agent QA\" (and back if it worked)",
    "Refused, built-in profiles keep their name (CRM equivalent bug NDC-2543)",
    "NEG",
    "NDC-2543 (CRM)"
   ],
   "W1-51": [
    "W1-51",
    "A-06",
    "Ticket statuses",
    "Add status \"QA GL N status\" (open), check it is offered for tickets, add it again as another type, remove it",
    "Added and offered; duplicate refused; removed",
    "API",
    ""
   ],
   "W1-58": [
    "W1-58",
    "Q-04",
    "My signatures",
    "Create, edit and delete the owner's all-departments signature",
    "Each step saved and read back; list shows it",
    "API+UI",
    ""
   ],
   "W1-52": [
    "W1-52",
    "A-06",
    "NDC-2303 retest",
    "Share a Customer Support QA ticket with Tech at Read only, Restricted, Full; a Tech-only Desk Supervisor PATCHes priority",
    "Read only / Restricted refused, priority unchanged; Full allowed",
    "PERM",
    "NDC-2303 (RFT)"
   ],
   "W1-53": [
    "W1-53",
    "A-07",
    "NDC-2387 retest",
    "QA module with a required field; field permission hidden and read_only for Desk Agent",
    "Both refused with a clear message",
    "NEG",
    "NDC-2387 (RFT)"
   ],
   "W1-B1": [
    "W1-B1",
    "O-01",
    "Company profile validation (screen + API)",
    "Website \"not a url\"; phone 300 and 40 digits; on screen and by API",
    "Invalid values refused with a field message; no server error. Zoho: phone limited to 20 characters, website 50",
    "NEG",
    ""
   ],
   "W1-B2": [
    "W1-B2",
    "O-05",
    "Department lost update (two tabs)",
    "Tab A turns CC off and saves; stale tab B changes the Help Center name and saves; reload",
    "Tab B told the department changed, or tab A's change kept",
    "CONC",
    ""
   ]
  }
 }
};
