// One-off: adds tickets #8–15 to make-report-html.js.
const fs = require('fs'); const f = __dirname + '/make-report-html.js'; let s = fs.readFileSync(f, 'utf8');
const cut = (a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('marker ' + a.slice(0, 30)); return [i, j]; };

const more = `  { n: 8, id: 'NDC-1234', pri: 'High', feat: 'Approval Process', title: '[Epic] Approval Process — prevent endless re-entry & post-approval edits of sensitive fields', v: 'PASS', action: 'Done + comment (children: housekeeping)', img: 'NDC-1234-retest-PASS.png',
    dev: 'Retested 24 Sep: every claim exercised worked; held in Ready For Test only for 5 linked bugs (NDC-1645, 1646, 1652, 1672, 1697).',
    summary: 'All five linked bugs are Done. Smoke test with a temporary process: Approval Status read-only with 4 values; entry guard auto-injected; pending → approved; allowed edit keeps Approved (re-entry blocked); non-owner refused on locked Amount (422 APPROVAL_LOCKED); owner override logged on the timeline; status not writable. Its 13 child stories are still in Backlog.' },
  { n: 9, id: 'NDC-1947', pri: 'Medium', feat: 'Custom Views', title: 'A user without "Manage Shared Views" cannot save a private view (only me view)', v: 'NAB', action: 'Done + comment (verified not a bug)', img: 'NDC-1947-retest-NOT-A-BUG.png',
    dev: 'Not a bug: Only-me views need no permission; only sharing options are gated. System views (All Leads) have no "Save to view" by design.',
    summary: 'Test user 2 (no metadata.views.manage) saved a private view (201) and saved column changes to it ("Save to view"). On All Leads only "Use the view\\'s columns" is offered — by design; a "save as new view" shortcut would be a product call.' },
  { n: 10, id: 'NDC-2098', pri: 'Medium', feat: 'Custom Views', title: '?view= with a deleted or foreign view ID falls back to the last-used view instead of All Leads', v: 'DEC', action: 'Your decision: close as designed, or change request (fallback to All Leads)', img: 'NDC-2098-retest-DECISION.png',
    dev: 'Specified precedence: ?view= → last view → All. Falling back to All Leads is a one-line change but a behaviour decision.',
    summary: 'Verified: own view opens; deleted and foreign ids show "That view is no longer available. Showing your default view.", ?view= is removed, nothing of the foreign view is shown, and the page lands on the last-used view (QA RT k7), not All Leads.' },
  { n: 11, id: 'NDC-2100', pri: 'Medium', feat: 'Custom Views', title: 'View API accepts non-numeric Amount values and stores them as raw strings', v: 'PASS', action: 'Done + comment', img: 'NDC-2100-retest-PASS.png',
    dev: 'Fixed: numeric criteria parsed and rewritten as numbers; anything else refused with 422.',
    summary: '"15,000" → 15000 and "1e9" → 1000000000 (and they match the QA RT deals); "abc", Arabic-Indic digits, "15 000", "1.2.3" → 422 "That value is not a number."' },
  { n: 12, id: 'NDC-2102', pri: 'Medium', feat: 'Custom Views', title: 'View API accepts an operator that does not fit the field type (Amount "contains" → 201)', v: 'PASS', action: 'Done + comment', img: 'NDC-2102-retest-PASS.png',
    dev: 'Fixed: server-side operators-per-datatype table; mismatch refused with 422.',
    summary: 'Amount contains / starts_with → 422 "That operator cannot be used on this field."; equals, greater_than, is_empty still save.' },
  { n: 13, id: 'NDC-2104', pri: 'Medium', feat: 'Custom Views', title: '"Last Activity" in view criteria is the record\\'s modified time; adding a note does not update it', v: 'DEC', action: 'Your decision: rename the label to "Last Modified Time", or build a real Last Activity field', img: 'NDC-2104-retest-DECISION.png',
    dev: 'Not a defect: "Last Activity" is the label for last_modified_at; notes never touch the record row. Options: rename label, or build the field (NDC-1868 P1-5).',
    summary: 'Verified: note added (201) on QA RT tz L1; Last Activity stays 3:31 PM and last_modified_at is unchanged.' },
  { n: 14, id: 'NDC-2124', pri: 'Low', feat: 'Custom Views', title: 'List preferences accept more than 50 column overrides; no oldest-dropped rule', v: 'FAIL', action: 'Bug + comment', img: 'NDC-2124-retest-FAIL.png',
    dev: 'Not a code defect: the 50 cap with oldest-dropped eviction lives in the frontend; retest through the UI.',
    summary: 'Through the UI on 51 views the cap holds (50 remain), but the wrong override is dropped: ov-38 was evicted while ov-01 (the oldest) stayed. The stored keys come back in a different order (looks sorted by view id), so "oldest" is picked from a reordered object.' },
  { n: 15, id: 'NDC-1789', pri: 'Low', feat: 'Work Queue', title: 'Applied filters don\\'t persist on refresh / next session (new login)', v: 'FAIL', action: 'Bug + comment', img: 'NDC-1789-retest-FAIL.png',
    dev: 'Built and deployed 15 Oct: filters kept per user, per list in module preferences; restored on refresh and new login.',
    summary: 'The filter is saved server-side and Clear filters / scope work, but a refresh or a new login opens Tasks unfiltered (112) — restored only after switching to another section and back (44). Restored once, lost on 4 of 4 later reloads and on a fresh login.' },
];
const todo = [];
const obs = ['Work Queue → My Open Activities → "All open" Tasks lists tasks with Status = Completed.', 'Queue badge counts differ from "Total Records" for some queues (e.g. test 46 vs 0) — may be load timing; not investigated.', 'Create Queue dialog showed "The server took too long to respond. Please try again." once.', 'NDC-2097: the first editor load hung on "Loading fields…" for more than 15 s; a reload worked.', 'The browser tab crashed three times — twice when opening Settings → Approval Processes and once on the Work Queue; NDC-1234 was finished by API.', 'Sessions of the shared ndc-staging-owner account were revoked several times (/login?reason=revoked) — likely other people signing in to the same account.'];
const ledger = [['Leads "QA RT del-list 1821", "QA RT del-wq 1821"', 'In Recycle Bin', 'Purge'], ['Leads "QA RT tz L1–L4" (one has a QA RT note)', 'Active', 'Delete + purge'], ['Deals "QA RT amt 15000", "QA RT amt 1e9", "QA RT ap 1" (now owned by test user 1, Approved)', 'Active', 'Delete + purge'], ['Approval process "QA RT ap" (Deals, active)', 'Active', 'Deactivate + delete'], ['Views "QA RT review-gate", "QA RT k7", "QA RT tz-day", "QA RT private-user2", 7 × "QA RT amt / op …" (Deals), 51 × "QA RT ov-01…51"', 'Active', 'Delete + purge'], ['Leads list-preferences of ndc-staging-owner (51 column overrides)', 'Changed', 'Restore the saved backup (viewColumns was empty)'], ['Leads list-preferences of test user 2 (column hidden on All Leads)', 'Changed', '"Use the view\\'s columns"'], ['Work Queue → Tasks filter "Priority equals highest" (existed before the run)', 'Cleared', 'Restore'], ['Arrange queues mode / Phone column width', 'Already restored', '—'], ['Company time zone', 'UTC → Africa/Cairo', 'Keep Cairo (your instruction)']];
`;
let [i, j] = cut('];\nconst todo', 'const count'); s = s.slice(0, i) + '];\n'.slice(0, 0) + more + s.slice(j);
s = s.replace("TODO: ['info', 'Not started'] };", "TODO: ['info', 'Not started'], DEC: ['dec', 'Needs decision'] };");
s = s.replace('.ok{color:var(--ok);background:var(--ok-bg)}', '.ok{color:var(--ok);background:var(--ok-bg)}.dec{color:#6d28d9;background:#efe7ff}');
[i, j] = cut('<div class="stat"><b>15</b>', '</div>\n<p class="note">');
s = s.slice(0, i) + `<div class="stat"><b>15</b><span>Ready For Test tickets</span></div>
<div class="stat"><b>15</b><span>Retested</span></div>
<div class="stat"><b style="color:var(--ok)">\${count('PASS') + count('NAB')}</b><span>Pass / not a bug</span></div>
<div class="stat"><b style="color:var(--warn)">\${count('PARTIAL')}</b><span>Partial</span></div>
<div class="stat"><b style="color:var(--bug)">\${count('FAIL')}</b><span>Fail</span></div>
<div class="stat"><b style="color:#7c3aed">\${count('DEC')}</b><span>Needs your decision</span></div>
` + s.slice(j);
[i, j] = cut('<h2>Not started (#8–15)</h2>', '<h2>Other observations');
s = s.slice(0, i) + s.slice(j);
s = s.replace("${t.v !== 'PASS' && t.v !== 'NAB' ? ' open' : ''}", "${t.v === 'FAIL' || t.v === 'PARTIAL' ? ' open' : ''}");
s = s.replace('<li>Developer comments were verified before each retest. NDC-1819 and NDC-2096 were retested twice on request.</li>',
  '<li>Developer comments were verified before each retest. NDC-1819 and NDC-2096 were retested twice on request.</li>\n<li>NDC-1234 was smoke-tested with a temporary approval process; NDC-2124 was run through the UI on 51 views as the developer asked.</li>\n<li><b>Security note:</b> two secrets appeared in this session’s output by mistake — a Zoho password (first line of the Edge password export) and one single-use CRM refresh token (already rotated). Nothing was written to files or sent elsewhere.</li>');
fs.writeFileSync(f, s); console.log('patched');
