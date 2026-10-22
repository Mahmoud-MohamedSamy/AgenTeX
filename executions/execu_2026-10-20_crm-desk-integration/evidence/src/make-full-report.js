// Builds ../../crm-desk-integration-report.html: one page with summary, gaps, bugs, every spec row with its verdict,
// the Zoho parity matrix and what was changed. Sources: the spec (.md), zoho-parity-matrix.md, missing-report.html,
// bug-report.html. Verdicts per row are listed below (from report.md, run2-facts.txt and the 21 Oct runs).
// node make-full-report.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../../..');
const DOCS = path.join(ROOT, 'docs/crm-desk-integration');
const EXE = path.resolve(__dirname, '../..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');

// ---------------- verdicts: [verdict, note] ----------------
const P = 'Pass', F = 'Fail', G = 'Gap', PA = 'Partial', IN = 'Inconclusive', BL = 'Blocked', NR = 'Not run', SK = 'Skipped', RC = 'Recorded';
const V = {
  A1: [P, 'Both settings pages, subtitles, 5 / 6 tabs'], A2: [NR, 'Screen state for a user without view permission not opened (API side = A3)'], A3: [P, 'Agent gets 403 on config, runs, history, failures, links'],
  A4: [P, 'All agent writes refused (403), row_version unchanged'], A5: [P, 'View-only: reads 200, writes 403, read-only hint, no action buttons'], A6: [NR, 'Settings URL opened by an agent on screen not checked (API refuses, A3)'],
  A7: [P, 'Same value and row_version in CRM and Desk'], A8: [P, 'CRM-only user: card hidden, Desk menu hidden, "Desk is not available"'], A9: [P, 'Agent pane follows the agent\'s profile (Potentials hidden)'],
  A10: [P, '401 without / with a bad token'], A11: [BL, 'No second tenant'],
  B1: [P, 'Overview matches /status'], B2: [PA, '"Needs attention" pill checked; other pill states not produced'], B3: [P, 'Pause dialog, "Paused: reason", reason stored as text'],
  B4: [F, 'CD-09 — 1,206-char reason → HTTP 500'], B5: [P, 'Edit held while paused (queue 8)'], B6: [P, 'Held edit arrives after Resume'],
  B7: [RC, 'Pause then Disconnect: enabled=false, paused=true; reconnect clears'], B8: [P, 'Disconnect dialog, "Not connected", links kept, nothing syncs'],
  B9: [P, 'Connect dialog, initial imports run'], B10: [IN, 'Imports finished in ~3 s; progress text not observable'], B11: [F, 'CD-07 — no notice when the initial sync finishes'],
  B12: [BL, 'No CRM records older than 12 months'], B13: [P, 'Runs are server-side; finish without a browser'], B14: [P, 'Reconnect: no duplicates, links reused'],
  C1: [P, 'Sync table matches config'], C2: [P, '"8 of 12 fields mapped"'], C3: [P, 'Desk fields = schema'], C4: [P, 'CRM fields = schema; lookups not offered'],
  C5: [P, 'Screen has one row per Desk field (cannot duplicate); API refuses duplicates'], C6: [P, '"Two Desk fields write back into this CRM field." shown'],
  C7: [P, 'Number fields not offered for text; API refuses datatype_incompatible'], C8: [NR, 'Pick-list mismatch not exercised'],
  C9: [PA, 'API refuses a read-only target; screen message not checked'], C10: [F, 'CD-04 — API saves a row with an empty CRM field'],
  C11: [P, 'One-way hides per-field directions'], C12: [NR, 'Protected target message not exercised'], C13: [P, 'Invalid banner on Save, nothing saved'],
  C14: [NR, 'Schema load failure not simulated'], C15: [NR, 'Stray mapping (deleted Desk field) not exercised'], C16: [NR, 'Accounts editor not repeated (Contacts checked)'],
  C17: [F, 'CD-04 — unknown CRM/Desk field, lookup, empty row accepted'], C18: [P, '"You have unsaved integration changes."'],
  D1: [P, 'Won deal → Desk contract'], D2: [P, 'Draft + needs-attention, missing [end_date]'], D3: [P, 'Draft off: no contract'], D4: [P, 'Reopen: keep unchanged, terminate → Terminated'],
  D5: [P, 'Lost: keep unchanged, terminate → Terminated'], D6: [F, 'CD-18 — CRM-owned field editable in Desk while locked'], D7: [P, 'Default support level applied (owner default applies only when the deal has none)'],
  D8: [P, 'Cancel and recreate'], D9: [P, 'Sync all contracts 202; again 409'], D10: [P, 'Contracts off: no contract'], D11: [P, 'Other customer\'s deal refused unless "allow any deal"'],
  D12: [PA, 'API gives field keys ([end_date]); screen wording not checked'], D13: [BL, 'Telephony does not log calls'], D14: [BL, 'Telephony'], D15: [BL, 'Telephony'],
  E1: [G, 'Z4 — no "delete if no associates"'], E2: [P, 'Keep: Desk contact stays, link needs_attention'], E3: [P, 'Unlink: Desk contact stays, "Unlinked"'], E4: [P, 'Delete: Desk contact and ticket deleted'],
  E5: [P, 'Account delete'], E6: [P, 'Desk contact delete: keep / delete'], E7: [P, 'Desk account delete'], E8: [F, 'CD-13 — preference change applied to an earlier delete'],
  E9: [F, 'CD-14 — integration-deleted contact not in the recycle bin'], E10: [P, 'Related lists follow CRM modules'], E11: [P, 'Untick Deals → card leaves deal pages'], E12: [P, '"No CRM record page will show…"'],
  F1: [P, 'Save, both apps same row_version'], F2: [P, 'Double Save → one save'], F3: [P, 'Stale save → conflict message + Reload'], F4: [P, 'Same conflict (other admin via API)'],
  F5: [F, 'CD-05 — save without row_version accepted'], F6: [P, 'Partial body keeps mappings'], F7: [P, 'Bad types / enums refused'], F8: [F, 'CD-17 — no audit entries'],
  G1: [P, 'CRM → Desk ~5 s'], G2: [P, 'Desk → CRM ~4 s'], G3: [P, 'Accounts both ways'], G4: [P, 'Updates both ways'], G5: [P, 'CRM→Desk field not written back'],
  G6: [P, 'One-way; switching back not retroactive'], G7: [P, 'Matched on email'], G8: [P, 'Email case ignored'], G9: [P, 'One link + failure entry'], G10: [P, 'Accounts matched by name'],
  G11: [P, 'No-email contact synced'], G12: [P, 'Mass update of 3'], G13: [P, 'Custom field (twitter) mapped and synced'], G14: [P, 'Last write wins, stable'],
  G15: [P, 'Account link followed'], G16: [P, 'Arabic / emoji / markup byte-identical'], G17: [IN, 'Both apps accept the same values; failure cannot be produced'],
  G18: [F, 'CD-11 — Desk contact created without required Last name'], G19: [F, 'CD-03 — failure reason shows raw ids'], G20: [RC, 'Latency ~5 s'],
  H1: [P, '7 days, directions, modules'], H2: [P, 'Counts grow with the run'], H3: [F, 'CD-06 — no failed count'], H4: [NR, 'Time-zone day boundary not checked'],
  H5: [NR, 'Empty-day text not checked'], H6: [P, 'Sync all customers 202'], H7: [P, '409 "already running"'], H8: [P, 'Run detail and items'], H9: [P, 'Failure Log renders'],
  H10: [F, 'CD-03 — raw ids'], H11: [P, 'Fix + Retry clears the failure'], H12: [SK, 'Would re-queue a teammate\'s parked failures'], H13: [P, 'Discard'], H14: [NR, 'Log never empty on staging'],
  I1: [P, 'Pane on ticket #298'], I2: [P, 'Info fields = config'], I3: [P, 'Potentials lists the QA deal'], I4: [P, 'Notes tab'], I5: [P, 'Activities ("No open activities.")'],
  I6: [P, 'Empty states'], I7: [P, '"Not linked to a CRM record"'], I8: [F, 'CD-01 — pair already re-linked by email (409)'], I9: [F, 'CD-01 — Unlink does not stop sync'],
  I10: [P, 'No candidates for nonsense'], I11: [P, 'Update from CRM'], I12: [P, 'Open in CRM reaches the contact'], I13: [P, 'CRM Account Info on the account page'],
  I14: [P, 'Pane on the contact page'], I15: [P, 'Link / unlink deal on ticket'], I16: [F, 'CD-08 — raw sync values in the contact list'], I17: [P, 'Links complete'], I18: [PA, 'CD-16 — error shown, no Retry'],
  J1: [G, 'Z9 — "Custom Access" naming'], J1a: [G, 'Z9 — every profile Full Access after Connect'], J2: [P, 'Access dialog sections and types'], J3: [P, 'Stored per profile'],
  J4: [F, 'CD-15 — API refuses, but pane offered and stuck on Loading…'], J5: [P, 'Potentials hidden'], J6: [P, 'Calls hidden when only Meetings + Tasks'], J7: [P, 'Potentials 403'],
  J8: [P, 'Allowed sections 200'], J9: [P, 'Account No access 403'], J10: [P, 'No re-login needed'], J11: [P, 'Owner unaffected'], J12: [P, 'Ticket visibility by department'],
  K1: [P, 'Handshake Mode in the picker'], K2: [P, 'Columns and buckets'], K3: [P, 'Won deal → Customers'], K4: [F, 'CD-12 — phone match not used'], K5: [P, 'Won + open → Customers'],
  K6: [P, 'Open deal → Potentials'], K7: [P, 'Contact / lead → Contacts/Leads'], K8: [P, 'Unknown → New'], K9: [P, 'Deal won live → Customers'], K10: [F, 'CD-02 — offered while paused (hidden when disconnected)'],
  L1: [P, 'Card on a contact'], L2: [P, 'Statistics (/stats)'], L3: [P, 'Filters'], L4: [P, 'Card on an account'], L5: [P, 'New ticket from CRM'], L6: [P, 'Form validation'],
  L7: [P, 'New ticket stays available for a no-email contact (synced to Desk)'], L8: [P, 'CRM-only user cannot create (403)'], L9: [P, 'Deal picker, customer\'s deals first'], L10: [P, 'Unlink from deal on the card'],
  L11: [P, 'Close (API behind the card)'], L12: [P, 'Update field (API behind the card)'], L13: [P, 'Delete confirm text'], L14: [P, '"No tickets for this record."'],
  L15: [NR, 'Desk Contracts card on a CRM account not opened'], L16: [P, 'Workspace with reply, reply all, forward, comment'], L17: [P, 'While disconnected: card and Desk menu hidden'],
  L18: [P, 'Hidden statistics remembered'], L19: [P, 'Visibility rule applies (J12)'], L20: [P, 'Customer\'s deals first'], L21: [P, 'Selection count, Clear selection'], L22: [P, 'Ticket contract endpoint'],
  M1: [P, '7 signals + contact owner'], M2: [P, 'Contact owner notified'], M3: [PA, 'Comment / mention delivered; overdue, escalated, rating, reply not produced'], M4: [P, 'Signal off → no entry'],
  M5: [P, 'Agents + CRM users mentionable'], M6: [P, 'Mention reaches the CRM bell'], M7: [G, 'Z13 — no @CRM Contact Owner'], M8: [G, 'Z12 — CRM users not Light Agents'],
  M9: [BL, 'No Light Agents to test (Z12)'], M10: [NR, 'Markup inside a mention comment not checked in the bell'],
  O1: [P, 'Markup stored and shown as text'], O2: [BL, 'No second tenant'], O3: [F, 'CD-10 — stats for a missing contact = 200'], O4: [P, 'No secrets in responses'],
  O5: [P, 'Arabic 450/450, right-to-left'], O6: [P, 'Labels, Tab focus, Escape closes dialogs'], O7: [P, 'Screen-reader names on mapping selects'], O8: [P, 'No overflow at 1280 / 1024 / 768'],
  O9: [P, '500 contacts: imported 78 s, synced 62 s'], O10: [PA, 'Typical 0.6–1.6 s; 3 of 15 calls over 2 s'], O11: [P, 'Edge + Chrome; Firefox not installed'],
  'E2E-1': [P, 'Chained in Run 2'], 'E2E-2': [P, 'Chained in Run 2'], 'E2E-3': [P, 'Mention + reply'], 'E2E-4': [P, 'Restricted agent'], 'E2E-5': [P, 'Failure → fix → retry'], 'E2E-6': [P, 'Cleanup + restore verified'],
  Z1: [G, 'Still missing'], Z2: [G, 'Still missing'], Z3: [G, 'Still missing'], Z4: [G, 'Confirmed (E1)'], Z5: [G, 'Still missing'], Z6: [G, 'Still missing'], Z7: [G, 'Still missing'],
  Z8: [G, 'From Zoho docs'], Z9: [G, 'Confirmed (J1, J1a)'], Z10: [G, 'Parity pass'], Z11: [G, 'Parity pass'], Z12: [G, 'Parity pass'], Z13: [G, 'Parity pass'], Z14: [G, 'Parity pass'],
  Z15: [G, 'From UI text; not testable'], Z16: [G, 'Out of NDC-1669 scope'], Z17: [G, 'Out of NDC-1669 scope'], Z18: [G, 'Parity pass'], Z19: [G, 'Checked 21 Oct'],
};

// ---------------- spec rows ----------------
const spec = fs.readFileSync(path.join(DOCS, 'spec-crm-desk-integration.md'), 'utf8').split('\n');
const rows = [];
let group = '';
for (const l of spec) {
  const h = l.match(/^## (Group [A-Z]+ — .+|E2E journeys.*|Group Z.*)$/);
  if (h) group = h[1].replace(/ `\[serial\]`.*$/, '').replace(/\s*\(ask first.*$/, '');
  const m = l.match(/^\| ((?:[A-MO]\d+a?)|(?:E2E-\d)|(?:Z\d+)) \| (.*)$/);
  if (!m || !group) continue;
  const cells = m[2].split(' | ').map(s => s.replace(/\|\s*$/, '').trim());
  rows.push({ id: m[1], group, scenario: cells[0], expected: cells.length >= 3 ? cells[cells.length - 2] : cells[1] || '' });
}
const missingV = rows.filter(r => !V[r.id]).map(r => r.id);
if (missingV.length) throw new Error('no verdict for ' + missingV.join(','));
const count = {};
for (const r of rows) count[V[r.id][0]] = (count[V[r.id][0]] || 0) + 1;

// ---------------- parity matrix ----------------
const pm = fs.readFileSync(path.join(DOCS, 'zoho-parity-matrix.md'), 'utf8').split('\n');
const parity = [];
let sec = '';
for (const l of pm) {
  const h = l.match(/^## (\d+ .+)$/);
  if (h) sec = h[1];
  const m = l.match(/^\| (\d+(?:[–-]\d+)?) \| (.*)$/);
  if (!m || !sec || /Totals/.test(sec)) continue;
  const c = m[2].split(' | ').map(s => s.replace(/\|\s*$/, '').trim());
  if (c.length >= 4) parity.push({ n: m[1], sec, zoho: c[0], tavi: c[1], verdict: c[2], ev: c[3] });
  else parity.push({ n: m[1], sec, zoho: c[0], tavi: '', verdict: c[1] || '', ev: '' });
}
const pcat = v => /^Pending/.test(v) ? 'Pending' : /^Not testable/.test(v) ? 'Not testable' : /^N\/A/.test(v) ? 'N/A' : /^Missing/.test(v) ? 'Missing' : /^Bug/.test(v) ? 'Bug' : /^Implemented/.test(v) ? 'Implemented' : 'See other row';

// ---------------- gaps and bugs from the existing pages ----------------
const missingHtml = fs.readFileSync(path.join(DOCS, 'missing-report.html'), 'utf8');
const gapArticles = (missingHtml.match(/<article class="bug-entry" id="gap-[\s\S]*?<\/article>/g) || [])
  .map(a => a.replace(/src="evidence\//g, 'src="../../docs/crm-desk-integration/evidence/'));
const gapTable = (missingHtml.match(/<div class="table-box"><table>[\s\S]*?<\/table><\/div>/) || [''])[0];
const bugHtml = fs.readFileSync(path.join(EXE, 'bug-report.html'), 'utf8');
const bugArticles = bugHtml.match(/<article class="bug-entry" id="CD-[\s\S]*?<\/article>/g) || [];
const style = bugHtml.slice(bugHtml.indexOf('<link rel="preconnect"'), bugHtml.indexOf('</style>'));
const bugIndex = bugArticles.map(a => {
  const id = (a.match(/id="(CD-\d+)"/) || [])[1];
  const sev = (a.match(/pill (?:bug|warn|info)">([A-Za-z]+) \(suggested\)/) || [])[1];
  const title = (a.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1];
  const cs = (a.match(/<span class="bug-id">[^·]*· ([^<]*)<\/span>/) || [])[1];
  return { id, sev, title, cs };
});

const vclass = v => ({ Pass: 'ok', Fail: 'bug', Gap: 'bug', Partial: 'warn', Inconclusive: 'warn', Blocked: 'info', 'Not run': 'info', Skipped: 'info', Recorded: 'info' }[v] || 'info');
const groups = [...new Set(rows.map(r => r.group))];
const total = rows.length;

const html = `<title>CRM Desk Integration Report</title>
${style}
.toc { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 0.9rem; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.filters input, .filters select { font: inherit; padding: 6px 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--fg); }
.stat { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.stat div { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
.stat b { display: block; font: 700 1.5rem/1.2 var(--font-display); }
td.v { white-space: nowrap; }
tr.hidden { display: none; }
h3.grp { margin-top: 10px; font-size: 1rem; }
</style>

<div class="wrap">
  <header>
    <span class="eyebrow">TAVI CRM ⇄ Desk Integration · QA report · 18–21 Oct 2026</span>
    <h1>CRM ⇄ Desk Integration: full test report</h1>
    <p>Everything done for NDC-1669 in one page: what is missing compared with Zoho CRM + Desk, the bugs found, the verdict of every spec row, the comparison of all 153 Zoho behaviours, and what was changed on the way. Expected behaviour = Zoho (user decision) and NDC-1669. Nothing here is filed in Plane.</p>
    <div class="meta">
      <span><b>TAVI</b> staging-crm / staging-desk.taviportal.com (tenant NDC-Staging)</span>
      <span><b>Zoho</b> Zoho Desk taviportal + Zoho CRM org943261092</span>
      <span><b>PRD</b> NDC-1669</span>
      <span><b>Method</b> Selenium + API automation (Java, TestNG), feature crmdeskintegration</span>
    </div>
    <nav class="toc"><a href="#summary">Summary</a><a href="#gaps">Missing features (19)</a><a href="#bugs">Bugs (${bugIndex.length})</a><a href="#rows">Spec rows (${total})</a><a href="#parity">Zoho parity (153)</a><a href="#notcovered">Not covered</a><a href="#changes">Changes made</a><a href="#files">Files</a></nav>
  </header>

  <section aria-labelledby="summary">
    <h2 id="summary">Summary</h2>
    <div class="stat">
      <div><b>${total}</b>spec rows</div>
      <div><b>${count.Pass || 0}</b>pass</div>
      <div><b>${count.Fail || 0}</b>fail (bugs)</div>
      <div><b>${count.Gap || 0}</b>gap rows</div>
      <div><b>${(count.Partial || 0) + (count.Inconclusive || 0) + (count.Recorded || 0)}</b>partial / inconclusive / recorded</div>
      <div><b>${(count.Blocked || 0) + (count['Not run'] || 0) + (count.Skipped || 0)}</b>blocked / not run / skipped</div>
      <div><b>19</b>missing features</div>
      <div><b>${bugIndex.length}</b>bugs</div>
      <div><b>153</b>Zoho behaviours classified</div>
    </div>
    <ul class="plain">
      <li><b>Works well:</b> sync both ways in ~5 s (email and account-name matching, mass update, custom fields, Arabic/emoji text), pause and resume, every delete preference except the missing "if no associates", API-enforced profile permissions, Handshake buckets, contracts from won deals, the CRM Desk Tickets card and ticket workspace, disconnect/reconnect without duplicates, 500 contacts synced in about a minute, Arabic UI.</li>
      <li><b>Biggest problems:</b> CD-14 (records deleted by the integration cannot be restored), CD-01 (Unlink does not stop the sync), CD-13 (delete preference applied retroactively), CD-18 (contract lock not enforced), CD-04 / CD-05 (settings API saves invalid mappings and skips the version check).</li>
      <li><b>Biggest gaps vs Zoho:</b> products sync, list-view scope, secondary-email matching, "delete if no associates", permission defaults, Light Agents, initial-sync report.</li>
      <li><b>Staging afterwards:</b> settings identical to the 20 Oct baseline, integration connected and not paused, every QA record deleted; the Zoho Desk ↔ Zoho CRM comparison integration was deleted on 21 Oct (user decision).</li>
    </ul>
  </section>

  <section aria-labelledby="gaps">
    <h2 id="gaps">Missing features (19)</h2>
    <p class="lead">Zoho behaviours that TAVI does not have. Images: TAVI on the left, Zoho on the right.</p>
    ${gapTable}
    ${gapArticles.join('\n')}
  </section>

  <section aria-labelledby="bugs">
    <h2 id="bugs">Bugs (${bugIndex.length})</h2>
    <div class="table-box"><table><thead><tr><th>Bug</th><th>Case</th><th>Severity</th><th>Title</th></tr></thead><tbody>
${bugIndex.map(b => `      <tr><td class="mono"><a href="#${b.id}">${b.id}</a></td><td>${b.cs || ''}</td><td>${b.sev || ''}</td><td>${b.title}</td></tr>`).join('\n')}
    </tbody></table></div>
    ${bugArticles.join('\n')}
  </section>

  <section aria-labelledby="rows">
    <h2 id="rows">Every spec row (${total})</h2>
    <p class="lead">Verdict and one-line result per row of spec-crm-desk-integration.md. Filter by text, group or verdict.</p>
    <div class="filters"><input id="q" type="search" placeholder="Filter rows (id, text, CD-nn)…" aria-label="Filter rows">
      <select id="g" aria-label="Group"><option value="">All groups</option>${groups.map(g => `<option>${esc(g)}</option>`).join('')}</select>
      <select id="v" aria-label="Verdict"><option value="">All verdicts</option>${Object.keys(count).map(v => `<option>${v}</option>`).join('')}</select></div>
    <div class="table-box"><table id="rowtable"><thead><tr><th>ID</th><th>Scenario</th><th>Expected</th><th>Verdict</th><th>Result</th></tr></thead><tbody>
${rows.map(r => `      <tr data-g="${esc(r.group)}" data-v="${V[r.id][0]}"><td class="mono">${r.id}</td><td>${md(r.scenario)}</td><td>${md(r.expected)}</td><td class="v"><span class="pill ${vclass(V[r.id][0])}">${V[r.id][0]}</span></td><td>${md(V[r.id][1])}</td></tr>`).join('\n')}
    </tbody></table></div>
  </section>

  <section aria-labelledby="parity">
    <h2 id="parity">Zoho parity: all 153 behaviours</h2>
    <div class="filters"><input id="pq" type="search" placeholder="Filter Zoho items…" aria-label="Filter Zoho items">
      <select id="pv" aria-label="Verdict"><option value="">All verdicts</option>${[...new Set(parity.map(p => pcat(p.verdict)))].map(v => `<option>${v}</option>`).join('')}</select></div>
    <div class="table-box"><table id="paritytable"><thead><tr><th>#</th><th>Area</th><th>Zoho</th><th>TAVI</th><th>Verdict</th><th>Evidence</th></tr></thead><tbody>
${parity.map(p => `      <tr data-v="${pcat(p.verdict)}"><td class="mono">${p.n}</td><td>${esc(p.sec.replace(/^\d+ /, ''))}</td><td>${md(p.zoho)}</td><td>${md(p.tavi)}</td><td><span class="pill ${({ Implemented: 'ok', Missing: 'bug', Bug: 'bug', 'N/A': 'info' })[pcat(p.verdict)] || 'warn'}">${pcat(p.verdict)}</span> ${md(p.verdict.replace(/^(Implemented|Missing|Bug|N\/A|Not testable)\s*/, ''))}</td><td>${md(p.ev)}</td></tr>`).join('\n')}
    </tbody></table></div>
  </section>

  <section aria-labelledby="notcovered">
    <h2 id="notcovered">Not covered</h2>
    <ul class="plain">
      <li><b>Blocked by staging:</b> ${rows.filter(r => V[r.id][0] === 'Blocked').map(r => `${r.id} (${esc(V[r.id][1])})`).join(', ')}.</li>
      <li><b>Not run:</b> ${rows.filter(r => V[r.id][0] === 'Not run').map(r => `${r.id} (${esc(V[r.id][1])})`).join(', ')}.</li>
      <li><b>Inconclusive / partial:</b> ${rows.filter(r => ['Inconclusive', 'Partial'].includes(V[r.id][0])).map(r => `${r.id}`).join(', ')}.</li>
      <li><b>Skipped on purpose:</b> ${rows.filter(r => V[r.id][0] === 'Skipped').map(r => `${r.id} (${esc(V[r.id][1])})`).join(', ')}.</li>
    </ul>
  </section>

  <section aria-labelledby="changes">
    <h2 id="changes">Changes made during testing</h2>
    <ul class="plain">
      <li><b>TAVI settings:</b> changed one at a time in Runs 2–3 and the later passes, each restored straight away; a final field-by-field comparison with the 20 Oct baseline shows every section identical.</li>
      <li><b>Connection:</b> two user-approved Disconnect/Connect cycles (20 Oct 15:32 UTC, 21 Oct 11:18 UTC). The integration is connected and not paused; "connected since" is now 21 Oct 11:18 UTC.</li>
      <li><b>Records:</b> every "QA CD" record was deleted in both apps (including 1,000 from the 500-contact test); deleted records sit in the recycle bins. Links and Sync History rows of the test records remain.</li>
      <li><b>Users and profiles:</b> the Desk Agent profile's CRM access was changed briefly for permission tests and restored; the QA agent got a temporary view-only override for A5, removed afterwards. No profile was created or deleted.</li>
      <li><b>Owner's view:</b> the ticket list was switched to Handshake Mode once and back to Classic View; the automation session's language was switched to Arabic and back (stored only in that session).</li>
      <li><b>Zoho:</b> the Zoho Desk ↔ Zoho CRM integration created on 18 Oct for the comparison was deleted on 21 Oct (user decision); records it copied stay in both Zoho orgs.</li>
      <li><b>Plane:</b> nothing filed.</li>
    </ul>
  </section>

  <section aria-labelledby="files">
    <h2 id="files">Files</h2>
    <ul class="plain">
      <li>Missing list: docs/crm-desk-integration/crm-desk-integration-missing-list.md and missing-report.html</li>
      <li>Zoho parity matrix: docs/crm-desk-integration/zoho-parity-matrix.md</li>
      <li>Spec: docs/crm-desk-integration/spec-crm-desk-integration.md / .html</li>
      <li>Run log with every detail: executions/execu_2026-10-20_crm-desk-integration/report.md, run2-facts.txt</li>
      <li>Bug report: executions/execu_2026-10-20_crm-desk-integration/bug-report.html</li>
      <li>Automation: automation/src/test/java/qa/features/crmdeskintegration/ (feature map in automation/src/test/resources/features/crmdeskintegration/feature-map.md)</li>
    </ul>
  </section>
</div>
<script>
function wire(qId, sel, tableId, gId) {
  const q = document.getElementById(qId), v = document.getElementById(sel), g = gId ? document.getElementById(gId) : null;
  const run = () => { const t = q.value.toLowerCase(); for (const r of document.querySelectorAll('#' + tableId + ' tbody tr')) {
    const ok = (!t || r.textContent.toLowerCase().includes(t)) && (!v.value || r.dataset.v === v.value) && (!g || !g.value || r.dataset.g === g.value);
    r.classList.toggle('hidden', !ok); } };
  [q, v, g].filter(Boolean).forEach(e => e.addEventListener('input', run));
}
wire('q', 'v', 'rowtable', 'g'); wire('pq', 'pv', 'paritytable');
</script>
`;
fs.writeFileSync(path.join(EXE, 'crm-desk-integration-report.html'), html);
console.log('rows', total, JSON.stringify(count), 'parity', parity.length, 'gaps', gapArticles.length, 'bugs', bugArticles.length);
