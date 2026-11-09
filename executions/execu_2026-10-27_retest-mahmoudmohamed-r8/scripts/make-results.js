// Writes results.json for round 6 (26 Oct 2026, 47 CRM tickets) from the verified notes (notes-r6.md). Usage: node scripts/make-results.js
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..');
const meta = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const P = s => s.charAt(0).toUpperCase() + s.slice(1);
const F = name => (name.split(' | ')[0] || '—').trim();
const ND = 'No developer note.';
const OPEN = 'Not retested yet: staging outage from ~15:45 UTC (IAM 500, sign-in "Exception was thrown by handler.").';
// [id, verdict, devNote, devHeld, summary, still[]]
const T = [
  ['2381', 'BLOCKED', ND, '—', 'Audit API returns 500 since ~14:30 UTC (AuditLogTest: "GET audit crm returned 500"), so new events cannot be read. Passed on 25 Oct.', []],
  ['2382', 'PASS', ND, '—', 'Blocker found: Deals has a CUSTOM pick-list field with api name "pipeline" (created 24 Oct by ndc-staging-owner on layout "Wonder Travel", allowed only "Standard (Standard)") that validates every deal\'s pipeline → 422. Widened for the test and restored exactly. Then: create on pipeline "1" → stored on "1"; PATCH a Standard deal to "1" → moved with stage test-01; stage not in "1" → 422.', []],
  ['2412', 'PARTIAL', ND, '—', 'Role mode (VisibilityTest): Manager (500) in the same department now sees a User\'s leads. A Supervisor (300) in the same department still does not ("Users see their own records and those of lower-ranked users in their department"), nor does a superior in another department (preview: "A Manager sees every User in the tenant…"). Controls correct.', ['Supervisor same department: lower-ranked User\'s leads not visible.', 'Superior in another department: User\'s leads not visible although the preview promises it.']],
  ['2413', 'PASS', ND, '—', 'Reporting mode (VisibilityTest): reporting manager sees the direct report\'s leads; also as Supervisor; report cannot see manager; user outside the chain sees nothing. Indirect (2 levels) not checked (needs a third user without view-all).', []],
  ['2416', 'PASS', ND, '—', 'HierarchyApiTest.userCannotSetOwnManager: a User-profile user can no longer change their own reporting manager through PUT /iam/me/profile; admin endpoint still refused.', []],
  ['2298', 'BLOCKED', ND, '—', 'Server part PASS (A-04): an API-only rule chosen on an import assigns no owner; an Import-channel control rule does. Wizard part (is the API-only rule still offered?) not checked — staging outage.', []],
  ['2281', 'PASS', ND, '—', 'Leads › Filter › Owner offers Current user + exactly the 9 CRM users; no Desk-only agents.', []],
  ['1863', 'PASS', ND, '—', 'Field ⋮ → Remove from Layout → "Delete Permanently" on a QA field → DELETE 204; Save → layout PUT 200, no error; field gone from module and layout.', []],
  ['1864', 'PASS', ND, '—', 'QA module switched off: not in the sidebar; direct URL shows "QA RT partners is disabled … records can\'t be opened or created"; list and create → 403 "This module is disabled".', []],
  ['1701', 'BLOCKED', ND, '—', OPEN + ' Automation (25 Oct scope) still passes: a plain member cannot rename the teamspace or make itself admin. Adding modules, folders and changing the access list/mode as a member not yet checked.', []],
  ['2540', 'PASS', ND, '—', 'Blueprint webhooks: After-transition → 1 request (WH-10); SLA escalation → field update + 1 request (WH-11); also from the designer screen (WH-22).', []],
  ['2423', 'PASS', ND, '—', 'On QA fields of a QA layout: Phone validation regex and Email Mark as Unique + Required persist after Save and reload; records are validated accordingly (bad pattern / duplicate / missing → 422).', []],
  ['2419', 'PARTIAL', ND, '—', 'Import choosing the rule → owner = rule user (A-02 PASS). API-channel create → owner stays the creator (test user 1) instead of the rule user (test user 2) (A-01 FAIL).', ['API-channel create: the rule fires but the owner is not set to the rule\'s user.']],
  ['2418', 'BLOCKED', ND, '—', 'Login History API returns 500 since ~14:30 UTC (LoginHistoryTest), so stale "Active" sessions cannot be counted.', []],
  ['2384', 'PASS', ND, '—', 'Create module dialog now has Module name (plural) and (singular), auto-filled; "QA RT partners" created (POST 201).', []],
  ['2383', 'PASS', ND, '—', 'Rollup Summary added on a QA layout → Save: field 201 (2 s), layout PUT 200 (3 s), rollup on the layout after reopen. The save is now 3 s, so a truly slow save could not be reproduced.', []],
  ['2334', 'PASS', ND, '—', 'Deal in a published blueprint edited to match an On Edit approval → no approval, stays governed; control deal outside the blueprint → pending approval (F-20). Scenario 2 not covered.', []],
  ['2309', 'PASS', ND, '—', 'Imported, rule-assigned lead under review → reviewer = assigned owner, who can approve (F-01). Checked on Leads (ticket was Contacts).', []],
  ['2308', 'PASS', ND, '—', 'Imported, rule-assigned lead → current approver = assigned owner, who can approve (F-03).', []],
  ['2297', 'PASS', ND, '—', 'Convert a lead under review → 422 REVIEW_LOCKED, as User and as CRM Admin (H-02).', []],
  ['2296', 'PASS', ND, '—', 'Convert (and delete) a lead awaiting approval → 422 APPROVAL_LOCKED, as User and as CRM Admin (D-21, H-03).', []],
  ['2293', 'BLOCKED', ND, '—', 'Audit Log screen opens (AccessScreensUiTest) but the audit API returns 500, so the entity filter options (duplicates, grouping) cannot be judged.', []],
  ['1873', 'PASS', ND, '—', 'Renaming a new Lookup to "Lookup Contacts" updates the read-only API name to lookup_contacts; saved (201/200); a second field with the same label gets lookup_contacts_2.', []],
  ['1699', 'BLOCKED', ND, '—', OPEN + ' Automation: a Supervisor not on the access list cannot see or open the teamspace; the Manager profile itself still to check.', []],
  ['1444', 'PASS', 'FIXED (21 Oct): rollup lookup check accepts single, multi-module and related_module lookups; please confirm end to end.', 'Yes — confirmed end to end.', 'Transactions (Deals) offers Connected To / Lookup / Multi-Select Lookup, Customers (Contacts) Connected To / Lookup, no false warning; rollup Connected To › Amount › Sum saved with the layout.', []],
  ['1172', 'BLOCKED', 'FIXED (21 Oct), verified only as owner; org-unit option not tested.', 'Partly — separate CRM Admin refused (automation); Settings › Teamspace list still to check.', OPEN + ' Automation: a CRM Admin not on the access list cannot see or open the teamspace. Still to check: Settings › Teamspace list / Edit page, org-unit option.', []],
  ['2545', 'PASS', ND, '—', 'Idle timeout 2 min: busy session stays signed in through 210 s; idle session signed out; policy restored to 60. Login History part not checkable (audit 500).', []],
  ['2543', 'PASS', ND, '—', 'Renaming the built-in User profile → 409 SYSTEM_PROFILE_PROTECTED "Built-in profiles cannot be renamed…"; not renamed.', []],
  ['2541', 'PASS', ND, '—', 'Approval Call Webhook to a 500 receiver: approve and reject each retried (3 requests in 4 min) and logged (dispatch Pending, attempts 3).', []],
  ['2422', 'PASS', ND, '—', 'Online status on: the offline first member is skipped and the online owner gets the lead; off (control): the first member gets it.', []],
  ['2414', 'FAIL', ND, '—', 'HierarchyApiTest.deskProfileGrantsCrmViewAll: a CRM Supervisor who also has the Desk Administrator profile still gets view-all on CRM records.', ['The Desk Administrator profile still grants CRM records.view_all.']],
  ['2411', 'PASS', ND, '—', 'Suspended first member skipped; the fallback (Supervisor) gets the lead; test user 2 reactivated right after.', []],
  ['2391', 'PASS', ND, '—', 'Workflow with an Owner condition fires for the assigned owner (F-02).', []],
  ['2388', 'PASS', ND, '—', 'New module QA RT partners is listed under Conversion Targets switched off (isConversionTarget false).', []],
  ['2386', 'PASS', ND, '—', 'RecordScreensUiTest.pipelinesPageLoads: Settings › Pipelines opened directly is no longer stuck on "Loading board…".', []],
  ['2385', 'BLOCKED', ND, '—', OPEN, []],
  ['2323', 'PASS', ND, '—', 'Scheduled (2 min) webhook: the lead converted at once never sent it; the control lead sent it at +2 min; the receiver got only the control.', []],
  ['2302', 'PASS', ND, '—', 'Import with automation off into a review → after approval the workflow does not run (G-04). INFO: a lead imported with automation off still enters a blueprint (governed=true).', []],
  ['2282', 'PASS', ND, '—', 'Deals Kanban: Layout picklist only in the page header; toolbar Pipeline picklist has a visible "Pipeline" label.', []],
  ['1823', 'PASS', ND, '—', 'Convert › Create a new Deal: Probability and Expected Revenue locked (read-only); Stage + Amount fill them in (10, 1000).', []],
  ['2547', 'PASS', ND, '—', 'Permissions page button now reads "Create profile" and opens "Create profile".', []],
  ['2546', 'PASS', ND, '—', 'PATCH rank 600 under a rank-300 parent → 400 "Profile rank (600) must be lower than parent profile\'s rank (300)."; valid edits 204.', []],
  ['2542', 'PASS', ND, '—', 'Invitation lifetime 0 and 10000 → 400 "lifetime_days must be between 1 and 90 days"; bad email / no profile 400.', []],
  ['2539', 'PASS', ND, '—', 'Approval Call Webhook body "owner" = the lead owner after approve (WH-15) and after reject (WH-09).', []],
  ['2415', 'PASS', ND, '—', 'Hierarchy change history shows who changed the mode (B5/D2).', []],
  ['2322', 'PASS', ND, '—', 'One And group: 24 and 25 conditions saved; 26 refused "at most 25 conditions (this one has 26)".', []],
  ['1678', 'BLOCKED', ND, '—', OPEN + ' API: a new teamspace keeps its description; the teamspace object now has icon / iconColor fields.', []],
];
// 27 Oct: results after staging recovered (overrides the 26 Oct BLOCKED rows)
let OVR2412_still;
const OVR = {
  2381: ['PASS', 'Rerun 27 Oct after the outage: record create/update/delete and setup changes appear in the Audit Log (AuditLogTest recordLifecycleIsLogged, setupChangesAreLogged).'],
  2418: ['PASS', 'Rerun 27 Oct: expired sessions are no longer Active (LoginHistoryTest.expiredSessionsNotActive); a revoked session stops working; a denied user cannot export.'],
  2293: ['PASS', 'All Entities filter: 67 options, no duplicates; related entities grouped (Approval and Approval Override under Approval Process; Saved View Sharing next to Saved View); Test / Module view pin / User list preference removed. INFO: "Audit Log Entry" and "Mail agent signature row" still look internal.'],
  1701: ['PASS', 'Plain member (test user 1) of a QA teamspace: create folder, change access list, rename, create module and change access mode are all refused (403); Settings › Teamspace says "You don\'t have permission to manage teamspaces"; teamspace unchanged.'],
  1699: ['PASS', 'Retest 27 Oct with test user 2 switched to the Manager profile (by the user): teamspace QA RT TS r6 limited to profiles User / Supervisor / test (no Manager) → not in the Manager user\x27s teamspace list or switcher; opening it and its folders → 403. Control: a teamspace whose org unit covers the user (QA RT 1172) is listed. Supervisor not on a list also refused (automation).'],
  1172: ['PASS', 'CRM Admin not on the access list (selected users, then an org unit he is not in): teamspace not listed, opening it and its folders → 403, not listed in Settings › Teamspace; the teamspace admin keeps access. Profile option covered by automation.'],
  1678: ['PASS', 'Edit Teamspace: icon picker (20 icons, 8 colours), admin picker opens and saves (admin changed), description persists; the saved icon (pink rocket) shows in the list. INFO: Add Modules lists raw module keys; Save needs at least one module; handing admin to someone else makes the follow-up access-mode call fail (403) silently.'],
  2385: ['PASS', 'Import Review: "Rows with errors 1"; the All errors table lists Row 3 | Percent Permission | 250 | "The value isn\'t a valid percentage: Percent value must be between 0 and 100." | Invalid format.'],
  2298: ['PASS', 'Import Assign step offers the Import-channel QA rule but not the API-only one; and an API-only rule picked on an import assigns no owner (A-04).'],
};
OVR['2412'] = ['FAIL', 'Against the expected rule given by the user on 27 Oct (same profile never; higher rank sees lower ranks in the SAME org unit only; other org units never; owner sees all): 7 cases follow it (I2, I2b, I1/I5, I3b, I7, I4, I8); 2 do not — I3 a Supervisor does not see a User\x27s leads in the same org unit, and I4b a Manager in another org unit DOES see a User\x27s leads. Visibility follows the profile parent tree tenant-wide, ignoring org unit and rank.'];
OVR2412_still = ['I3: Supervisor (300) does not see a lower-ranked User (100)\x27s leads in the same org unit.', 'I4b: Manager (500) in another org unit (HR) sees a User\x27s leads in Sales.'];
OVR['2302'] = ['PASS', 'Import with Trigger automation off: workflow, approval and review do not run (G-04), and the lead does not enter a blueprint (TAVI lead not governed; same in live Zoho org943261092). Option on and manual create: the lead enters the blueprint in both TAVI and Zoho. INFO: a lead held for review and later approved can enter a blueprint because the approval is an edit (Zoho also evaluates blueprints on edit).'];
for (const row of T) if (OVR[row[0]]) { row[1] = OVR[row[0]][0]; row[4] = OVR[row[0]][1]; if (row[0] === '2412') row[5] = OVR2412_still; }
const tickets = T.map(([id, v, dev, devHeld, summary, still]) => ({ id: 'NDC-' + id, uuid: meta[id].uuid, pri: P(meta[id].pri), mod: 'CRM', feat: F(meta[id].name), title: meta[id].name, v, dev, devHeld, summary, still: still.length ? still : null, img: fs.existsSync(path.join(RUN, 'screenshots/annotated', `NDC-${id}-retest-${v}.png`)) ? [`NDC-${id}-retest-${v}.png`] : [] }));
const R = { batch: 'CRM', title: 'Retest round 6 — Mahmoud Mohamed · NDC · 47 CRM tickets', date: '26 Oct 2026',
  env: 'staging-crm.taviportal.com · tenant NDC-Staging · Edge headless + API + automation · mahmoud.mahamed1515 (CRM Admin); test users 1/2, ndc-staging-owner via automation',
  devNote: 'Developer comments on 2 of 47 tickets (NDC-1444, NDC-1172, both 21 Oct "FIXED"). Staging outage 26 Oct ~14:30–(next morning); the 9 blocked tickets were retested on 27 Oct after recovery.',
  tickets,
  observations: [
    ['New defect', 'A custom field can take the system api name "pipeline" and then validates every deal\'s pipeline', 'Deals custom pick list "pipeline" (24 Oct, ndc-staging-owner, layout Wonder Travel, allowed "Standard (Standard)") → any real pipeline id refused 422 "Invalid value for: Pipeline" module-wide. Root of the NDC-1302/1312/1316/1324 blockers in round 4.'],
    ['Decision', 'NDC-2302: import with automation off still enters a blueprint', 'Workflow, approval and review do not run; the lead is still governed by a blueprint. Ticket expected says Zoho\'s option also covers blueprints.'],
    ['Observation', 'Layout Save also rewrites untouched fields', 'Deleting a field and saving also PUT two unrelated fields (5dd25be0, 9eff6424), as reported in NDC-2383/2423.'],
    ['Environment', 'Staging outage', 'Audit 500 from ~14:30 UTC; IAM 503/500, /modules 500 and sign-in "Exception was thrown by handler." from ~15:45 UTC (still down at ~17:00).']] };
fs.writeFileSync(path.join(RUN, 'results.json'), JSON.stringify(R, null, 1));
const c = {}; tickets.forEach(t => c[t.v] = (c[t.v] || 0) + 1); console.log('results.json', tickets.length, c, 'missing images:', tickets.filter(t => !t.img.length && t.v !== 'BLOCKED').map(t => t.id).join(','));
