// Renders API request/response evidence as PNG panels (1440 wide) into evidence/raw/. No secrets: only request bodies and responses.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const { chromium } = require(path.join(ROOT, 'node_modules/playwright'));
const RUN = path.join(__dirname, '..'); const ev1 = require('../a4/ev1-out.json'); const ev2 = require('../a4/ev2-out.json');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const panels = {
  'api-d02-two-field-updates.png': ['POST /api/v1/workflow/rules — 12 Nov 2026, NDC-Staging', [
    ['Request (actions part)', '"actions": [\n  { "type": "FieldUpdate", "delaySeconds": 0, "fieldUpdates": { "description": "one" } },\n  { "type": "FieldUpdate", "delaySeconds": 0, "fieldUpdates": { "priority": "high" } }\n]'],
    ['Response', ev2.Z18_twoFieldUpdates.replace(/^400 /, 'HTTP 400  ')],
    ['Same call with two Task actions', ev2.Z18_twoTasks.replace(/^201 saved/, 'HTTP 201  saved (two Tasks are allowed now)')]]],
  'api-d03-created-by.png': ['POST /api/v1/workflow/rules — 12 Nov 2026, NDC-Staging', [
    ['Field Update on created_by', '"actions": [ { "type": "FieldUpdate", "fieldUpdates": { "created_by": "97be04b6-…" } } ]\n\n' + ev2.B2_createdBy.replace(/^201 saved/, 'HTTP 201  saved  ← system field accepted')],
    ['Control: Field Update on ticket_number', ev2.B2_ticketNumber_control.replace(/^422 /, 'HTTP 422  ')],
    ['Rule editor (screen)', 'Field Update › Add field › search "Created" → "No results found" (the screen hides it; the API does not refuse it)']]],
  'api-d08-webhook-headers.png': ['webhook.site — request received from TAVI workflow rule "QA AO WF EV8" — 12 Nov 2026 ' + ev1.R.EV8.at + ' UTC', [
    ['Header configured on the Webhook action (one header)', '"headers": { "X-QA": "a\\r\\nInjected: 1" }'],
    ['Headers received by webhook.site (webhook.site API, request ' + ev1.R.EV8.uuid.slice(0, 8) + '…)', Object.entries(ev1.R.EV8.headers).map(([k, v]) => k + ': ' + v.join(', ')).join('\n') + '\n\n← "injected: 1" arrived as its own header'],
    ['Execution History', 'Webhook: Succeeded']]],
  'api-d12-happiness-off.png': ['Customer Happiness off, rule "QA AO WF EV12" with Send happiness email — 12 Nov 2026', [
    ['GET /api/v1/desk/happiness/settings', ev1.R.happiness + ' …'],
    ['Execution for ticket #' + ev1.R.EV12.number + ' (GET /api/v1/workflow/executions)', 'outcome: Fired\nactions: SendHappinessEmail → Succeeded\n(no reason, no "skipped", nothing in the ticket history)']]],
  'api-d13-key-order.png': ['POST /api/v1/modules/{tickets}/records — 12 Nov 2026, NDC-Staging', [
    ['Request A: "value" before "kind"', '{ "field": "subject", "value": { "value": "QA AO WF EV13 order", "kind": "string" } }'],
    ['Response A', 'HTTP ' + ev1.R.EV13.bad.replace(/Trace id: [0-9a-f-]+/, 'Trace id: …')],
    ['Request B: same value, "kind" first', '{ "field": "subject", "value": { "kind": "string", "value": "QA AO WF EV13 order" } }'],
    ['Response B', 'HTTP ' + ev1.R.EV13.good]]],
};
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true }); const pg = await b.newPage({ viewport: { width: 1440, height: 600 } });
  for (const [f, [title, blocks]] of Object.entries(panels)) {
    await pg.setContent(`<html><body style="margin:0;background:#0f172a;color:#e2e8f0;font:15px/1.5 Consolas,monospace;width:1440px"><div style="padding:16px 22px;background:#1e293b;font:600 16px 'Segoe UI'">${esc(title)}</div>${blocks.map(([h, t]) => `<div style="padding:12px 22px"><div style="color:#93c5fd;font:600 14px 'Segoe UI';margin-bottom:6px">${esc(h)}</div><pre style="margin:0;white-space:pre-wrap;background:#020617;border:1px solid #334155;border-radius:6px;padding:12px">${esc(t)}</pre></div>`).join('')}<div style="height:12px"></div></body></html>`);
    const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: 1440, height: h });
    await pg.screenshot({ path: path.join(RUN, 'evidence/raw', f) }); console.log(f, h);
  }
  await b.close();
})();
