# Retest round 6 — ticket spec (47 tickets)

Source: Plane project efce4d84-5876-4015-b472-2efca7ad73f3, read-only pull 26 Oct 2026. QA user id (our own comments) = e1364b0b-d3cd-4167-8261-6194577a480a.
Default environment unless stated: tenant NDC-Staging, staging-crm.taviportal.com, account mahmoud.mahamed1515 (CRM Admin).

---

# URGENT

## NDC-2381 — Audit Log | No audit events are recorded after 20 Oct 21:41 UTC — record changes, metadata changes and sign-ins are missing
uuid: b44450d2-de86-49fc-a80c-a024565037b3 · priority: urgent
**Steps**
1. Create a deal: `POST /api/v1/modules/{Deals}/records` deal_name "QA RT audit probe" → 201.
2. Update it: `PATCH /api/v1/modules/{Deals}/records/{id}` amount = 2 → 200.
3. Wait up to 2 min; read `GET /api/v1/audit/events?app_key=crm` (or Settings › Security Control › Audit Log).
4. Check newest event per source: `?app_key=crm`, `?app_key=metadata-engine`, `?app_key=iam`.
**Expected**
- Every create/update/delete, config change and sign-in appears in the Audit Log within seconds.
**Actual (old)**
- No event for the probe after 2 min (polled every 10 s).
- Newest crm event 20 Oct 21:42 UTC, metadata-engine 21:41, iam login 21:34, despite many changes on 21 Oct.
- Only Recycle Bin restore/purge events still recorded; outbox/consumer looked stopped.
**Environment** NDC-Staging staging-crm.taviportal.com (also Desk, IAM events); mahmoud.mahamed1515 (CRM Admin); observed 21 Oct 11:00–13:40 UTC.
**Developer comments** none
**Previous retests** Previous retest: PASS 25 Oct (Wave 1): lead create/update/delete all in Audit Log within 3 s, owner as actor, update lists changes; crm/iam/metadata recording again (state not moved).

## NDC-2382 — Deals | The record API ignores the pipeline — creates always land on the default pipeline and updates never move a deal
uuid: a28753b1-964a-466a-beeb-d54252161c3d · priority: urgent
**Steps**
1. `GET /api/v1/modules/{Deals}/fields` — look for a pipeline field.
2. Create a deal on layout Standard with pipeline "1" (640e03a4…) as `data[]: {"field":"pipeline","value":{"kind":"string","value":"640e03a4…"}}` (what the UI sends).
3. Repeat with top-level `pipeline_id`, top-level `pipelineId`, and `data[]: {"field":"pipeline_id"}`.
4. Take a deal on pipeline "1" (created by import) and PATCH pipeline = Standard, stage = proposal.
5. Read each record back.
**Expected**
- Pipeline sent on create is stored.
- Change pipeline (record page, list inline edit, Mass Update) moves the deal to the new pipeline + chosen stage.
- Stage validation runs against the new pipeline.
**Actual (old)**
- No pipeline field in field list.
- All four create variants → 201 but stored on Standard (default).
- PATCH pipeline → 200, deal does not move (both directions).
- Stage of chosen pipeline fails: "Stage 'test-02' is not part of the 'Standard' pipeline" (422 in change-pipeline modal and Mass Update).
- Only import (Pipeline column) and pipeline delete-with-transfer set a deal's pipeline.
**Environment** NDC-Staging; Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430, layout Standard fcba0068-d67f-44f5-8412-cdef9c09e16e (same on layout Test); pipelines Standard 5170500c… (default), "1" 640e03a4…; mahmoud.mahamed1515; related NDC-1302/1312/1316/1324.
**Developer comments** none
**Previous retests** none

## NDC-2412 — Hierarchy Preference | Role mode: higher-ranked users can't see lower-ranked users' records
uuid: d445616c-8681-40ba-baa2-d5a9aa4db3c4 · priority: urgent
**Steps**
1. Company Settings → Hierarchy Preference = Role-based.
2. Modules → Leads → permissions: Record visibility = Hierarchy.
3. Two users WITHOUT "view all records": A = Supervisor (rank 300) in org unit Sales; B = User (rank 100) in Sales. (CRM Admin, Owner, "test", Desk Administrator have view-all — unusable.)
4. B creates a lead (or admin creates with Lead Owner = B).
5. Sign in as A, open B's lead (`GET /api/v1/modules/{leads}/records/{id}`).
6. Repeat with A = Manager (rank 500, parent of User), and A in another dept (HR).
**Expected**
- A sees B's leads (tab: "Visibility follows the profile rank hierarchy"; hint: "Users see their own records and those of lower-ranked users in their department"). Zoho: superior roles see subordinate roles' records.
**Actual (old)**
- 403 "Record not found / Permission denied." in every case; A still opens own lead (200); B can't see A's lead (correct).
**Environment** NDC-Staging, API + web, 21 Oct; users valafo4080 (temporarily Supervisor/Manager, reset to "test") and nameb56175 (User, Sales). Automation crmhierarchy tests I3, I3b, I4 (VisibilityTest). Gaps NDC-2417; sibling NDC-2413.
**Developer comments** none
**Previous retests** Previous retest: FAIL 25 Oct (Wave 1): Supervisor/Manager same dept and Manager other dept still can't see User's leads; controls pass.

## NDC-2413 — Hierarchy Preference | Reporting mode: a manager can't see their direct report's records
uuid: 0e25b024-fae8-4940-9a16-d2bbe8ccd142 · priority: urgent
**Steps**
1. Company Settings → Hierarchy Preference → Reporting-based → Switch mode.
2. Leads record visibility = Hierarchy.
3. Settings → Users → user B (profile User) → Reporting manager = user A → Save (users without view-all).
4. B creates a lead.
5. As A: `GET /api/v1/iam/me/subordinates` lists B; open B's lead.
6. Repeat with A on Supervisor profile in B's department.
**Expected**
- A sees B's leads ("Visibility follows the reporting-manager chain"). Zoho Reporting Hierarchy: manager sees everyone below in the chain.
**Actual (old)**
- subordinates → 200 includes B; lead → 403 "Record not found … Permission denied." Same as Supervisor. Controls correct (B can't see A; higher rank outside chain sees nothing).
**Environment** NDC-Staging, API + web, 21 Oct; valafo4080 (manager) + nameb56175 (report, User, Sales); mode/managers/profiles reset afterwards. Automation crmhierarchy J1, J3, J1s.
**Developer comments** none
**Previous retests** Previous retest: FAIL 25 Oct (Wave 1): reporting manager (also higher rank same dept) still can't see direct report's leads.

## NDC-2416 — Reporting Hierarchy | A user can change their own manager without permission
uuid: 73cfcb0d-2953-4e62-b914-4e3624fe6fd4 · priority: urgent
**Steps**
1. Sign in as a User-profile user (no `iam.personal.reporting_hierarchy`; Personal → Reporting Hierarchy page hidden).
2. `PUT /api/v1/iam/me/profile` `{"reporting_manager_id":"<any tenant user id>"}`.
3. As admin, Settings → Users → that user: check Reporting manager.
4. Control: same user `PATCH /api/v1/iam/users/{own id}/reporting-manager` same body.
**Expected**
- 403, nothing saved (same as admin endpoint). Zoho: only admin sets Reports To.
**Actual (old)**
- PUT → 200 and manager changed (GET /iam/users shows new reportingManagerId). PATCH → 403 "Cannot assign a reporting manager for this user." (correct).
**Environment** NDC-Staging, API, 21 Oct; user nameb56175 (User profile); restore manager right after. Automation crmhierarchy G9. Note: no CRM profile grants the permission today (only Owner).
**Developer comments** none
**Previous retests** Previous retest: FAIL 25 Oct (Wave 1): PUT /iam/me/profile still 200 and manager changed (restored).

## NDC-2298 — Assignment Rule | An assignment rule limited to the API channel still assigns owners to imported leads
uuid: 9ff00920-1f60-4246-ab23-0878a03647d1 · priority: urgent
**Steps**
1. Settings › Automation › Assignment Rules → open a Leads rule.
2. Channels: API only (Import unticked).
3. Entry matching test data, e.g. "First Name contains B04" → specific user. Save Rule Entry, Save.
4. Leads → Import Leads; upload a file with one lead first name "B04"; Next through Operation and Map fields.
5. Assign step: tick "Assign owner based on assignment rules", open rule list, select the API-only rule.
6. Save & next → confirm permission checkbox → Submit → View records → open imported lead.
**Expected**
- API-only rule NOT offered in import wizard; only rules incl. Import channel listed.
- A rule without Import channel never assigns owners to imported leads.
**Actual (old)**
- API-only rule listed and selectable; imported lead ("Excel Import") gets owner from it (mahmoud.mahamed1515).
**Environment** staging-crm.taviportal.com › Settings › Automation › Assignment Rules + Leads › Import; Edge 154, Win10; 19 Oct; Jam https://jam.dev/c/21b57115-4271-4bd1-850b-3629dfd230ed
**Developer comments** none
**Previous retests** none

## NDC-2281 — Modules and Fields - Records Listing Page | Owner filter lists both CRM users and Desk agents
uuid: c4b88a2a-2f01-4375-acca-e0671eb8a42a · priority: urgent
**Steps** (precondition: tenant has both CRM users and Desk agents)
1. Sales > Leads.
2. Click Filter → "Filter Leads by" panel.
3. Under Fields, expand Owner; scroll the options list.
**Expected**
- Owner options show only CRM users (plus "Current user"); no Desk agents.
**Actual (old)**
- Owner options list shows both CRM users and Desk agents.
**Environment** Staging only, staging-crm.taviportal.com, Edge, Windows, ~1280×984.
**Developer comments** none
**Previous retests** none

## NDC-1863 — Modules and Fields | Deleting a field and trying to save the layout returns 400 Bad Request
uuid: aa1dfd04-057c-4c06-93ac-20bd173eac45 · priority: urgent
**Steps**
1. Settings → Modules and Fields → Leads → open a layout.
2. On any field (e.g. "lookup0") choose Delete Permanently.
3. Save → "Save anyway" in confirmation.
**Expected**
- Field deleted and removed from the layout; layout saved successfully.
**Actual (old)**
- Layout not saved: "Layout not saved: it places fields that do not exist on the module. Field 'lookup0' is placed on the layout but does not exist on module 'leads'…"
- Field is deleted from the module but stays on the layout; layout can't be saved afterwards.
**Environment** TAVI CRM (ticket says crm.taviportal.com; test on staging), Settings → Modules and Fields → Leads layout; Edge 154, Win10. Needs a throw-away field to delete.
**Developer comments** none
**Previous retests** none

## NDC-1864 — Modules and Fields | A disabled module is still reachable and accessible by users, and users can create records within it
uuid: b3a825af-3d42-40b5-bb9d-2d4619e9d6f4 · priority: urgent
**Steps**
1. Settings → Modules and Fields.
2. Turn off status toggle of a module (e.g. "test") → "Module updated successfully".
3. Check side menu: module still there; click it.
4. Create test → fill Name, Status → Save.
**Expected**
- Disabled module not in side menu or any navigation.
- Opening its page directly (saved link) shows a "module is disabled" message.
- Users can't view or create records in it.
**Actual (old)**
- Still in side menu, opens normally after refresh.
- New record saved ("Record saved successfully").
- Work Queue hides it and its queues (inconsistent).
**Environment** TAVI CRM Settings → Modules and Fields; Edge 154, Win10. Re-enable the module after testing (shared tenant setting).
**Developer comments** none
**Previous retests** none

## NDC-1701 — Teamspace | Any user with access to a teamspace can act as admin on it
uuid: e7512895-1e5f-4c8e-b7cf-133db87016be · priority: urgent
**Steps**
1. As tenant owner open a teamspace whose Admin is the owner.
2. Accessible To > Selected Users; grant access to another (non-admin) user; Save; sign out.
3. Sign in as granted user → Settings > Customization > Teamspace → open the same teamspace.
4. Add Modules (tick two) → Add; Create Folder and move a module into it.
5. Permissions → change access list; Save.
6. Confirm persisted; check "last modified by".
**Expected**
- Access holders can use, not reconfigure, the teamspace.
- Add/remove modules, folders, access list restricted to teamspace admin + tenant owner; controls unavailable to non-admins.
**Actual (old)**
- Plain-access user can add modules, create folders, rewrite ACL, change access mode — all succeed (UI and API); last-modified-by = non-admin.
**Environment** https://crm.taviportal.com/settings/teamspace (Edit Teamspace); teamspace "test" 8ee1838d-258b-4d48-bd3c-8cdcc94a9673 (created by ndc-staging-owner, Selected Users); acting user test user 2 valafo4080@94an.com (profile "test"); Edge 152; 16 Sep; Jam https://jam.dev/c/82973ad3-ef4d-4379-aa4e-7093a18a98b9
**Developer comments** none
**Previous retests** Previous retest: PASS 25 Oct (Wave 1): plain member rename + self-promote to admin both 403 PERMISSION_DENIED (only rename/admin checked — re-run add modules/folder/ACL/access mode per full-feature rule).

---

# HIGH

## NDC-2540 — Blueprint | Webhook actions are never sent (After transition and SLA escalation)
uuid: 41c78776-d156-4ae5-9066-e7390e581d2f · priority: high
**Steps**
1. Settings → Blueprints → blueprint on Leads, field Lead Source, states chat → web → referral.
2. Transition "chat to web": add After action Webhook, POST, to a request catcher (e.g. webhook.site URL). Save + activate.
3. Create lead Lead Source = chat; run transition "chat to web" (`POST /api/v1/modules/{leads}/records/{id}/blueprint-transitions/{transitionId}`); check catcher.
4. SLA check: state "chat" SLA 1 min, escalation actions Field Update (Description = "SLA escalated") + Webhook (same catcher). Create lead Lead Source = chat; wait 3 min.
**Expected**
- One POST after the transition; one POST when the SLA escalates.
**Actual (old)**
- Transition: lead moves to "web", 0 requests (watched 105 s) (WH-10).
- SLA: Field Update applied ~1.5 min, 0 requests in 9 min (webhook first or last) (WH-11).
- Control: workflow-rule webhook to same catcher arrives in ~1 s.
**Environment** staging-crm.taviportal.com, API + designer UI, 25 Oct, CRM Admin. Saved action shape `{"kind":"webhook","url":"…","verb":"POST"}` under after.actions. Related NDC-2537 (internal-address check). Zoho: create-blueprint API v8.
**Developer comments** none
**Previous retests** none (our own 25 Oct update: also confirmed via designer UI, case WH-22, transition "QA chat to web" → 0 requests; evidence v2).

## NDC-2423 — Modules and Fields | Layout builder Save doesn't persist field changes (validation regex, Mark as Unique)
uuid: 1ed0dac7-4dce-4b7e-a619-7ab0b8a13775 · priority: high
**Steps**
1. Settings → Modules and Fields → Leads → Layouts → Standard.
2. Phone → ⋮ → Set Permission → Validation tab → clear/change regex → Apply.
3. Email → ⋮ → Mark as Unique, then Mark as Required.
4. Save; F5; reopen Standard, check Phone validation and Email.
**Expected**
- Phone keeps new regex (or none) after refresh and records validate with it.
- Email unique + required; duplicates refused.
**Actual (old)**
- Phone shows old regex `^01[0125]\d{8}$` again; Email required but NOT unique.
- Save also re-saves 4 unrelated fields (User Full Name, User Email Address, Wallet Number, Fill From Name).
- Layout PUT has Phone regex "" + Email unique true; but PATCH fields/47d783ad…/constraints sends unique:false; no request updates Phone field 795319a8….
**Environment** staging-crm.taviportal.com, Edge 154, 22 Oct, Owner account; Standard layout bf971461-2edc-45f2-b6e4-6e180aa64288; Jam https://jam.dev/c/1d9d8e4e-e5b5-458b-b342-c75eede2c439. NOTE: recording left Email required on Leads (shared tenant setting — leads without email refused); restore after test.
**Developer comments** none
**Previous retests** none

## NDC-2419 — Assignment Rules | Rules fire on import and API but no longer set the owner
uuid: 681147a1-23cc-465d-a5fc-0c19d64785b5 · priority: high
**Steps**
1. Settings → Assignment Rules → Leads rule, channels Import + API, entry All Records → active user A. Active.
2. Leads → Import Leads → one row (Name, Phone) → Standard layout → Assign: tick "Assign owner based on assignment rules", choose rule → Submit.
3. Open imported lead, check Lead Owner.
4. API: `POST /api/v1/modules/{leads}/records` (source = api); check owner.
**Expected**
- Lead Owner = user A (import and API).
**Actual (old)**
- Import: Lead Owner empty (no owner field) (A-02, lead a6e8cf76…; also d9934be8, de16faae).
- API create: owner stays creator (A-01, lead 227c598d…, rule c0d9801c…).
- Execution outcome "Fired" in both (`GET /workflow/executions?recordId=…`).
**Environment** staging-crm.taviportal.com, API + Edge, 22 Oct, Owner + CRM Admin. Jams https://jam.dev/c/d0b413bd-a31a-4c0a-8b05-99a9e1aefe08 , https://jam.dev/c/275e7847-2e0b-4278-83e7-2df44c7a4226 (rule "test"). Regression vs 21 Oct. Blocks NDC-2411 — retest that after this.
**Developer comments** none
**Previous retests** none

## NDC-2418 — Login History | Sessions stay "Active" after they expire (255 "active" sessions, back to 30 Aug)
uuid: 3cc90c86-0d95-44c4-982b-bc723a752610 · priority: high
**Steps**
1. Settings → Login History.
2. Status filter → Active.
3. Check count, Login Time (scroll) and Logout Time. API: `GET /api/v1/audit/login-history?status=active` (paged); compare expires_at to now.
**Expected**
- Only currently signed-in sessions are Active.
- Past-expiry / signed-out sessions show Expired/Ended with a logout time.
- Online status used by assignment rules reflects really-online users.
**Actual (old)**
- 255 Active (API 249; 245 past expires_at; oldest login 30 Aug), no logout time. Sessions = 12 h.
- Per user: ndc-staging-owner 171, Mahmoud Mohamed 48, Mahmoud Samy 14, test user 2 11, …
- Impact: assignment rule "Online status" availability doesn't skip offline users (A-10).
**Environment** staging-crm.taviportal.com, Edge, 22 Oct, Owner. Do NOT use "Clear All Sessions" (shared tenant).
**Developer comments** none
**Previous retests** Previous retest: FAIL 25 Oct (Wave 1): 346 Active, 306 past expiry, oldest 16 Aug; revoking a single session works.

## NDC-2384 — Modules and Fields | CRM Create module dialog cannot create a module — "Module plural form is required" but the dialog has no plural field
uuid: 5414e104-108b-4e57-be81-39e856ae5a4c · priority: high
**Steps**
1. CRM › Settings › Customization › Modules and Fields › Create New Module (also sidebar teamspace ⋯ › Create Module).
2. Display name "QA RT partners" (key auto-fills) › Create.
**Expected**
- Module created, or the dialog asks for every value the server needs (plural/singular, like Desk).
**Actual (old)**
- `POST /api/v1/teamspaces/{teamspace}/modules` → 400 MODULE_NAME_REQUIRED "Module plural form is required and cannot be blank."; same toast.
- No plural/singular field in dialog; Cancel asks "Discard your changes?…".
**Environment** NDC-Staging, CRM Teamspace 5ea90671-4df5-4642-939d-49494f8e4d6e; mahmoud.mahamed1515; Edge headless; 21 Oct. Contrast: staging-desk dialog has plural + singular. Clean up created test module afterwards.
**Developer comments** none
**Previous retests** none

## NDC-2383 — Modules and Fields | Layout builder Save is silently lost when the layout save is slow (e.g. after adding a Rollup Summary)
uuid: 900c4f77-136e-445b-abd6-b210f6cc22e0 · priority: high
**Steps**
1. Settings › Modules and Fields › Leads › open a layout (our copy "QA RT layout" f01e6c73…).
2. Test A: drag a Single Line field → Save.
3. Test B: drag a Rollup Summary → ADVANCED: Related Module Deals, Related List Connected To, Field Amount, Function Sum → Apply → Save.
4. Watch network; reopen layout (or `GET /api/v1/modules/{Leads}/layouts`).
5. Replay test B layout PUT by API with 180 s timeout.
**Expected**
- Save persists the layout or shows an error; slow saves are waited for.
**Actual (old)**
- A: POST field 201, PUT layout 200 — saved.
- B: POST field 201, PUT layout no response in browser, toast "Field updated successfully", layout lastModifiedAt unchanged, rollup in Unused Fields; further Save clicks send nothing.
- API replay: 200 after 14 s; unchanged-layout PUT takes 18 s. Every Save re-PUTs 4 untouched fields.
**Environment** NDC-Staging, Leads 841043e1-c078-41f9-8d6e-dfd61bee45c3; first seen on layout FieldPermissions (563411f4…); mahmoud.mahamed1515; Edge headless; 21 Oct. Blocks E2E of NDC-1444.
**Developer comments** none
**Previous retests** none

## NDC-2334 — Blueprint + Approval Process | Editing a deal in a blueprint starts an approval and drops the deal out of the blueprint
uuid: 7347b379-cb48-414c-af3a-7d93bc780508 · priority: high
**Steps**
1. Settings → Blueprint: publish a Deals blueprint on Stage (pipeline Standard), transition qualification → negotiation.
2. Settings → Approval Processes: Deals, Execute On Edit, criteria Type = new_business, approver = named user.
3. Create a deal in Stage qualification (enters blueprint); run transition to negotiation.
4. Edit deal Type = new_business → Save (`PATCH /api/v1/modules/{deals}/records/{id}`).
5. Check approval status and blueprint bar (`GET …/records/{id}/blueprint-state`).
6. Scenario 2: approval criteria Stage = negotiation; run transition itself.
**Expected**
- No approval starts while deal is in blueprint; deal stays in state negotiation with next transitions offered. (Zoho: approvals not supported for records in a blueprint.)
**Actual (old)**
- approval_status pending_approval; blueprint-state `{"states":[],"transitions":[]}` (before: activeStates ["negotiation"]).
- Scenario 2: transition itself starts approval and deal leaves blueprint.
- Without the approval process the same edit keeps deal in blueprint (control).
**Environment** staging-crm.taviportal.com, Edge, 20 Oct, Owner; deals f406755e…, 0b95694e…; Jam https://jam.dev/c/ccd8940e-052e-4a0c-b437-890243acf7a0. Deactivate test approval process/blueprint afterwards (shared automation config).
**Developer comments** none
**Previous retests** none

## NDC-2309 — Review Process | Reviewer "Record owner" resolves to nobody on an imported, assigned record
uuid: 42e16ff8-d3e2-457a-941f-79a591a574aa · priority: high
**Steps**
1. Settings → Assignment Rules: Contacts rule, channel Import, entry All Records → user X.
2. Settings → Review Process: Contacts (same layout), channels Manual + Excel import, criteria Lead Source = chat, fields Email + Phone, reviewer Record owner.
3. Contacts → Import Contacts: one contact "B04", Lead Source = chat; Assign step: tick "Assign owner based on assignment rules", choose rule → Submit.
4. Open contact (owner X). Log in as X → My Reviews; as CRM Admin → My Reviews → All reviews (`GET /api/v1/workflow/reviews/queue`).
**Expected**
- Review request lists X as reviewer; appears in X's My reviews; X can review.
**Actual (old)**
- reviewerUserIds [] and empty ownerUserId; only under "All reviews".
- Review created 06:34:28.740, contact saved with owner X 0.23 s later (ordering bug).
**Environment** staging-crm.taviportal.com, Edge, 20 Oct, CRM Admin; rule 0acc78c4-85f2-498a-98e9-abc3df1df403; X = 3445ec4a-020e-4f12-b156-dd2de7610164; Jam https://jam.dev/c/a5d1675e-cda9-4fd4-a17b-4a27b5511375. Also Leads (19 Oct, lead 50ae5e2d). Same cause as NDC-2308. Depends on NDC-2419 (assignment rule must set owner). Needs second user X login.
**Developer comments** none
**Previous retests** none

## NDC-2308 — Approval Process | Approver "Record Owner" ignores the owner set by the assignment rule on import
uuid: 0fe9eca6-89ee-4a09-ab85-a27a1cf1e1eb · priority: high
**Steps**
1. Settings → Assignment Rules: Leads rule, channel Import, criteria First Name contains "B04" → user X.
2. Settings → Approval Processes: Leads, On Create, criteria First Name contains "B04", approver Record Owner, process admin = different user Y.
3. Leads → Import Leads: one lead "B04"; Assign step: tick "Assign owner based on assignment rules", choose rule, tick "Trigger workflow rules" → Submit.
4. Open the lead; `GET /api/v1/workflow/approvals/records/{leads}/{id}`.
**Expected**
- Owner X; approval waiting on X; X can approve/reject.
**Actual (old)**
- Owner X, but approval waiting on Y (process admin, "Waiting on Mahmoud Mohamed"); X can't approve.
- Approval submitted 06:50:16.52, owner set 06:50:18.27 (1.75 s later).
**Environment** staging-crm.taviportal.com, Edge, 20 Oct, CRM Admin; rule 28c23105-d7a8-4765-b2b3-5159c676c14c; lead 2c7c7eee…; X = 3445ec4a-020e-4f12-b156-dd2de7610164, Y = 7e5e7c27-46e4-4bf6-b021-7bd219d34472; Jam https://jam.dev/c/daac6a08-edbe-4dd7-a4b7-ad0489ce6550. Same cause as NDC-2309; depends on NDC-2419. Needs X login to confirm approve.
**Developer comments** none
**Previous retests** none

## NDC-2297 — Review Process | A lead held for review can be converted
uuid: c97e7584-b075-4058-8adc-83c2b47ea364 · priority: high
**Steps**
1. Settings → Review Process: Leads, channel Manual, field set Email, rule All records, reviewer = a CRM Admin.
2. As a User-profile account create a lead with Email → Pending for review.
3. Control: edit any field → 422 REVIEW_LOCKED.
4. Convert the lead (`POST /api/v1/modules/{leads}/records/{id}/convert` body {}).
5. Check review status; try to delete converted lead.
**Expected**
- No conversion until the review is complete (Zoho: records under review locked).
**Actual (old)**
- Convert → 200, targets created; review still pending_for_review; delete then fails REVIEW_LOCKED until review rejected by hand.
**Environment** NDC-Staging, API + web, 18–19 Oct; User-profile + CRM Admin accounts; leads da6f6b7c, 22d5679b. Case H-02; gaps NDC-2294; sibling NDC-2296. Needs User-profile account.
**Developer comments** none
**Previous retests** none

## NDC-2296 — Approval Process | A lead waiting for approval can be converted
uuid: 084ef91a-e6e2-4e6b-8273-ebab4d8a7dd8 · priority: high
**Steps**
1. Settings → Approval Processes: Leads, On Create, criteria Last Name starts with "B01", approver = named user (CRM Admin).
2. As User-profile account create lead Last Name "B01 test" → Pending approval.
3. Control: Delete → 422 APPROVAL_LOCKED.
4. Convert and confirm (`POST …/records/{id}/convert`).
5. Open lead + new Contact/Subscription; check approval status.
**Expected**
- Convert blocked while waiting for approval, like Delete (Zoho: Convert/Delete/Edit disabled).
**Actual (old)**
- Convert → 200: Contact + Subscription created; lead stays Pending approval. Seen as User-profile and CRM Admin.
**Environment** NDC-Staging, API + web, 18–19 Oct; leads fe605f05, 96850232, ba3a146a. Cases D-21/H-03; gaps NDC-2294; sibling NDC-2297.
**Developer comments** none
**Previous retests** none

## NDC-2293 — Audit Log | Entities filter lists the same entity several times and doesn't group related entities
uuid: 3b11ea52-41cd-401f-940d-d28348de8410 · priority: high
**Steps**
1. Settings › Security Control › Audit Log → All Entities filter.
2. Search "approval" (4 options), "blueprint" (×3), "work" (Workflow rule/Rule), "act" (Contacts ×2).
3. Clear and scroll whole list (Subscriptions ×2; "Test", "Module view pin", "User list preference"; Saved View vs Saved View Sharing ungrouped).
**Expected**
- Each entity once with one consistent name.
- Related options grouped (Approval + Approval Override under Approval Process; Saved View Sharing under Saved View).
- Only real user-facing entities (no test/internal).
**Actual (old)**
- Duplicates by spelling and identical repeats; internal/test entries; flat ungrouped list.
**Environment** staging-crm.taviportal.com › Settings › Audit Log; Edge 154, Win10; 18 Oct; Jam https://jam.dev/c/1c425f53-b069-49a6-b4d8-8dc6d2d24523
**Developer comments** none
**Previous retests** Previous retest: PASS 25 Oct (Wave 1): 56 options on screen, no duplicates (facets API 98, none duplicated); grouping NOT judged — still check grouping and internal entries.

## NDC-1873 — Modules and Fields | Changing a new field's name doesn't automatically change its API name
uuid: 09f2c397-06d1-4c4a-a905-210a7de6d1bb · priority: high
**Steps**
1. Settings → Modules and Fields → Leads → open a layout.
2. Drag a new Lookup field (default "Lookup 4").
3. Properties → General: rename to "Lookup Contacts"; check API Name (still "Lookup").
4. Apply → Save → Save anyway.
**Expected**
- While new/unsaved, renaming updates API name (e.g. "lookup_contacts").
- New field never gets an API name already used in the module.
- API name read-only (system-generated).
**Actual (old)**
- API name stays "Lookup"; save blocked: "\"Lookup Contacts\": the API name \"Lookup\" is already used by another field in this module — choose another."
**Environment** TAVI CRM (ticket says crm.taviportal.com; use staging), Leads layout; Edge 154, Win10. Delete the test field afterwards.
**Developer comments** none
**Previous retests** none

## NDC-1699 — Teamspace | A Manager-profile user can access a teamspace though neither the user nor the Manager profile is on the access list
uuid: 467c3fce-fbfc-436b-9a8a-68eccb3316f1 · priority: high
**Steps**
1. Settings > Customization > Teamspace → open a teamspace.
2. Permissions → Accessible To = Selected Users → Edit → Profiles: add User, Supervisor, test (leave Manager, CRM Admin out) → Save dialog → Save.
3. Reload; confirm only those 3 profiles listed.
4. Settings > General > Users: confirm a user holds the Manager profile.
5. Sign in as that Manager user → teamspace switcher → look for the restricted teamspace.
**Expected**
- Not visible to a user whose profile isn't on the list; Manager treated like any other non-granted profile.
**Actual (old)**
- Restricted teamspace listed in the Manager user's switcher.
**Environment** https://crm.taviportal.com/settings/teamspace; teamspace "test" (admin ndc-staging-owner); Manager user at the time: mahmoud.mahamed1515@gmail.com (now CRM Admin — needs a real Manager-profile user); Edge 152; 16 Sep; Jam https://jam.dev/c/e55a3afd-5af1-48ae-a69e-8f528952e134
**Developer comments** none
**Previous retests** Previous retest: PASS 25 Oct (Wave 1): Supervisor-profile user not on list can't see/open it — Manager profile itself NOT used; re-run with Manager.

## NDC-1444 — Modules and Fields | Rollup Summary says the related module has no lookup pointing at this module, when it does
uuid: 40563a1b-3839-45ab-bc3e-2ee2e7f10945 · priority: high
**Steps**
1. Settings › Modules and Fields › Deals → layout → Connected To → ADVANCED: confirm "Let users choose the related module…" ticked and Leads among Related Modules. Cancel.
2. Settings › Modules and Fields › Leads → edit a layout → add Rollup Summary.
3. ADVANCED: Related Module = Deals → open "Related List (Lookup Field)" dropdown; read message.
4. Repeat with Contacts.
5. Choose relation + field + function (e.g. Connected To › Amount › Sum) → Apply → Save; reopen layout.
**Expected**
- Dropdown offers lookups on selected module pointing at Leads (incl. Deals › Connected To).
- "No lookup" warning only when genuinely none.
- Rollup saves with the layout.
**Actual (old)**
- "The selected module has no lookup field pointing at this module…" for Deals and Contacts; dropdown empty; "A rollup needs its related list, field and function before the layout can be saved."
**Environment** NDC-Staging; Leads 841043e1-c078-41f9-8d6e-dfd61bee45c3, layout 563411f4-6c8e-4b98-a91d-c618d88a5138 (FieldPermissions); Deals f42cbafd…, Contacts 6f553963…; Edge 152; 7 Sep; Jam https://jam.dev/c/e137b47d-65f5-46cd-9ca8-6024822a2d13. E2E save blocked by NDC-2383.
**Developer comments**
- 21 Oct (dev 00a20184): "FIXED (verified in deployed bundle). The Rollup Summary lookup check now accepts single-target, multi-module (target_modules) and related_module lookups, and reads the module id from the layout store (client-engine 0a8125e0f). Deals.connected_to (multi-module incl. Leads) now qualifies. Please confirm end-to-end in the UI."
**Previous retests** Previous retest: PARTIAL 21 Oct: lookup detection + no false warning PASS (Deals/Contacts/Accounts/Tasks); rollup field qa_rt_rollup created but layout not saved (Unused Fields, later Saves send nothing) FAIL → NDC-2383.

## NDC-1172 — Teamspace | A CRM Admin can open any teamspace they are not on the access list of, whatever accessibility option is set
uuid: 244331d7-49dc-4f9d-9fba-947440bb2433 · priority: high
**Steps**
1. As owner: Settings > Customization > Teamspace → edit a teamspace (e.g. "TestTeamspace").
2. Accessible To = Selected Users; list contains only one user (not the test CRM Admin) → Save dialog → Save ("Teamspace updated successfully").
3. Log in as a CRM Admin NOT on the list → sidebar switcher → select restricted teamspace → expand folder → open a module (Leads).
4. Repeat with org-unit (CRM Admin not in it) and profile (not CRM Admin) options.
5. Also check Settings › Teamspace list + Edit Teamspace page as that CRM Admin; creator/admin keeps access; Modules section after save.
**Expected**
- Not in switcher for uncovered users regardless of profile; other routes refused.
- CRM Admin subject to accessibility like any profile (or setting says it bypasses).
**Actual (old)**
- Visible in switcher, folders load, module lists all records (23 leads) under all three options.
**Environment** crm.taviportal.com (use staging); Edge 151; 19 Aug; reporter cetow80696; Jam https://jam.dev/c/604ce602-893a-427d-8524-4c699182408d. Needs a second CRM Admin login not on the list + a covered user (test user 1 nameb56175) + creator ndc-staging-owner.
**Developer comments**
- 21 Oct (dev 00a20184): "FIXED. QA teamspace with access 'selected' and an ACL that excludes the caller (one other user; then profile Manager; then profile User): as the owner (same admin-bypass keys as CRM Admin) GET /teamspaces does not list it and GET /teamspaces/{id} and /folders → 403 PERMISSION_DENIED. Not re-checked with a separate CRM Admin login, and the org-unit option was not tested." (limits: owner only, no org-unit)
**Previous retests** Previous retests: PARTIAL 22 Aug (creator lost access; Modules section empty after save; Settings › Teamspace lists inaccessible teamspace showing logged-in user as Admin, Jams https://jam.dev/c/61047ba4-6fe2-4a13-b95e-92917c215d95 , https://jam.dev/c/3cd27924-a437-4b7e-94d5-43b1e66fc78d); PARTIAL 21 Oct (switcher/API 403 PASS for all 3 options; Settings › Teamspace still lists it and Edit shows logged-in user as Admin + "Permission denied" toast FAIL; Modules section not re-checked); PASS 25 Oct (Wave 1, Selected option only: not listed, refused; member can open). Re-check Settings › Teamspace item (b) and Modules section (a).

---

# MEDIUM

## NDC-2545 — Security Policies | Idle timeout also signs out sessions that are in active use
uuid: 64598854-9c26-440f-bd5b-0c4652e4a751 · priority: medium
**Steps**
1. As Owner: Settings › Security Control › Security Policies → Idle timeout (minutes) = 2 → Save.
2. Sign in two other sessions. Session A: `GET /api/v1/iam/me` every 30 s. Session B: idle.
3. Watch 4 min; open Login History.
4. Restore idle timeout to 60.
**Expected**
- A (busy) stays signed in; only B signed out after 2 idle min ("resets on every request").
- Login History shows B ended.
**Actual (old)**
- A: 200 at 30–150 s, then 401 from 180 s (token + refresh 401). B also signed out.
- Login History still shows both "active". Reproduced twice.
**Environment** NDC-Staging; ndc-staging-owner (policy change), test user 2 (busy) + Supervisor account (idle); 25 Oct case SP-04; automation crmaccess/SessionPolicyTest#idleTimeoutEnforced. SHARED TENANT SETTING — restore 60 min immediately. Zoho not checked live (Directory not set up).
**Developer comments** none
**Previous retests** none

## NDC-2543 — Profiles | The built-in "User" profile can be renamed
uuid: 405c8ff3-848d-4901-b317-2d7ac2f24a5c · priority: medium
**Steps**
1. Sign in as Owner.
2. `PATCH /api/v1/iam/profiles/11111111-1111-1111-1111-111111111103` `{"name":"QA W1 User renamed"}` (also try UI).
3. Settings › Security Control › Profiles or `GET /api/v1/iam/profiles`.
**Expected**
- System profiles (Owner, CRM Admin, User…) can't be renamed/deleted; refused with clear message (Zoho Standard: only Clone, View Users).
- Custom profiles still renameable.
**Actual (old)**
- 204 and profile listed under new name (renamed back at once).
**Environment** NDC-Staging; ndc-staging-owner; 25 Oct case PR-06; automation crmaccess/AdminApiTest#systemProfileProtected. If rename succeeds, rename back to "User" IMMEDIATELY (shared; tests look up by name).
**Developer comments** none
**Previous retests** none

## NDC-2541 — Approval Process | A failed Call Webhook is not retried and not logged
uuid: 0a19cfc4-0dfb-4fae-a444-5783f11d3e5d · priority: medium
**Steps**
1. Request catcher answering HTTP 500 (e.g. webhook.site set to 500).
2. Settings → Approval Processes: Leads, approver user A, After final approval → Call Webhook POST to catcher. Activate.
3. Create matching lead; approve as A (`POST /api/v1/workflow/approvals/{instanceId}/approve` → 204).
4. Watch catcher 4 min; `GET /api/v1/workflow/executions?recordId={leadId}`.
5. Same with After rejection webhook (`…/reject`).
6. Compare with workflow rule On Create webhook to a 500 catcher.
**Expected**
- Failed call retried like workflow webhooks (~+30 s, +2.5 min, +10 min); each attempt logged with status/error.
**Actual (old)**
- Approval: 1 request, no retry in 4 min, executions [] (WH-16, lead 52bc953e…).
- Rejection: same (WH-19, lead b7a36ee8…).
- Workflow control: 0 s, +32 s, +2.5 min, next +10 min; dispatch Pending, attempts 3, lastError "HTTP 500" (WH-04).
**Environment** staging-crm, API, 25 Oct, CRM Admin + Supervisor (approver). Related NDC-2539.
**Developer comments** none
**Previous retests** none (our own 25 Oct update added the after-rejection case WH-19).

## NDC-2422 — Assignment Rules | "Online status" availability does not skip a member who is not online
uuid: 79c37985-afc7-494f-80b7-787cac009234 · priority: medium
**Steps**
1. User A has no browser/session open; user B signed in.
2. Settings → Assignment Rules: Leads, channel Import; entry All Records → Category members A, B (A first); tick Online status; fallback Default user C. Active.
3. Leads → Import Leads, one row, tick "Assign owner based on assignment rules", choose rule → Submit.
4. Check Lead Owner. Control: same rule without Online status.
**Expected**
- A skipped, B gets the lead; control gives A.
**Actual (old)**
- Both test (fa16208a…) and control (c68cf3d7…) → test user 2 (A, offline). Execution outcome Fired, no availability reason.
**Environment** staging-crm, API + Edge, 21–22 Oct, Owner + CRM Admin. Members test user 2 (51666421…), ndc-staging-owner (97be04b6…), fallback Mahmoud Samy. Blocked by NDC-2418 (stale Active sessions) and NDC-2419 (no owner set) — retest after both, with a first member that has no session at all.
**Developer comments** none
**Previous retests** none

## NDC-2414 — Profiles | The Desk Administrator profile gives view-all on CRM records
uuid: 6d5f4999-6b0c-4f38-96c5-a2729bceb70a · priority: medium
**Steps**
1. Settings → Users: user with CRM profile Supervisor who also has Desk Administrator (e.g. mahmoud.mmohamedsamy).
2. Sign in as that user; open Leads (visibility = Hierarchy). `GET /api/v1/iam/me/permissions`.
3. As owner `GET /api/v1/iam/profiles/{desk-administrator-id}/permissions`.
4. Compare with a CRM-Supervisor-only user.
**Expected**
- A Desk profile doesn't change CRM record access; user sees records per CRM profile + hierarchy (Zoho: profiles per product).
**Actual (old)**
- User sees all 10,848 leads; Desk Administrator (appKey desk) contains `metadata.records.view_all`; CRM Supervisor doesn't.
**Environment** NDC-Staging, API, 21 Oct. View-all profiles today: CRM Admin, Owner, "test", Desk Administrator. Automation crmhierarchy E7d. Needs Supervisor+Desk Admin account (mahmoud.mmohamedsamy) and a Supervisor-only control.
**Developer comments** none
**Previous retests** Previous retest: FAIL 25 Oct (Wave 1): Supervisor + Desk Administrator still gets CRM view_all (E7d).

## NDC-2411 — Assignment Rules | A suspended member is not skipped and the fallback user never gets the record
uuid: 5f61b254-25be-48fb-a2c5-805cf2668a6b · priority: medium
**Steps**
1. Settings → Assignment Rules: Leads, channel Import; entry All Records → Category → user A; fallback Default user = B. Active.
2. Settings → Users → A → ⋮ → Suspend (or `PATCH /api/v1/iam/users/{id}` {"status":"Suspended"}).
3. Leads → Import Leads → one row (Name, Phone) → Standard layout → map → Assign: tick "Assign owner based on assignment rules", choose rule, tick "Trigger workflow rules" → Submit.
4. Check Lead Owner. Reactivate A afterwards (⋮ → Reactivate).
**Expected**
- Suspended A skipped; fallback B is Lead Owner.
**Actual (old)**
- 21 Oct: owner = suspended A (lead 07bae50b…, test user 2, rule "QA AEO UI A-17 AR", fallback Mahmoud Samy).
- 22 Oct: owner empty — masked by NDC-2419 (rule ace3ac8e…, member test user 1 45ffbc5b…, fallback Mahmoud Mohamed).
**Environment** staging-crm, Edge 154 + API, 21–22 Oct, Owner. Jams https://jam.dev/c/d0b413bd-a31a-4c0a-8b05-99a9e1aefe08 , https://jam.dev/c/275e7847-2e0b-4278-83e7-2df44c7a4226. Retest only after NDC-2419 fixed. Suspending a shared test user affects others — reactivate right away.
**Developer comments** none
**Previous retests** none

## NDC-2391 — Workflow Rules | A condition on Lead Owner never matches
uuid: 99f20ca0-c9d1-4a21-a4cb-a2273c435b6e · priority: medium
**Steps**
1. Settings → Workflow Rules → New Rule: Leads, trigger Create.
2. Conditions: Lead Owner is user A (optionally + Name starts with "QA").
3. Action Field Update → Comment = "owner rule ran". Save & Activate.
4. As user A create a matching lead (owner A).
5. Control: same rule without owner condition; also try "Lead Owner is one of [A]".
**Expected**
- Rule runs on A's lead (Comment set); not on others' leads.
**Actual (old)**
- Owner-condition rules never run (leads 5331182e, a3511a73: Description empty though owner = A); control ran (01879074).
- Criteria saved by UI: {field: owner, operator: Equal, value: {kind: string, stringValue: 3445ec4a-…}}; user/uuid value types → 400; "owner_id" unknown.
**Environment** staging-crm, Edge + API, 21 Oct, Owner + CRM Admin; user A = mahmoud.mahamed1515 (3445ec4a-020e-4f12-b156-dd2de7610164). Also verify Assignment → Workflow order (workflow sees owner set by assignment rule). Deactivate test rules afterwards.
**Developer comments** none
**Previous retests** none

## NDC-2388 — Lead Conversion | A newly created module is switched on as a conversion target with "Always create" without being asked
uuid: 019988ab-3db8-4757-b7aa-226eff8cfa2c · priority: medium
**Steps**
1. Create a custom module in CRM teamspace (e.g. "QA RT partners" via `POST /api/v1/teamspaces/{teamspace}/modules`, since dialog fails — NDC-2384).
2. Settings › Modules and Fields › Leads › Lead Conversion Mapping › Conversion Targets.
**Expected**
- New module not a conversion target until an admin turns it on (or added switched off).
**Actual (old)**
- Listed switched ON with "Create when: Always create" and as a Field Mapping column.
**Environment** NDC-Staging, Leads 841043e1-c078-41f9-8d6e-dfd61bee45c3; test module e51b6c77… (deleted); mahmoud.mahamed1515; 21 Oct. Related NDC-1229. Delete test module afterwards (else every conversion creates a record in it).
**Developer comments** none
**Previous retests** none

## NDC-2386 — Pipelines | Settings › Pipelines stays on "Loading board…" when opened directly or reloaded
uuid: b97a3d54-1567-4c1d-9228-79d9145e644b · priority: medium
**Steps**
1. Open https://staging-crm.taviportal.com/settings/pipelines directly (new tab / bookmark / F5).
2. Wait 25 s.
3. Compare: Settings › Modules and Fields, then Pipelines in sidebar.
**Expected**
- Board loads on direct link and after reload.
**Actual (old)**
- "Loading board…" forever (3/3); only `GET /api/v1/modules` requested; `/modules?page=1&page_size=200`, `/modules/{Deals}/stage-probability`, `/layouts`, `/pipelines?layout_id=…` never start; no error.
- In-app navigation after Modules and Fields loads fine.
**Environment** NDC-Staging, staging-crm.taviportal.com/settings/pipelines; mahmoud.mahamed1515; Edge headless; 21 Oct.
**Developer comments** none
**Previous retests** none in Plane (local evidence NDC-2386-retest.png exists in the wave2 folder).

## NDC-2385 — Import | The "All errors" table on the Review step is always empty ("No errors match your filters") although errors are counted
uuid: 35ca4331-daef-4e22-9e25-bad818dca343 · priority: medium
**Steps**
1. Leads › Module actions › Import Leads; upload a file with an invalid row (QA-RT-inv.csv: Percent = 250; or 8 rows with 3 invalid).
2. Target layout FieldPermissions, Add new records › Next; map Name, Single Line, Percent › Next › Save & next.
3. On Review look at "All errors"; open Filters; click Clear.
**Expected**
- Table lists each error row with Row #, Column, Value, Reason, Type.
**Actual (old)**
- "All errors 1 errors … No errors match your filters … 1–1 of 1" (3/3); no filter selected; Clear does nothing.
- `POST …/import/{session}/validate` returns `{"row":3,"field":"percent_8_9","reason":"…between 0 and 100.","value":"250","kind":"datatype"}`; Error breakdown renders it, row table doesn't.
**Environment** NDC-Staging, Leads 841043e1-c078-41f9-8d6e-dfd61bee45c3, layout FieldPermissions; mahmoud.mahamed1515; Edge headless; 21 Oct. Related NDC-1590. Needs an invalid CSV (QA-RT-inv.csv) — cancel before submit.
**Developer comments** none
**Previous retests** none

## NDC-2323 — Workflow Rules | Pending scheduled actions still run on a converted lead
uuid: 3e832279-3a1a-458c-8d33-2b599d5aa26c · priority: medium
**Steps**
1. Settings → Workflow Rules: Leads, On Create, scheduled action Webhook (reachable test endpoint) after 2 min. Save & Activate.
2. Create two matching leads (lead 1, lead 2 control).
3. Immediately convert lead 1 (`POST …/records/{id}/convert`).
4. Wait 2–3 min; check execution history (dispatches) for both.
**Expected**
- Converted lead 1's scheduled webhook cancelled, never sent; lead 2's sent after 2 min (Zoho: scheduled actions not executed after conversion).
**Actual (old)**
- Converted lead's webhook sent: status Succeeded, attempts 1 (lead 64684edc…, 07:32:55); control also sent (correct).
**Environment** staging-crm, API, 19 Oct, CRM Admin; control lead 8165e04f…. Needs a webhook receiver. Cancellation already works when the record stops matching criteria; conversion just doesn't trigger it.
**Developer comments** none
**Previous retests** none

## NDC-2302 — Import | Import with "Trigger automation" off still runs the workflow once the review is approved
uuid: 0e6cb4e3-3e24-45b3-a5b3-534e1901c13a · priority: medium
**Steps**
1. Settings → Review Process: Leads, channel Excel import, field set Email, reviewer = CRM Admin. Activate.
2. Settings → Workflow Rules: Leads, On Create, Field Update Description = "WF B06". Activate.
3. Leads → Import CSV with one lead (with Email), "Trigger automation" OFF.
4. Lead is Pending for review → as reviewer approve Email (`POST /api/v1/workflow/reviews/{requestId}/fields/email/approve`); wait ~1 min.
5. Check Description + workflow execution history.
6. Control: no review process, same import → nothing runs.
**Expected**
- With automation off nothing runs: no review hold, no workflow, no approval (Zoho's single option covers workflow, approval, review, blueprint, CommandCenter).
**Actual (old)**
- Lead held for review; after approval the On Create workflow fires (Description set, RecordCreated Fired); on 18 Oct the approval process also started. Control: nothing (correct).
**Environment** NDC-Staging, API, 18–19 Oct, CRM Admin; leads 3dbedc30, control a3221c31, 224a4501. Case G-04; gaps NDC-2294. Deactivate test review/workflow afterwards.
**Developer comments** none
**Previous retests** none

## NDC-2282 — Deals – Kanban View | Duplicate unlabeled Layout picklist and unlabeled Pipeline picklist in the toolbar
uuid: 4faacfdf-a173-4647-9981-dde53b74178a · priority: medium
**Steps** (not written in the ticket; derived from its annotations)
1. Deals → switch to Kanban view.
2. Inspect the header Layout picklist (1), the second toolbar Layout picklist (2) and the Pipeline picklist (3).
**Expected**
- Layout picklist appears once (page header).
- Pipeline picklist has a visible label (e.g. "Pipeline").
- Two dropdowns both showing "Standard" can't be confused.
**Actual (old)**
- A second unlabeled Layout picklist in the toolbar duplicates the header one; it and the unlabeled Pipeline picklist both read "Standard".
**Environment** not stated (annotated screenshot only); use staging-crm, Deals Kanban.
**Developer comments** none
**Previous retests** none

## NDC-1823 — Lead Conversion | "Create a new Deal" offers Probability and Expected Revenue as editable instead of read-only system fields
uuid: 2323dc05-4952-429c-853a-ba237dded14b · priority: medium
**Steps**
1. Leads → open a lead (e.g. lead02) → Convert.
2. Tick "Create a new Deals for this Contacts."; Stage = Qualification, Amount = 10,000.
3. Type 500 in Probability and 10,000 in Expected Revenue.
4. Convert; open the new deal from the confirmation; check both fields.
**Expected**
- Both read-only in the conversion form, auto-filled from Stage and Amount (as on the Deal form); user can't type values that won't be saved.
**Actual (old)**
- Both editable (accepts 500%); the deal then shows Probability 10, Expected Revenue 1,000 with no message.
**Environment** TAVI CRM (ticket cites crm.taviportal.com; use staging) Leads → Convert; Edge 153, Win10; ndc-staging-owner; 24 Sep. Consumes a lead (needs a convertible test lead).
**Developer comments** none
**Previous retests** none

---

# LOW

## NDC-2547 — Permissions | "Create permission" button opens the "Create profile" dialog
uuid: 9222d052-5b31-4a64-b10c-57896b8a3898 · priority: low
**Steps**
1. Sign in as Owner.
2. Settings › Security Control › Permissions → click "Create permission".
**Expected**
- Label matches the action, e.g. "Create profile" (as on the Profiles page / Zoho "New Profile").
**Actual (old)**
- A dialog titled "Create profile" opens.
**Environment** NDC-Staging; ndc-staging-owner; 25 Oct case PE-04.
**Developer comments** none
**Previous retests** none

## NDC-2546 — Profiles | API: editing a profile's rank above its parent's rank answers 204 but is silently ignored
uuid: 44334f73-b187-4d25-afb1-74ef1e56e39c · priority: low
**Steps**
1. As Owner create a profile under Supervisor (rank 300) with rank 100.
2. `PATCH /api/v1/iam/profiles/{id}` `{"rank":600}`.
3. `GET /api/v1/iam/profiles`.
4. Compare `POST /api/v1/iam/profiles` with parent Supervisor, rank 600.
**Expected**
- PATCH refused like create: 400 "Profile rank (600) must be lower than parent profile's rank (300)."
**Actual (old)**
- PATCH 204, rank stays 100, no error; create → 400 VALIDATION_ERROR. Valid edits (rank 200, new parent with apply_parent:true) work. UI blocks it (Save disabled).
**Environment** NDC-Staging; ndc-staging-owner; 25 Oct case PR-04; automation crmaccess/LeftoversApiTest#editRankAndParent. Delete the QA profile afterwards.
**Developer comments** none
**Previous retests** none

## NDC-2542 — Users | Invitation lifetime is not validated: 0 and -1 days silently become 7 days, 10000 days is accepted
uuid: 8e2be0f9-cff6-462b-b7c3-423f4cab4493 · priority: low
**Steps**
1. Settings › Users → Invite user; non-CRM email, profile User, lifetime 0 → Send.
2. Repeat with -1 and 10000.
3. Check Invitation Status/expiry (`GET /api/v1/iam/users?app_key=crm`, invitationExpiresAt).
4. API: `POST /api/v1/iam/users/invite` with lifetime_days 0, -1, 10000.
**Expected**
- Out-of-range lifetime refused with a clear message (UI + API); the typed value is never silently replaced.
**Actual (old)**
- 0 → 200, 7 days; -1 → 200, 7 days; 10000 → 200, expires 12 Mar 2054; no warning. (Bad email / missing profile correctly 400.)
**Environment** NDC-Staging Settings › Users; ndc-staging-owner; 25 Oct case US-06; automation crmaccess/AdminApiTest#inviteValidation. Use @example.com addresses and cancel the invitations.
**Developer comments** none
**Previous retests** none

## NDC-2539 — Approval Process | ${owner} merge field is empty in Call Webhook actions
uuid: 50a9cd2d-4c9c-4435-9e47-896495d622c3 · priority: low
**Steps**
1. Approval process on Leads, approver user A, After final approval → Call Webhook POST to a request catcher, body `{"recordId":"${recordId}","owner":"${owner}"}`.
2. Create a matching lead, approve as A (also check After rejection).
3. Compare with a workflow rule On Create using the same webhook body.
**Expected**
- "owner" = lead owner in both.
**Actual (old)**
- Workflow: "owner":"3445ec4a-…"; approval (approve and reject): "owner":"" (WH-08 lead c1854c85…, WH-09 e64ea33c…; workflow WH-01 eba4bdbe…). Other merge fields (recordId, moduleId, first_name) filled.
**Environment** staging-crm, API, 25 Oct, CRM Admin. Needs a webhook receiver + approver login. Related NDC-2541.
**Developer comments** none
**Previous retests** none (our own 25 Oct update WH-15: lead 6a888f8b… owner 3445ec4a… before/after; approval webhook "owner":"", workflow webhook filled).

## NDC-2415 — Hierarchy Preference | Change history doesn't show who changed the mode
uuid: 8881a557-6d80-40ab-96a8-c877c5cae723 · priority: low
**Steps**
1. Company Settings → Hierarchy Preference.
2. Switch the mode and switch it back.
3. Look at Change history (`GET /api/v1/settings/history?app_key=general&key=general.company.hierarchy.preference&scope_type=Org&limit=10`).
**Expected**
- Each row shows who made the change, next to value and time.
**Actual (old)**
- Rows show only "Reporting-based → Role-based" + date/time; the API already returns changed_by (97be04b6-…).
**Environment** NDC-Staging, web, 21 Oct, owner. Automation crmhierarchy B5/D2. SHARED SETTING — set the mode back to Role-based.
**Developer comments** none
**Previous retests** Previous retest: FAIL 25 Oct (Wave 1): history still lacks who changed it (B5/D2).

## NDC-2322 — Workflow Rules | A rule with exactly 25 conditions is refused ("this one has 26")
uuid: b6dca941-9531-4498-a32f-228999060e53 · priority: low
**Steps**
1. `POST /api/v1/workflow/rules` Leads On Create, criteria = one And group with 24 leaf conditions → 201.
2. Same with 25 leaf conditions (or edit the rule in the UI, add a 25th AND, save).
3. Optional: 26 → must fail.
**Expected**
- 25 conditions saved; error only from the 26th, counting only leaf conditions (Zoho: 25 criteria per pattern).
**Actual (old)**
- 400 "A rule's criteria may have at most 25 conditions (this one has 26)." — the And group is counted.
**Environment** staging-crm, API, 19 Oct, CRM Admin. Delete test rules afterwards.
**Developer comments** none
**Previous retests** none

## NDC-1678 — Teamspace | No option to set a teamspace icon/logo; admin can't be changed (disabled picklist); description doesn't persist
uuid: ad63df05-31fd-4e0f-b49c-a379b550dab5 · priority: low
**Steps**
1. Settings > Customization > Teamspace → Create New Teamspace.
2. Name "Marketing Teamspace" + a description; try to change the initials tile.
3. Add Modules → select one → confirm.
4. Permissions → click the Admin dropdown.
5. Save; reopen: retry tile/Admin; check the description.
6. Re-enter the description → Save → reopen and check.
**Expected**
- Upload an image / choose an icon instead of the initials tile; shown in the settings list and sidebar switcher.
- Admin field opens and allows another user.
- Description saved and shown on reopen (create and edit).
**Actual (old)**
- Initials tile only, no upload/edit affordance.
- Admin picklist greyed out, doesn't open; admin fixed to creator.
- Description empty after create and after edit.
**Environment** crm.taviportal.com (use staging) Settings > Customization > Teamspace; "Marketing Teamspace" (1 module "test", All Users, admin ndc-staging-owner); Edge 152; 16 Sep; reporter valafo4080. Delete the test teamspace afterwards.
**Developer comments** none
**Previous retests** none

---

## Cross-ticket notes

**Developer comments found:** only 2 of 47 tickets — NDC-1444 and NDC-1172, both by dev user 00a20184-a95d-4ad8-a9d9-6273a8ba704f on 21 Oct, both "FIXED" with stated limits. No "not a bug" / "by design" claims anywhere. The NDC-1172 comment is a partial verification by the developer (owner only, no separate CRM Admin login, org-unit option not tested). On NDC-1444 the developer asked QA to confirm end-to-end; that failed on save (now NDC-2383).

**Webhook receiver URL needed**
- NDC-2540 (blueprint After-transition + SLA escalation webhook), NDC-2541 (approval webhook; receiver must answer HTTP 500), NDC-2539 (approval webhook body ${owner}), NDC-2323 (scheduled workflow webhook after 2 min).
- URLs mentioned: only "https://webhook.site/…" (truncated in NDC-2540's request; NDC-2541 says "a webhook.site URL set to status 500"). No full receiver URL is recorded in any description or comment, so a fresh catcher must be created. NDC-2537 (internal-address check) applies to webhook targets.

**Second user account needed (sign in as another user)**
- NDC-2412, NDC-2413: two users without view-all — valafo4080 (test user 2; temporarily Supervisor/Manager) + nameb56175 (test user 1, User, Sales).
- NDC-2416: nameb56175 (User profile) calls PUT /iam/me/profile.
- NDC-1701: valafo4080, granted access but not admin.
- NDC-1699: a real Manager-profile user (the ticket's mahmoud.mahamed1515 is now CRM Admin, so one may not exist).
- NDC-1172: a CRM Admin NOT on the teamspace list + a covered user (nameb56175) + creator ndc-staging-owner.
- NDC-2414: Supervisor + Desk Administrator user (mahmoud.mmohamedsamy) + a Supervisor-only control.
- NDC-2297, NDC-2296: a User-profile account creates the lead + a CRM Admin reviewer/approver.
- NDC-2309, NDC-2308: user X (3445ec4a…) to see My Reviews / approve; process admin Y.
- NDC-2541, NDC-2539: approver user A (Supervisor account) to approve/reject.
- NDC-2545: two extra sessions (test user 2 busy + Supervisor idle) besides the Owner.
- NDC-2422, NDC-2411: member users A/B + fallback user; A must have no session / be suspended.
- NDC-2391: user A = mahmoud.mahamed1515 creates the lead.

**Shared tenant settings touched (restore immediately)**
- Hierarchy Preference mode Role/Reporting (NDC-2412, 2413, 2415): leave on Role-based. User profiles / reporting managers changed temporarily (2412, 2413, 2416).
- Security Policies idle timeout → 2 min (NDC-2545): restore to 60.
- Built-in "User" profile rename (NDC-2543): rename back to "User" at once.
- Module enable/disable toggle (NDC-1864). Email "required" was left on Leads by the NDC-2423 recording (leads without email refused): check the current state first.
- User suspend (NDC-2411): reactivate.
- Active automation config: assignment rules (2298, 2419, 2422, 2411, 2309, 2308), approval processes (2334, 2308, 2296, 2541, 2539), review processes (2309, 2297, 2302), workflow rules (2391, 2323, 2302, 2322), blueprints (2540, 2334). Deactivate/delete QA rules so they don't hit other testers' records.
- A new custom module is auto-enabled as a conversion target (NDC-2388, via NDC-2384): delete the test module.
- Login History "Clear All Sessions" (NDC-2418): do not use.

**Dependencies / ordering**
- NDC-2419 (assignment sets no owner) blocks NDC-2411, NDC-2422, NDC-2309, NDC-2308, and partly NDC-2298. Run 2419 first.
- NDC-2418 (stale Active sessions) blocks NDC-2422.
- NDC-2383 (slow layout save lost) blocks the end-to-end part of NDC-1444.
- NDC-2384 (create-module dialog) is needed for NDC-2388 (otherwise create the module via API).
- NDC-2382 is the root cause of NDC-1302/1312/1316/1324.

**Data that may not exist / may have changed**
- NDC-1699: Manager-profile user (mahmoud.mahamed1515 is now CRM Admin).
- NDC-2412/2413: valafo4080 and nameb56175 must still lack view-all; profile "test" grants view-all.
- NDC-2382: Deals pipeline "1" (640e03a4…) and a deal on it created by import.
- NDC-2383/1444: "QA RT layout" (f01e6c73…) and the FieldPermissions layout (563411f4…) on Leads.
- NDC-2385: the QA-RT-inv.csv invalid-row file.
- NDC-2298, 2308: a file with lead first name "B04"; NDC-2296: Last Name "B01 test".
- NDC-1701: teamspace "test" 8ee1838d…; NDC-1172: "TestTeamspace" / "QA RT 1172".
- NDC-2414: the lead count of 10,848 will differ.
- NDC-1863, 1873: use throw-away fields on a Leads layout (don't delete real fields like "lookup0").
- NDC-2282: the ticket records no environment or steps.
- Several old tickets (NDC-1863, 1864, 1873, 1699, 1172, 1701, 1678, 1823) cite production crm.taviportal.com. Retest them on staging.
