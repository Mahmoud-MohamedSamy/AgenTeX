# CRM Automation Execution Order: what Zoho CRM has that TAVI CRM is missing

| | |
|---|---|
| App | TAVI CRM, `https://staging-crm.taviportal.com` (build `index-DWsxCNuD.js`) |
| Reference | Zoho CRM, org943261092 (full edition), seen live on 18 Oct 2026, read-only. Zoho help pages are listed in `reference/zoho-docs-inventory.md` |
| Processes | Assignment Rules → Review Process → Workflow Rules + Actions → Approval Process → Blueprint |
| Modules | Leads, Deals, Tasks |
| Evidence | `evidence/NN-…-vs-zoho.png`, one image per group: TAVI on the left, Zoho on the right, numbered boxes, Match table |
| Status | **Draft for your review. Nothing has been filed in Plane.** |

Nothing was saved in TAVI or Zoho. Forms were opened and cancelled. In Zoho, three probe forms named "QA AEO probe not saved" were opened and discarded, and Zoho's lists were checked afterwards.

---

## Already done in TAVI (same as Zoho)

- All five processes exist and can be set up on **Leads, Deals and Tasks**.
- Assignment rules work like Zoho's:
  - They run only for Web Form, API and Import.
  - Entries are ordered and the first match wins.
  - They offer a category or "users matching conditions", an online/shift availability check, a follow-up task, and a fallback (leave unassigned, default user, or a pool).
  - The import wizard offers "Assign owner based on assignment rules".
- Review process matches Zoho on rules (up to 5) with an "Others" fallback, field-level review, rejection reasons, notifications, SLA escalation, resubmit, and blocking deletion while records are held.
- Workflow rules matches Zoho on:
  - triggers Create, Edit, Create or Edit, Delete, Field Changed and Date-Time
  - Recurring / One time
  - instant and scheduled actions
  - Owner Assignment, Webhook, Email, Task, Create Record and Add/Remove Tags
- Approval process matches Zoho on:
  - Execute On (Create, Edit, both)
  - several rules
  - levels with the approver types Users, Role, Groups, Levels, Manager, Record Owner and User Lookup Field
  - per-stage field updates
  - final and rejection actions (Update fields, Email, Webhooks, Functions)
  - record modification (pending, rejected, approved)
  - process admins with takeover, delegate and resubmit
  - the Approval Status guard
- Blueprint matches Zoho on:
  - states and transitions with Before (owners, criteria), During (fields, validations, checklist, message, tags, note, attachment) and After (field update, email, notification, task, meeting, call, webhook)
  - common, automatic and parallel transitions
  - SLA per state
  - versions
- Out of scope until implemented in TAVI CRM: mass include / mass exclude of records (Zoho: Setup → Blueprint → Filters → Include / Exclude). TAVI has only the API (`/mass-include`, `/mass-exclude`) with no CRM screen. Not tested or reported until a screen exists (user, 20 Oct 2026).
- TAVI also has things Zoho does not:
  - Review on Tasks (Zoho has no review on Tasks; confirmed live).
  - Review delegation (Zoho has none).
  - A review "Where records come from" channel picker.
  - Review retention of 30–365 days (Zoho deletes after 3 months).
  - Blueprint version history.

## Missing: execution order and entry points

1. The import option *"Trigger workflow rules"* has a misleading name. It actually controls whether workflow rules, the approval process and the blueprint run on imported records (verified 19 Oct 2026: G-03, G-04, Z1). Rename it to Zoho's *"Trigger automation and process management"*, then retest import with the option on and off. Evidence `01`.
2. Manual approval of imported records (Zoho *"Enable Manual Lead Approval"*) shows *"Coming soon"* in TAVI. Evidence `01`.

## Missing: workflow rules

3. Record Score and Record Notes triggers. TAVI offers only Record Action and Date-Time. A score trigger exists in the code but is not shown. Evidence `02`.
4. Add Meeting, Schedule a Call, Function and Create Connected Record actions. The code has a "Custom Function" action type that is never offered. Evidence `03`.
5. The Assign Owner action cannot use an **assignment rule**. It also lacks "only online users", "email the new owner" and "transfer related records". TAVI offers only Users, Org Units, Profiles and User Fields. In Zoho this is how assignment runs again after a record is created. Evidence `04`.

## Missing: review process

6. Functions on review events (submission, review, rejection, resubmission). TAVI's review actions have notifications and SLA only. The API object has a `webhookUrl` field with no screen. Evidence `05`.
## Missing: approval process

7. For Role or Group approvers, the choice between **Anyone** and **Everyone** (and, for Everyone, sequential or parallel) is missing. TAVI has only an approver type and a value. Evidence `06`.
8. "Call Functions" (after approval or rejection) can be added but *"runs as a no-op in this version"*. Evidence `07`.

## Missing: blueprint

9. After a transition, the Convert (Leads), Custom Actions (functions) and Tags actions are missing. "Create record" exists in the build but is not offered in the After list of the blueprint checked. Evidence `08`.

## Missing: review process (added 19 Oct 2026)

10. Rejection reasons for each review process. TAVI has one list for all review processes (*"Configure Rejection Reasons"* on the Review Process list page, `GET /workflow/review-rejection-reasons`, at most 10 active for the whole org), so changing a reason changes every process. In Zoho the reasons are set inside each process (Actions → *"Configure Reasons For Record Rejection"*) and saved with it. Defaults and "reason required" are the same. Zoho was checked read-only (help pages + the dialog of the existing process); a definitive two-process check would need saving in Zoho. Evidence `09`.

## Missing: workflow scheduled actions (added 20 Oct 2026)

11. Field Update, Assign Owner and Tags as **scheduled** actions. TAVI offers only Webhook, Email, Task, Create Record and Send portal access (TAVI extra). Zoho also offers Field Update, Assign Owner, Tags, Activities (Task, Meeting, Call), Create Connected Record and Function; Meeting, Call, Function and Create Connected Record are already item 4. The API accepts `delaySeconds` on a Field Update but runs it at once (was B-12, withdrawn 20 Oct), so the delay must be honoured once the screen offers it. Screenshots by the user (TAVI staging, Zoho org943261092 read-only). Evidence `10`.

## Missing: workflow conditions (added 22 Oct 2026)

12. Several **conditions in one workflow rule**, each with its own instant and scheduled actions. Zoho: up to 10 conditions per rule, checked in order (first match runs, the rest are skipped; "records not meeting any of the above" from the 2nd condition on); two conditions with the same criteria in one rule are refused (`AMBIGUITY_DURING_PROCESSING`), and the same action twice in one condition is refused (`DUPLICATE_DATA`). TAVI stores one `criteria` and one `actions` list per rule (`GET /workflow/rules/{id}`) and the editor offers no "+ Add another condition". Workaround: separate rules, which all fire (no first-match-wins, no else). Evidence `12`. Added to NDC-2294 on 22 Oct 2026.

## Could not be checked yet (these are tested in the spec, not gaps)

- The real order at run time (R1–R15 in the plan): whether review holds workflow, approval and blueprint, and whether blueprint waits for approval. Only a functional run can show this. Spec groups F–I.
- Lead conversion: whether the new Deal runs its own assignment, workflow, approval and blueprint. Zoho does not document this either, so we will record what each side does. Spec group H.
- Whether the record Timeline lists the processes in the order they ran (Zoho: *"The Timeline will display the order each process was executed"*). Spec group G.
- Web form entry: the web form settings were not opened. Spec G-08 covers it.

## Additional notes

- **Not gaps:**
  - Zoho has no Review on Tasks; TAVI's is an extra.
  - Approval rejection actions match Zoho.
  - Zoho has no "recall" for a pending approval either.
  - Assignment rules don't run on manual UI create in Zoho either.
- **Possible bug to check separately:** signed in as `mmohamed@anyware.software`, workflow rule AEX-01 first showed all four saved actions as *"Unknown action — This saved action no longer exists"*. A later load showed them correctly. Saving during that window could break the rule.
- **Possible bug to check separately:** staging-crm sessions end every 10–15 minutes (both accounts), even in a single browser tab.
- **Shared tenant:** Leads already has active rules that will fire on our test records:
  - assignment rule AEX-01 (Import)
  - approval process "AP" (Full Name contains "AP")
  - 6 active workflow rules, among them AEX-01, RP, temp and two "ZZSWEEP… delete me"
  - active blueprint RVW-008 on the FieldPermissions layout (the API lists no active blueprint on Deals or Tasks)
  
  The spec's guard prefix avoids most of them. Any that still fire will be reported to you before testing.
- **Spec:** `docs/crm-automation-execution-order/spec-crm-automation-execution-order.md`.

## Environment

staging-crm.taviportal.com, Edge 141 (headless), 18 Oct 2026. Accounts: `ndc-staging-owner` (admin) and `mmohamed@anyware.software` (QA Approver, Anyware org), both read-only. Zoho CRM org943261092, read-only.
