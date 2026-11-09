// Round 9: comment + state change + annotated evidence for the tickets the user approved on 29 Oct 2026
// ("move what passes to done …, fails / partially to bug …, skip what needs decision"). PASS → Done; FAIL / PARTIAL → Bug.
// Skipped (user decides): NDC-2701, NDC-2630, NDC-2706, NDC-2538, NDC-2406. Not retested yet: the 13 paused tickets.
// Usage: node scripts/post-r9.js <token.csv> [--dry]. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..');
const [csv, ...flags] = process.argv.slice(2); const DRY = flags.includes('--dry');
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 6; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const onlyArg = (flags.find(f => f.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const APPROVED = onlyArg.length ? onlyArg : ['NDC-2412', 'NDC-2294', 'NDC-613', 'NDC-2707', 'NDC-2708', 'NDC-2709', 'NDC-2705', 'NDC-2703', 'NDC-492', 'NDC-2712', 'NDC-2710'];
// verdict overrides decided by the user at Gate 2 (1 Nov 2026)
const OVERRIDE = { 'NDC-2706': { v: 'PASS', note: 'Decision (1 Nov 2026): review processes applying to newly created records only is the intended design, so the On Edit workflow is judged on Mass Update without a review hold — it runs every time.' } };
// One-line results (same text as report.html)
const SUM = {
  'NDC-2412': 'In role mode a higher-ranked user in the same org unit still cannot see a lower-ranked user\'s leads (Supervisor and Manager @ team1 → 403, not listed; also after 60 s and a fresh sign-in). Other org unit, same rank and lower → higher are correctly hidden; own lead and owner see it.',
  'NDC-2294': '12 of the 13 items now work on Anyware and were run, not only saved. Still missing: the Record Score trigger (the editor\'s "Score value" category is switched off — "Scoring rules land in Phase 5"). Item 7 (Anyone / Everyone) is stored and read back correctly but was not run: every role / org unit on this tenant includes real users.',
  'NDC-613': 'A user with export granted and View Own / Team / All Login History denied can neither list nor export login history (403 / 403); Settings has no Login History link and the direct URL shows "Access Denied". Control: with the denies lifted, list and export work (200) and the export holds only the user\'s own rows.',
  'NDC-2707': 'Records approved by an approval process now enter their blueprint: Tasks 2/2, a lead created by a blueprint "Create record" after-action, and a control lead. None was in the blueprint while the approval was pending.',
  'NDC-2708': 'The approver opened records waiting for their approval 62 of 62 times (record and approval state 200), with and without the approve permission. Observation (not part of this ticket): right after deciding, the approver (CRM User) gets 404 on that record.',
  'NDC-2709': '4 of 4: right after the review is approved, the first edit succeeds (200) and a second edit 5 s later too — no REVIEW_LOCKED.',
  'NDC-2705': 'With the Excel channel ticked and "Trigger automation and process management" on, the imported lead is held for review (pending in the review queue). With the option off it is not held, as the option says. A lead created through the API is held (control).',
  'NDC-2703': 'A free-text condition is refused (400 INVALID_RECORD_LOCK). A rule matching a QA lead locks it: edits by the owner and by a CRM user are refused (422 RECORD_LOCKED, the rule is named). A lead that doesn\'t match can be edited.',
  'NDC-492': 'Tab Order "Top to Bottom" / "Left to Right" now selects, saves ("Layout saved successfully."), survives a reload, and the record form follows it (Top to Bottom: down the left column, then the right; Left to Right: row by row). Restored to Left to Right afterwards.',
  'NDC-2712': 'A submission with the spam-trap field filled creates no lead — sent exactly as the embedded form does (page_origin null) and with page_origin set. A normal submission creates the lead (control).',
  'NDC-2710': 'For an approver without workflow:approval:act the approval view now says canApprove = false (reason missing_permission) and Approve is refused with a clear message — the view and the action agree. With the permission, Approve is offered and works.',
  'NDC-2655': 'Business hours moved to /iam/tenant/business-hours. The stored 24/7 record re-saves unchanged (200 ×2); a 24/7 save carrying hours is stored clean; the check still refuses a broken 24/7. Screen: Save stays disabled while nothing changed.',
  'NDC-2656': 'On the owner\'s own user record the profile control is disabled ("Owner (fixed)"), Assign is disabled, and the reason is shown.',
  'NDC-2414': 'Adding the Desk Administrator profile gives no CRM view-all: other users\' leads stay 403 and unlisted; the CRM-scoped permissions have no view_all. (The unscoped permission list still merges desk metadata keys — no effect on records.)',
  'NDC-2647': 'The report shows the rollup value 12 — the same as the record — at once and after 1, 3 and 6 minutes.',
  'NDC-2624': 'The timeline now logs attachment added (×2), attachment removed and record deleted, besides created / changed / note / restored. Uploads work again.',
  'NDC-1950': 'My Requests has the three tabs, columns, filters, per-cycle History rows and DELETED marking; no action controls. Owner, manager (U2 → subordinate U1) and regular user each get the right rows and filters. Note: the default User profile lacks crm.page.my_requests.view.',
  'NDC-1823': 'Probability and Expected Revenue are locked and filled from Stage + Amount (18 / 1800); typing is refused; the duration fields aren\'t offered; the deal form opens at once.',
  'NDC-1343': 'Record, field, workflow rule, profile, user override and org unit actions are all logged with the user; every login / logout names the user.',
  'NDC-2711': 'A deleted or unknown layout now answers 404 LAYOUT_NOT_FOUND with a clear message (not 403); a live layout creates the lead.',
  'NDC-2704': 'Home cards show field names (Subject, Due date, Status, Priority, Related To; Title, From, To, Related To) — no raw keys.',
  'NDC-2657': 'A user without profile access has no Permissions link and the direct URL shows "You don\'t have permission to manage profiles". (Optional view-only permission not added.)',
  'NDC-2658': 'Invite with all seats used: "All seats are in use. Remove a user or add seats in Billing to invite someone." — no raw key; nothing invited.',
  'NDC-2321': 'The timeline shows the owner change naming the assignment rule, a workflow field-update row naming the rule, and a blueprint entry row — in the order they ran.',
  'NDC-2706': 'Decision 1 Nov: review applies to new records only (intended). The On Edit workflow runs after every Mass Update (4/4: execution logged, marker set) and the lead continues into its blueprint.',
  'NDC-2406': 'On Anyware (pair made from the Desk side): deleting the CRM contact removes the Desk contact, which lands in the Desk recycle bin and restores (200, back). Observation: CRM-created contacts never get a Desk partner on Anyware.',
  'NDC-2538': 'Review webhook (public catcher, user-approved, deleted after): submitted, approved, rejected and resubmitted are all posted, each with X-Anyware-Timestamp and X-Anyware-Signature; the HMAC-SHA256 signature verifies on all 9 requests.',
};
(async () => {
  const log = []; const map = { dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: {} }; const done = [];
  for (const key of APPROVED) {
    const t = META.find(x => x.key === key); const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs-r9', key + '.json'), 'utf8'));
    const v = OVERRIDE[key]?.v || spec.verdict; const pass = v === 'PASS';
    const w = await call('GET', `/work-items/${t.id}/`);
    if (w.j?.state !== RFT) { log.push(key + ' SKIPPED — not in Ready For Test'); continue; }
    const still = spec.rows.filter(r => r[4] === 'FAIL');
    const html = `<p><strong>Retest ${v} — 29 Oct – 1 Nov 2026</strong>${pass ? '' : ' → moved to Bug'}<br>Environment: staging-crm.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner, test users (CRM User profile)<br>Method: API and screen (the steps of the existing automation, run against the Anyware tenant)</p>`
      + (OVERRIDE[key]?.note ? `<p><strong>${esc(OVERRIDE[key].note)}</strong></p>` : '') + `<p>${esc(SUM[key])}</p><p>Checked:</p><ul>${spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <strong>[${esc(r[4])}]</strong></li>`).join('')}</ul>`
      + (still.length ? `<p><strong>Still failing:</strong></p><ul>${still.map(r => `<li>${esc(r[1])}: expected ${esc(r[2])}, actual ${esc(r[3])}</li>`).join('')}</ul>` : '')
      + `<p>Evidence: ${esc(spec.out)} (attached)</p>`;
    if (DRY) { log.push(`${key} ${v} → ${pass ? 'Done' : 'Bug'} (dry) ${html.length} chars, ${spec.out}`); continue; }
    const c = await call('POST', `/work-items/${t.id}/comments/`, { comment_html: html });
    const u = await call('PATCH', `/work-items/${t.id}/`, { state: pass ? DONE : BUG });
    log.push(`${key} ${v} comment ${c.s} | ${pass ? 'Done' : 'Bug'} ${u.s}`); map.files[spec.out] = t.id; done.push({ key, id: t.id, out: spec.out });
    await new Promise(s => setTimeout(s, 1200));
  }
  console.log(log.join('\n'));
  if (!done.length) return;
  fs.writeFileSync(path.join(RUN, 'attach-r9.json'), JSON.stringify(map));
  console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, path.join(RUN, 'attach-r9.json')], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim());
  const back = [];
  for (const { key, id, out } of done) { const r = await call('GET', `/work-items/${id}/?expand=state`); const a = await call('GET', `/work-items/${id}/attachments/`);
    back.push(`${key} → ${r.j?.state?.name} | image ${(a.j?.results || a.j || []).some(x => x.attributes?.name === out) ? 'yes' : 'MISSING'}`); await new Promise(s => setTimeout(s, 400)); }
  console.log('READ BACK\n' + back.join('\n'));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
