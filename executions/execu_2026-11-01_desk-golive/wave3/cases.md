# Desk go-live — Wave 3 (rest of automation): cases for Gate 1

Written 13 Nov 2026. NDC-Staging (Wonder Travel), owner + agent C (fedelav803@) for permission rows. Prefix `QA GL W3`. Proposed department: **Marketing** (QA department, as in Wave 5).

**Scope.** Wave 3 rows the Desk automation-order session does NOT cover: U-08 support plans (screen side), U-13 custom actions, U-15 AI tagging, U-16 auto-close / time-based ticket rules, and a recheck of the two missing ones (U-10 Supervisor rules, U-11 Schedules).
**Left to the automation-order session (not run here):** U-01 assignment, U-02 round robin, U-03 skills, U-04/U-05/U-06 workflow rules + actions + triggers, U-07 SLA, U-09 blueprints, U-12 notifications, macros, and the E2E journeys.
**Reused from that session, not repeated:** SL-38 plan allowance used up (NDC-2833), SL-60 plan from another department (NDC-2841), SL-40 contract notice (pass), P22 "Run Custom Action" from a workflow rule (pass), E2E-2 blueprint state auto-close (pass).

**Probe 13 Nov (read only, wave3/raw/probe*.json, shots evidence/raw/w3/):** Support Plans page per department (Active / Discontinued, Customer Support has 0 plans). AI Tagging page says "Auto-tagging is off in your AI policy". Ticket Archiving page (/settings/tickets/archiving) holds auto-archive, spam auto-delete, contact auto-spam and parent/child close rules. Custom Actions (/settings/developer/custom-actions) has tabs Actions / Variables / API sources and **the real NDC booking actions** (Book and hold, Book and pay, Confirm price…) on the NDC channel API. /settings/automation/supervisor-rules and /schedules redirect to /hq; neither is in the Setup menu.

| ID | Row | Area | Steps | Expected | Type |
|---|---|---|---|---|---|
| **A. Support plans and contracts (U-08)** |||||
| W3-01 | U-08 | Plans page | Open Support Plans for Marketing; switch Active / Discontinued; switch department | Lists per department, empty state, no errors | UI |
| W3-02 | U-08 | Unlimited plan | New Plan "QA GL W3 Unlimited" linked to a QA SLA policy in Marketing | Saved, shown in Active | UI+API |
| W3-03 | U-08 | Allowance plan | New Plan "QA GL W3 Allowance" with 2 tickets per month | Saved with allowance and cycle | UI+API |
| W3-04 | U-08 | Plan validation | No name; no SLA; allowance 0 / -1 / 100000; duplicate name; 300-character name | Clear messages, nothing saved | NEG |
| W3-05 | U-08 | Contract with plan | Contract for a QA account with the allowance plan (Wave 5 W5-16 was blocked here) | Contract shows the plan; account and its tickets show the contract | UI+API |
| W3-06 | U-08 | Entitlement on ticket | Ticket from the contract's contact in Marketing | Ticket gets the plan's SLA, and it shows on the ticket | RUN |
| W3-07 | U-08 | Edit plan | Change the plan's SLA and allowance | Saved; existing contract shows the new values | UI |
| W3-08 | U-08 | Discontinue plan | Discontinue the plan, then open New Contract | Plan moves to Discontinued; can't be picked for a new contract; the existing contract keeps it | UI |
| W3-08b | U-08 | Discontinued plan via API | POST a contract with the discontinued plan through the API | Refused, as on screen | NEG/API |
| W3-09 | U-08 | Delete plan in use | Delete a plan linked to a contract | Refused or clear warning | NEG |
| W3-10 | U-08 | Expired / future contract | Contract ended yesterday; contract starting next month; ticket from its contact | Plan SLA not applied | RUN |
| **B. Custom actions (U-13)** — the real NDC actions are never run |||||
| W3-11 | U-13 | Page and tabs | Open Actions, Variables, API sources; read the existing NDC actions only | All tabs load; "Available in", "Depends on", "Access", "AI" and "Status" shown | UI |
| W3-12 | U-13 | API source | New API source "QA GL W3 source" pointing to webhook.site, with no auth and then header auth | Saved; secret masked after save | UI+API |
| W3-13 | U-13 | New action | Action "QA GL W3 echo" (POST, one path parameter, 2 runtime fields), available in Desk | Saved, Active | UI |
| W3-14 | U-13 | Run from a ticket | Find and run the action from a ticket and from a conversation (Wave 5 couldn't find where it shows on tickets) | Action offered on the ticket; asks for the runtime fields; webhook.site gets the call | RUN |
| W3-14b | U-13 | Run from a conversation | Conversation entry menu on the ticket | Custom actions offered there too | UI |
| W3-15 | U-13 | Run result / errors | Endpoint returns 200, 404, 500 and a slow reply (timeout) | Success shown; errors shown in plain words; nothing stuck | NEG |
| W3-16 | U-13 | Variables | Variable "QA GL W3 var" (plain + secret) used in the action | Value sent; secret never shown in the UI or the run log | SEC |
| W3-17 | U-13 | Depends on | Second action that depends on the first (like "NDC login") | Runs the first, passes its result, then runs | RUN |
| W3-18 | U-13 | Access | Limit the action to one profile; agent C opens the ticket | C doesn't see it or can't run it | PERM |
| W3-19 | U-13 | Validation / safety | Invalid URL, no method, duplicate name, plain http, localhost / 169.254.169.254 / 10.x address | Refused with a message (private addresses blocked) | NEG/SEC |
| W3-20 | U-13 | Disable / delete | Disable, then delete, an action used by a QA workflow rule | Disabled not offered; delete warns about the rule | UI |
| W3-21 | U-13 | AI switch | Read what the "AI" On/Off column does (tooltip / help) on our action only | Documented on screen; note only | UI |
| **C. AI tagging (U-15)** |||||
| W3-22 | U-15 | Page while policy off | Open AI Tagging with the AI policy off | Banner explains; switch disabled or save refused clearly | UI |
| W3-23 | U-15 | Settings validation | Max tags 0 / 6; confidence 0 / 101 | Kept in range 1–5 and 0–100 | NEG |
| W3-24 | U-15 | Runtime (**needs your OK: AI policy is tenant-wide**) | Turn the AI policy and auto-tagging on for Marketing only; ticket that matches an existing tag; remove the tag; customer reply | Tag added within limits; a removed tag is not added back; reply adds tags; then restore off | RUN |
| **D. Auto-close and time-based rules (U-16)** — Ticket Archiving page settings are tenant-wide, each set back at once |||||
| W3-25 | U-16 | Auto-archive settings | Days 6 / 7 / 1095 / 1096; "Only closed tickets" on and off; save, then restore | Range enforced; saved and restored | NEG |
| W3-26 | U-16 | Auto-archive runtime | Can't age a ticket 7 days in one session; read whether old closed tickets on the tenant are archived (read only) | Recorded; likely inconclusive | RUN |
| W3-27 | U-16 | Un-archive on activity | Archive a QA ticket by hand, then the agent replies (and a portal customer reply) | Ticket comes back to the live views | RUN |
| W3-28 | U-16 | Spam auto-delete settings | Days 6 / 7 / 365 / 366; save, then restore | Range enforced | NEG |
| W3-29 | U-16 | Contact auto-spam | Set the threshold to 2; mark 2 QA tickets from one QA contact as spam | Contact's address blocked; then restore setting, unblock | RUN |
| W3-30 | U-16 | Parent closed, children open | Each of the 3 "parent closed" options with a QA parent + 2 children | Leave open / close all / refuse, as the option says | RUN |
| W3-31 | U-16 | Child reopen, last child closed | Reopen a child of a closed parent; close the last open child with "close parent" on | Parent reopens; parent closes on its own | RUN |
| W3-32 | U-16 | General auto-close | Look for a rule like "close tickets with no customer reply for N days" (Zoho does this with Supervisor rules) | Missing (time-based workflow actions are the only option); confirm | UI |
| **E. Missing rechecks** |||||
| W3-33 | U-10 | Supervisor rules | Setup menu, search, route | Still missing (NDC-2760) | UI |
| W3-34 | U-11 | Schedules | Setup menu, search, route | Still missing (NDC-2760) | UI |
| **F. Cross-cutting** |||||
| W3-35 | all | Agent C | C opens Support Plans, Custom Actions, AI Tagging, Ticket Archiving | Allowed or refused per profile; no raw errors | PERM |
| W3-36 | all | Arabic | Same 4 pages in Arabic | RTL, no English leftovers or raw keys | I18N |
| W3-37 | all | Cleanup | Delete all QA GL W3 data by exact id; purge; diff the settings against the baseline | Zero QA GL W3 data; settings equal the baseline | — |

Zoho: checked live (read only) only for rows that fail; the Zoho trial Setup pages often don't load, so those comparisons may stay "not checked live".
