// Builds the annotated images for the Wave 1 leftovers, the settings finding and NDC-2098 (27 Oct 2026), approved layout.
// TAVI panels are screenshots or API facts cards from after/*.json; Zoho panels are earlier read-only captures (dates in captions).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const S = path.resolve(__dirname, '..');
const card = (out, title, lines) => { const f = path.join(S, 'scripts', 'card-' + out.replace('.png', '') + '.json'); fs.writeFileSync(f, JSON.stringify({ out, title, lines }, null, 1)); execFileSync('node', [path.join(S, 'scripts/apicard.js'), f], { stdio: 'pipe' }); return fs.readFileSync(path.join(S, 'evidence/raw', out)).readUInt32BE(20); };
const build = spec => { const f = path.join(S, 'scripts', `spec-${spec.out.replace('.png', '')}.json`); fs.writeFileSync(f, JSON.stringify(spec, null, 1)); execFileSync('node', [path.join(S, 'scripts/annotate-vs-zoho.js'), f], { stdio: 'pipe' }); console.log('built', spec.out); };
const ENV = 'staging-crm.taviportal.com (owner, test user 1) vs Zoho CRM org943261092 (read-only captures)', D = '27 Oct 2026';
const Z = (img, h, caption, boxes) => ({ img, w: 1600, h, crop: [0, 0, 1600, h], caption, boxes: (boxes || []).map(([b, n]) => ({ b, n, color: '#16a34a' })) });
const T = (img, w, h, caption, boxes) => ({ img, w, h, crop: [0, 0, w, h], caption, boxes: (boxes || []).map(([b, n]) => ({ b, n })) });

build({ out: 'NDC-2098-retest.png', ticket: 'NDC-2098', verdict: 'PASS', label: 'RETEST PASS', title: 'A deleted view id in the URL opens All Leads', env: ENV, date: D,
  panels: [T('t-ndc2098-deleted-view.png', 1280, 720, 'TAVI — QA view created, opened, deleted by API, then /modules/{Leads}?view={deleted id} opened again: the URL drops ?view and the list shows "All Leads", 172 records.', [[[284, 150, 380, 182], 1], [[262, 70, 380, 125], 2]]),
    Z('z-leads-views.png', 950, 'Zoho — Leads view picker (captured 25 Oct).', [])],
  rows: [['1', 'Open a deleted view by its link', 'Not checked live with a deleted view id', 'Falls back to the default "All Leads" view; the deleted view does not open', 'PASS'],
    ['2', 'The list loads', 'Not checked live', 'Loaded once the slow first load finished (the automated check timed out at 60 s, NDC-2136)', 'INFO']] });

const hJ4 = card('api-j4.png', 'TAVI API — J4 indirect report in Reporting mode, 27 Oct 2026', [
  ['Hierarchy mode role -> reporting (200). Chain: test user 1 (top, User profile, no view-all) -> zzsweep-tavi-probe (middle) -> zzsweep-tavi-probe2 (bottom)', 'info'],
  ['QA lead owned by the BOTTOM user, read as test user 1 -> 200 (visible), also in its Leads list', 'ok'],
  ['QA lead owned by the MIDDLE user (direct report), read as test user 1 -> 200 (visible)', 'ok'],
  ['Control: QA lead owned by the Supervisor (outside the chain) -> 403 PERMISSION_DENIED', 'ok'],
  ['Restored: both managers cleared (204), mode back to role (200), 3 QA leads deleted and purged', 'info']]);
build({ out: 'W1-J4-retest.png', ticket: 'Wave 1 J4', verdict: 'PASS', label: 'PASS', title: 'Reporting hierarchy: a manager sees records of an indirect report', env: ENV, date: D,
  panels: [T('api-j4.png', 1600, hJ4, 'TAVI — API facts (CRM owner sets up, test user 1 reads).', [[[8, 168, 1592, 256], 1], [[8, 256, 1592, 278], 2]]),
    Z('z-roles.png', 900, 'Zoho — Roles hierarchy (captured 25 Oct).', [])],
  rows: [['1', 'Manager sees the records of a report\'s report', 'Roles tree as captured; record visibility not checked live', 'Indirect and direct reports\' leads visible to the top manager', 'PASS'],
    ['2', 'Records outside the chain stay hidden', 'Not checked live', 'A lead owned by someone outside the chain answers 403', 'PASS']] });

build({ out: 'W1-SP03-retest.png', ticket: 'Wave 1 SP-03', verdict: 'PASS', label: 'PASS', title: 'Max concurrent sessions can be raised (20 -> 25) and is shown', env: ENV, date: D,
  panels: [T('t-sp03-25.png', 1280, 720, 'TAVI — Security Policies after PUT max_concurrent = 25 (200): the field shows 25; existing sessions of the owner and test user 1 kept working (200). Restored to 20 (read back).', [[[781, 257, 893, 291], 1]]),
    Z('z-security-policies.png', 900, 'Zoho — Security Policies (captured 25 Oct). Session limits live in Zoho Directory, which is not enabled in this org.', [])],
  rows: [['1', 'Raise the session limit and see it on screen', 'Not checked live (Zoho Directory not enabled)', 'Saved as 25 and shown as 25; set back to 20 at once', 'PASS'],
    ['2', 'More sessions than the limit are refused', 'Not checked live', 'Not exercised: would need 26 sign-ins (rate limit risk)', 'INFO']] });

build({ out: 'W1-FP02-retest.png', ticket: 'Wave 1 FP-02', verdict: 'PASS', label: 'PASS', title: 'Layout builder: a field permission set in the dialog is stored', env: ENV, date: D,
  panels: [T('t-fp02-dialog.png', 1280, 720, 'TAVI — Leads › Standard layout › Company › Set Permission: Permissions tab, Read / Edit per profile ("Per-profile permissions save as soon as you change them"). Edit unticked for a QA profile -> stored company = read_only; ticked again -> read_write; QA profile deleted; layout never saved.', [[[1030, 260, 1260, 300], 1]]),
    Z('z-layout-editor.png', 950, 'Zoho — layout editor (captured 26 Oct).', [])],
  rows: [['1', 'Set a field\'s permission per profile from the layout builder', 'Layout editor as captured; per-field permission not checked live', 'Edit off for the QA profile stored read_only at once (API), and read_write when ticked again', 'PASS']] });

build({ out: 'W1-US08-observation.png', ticket: 'Wave 1 US-08', verdict: 'PARTIAL', label: 'OBSERVATION', title: 'Owner changing their own profile: no warning before Assign', env: ENV, date: D,
  panels: [T('t-us08-owner-pick.png', 1280, 720, 'TAVI — Users › owner\'s own record: "User (rank 100)" picked under Assign profile; Assign is enabled and no warning is shown. Assign was NOT clicked (the Owner profile cannot be given back).', [[[329, 645, 951, 684], 1]]),
    Z('zoho-standard-profile.png', 1000, 'Zoho — built-in profiles (captured 25 Oct). Zoho\'s own-user screen was not checked live.', [])],
  rows: [['1', 'Warning before the owner changes their own profile', 'Not checked live', 'No warning shown before Assign; the result of clicking it was not tried', 'PARTIAL'],
    ['2', 'Give the Owner profile to a second account', 'Not checked live', 'Refused: 409 OWNER_PROFILE_LOCKED "cannot be assigned or transferred" (so no second owner-level account can exist)', 'INFO']] });

build({ out: 'W1-PE06-finding.png', ticket: 'Wave 1 PE-06', verdict: 'FAIL', label: 'FINDING', title: 'No view-only permission for profiles; the page shows a raw permission error', env: ENV, date: D,
  panels: [T('t-pe06-user1-permissions.png', 1280, 720, 'TAVI — test user 1 (no iam.profile.manage) opens Settings › Permissions by URL: the page opens and its profile list shows "Missing required permission \'iam.profile.manage\'."; GET /iam/profiles answers 403.', [[[300, 190, 575, 235], 1]]),
    Z('z-profiles.png', 900, 'Zoho — Profiles (captured 25 Oct).', [])],
  rows: [['1', 'A user who may only look at profiles sees a read-only page', 'Not checked live', 'Not possible: the permission catalog has only iam.profile.manage, no view-only permission', 'FAIL'],
    ['2', 'A user without access gets a clear "no access" page', 'Not checked live', 'The page opens by URL and shows the raw permission key in red', 'FAIL']] });

const hBH = card('api-business-hours.png', 'TAVI API — business hours check, 27 Oct 2026', [
  ['GET /iam/tenant/business-hours -> preset 24_7, all 7 days, timing_mode "same", hours 09:00–17:00, Africa/Cairo', ''],
  ['PUT the same object back, unchanged -> 400 business_hours.invalid_timing_mode', 'bad'],
  ['  "24_7 preset must have timing_mode, hours, hours_per_day, slots and slots_per_day all null."', 'bad'],
  ['PUT with Sunday off -> 400 "24_7 requires all 7 days."  (correct)', 'ok'],
  ['Stored record unchanged (read back); company fax and fiscal start month were changed and restored (200)', 'info']]);
build({ out: 'BH-resave-candidate.png', ticket: 'Business hours', verdict: 'FAIL', label: 'NEW CANDIDATE', title: 'Stored business hours fail the API\'s own check, so they can\'t be saved again unchanged', env: ENV, date: D,
  panels: [T('api-business-hours.png', 1600, hBH, 'TAVI — API facts. The stored value mixes the 24x7 preset with fixed hours, which the save rule forbids.', [[[8, 146, 1592, 240], 1]])],
  rows: [['1', 'Re-save the business hours as stored', 'Not checked live', '400: the stored 24x7 record carries hours 09:00–17:00 and timing mode "same", which the save rule forbids', 'FAIL']] });

const hUS = card('api-us13.png', 'TAVI API — throwaway user for US-13 / PS-06, 27 Oct 2026', [
  ['POST /iam/users/invite (hmohamed@anyware.software, User profile, 1 day) -> 409 SUBSCRIPTION_SEAT_LIMIT_REACHED', 'bad'],
  ['  message is the raw key "iam.subscription.seat_limit_reached"', 'bad'],
  ['Login page › Register opens "Create account" (a new account, not a member of this tenant) — not submitted', 'info'],
  ['No invite was created, nothing to cancel', 'info']]);
build({ out: 'W1-US13-PS06-blocked.png', ticket: 'Wave 1 US-13 / PS-06', verdict: 'BLOCKED', label: 'BLOCKED', title: 'No throwaway user possible: the tenant has no free seat', env: ENV, date: D,
  panels: [T('api-us13.png', 1600, hUS, 'TAVI — API facts.', [[[8, 70, 1592, 160], 1]])],
  rows: [['1', 'Invite a throwaway user to delete it / change its password', 'Not checked live', 'Refused: seat limit reached (shown as a raw message key)', 'BLOCKED']] });

build({ out: 'Referral-sync-blocked.png', ticket: 'Referral Code sync', verdict: 'BLOCKED', label: 'BLOCKED', title: 'Directory sync not set up; "Sync now" not pressed (permission check)', env: ENV, date: D,
  panels: [T('t-referral-page.png', 1280, 720, 'TAVI — Settings › Referral Code Integration: no base URL, no API key, sync off, no runs ("Add the base URL and API key and save before running it").', [])],
  rows: [['1', 'Run one directory sync and diff users', 'Not applicable', 'Not run: the integration is not configured, and the attempt to press Sync now was blocked by the session\'s permission check', 'BLOCKED']] });
