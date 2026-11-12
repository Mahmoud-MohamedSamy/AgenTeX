// Evidence for the two Phase 3 bugs: API panel for the deleted-status bug + annotate specs for both, then builds the images.
const path = require('path'), fs = require('fs'); const { execFileSync } = require('child_process');
const P = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RAW = path.join(P, 'executions/execu_2026-11-01_desk-blueprint/evidence/raw');
const b = JSON.parse(fs.readFileSync(path.join(RAW, 'c20b.json'), 'utf8')), c = JSON.parse(fs.readFileSync(path.join(RAW, 'c20c.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const blk = (n, label, body) => `<div class="blk hl"><span class="mark">${n}</span><div class="lbl">${esc(label)}</div><pre>${body}</pre></div>`;
const ok = s => `<span class="ok">${s}</span>`, bad = s => `<span class="bad">${s}</span>`;
const panel = [
  blk(1, 'Status removed while an ACTIVE blueprint uses it as a state, no ticket in that state', `POST /desk/blueprints/states {"name":"QA BP Verify","type":"open"} → ${ok('200')}\nactive blueprint "QA BP C20c": Open → QA BP Verify → Closed\nPUT /modules/{tickets}/fields/{status} without "QA BP Verify" → ${bad(c.removeNoTicket.status + ' (accepted)')}`),
  blk(2, 'A ticket then runs transition "QA v" (Open → QA BP Verify)', `POST …/blueprint-transitions/v → ${bad(c.runIntoRemoved.status)}\nticket Status = ${bad('"' + c.ticketStatus.value + '"')} — no longer a ticket status`),
  blk(3, 'Control: same removal with 1 ticket already in that state', `→ ${ok(b.removeWithTicketInside.status)} ${esc(b.removeWithTicketInside.error.code)}\n"${esc(b.removeWithTicketInside.error.message)}"`)];
const page = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1600px;height:1000px;background:#0f172a;color:#e2e8f0;font:21px/1.45 Consolas,monospace;padding:36px;box-sizing:border-box}
h1{font:600 28px "Segoe UI",sans-serif;color:#fff;margin:0 0 20px}.blk{background:#1e293b;border-radius:10px;padding:18px 24px;margin-bottom:22px;position:relative}
.lbl{font:600 21px "Segoe UI",sans-serif;color:#94a3b8;margin-bottom:8px}.ok{color:#4ade80;font-weight:700}.bad{color:#fb7185;font-weight:700}
.mark{position:absolute;right:-14px;top:-14px;width:44px;height:44px;border-radius:50%;background:#ff2d55;color:#fff;font:700 24px "Segoe UI";display:flex;align-items:center;justify-content:center}
.hl{outline:4px solid #ff2d55;border-radius:6px}pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}</style></head><body>
<h1>TAVI Desk API — staging-desk.taviportal.com, org Anyware, QA WF Dept R, 2 Nov 2026 (QA records, deleted after)</h1>${panel.join('')}</body></html>`;
const ENV = 'TAVI: staging-desk.taviportal.com, org Anyware, owner, QA WF Dept R (QA records, deleted after; tenant settings restored) · Zoho: Zoho Desk Enterprise trial (read only)';
const base = { label: 'BUG', verdict: 'FAIL', date: '2 Nov 2026', env: ENV };
const specs = {
  'BH': { ...base, out: 'BP-BH-weekend-vs-zoho.png', ticket: 'Business hours', taviHead: 'TAVI Desk (Business Hours, ticket #1107)', zohoHead: 'Zoho Desk (State Level SLA clock)',
    title: 'With business hours set to Mon–Fri, blueprint and SLA due times still count Saturday',
    panels: [
      { img: 'BH-settings-keep.png', caption: 'TAVI Setup → Business Hours: Default = 24 hours · Mon–Fri; "SLA policies, blueprints and supervise rules count time in them."', crop: [270, 60, 1160, 320], boxes: [{ b: [288, 90, 852, 110], n: 1 }, { b: [905, 325, 1122, 352], n: 1 }] },
      { img: 'zoho-state-sla-clock.png', caption: 'Zoho: a state SLA picks its clock (business-hours sets or Calendar Hours); business hours count working days only', crop: [1120, 160, 480, 320], boxes: [{ b: [1312, 294, 1444, 340], n: 1 }] },
      { img: 'BH3-ticket.png', caption: 'TAVI ticket #1107, entered Mon 2 Nov 11:57: blueprint state (5 days, business clock) "Due Sat 11:57", warning Fri 11:57', crop: [365, 385, 300, 240], boxes: [{ b: [408, 510, 530, 534], n: 2 }, { b: [408, 534, 548, 556], n: 2 }] },
      { img: 'BH3-ticket-sla.png', caption: 'Same ticket, department SLA on business hours: resolution (120 h) due 07/11/2026 11:57 but "4 days 11 hours of business time left"', crop: [365, 280, 300, 370], boxes: [{ b: [386, 466, 640, 532], n: 3 }, { b: [386, 596, 600, 638], n: 3 }] }],
    rows: [
      [1, 'Working days', 'Business hours define the working days and times; time outside them is not counted by SLAs or blueprint state SLAs.', 'Default business hours set to 24 hours · Mon–Fri (Sat and Sun not working days). The page says blueprints and SLA policies count time in them.', 'INFO'],
      [2, 'Blueprint state, 5-day limit on "Business hours"', 'Counts only working time: entered Mon 11:57 → due the next Mon 11:57.', 'Due Sat 7 Nov 11:57 (warning Fri 11:57) — exactly 5 calendar days. The value is final (not provisional) after the server recalculates it.', 'BUG'],
      [3, 'Department SLA, resolution 120 business hours, same ticket', 'Counts only working time.', 'Due 07/11/2026 11:57 too, while the card says "4 days 11 hours of business time left" — only about 108 working hours exist before that time.', 'BUG']] },
  'C20': { ...base, out: 'BP-C20-removed-status-vs-zoho.png', ticket: 'Blueprint', taviHead: 'TAVI Desk (API log, ticket #1109, designer)', zohoHead: 'Zoho Desk (ticket #101 in a blueprint)',
    title: 'A status a live blueprint uses can be removed when no ticket is in it; tickets then move into the removed status',
    panels: [
      { img: 'C20c-api.png', caption: 'TAVI API: removal accepted with no ticket in the state; a transition then sets the removed status; with a ticket inside, removal is refused', crop: [0, 0, 1600, 600], boxes: [] },
      { img: 'zoho-ticket-in-blueprint.png', caption: 'Zoho: Status is locked while the blueprint controls it; the strip shows the current state', crop: [0, 0, 1600, 1000], boxes: [{ b: [352, 420, 436, 468], n: 2 }, { b: [652, 916, 1600, 972], n: 2 }] },
      { img: 'C20c-ticket.png', caption: 'TAVI ticket #1109 after the transition: Status "QA BP Verify" (locked, set by the blueprint) although it is no longer a ticket status', crop: [0, 56, 1600, 944], boxes: [{ b: [388, 783, 504, 811], n: 2 }, { b: [22, 210, 122, 240], n: 2 }, { b: [1176, 108, 1352, 130], n: 2 }] },
      { img: 'C20c-designer.png', caption: 'TAVI designer: "1 issue to fix before publishing · QA BP Verify is no longer a ticket status", yet the blueprint is still Active', crop: [0, 56, 1600, 944], boxes: [{ b: [310, 122, 1290, 184], n: 3 }, { b: [1458, 348, 1516, 370], n: 3 }, { b: [70, 222, 292, 414], n: 3 }] }],
    rows: [
      [1, 'Removing a status a live blueprint uses', 'Status is locked inside a blueprint and changes only through its transitions. Deleting a status used by a blueprint is not described in Zoho help and was not tried in Zoho (it would change the Zoho org).', 'With no ticket in that state, removing "QA BP Verify" is accepted (200) and the blueprint stays active. With a ticket inside, it is refused (422 FIELD_OPTION_IN_BLUEPRINT), which is correct.', 'BUG'],
      [2, 'A ticket runs the transition into that state', 'The ticket stays on a valid status.', 'Ticket #1109 moves into "QA BP Verify": Status shows it (locked, "Set by blueprint QA BP C20c") although it is no longer a ticket status.', 'BUG'],
      [3, 'What the admin sees', 'Not applicable.', 'The designer shows "QA BP Verify is no longer a ticket status" as an issue to fix before publishing, but the published version stays Active and keeps moving tickets there.', 'INFO']] } };
(async () => {
  const br = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] }); const pg = await br.newPage({ viewport: { width: 1600, height: 1000 } });
  await pg.setContent(page); await pg.screenshot({ path: path.join(RAW, 'C20c-api.png') }); await br.close();
  for (const [k, s] of Object.entries(specs)) { const f = path.join(__dirname, `spec-${k}.json`); fs.writeFileSync(f, JSON.stringify(s, null, 1)); console.log(execFileSync('node', [path.join(__dirname, 'annotate-vs-zoho.js'), f], { encoding: 'utf8' }).trim()); }
})();
