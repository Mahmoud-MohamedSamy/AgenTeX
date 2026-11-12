// I9 evidence panel (12 Nov 2026 22:2x Cairo): Owner Assignment workflow vs manual assign, agent active/suspended, in/out of the department. Results recorded by a4/i9c..i9i.js.
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(path.resolve(__dirname, '../../..'), 'node_modules/playwright'));
const RUN = path.join(__dirname, '..'); const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const title = 'Workflow rule "QA AO WF I9 owner" (On Create → Owner Assignment → specific agent) vs manual assign — NDC-Staging, 12 Nov 2026';
const blocks = [
  ['Agent status change', 'PATCH /api/v1/iam/users/{agent} { "status": "suspended" }  → HTTP 204, users list shows status "suspended"'],
  ['A. Agent NOT a member of the ticket\'s department', 'Manual  POST /api/v1/desk/tickets/{id}/assign (agent active)\n  → HTTP 422 "User … is not an active agent of the ticket\'s department."  (owner_id: not_eligible)\nWorkflow, agent active     → ticket owner = agent   execution: Fired\nWorkflow, agent SUSPENDED  → ticket owner = agent   execution: Fired   ← suspended non-member assigned'],
  ['B. Agent added to the department', 'Manual, agent active      → HTTP 200, owner = agent\nManual, agent SUSPENDED   → HTTP 422 "User … is not an active agent of the ticket\'s department."\nWorkflow, agent SUSPENDED → ticket left unassigned\n   GET /api/v1/workflow/executions?recordId=…  →  outcome: "Fired", errorMessage: null, dispatches: []   ← no failure, no reason'],
  ['Ticket', 'Status Open, editable afterwards (PATCH priority → 200). History: owner_changed (case A), workflow_rule_ran.'],
];
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true }); const pg = await b.newPage({ viewport: { width: 1440, height: 600 } });
  await pg.setContent(`<html><body style="margin:0;background:#0f172a;color:#e2e8f0;font:15px/1.5 Consolas,monospace;width:1440px"><div style="padding:16px 22px;background:#1e293b;font:600 16px 'Segoe UI'">${esc(title)}</div>${blocks.map(([h, t]) => `<div class="blk" style="padding:12px 22px"><div style="color:#93c5fd;font:600 14px 'Segoe UI';margin-bottom:6px">${esc(h)}</div><pre style="margin:0;white-space:pre-wrap">${esc(t)}</pre></div>`).join('')}</body></html>`);
  const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: 1440, height: h });
  console.log(JSON.stringify(await pg.evaluate(() => [...document.querySelectorAll('pre')].map(p => { const r = p.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.right), Math.round(r.bottom)]; }))), h);
  await pg.screenshot({ path: path.join(RUN, 'evidence/raw/api-i9-owner-suspended.png') }); await b.close();
})();
