// Evidence panels for D-16 (E2E-1 role round robin), D-17 (date trigger on non-date field), D-18 (owner target not checked). Data: a4/e2e134.json, a4/side.json (12 Nov 2026 night).
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(path.resolve(__dirname, '../../..'), 'node_modules/playwright'));
const RUN = path.join(__dirname, '..'); const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); const sd = require('../a4/side.json');
const P = {
  'api-d16-role-round-robin.png': ['Workflow rule "QA AO WF E2E1" (On Create, Priority = urgent) — NDC-Staging, 12 Nov 2026 21:33–21:52 UTC', [
    ['Actions', '1. Owner Assignment → Roles (round robin): CEO  (members: Test User 1, Dev Team 2 — both in QA AO Dept A)\n2. Add Tags "QA WF urgent"   3. Task "Call customer" due +1 day   4. Email → ticket owner'],
    ['Presence while testing', 'GET /desk/queues/agents → online: Test User 1 (and the owner account)'],
    ['Result on 6 urgent tickets (#A–#F, incl. 3 created with owner = none)', 'Tag: added   Task: Succeeded   Email: Succeeded   Execution History: 1 row, outcome Fired\nOwner: unchanged on every ticket (owner account / none) — nobody from the CEO role was assigned\nTicket history: workflow_rule_ran only — no owner_changed\nDispatches listed: Task, Email — the Owner Assignment action leaves no result and no reason', true],
    ['Control', 'Same rule with Owner Assignment → specific user (I9 run): owner set as expected']]],
  'api-d17-date-trigger-text-field.png': ['POST /api/v1/workflow/rules — trigger "A Date-Time field" — NDC-Staging, 12 Nov 2026 22:03 UTC', [
    ['dateFieldName: "subject" (text)', sd.date_subject + '\nsaved trigger ' + sd.date_subject_trigger, true],
    ['dateFieldName: "priority" (pick list)', sd.date_priority + '\nsaved trigger ' + sd.date_priority_trigger, true],
    ['dateFieldName: "due_date" (date-time)', sd.date_due_date + '  ← correct'],
    ['dateFieldName: "nope_field" (does not exist)', sd.date_nope_field + '  ← correct'],
    ['Rule editor (screen)', 'Date field picker offers only date fields (Created Time, Modified Time, Due Date …) — only the API lets other fields through']]],
  'api-d18-owner-target-unchecked.png': ['POST /api/v1/workflow/rules — Owner Assignment action — NDC-Staging, 12 Nov 2026 22:03 UTC', [
    ['ownerTargetKind "RoleRoundRobin", ownerValue "x"', sd.role_x, true],
    ['ownerTargetKind "RoleRoundRobin", ownerValue "11111111-2222-3333-4444-555555555555" (no such role)', sd.role_randomUuid, true],
    ['ownerTargetKind "SpecificUser", ownerValue "x"', sd.user_x_control, true],
    ['ownerTargetKind "RoleRoundRobin", ownerValue = CEO role id (real)', sd.role_CEO + '  ← correct'],
    ['Compare', 'Unknown trigger field → 400 "Unknown field(s) …"; unknown owner target → saved']]],
};
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true }); const pg = await b.newPage({ viewport: { width: 1440, height: 600 } }); const out = {};
  for (const [f, [title, blocks]] of Object.entries(P)) {
    await pg.setContent(`<html><body style="margin:0;background:#0f172a;color:#e2e8f0;font:15px/1.5 Consolas,monospace;width:1440px"><div style="padding:16px 22px;background:#1e293b;font:600 16px 'Segoe UI'">${esc(title)}</div>${blocks.map(([h, t, bug]) => `<div class="blk${bug ? ' bug' : ''}" style="padding:12px 22px"><div style="color:#93c5fd;font:600 14px 'Segoe UI';margin-bottom:6px">${esc(h)}</div><pre style="margin:0;white-space:pre-wrap">${esc(t)}</pre></div>`).join('')}</body></html>`);
    const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: 1440, height: h });
    out[f] = { h, bugs: await pg.evaluate(() => [...document.querySelectorAll('.blk.bug')].map(d => { const r = d.getBoundingClientRect(); return [Math.round(r.x + 14), Math.round(r.y + 6), Math.round(r.right - 14), Math.round(r.bottom - 4)]; })) };
    await pg.screenshot({ path: path.join(RUN, 'evidence/raw', f) });
  }
  fs.writeFileSync(path.join(RUN, 'evidence/raw/night-panels.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out)); await b.close();
})();
