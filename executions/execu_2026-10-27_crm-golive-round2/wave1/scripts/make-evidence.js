// Round 2 Wave 1 evidence: one facts card (TAVI side, from logged facts only) + one annotated TAVI-vs-Zoho spec per
// retested ticket / finding, then renders them. Usage: node make-evidence.js [onlyId]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = path.resolve(__dirname), RAW = path.join(D, '../evidence/raw');
const ENV = 'staging-crm.taviportal.com, build of 27 Oct (acting admin CRM Admin B while the owner was unavailable) vs Zoho CRM org943261092 (read-only)';
// card line top (px) for line i: header 74 + padding 14 + 46 per line
const y = i => 88 + i * 46;
const box = (from, to, n, color) => ({ b: [20, y(from) - 2, 1580, y(to) + 44], n, ...(color ? { color } : {}) });
const Z = { // Zoho captures (1600x950) and the region to box
  profile: ['zoho-standard-profile.png', [1388, 56, 1578, 97]], profiles: ['z-profiles2.png', [256, 60, 1584, 400]],
  audit: ['z-audit-log.png', [287, 260, 1554, 620]], login: ['z-login-history.png', [256, 60, 1584, 600]],
  team: ['z-teamspace.png', [256, 60, 1584, 600]], roles: ['z-roles-sharing.png', [287, 270, 600, 380]],
  sharing: ['z-roles-sharing.png', [256, 66, 560, 110]], policies: ['z-security-policies.png', [256, 60, 1584, 600]],
  newuser: ['z-newuser.png', [256, 60, 1584, 600]],
};
const zsize = f => { const b = fs.readFileSync(path.join(RAW, f)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const items = [
  { id: 'NDC-2543', verdict: 'PASS', label: 'RETEST PASS', title: 'Built-in profiles can no longer be renamed or deleted', z: 'profile',
    lines: [['PATCH /iam/profiles/{User} name="QA R2W1 renamed User"', ''], ['-> 409 SYSTEM_PROFILE_PROTECTED "Built-in profiles cannot be renamed. Clone the profile to create one you can rename."', 'ok'],
      ['DELETE /iam/profiles/{User}', ''], ['-> 409 SYSTEM_PROFILE_PROTECTED "Built-in profiles cannot be deleted."', 'ok'], ['Profile "User" still listed with its name', 'ok']],
    rows: [['1', 'Rename the built-in User profile', 'Not possible: built-in Standard profile offers only Clone and View Users', 'Refused, 409 with a clear message', 'PASS', [1, 1]],
      ['2', 'Delete the built-in User profile', 'Not possible', 'Refused, 409 with a clear message', 'PASS', [3, 3]]] },
  { id: 'R2W1-B1', verdict: 'FAIL', label: 'NEW CANDIDATE', title: 'The new built-in "AI Agent" profile can be renamed (not protected like "User")', z: 'profile',
    lines: [['GET /iam/profiles -> "AI Agent" rank 10, isSystem=false (new in the 27 Oct build)', 'info'], ['PATCH /iam/profiles/{AI Agent} name="QA R2W1 renamed AI"', ''],
      ['-> 204, the name changed', 'bad'], ['Same call on the built-in "User" profile -> 409 SYSTEM_PROFILE_PROTECTED', 'ok'], ['Name set back to "AI Agent" at once and read back', 'info']],
    rows: [['1', 'Rename a built-in profile', 'Not possible for built-in profiles (Standard: Clone / View Users only)', '"AI Agent" renamed (204); it is not marked as a system profile', 'FAIL', [2, 2]],
      ['2', 'Same rule for the other built-in profile', 'Same rule for all built-ins', '"User" is protected (409)', 'INFO', [3, 3]]] },
  { id: 'NDC-2546', verdict: 'PASS', label: 'RETEST PASS', title: 'A rank above the parent profile is refused with a clear error', z: 'profiles',
    lines: [['QA profile under Manager (rank 500), own rank 100', 'info'], ['PATCH rank = 600', ''], ['-> 400 VALIDATION_ERROR "Profile rank (600) must be lower than parent profile\'s rank (500)."', 'ok'], ['rank read back = 100 (unchanged)', 'ok'], ['QA profile deleted (204)', 'info']],
    rows: [['1', 'Edit a profile rank above its parent', 'Zoho profiles have no ranks (not comparable)', 'Refused with 400 and a clear message, nothing stored', 'PASS', [2, 3]]] },
  { id: 'NDC-2547', verdict: 'PASS', label: 'RETEST PASS', title: 'The Permissions page button now says "Create profile"', z: 'profiles',
    lines: [['Screen test AccessScreensUiTest.profilesAndPermissions (CRM Admin B), 27 Oct', 'info'], ['Permissions matrix: button label = "Create profile" (was "Create permission")', 'ok'], ['The button opens "Create profile" - label and dialog now match', 'ok']],
    rows: [['1', 'Button label matches what it opens', '"New Profile" opens the new profile form', '"Create profile" opens "Create profile"', 'PASS', [1, 2]]] },
  { id: 'NDC-2418', verdict: 'PASS', label: 'RETEST PASS', title: 'Expired sessions are no longer listed as Active', z: 'login',
    lines: [['GET /audit/login-history?status=active (up to 1,000 rows)', ''], ['21 sessions listed Active; past their expiry: 0', 'ok'], ['(25 Oct: 306 of 346 "Active" sessions were already expired)', 'info']],
    rows: [['1', 'Only live sessions are listed as active', 'Login History shows sign-ins; no expired session listed as active', '0 of 21 active sessions past expiry', 'PASS', [1, 1]]] },
  { id: 'NDC-2381', verdict: 'PASS', label: 'RETEST PASS', title: 'The audit log records record create, edit and delete again', z: 'audit',
    lines: [['QA lead created, edited, deleted by the acting admin', ''], ['after 8 s: created=true, updated=true (with changes), deleted=true; actor named', 'ok'], ['Setup changes logged: profile created, field permission, user override (all true)', 'ok']],
    rows: [['1', 'Record changes appear in the audit log with who and what', 'Audit Log lists each action with the user', 'Created / updated / deleted logged within 8 s, actor and changes shown', 'PASS', [1, 2]]] },
  { id: 'NDC-2293', verdict: 'PASS', label: 'RETEST PASS', title: 'The audit log entity filter lists each entity once', z: 'audit',
    lines: [['GET /audit/events/facets (app keys as the screen sends them)', ''], ['53 entity options; duplicates (case-insensitive): none', 'ok'], ['Screen: 55 entity options, duplicates: none', 'ok'], ['Note: one call without app keys answered 500 once, 200 on the rerun (not reproduced)', 'info']],
    rows: [['1', 'Each entity is offered once in the filter', 'Filter lists each action / module once', '53 (API) / 55 (screen) options, no duplicates', 'PASS', [1, 2]]] },
  ...[['NDC-1172', 'A CRM Admin who is not on the teamspace list can\'t open it', 'F-1a CRM Admin (not on the list): opens=false, listed=false'],
      ['NDC-1699', 'A user whose profile is not on the list can\'t open the teamspace', 'F-1b Supervisor (not on the list): opens=false, listed=false'],
      ['NDC-1701', 'A teamspace member can\'t act as its admin', 'F-1c member rename -> 403; member makes self admin -> 403']].map(([id, t, f]) => ({
    id, verdict: 'PASS', label: 'RETEST PASS', title: t, z: 'team',
    lines: [['QA teamspace created with module Leads (a teamspace now needs at least one module, new in the 27 Oct build)', 'info'], [f, 'ok'], ['QA teamspace deleted', 'info']],
    rows: [['1', t, 'Teamspace access is limited to its members', f.replace(/^F-1. /, ''), 'PASS', [1, 1]]] })),
  { id: 'NDC-1337', verdict: 'PASS', label: 'RETEST PASS', title: 'Field permissions are enforced (hidden and read-only)', z: 'profiles',
    lines: [['Test user 2 on a QA profile: Company = hidden, Email = read-only', 'info'], ['create lead with Company -> 422 FIELD_PERMISSION_DENIED', 'ok'], ['edit Email -> 422 FIELD_PERMISSION_DENIED', 'ok'], ['read lead as test user 2: Company = null (not returned)', 'ok'], ['test user 2 back on Manager @HR; QA profile and field permissions deleted', 'info']],
    rows: [['1', 'A hidden field can\'t be written or read', 'Hidden fields are not shown or editable', 'Write refused (422); value not returned', 'PASS', [1, 3]], ['2', 'A read-only field can\'t be edited', 'Read-only fields are not editable', 'Edit refused (422)', 'PASS', [2, 2]]] },
  ...['NDC-1593', 'NDC-1599'].map(id => ({ id, verdict: 'PASS', label: 'RETEST PASS', title: 'Import respects field permissions', z: 'profiles',
    lines: [['Test user 2 (Company hidden) imports a lead with a Company value', 'info'], ['import: mapping 204, validate 200, execute 202 -> partially_completed, created 0, errors 1', 'ok'], ['No lead with the hidden value was created', 'ok']],
    rows: [['1', 'Import can\'t set a field the user may not write', 'Not checked live (would need an import in Zoho)', 'Row refused, 0 records created', 'PASS', [1, 2]]] })),
  { id: 'NDC-2416', verdict: 'PASS', label: 'RETEST PASS', title: 'A user can\'t change their own manager without permission', z: 'roles',
    lines: [['Test user 2 does not hold iam.personal.reporting_hierarchy', 'info'], ['PUT /iam/me/profile reporting_manager_id=null -> 403', 'ok'], ['manager unchanged (still the Supervisor)', 'ok']],
    rows: [['1', 'Changing your own manager needs permission', 'Users can\'t change their own place in the hierarchy', 'Refused 403; manager unchanged', 'PASS', [1, 2]]] },
  { id: 'NDC-2414', verdict: 'PASS', label: 'RETEST PASS', title: 'The Desk Administrator profile no longer gives CRM view-all', z: 'profiles',
    lines: [['Supervisor (+ Desk Administrator) reads a QA lead owned by the acting admin', ''], ['-> 403 (record outside its hierarchy)', 'ok'], ['Note: /iam/me/permissions still lists metadata.records.view_all for the Supervisor;', 'info'], ['      the Supervisor profile itself does not grant it (comes from Desk Administrator) - no effect seen', 'info']],
    rows: [['1', 'A Desk role does not open CRM records', 'Profiles are per app; CRM access only from the CRM profile', 'Read refused 403', 'PASS', [1, 1]], ['2', 'Permission list matches the effect', 'Not checked live', 'view_all still listed, but not applied', 'INFO', [2, 3]]] },
  { id: 'R2W1-GAP-U07', verdict: 'GAP', label: 'GAP', title: 'Data sharing rules: only public / hierarchy visibility per module', z: 'sharing',
    lines: [['Leads record visibility = hierarchy (read from the module)', 'info'], ['PUT /modules/{leads}/record-visibility {mode:"everyone-please"}', ''], ['-> 400 INVALID_RECORD_VISIBILITY, expected one of public, hierarchy; unchanged', 'ok'], ['No sharing-rule screen or API in the build (no rules per user / role / criteria)', 'bad']],
    rows: [['1', 'Default sharing per module', 'Data Sharing Settings: default access per module', 'public / hierarchy per module; bad values refused', 'PASS', [0, 2]], ['2', 'Sharing rules (share records with roles / groups)', 'Sharing rules in Data Sharing Settings', 'Not available', 'GAP', [3, 3]]] },
  { id: 'NDC-2658', verdict: 'FAIL', label: 'STILL FAILS', title: 'Inviting with no free seat shows a raw key', z: 'newuser',
    lines: [['POST /iam/users/invite (hmohamed@anyware.software)', ''], ['-> 409 SUBSCRIPTION_SEAT_LIMIT_REACHED  message "iam.subscription.seat_limit_reached"', 'bad'], ['Bulk invite row -> same raw key', 'bad'], ['Blocks NDC-2542 (invite lifetime) and US-13 / PS-06 until a seat is free', 'info']],
    rows: [['1', 'A clear message when no seat is free', 'Not checked live (the Zoho org has free seats)', 'Raw key "iam.subscription.seat_limit_reached"', 'FAIL', [1, 2]]] },
  { id: 'NDC-2412', verdict: 'FAIL', label: 'STILL FAILS', title: 'Role mode: a Supervisor still can’t see a lower-ranked User’s leads in the same department', z: 'roles',
    lines: [['Hierarchy mode = role (unchanged); test user 2 = Supervisor (rank 300) @Sales, test user 1 = User (rank 100) @Sales', 'info'], ['test user 2 reads test user 1’s leads: owner-set lead = not visible, lead created by test user 1 = not visible', 'bad'], ['Seen twice (batch run + from-scratch rerun); controls pass: own leads visible, peers not visible (I1, I2, I6)', 'info'], ['Users, profiles and managers restored: "no difference from the baseline"', 'info']],
    rows: [['1', 'A superior sees records of lower-ranked users in the same department', 'Roles: a superior role sees its subordinates’ records', 'Supervisor can’t see the Sales User’s leads', 'FAIL', [1, 1]], ['2', 'Controls', 'Own records visible', 'Own leads visible; peers not visible', 'PASS', [2, 2]]] },
  { id: 'R2W1-B2', verdict: 'FAIL', label: 'NEW CANDIDATE', title: 'Role mode: a Manager in another org unit sees a User’s leads', z: 'roles',
    lines: [['Hierarchy mode = role; test user 2 = Manager (rank 500) @HR, test user 1 = User (rank 100) @Sales', 'info'], ['test user 2 (no records view-all) reads test user 1’s leads: owner-set lead = VISIBLE, lead created by test user 1 = VISIBLE', 'bad'], ['Expected hidden: role visibility is "lower-ranked users in their department"; Sales is not under HR', 'bad'], ['Seen twice (batch run + from-scratch rerun); restored with no difference from the baseline', 'info']],
    rows: [['1', 'A manager of another department does not see this department’s records', 'Only superiors in the role hierarchy see the records', 'HR Manager sees the Sales User’s leads', 'FAIL', [1, 2]]] },
  { id: 'NDC-613', verdict: 'PASS', label: 'RETEST PASS', title: 'A user denied login history can’t see or export it, and the Setup link is hidden', z: 'login',
    lines: [['Test user 2: view self / team / all denied -> list 403, export 403 (0 bytes)', 'ok'], ['Test user 1 (login history denied): Login History link not in Setup; admin pages by URL without permission: none', 'ok'], ['Overrides removed afterwards (204)', 'info']],
    rows: [['1', 'Denied users can’t list or export login history', 'Login History needs the admin permission', 'List 403, export 403', 'PASS', [0, 0]], ['2', 'The Setup link is hidden', 'Not shown without permission', 'Link hidden for test user 1', 'PASS', [1, 1]]] },
  { id: 'NDC-2657', verdict: 'FAIL', label: 'STILL FAILS', title: 'Without access, the Permissions page shows raw "Missing required permission" text', z: 'profiles',
    timg: 'tavi-permissions-testuser1.png', tbox: [292, 142, 580, 245],
    rows: [['1', 'A user without access sees a normal no-access page', 'Not checked live (needs a non-admin Zoho user)', 'Raw text "Missing required permission ‘iam.profile.manage’." in the Profiles panel (test user 1, 27 Oct)', 'FAIL']] },
  { id: 'NDC-2415', verdict: 'PASS', label: 'RETEST PASS', title: 'Hierarchy change history shows who made each change', z: 'roles',
    timg: 'tavi-hp-history.png', tbox: [292, 300, 1580, 900],
    rows: [['1', 'Each change names the user and time', 'Zoho shows who changed settings in the Audit Log', '"by mahmoud.mahamed1515 · 27/10/2026 14:40", "by ndc-staging-owner · …" on every row', 'PASS']] },
];
const only = process.argv[2];
for (const it of items) {
  if (only && it.id !== only) continue;
  if (it.timg) {
    const ts = zsize(it.timg), [zf2, zb2] = Z[it.z], zs2 = zsize(zf2);
    const spec2 = { out: `${it.id}-retest.png`, ticket: it.id, verdict: it.verdict, label: it.label, title: it.title, env: ENV, date: '27 Oct 2026',
      panels: [{ img: it.timg, w: ts[0], h: ts[1], crop: [0, 0, ts[0], ts[1]], caption: 'TAVI — screen, 27 Oct 2026 build.', boxes: [{ b: it.tbox, n: '1' }] },
        { img: zf2, w: zs2[0], h: zs2[1], crop: [0, 0, zs2[0], zs2[1]], caption: 'Zoho — the same function, read-only.', boxes: /Not checked live/.test(it.rows[0][2]) ? [] : [{ b: zb2, n: '1', color: '#16a34a' }] }],
      rows: it.rows };
    fs.writeFileSync(path.join(D, `spec-${it.id}.json`), JSON.stringify(spec2, null, 1));
    execFileSync('node', [path.join(D, 'annotate-vs-zoho.js'), path.join(D, `spec-${it.id}.json`)], { stdio: 'pipe' });
    console.log('built', it.id); continue;
  }
  const card = { out: `api-${it.id}.png`, title: `TAVI API facts — ${it.id} (Round 2 Wave 1, 27 Oct 2026)`, lines: it.lines };
  fs.writeFileSync(path.join(D, `card-${it.id}.json`), JSON.stringify(card, null, 1));
  execFileSync('node', [path.join(D, 'apicard.js'), path.join(D, `card-${it.id}.json`)], { stdio: 'pipe' });
  const ch = zsize(`api-${it.id}.png`), [zf, zb] = Z[it.z], zs = zsize(zf);
  const spec = { out: `${it.id}-retest.png`, ticket: it.id, verdict: it.verdict === 'GAP' ? 'PARTIAL' : it.verdict, label: it.label, title: it.title, env: ENV, date: '27 Oct 2026',
    panels: [
      { img: card.out, w: ch[0], h: ch[1], crop: [0, 0, ch[0], ch[1]], caption: 'TAVI — facts from the automated run (Round 2 Wave 1, 27 Oct 2026).', boxes: it.rows.filter(r => r[5]).map(r => box(r[5][0], r[5][1], r[0])) },
      { img: zf, w: zs[0], h: zs[1], crop: [0, 0, zs[0], zs[1]], caption: 'Zoho — the same function, read-only.', boxes: it.rows.filter(r => !/Not checked live|not comparable/i.test(r[2])).map((r, k) => ({ b: [zb[0] + 44 * k, zb[1] + 10 * k, zb[2] - 6 * k, zb[3] - 6 * k], n: r[0], color: '#16a34a' })) }],
    rows: it.rows.map(r => r.slice(0, 5)) };
  fs.writeFileSync(path.join(D, `spec-${it.id}.json`), JSON.stringify(spec, null, 1));
  execFileSync('node', [path.join(D, 'annotate-vs-zoho.js'), path.join(D, `spec-${it.id}.json`)], { stdio: 'pipe' });
  console.log('built', it.id);
}
