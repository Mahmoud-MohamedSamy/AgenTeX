// Phase 3 screen pass 1 (owner, Edge 1600x900): list, designer, new designer, ticket pages, dashboard, approvals, views.
const FX = JSON.parse(require('fs').readFileSync(require('path').resolve('../out/ui-fixture.json'), 'utf8'));
const out = {};
const grab = async (name, wait = 6000) => { await sleep(wait); const t = await text(); await shot(name); return t; };
const has = (t, arr) => Object.fromEntries(arr.map(s => [s.slice(0, 40), t.includes(s)]));
const t0 = Date.now();
// list
const DEPT = 'f3be4a9a-aeb3-4450-a6ef-ed5d50ce00f7';
await go('/settings/automation/blueprints?department=' + DEPT);
let t = await grab('P3-LS-list-default', 9000);
if (/sign in|log in/i.test(t.slice(0, 300))) return { signedOut: true };
t = await grab('P3-LS-list-qa-dept', 5000);
out.list = has(t, ['Create Blueprint', 'QA BP R ' + FX.tag, 'مسار الاسترداد', 'Active', 'Inactive', 'in progress', '*', 'Clone', 'Manage records', 'Revoke tickets', 'Include tickets']);
out.listSnippet = t.slice(0, 1200);
// designer of the flow blueprint
const d0 = Date.now(); await go('/settings/automation/blueprints/' + FX.bps.flow); t = await grab('P3-DT-designer-flow', 12000); out.designerLoadMs = Date.now() - d0;
out.designer = has(t, ['Save Draft', 'Publish', 'Versions', 'Undo', 'Redo', 'Tidy', 'Add State', 'Details', 'Advanced configuration', 'Dynamic Transition Owner Assignment', 'Strict Mode', 'Continuous', 'Transition Owners', 'Ticket status', 'Used statuses', 'Other statuses']);
out.designerSnippet = t.slice(0, 1500);
// click a state to open its panel
for (const n of ['On Hold', 'Open']) { const el = page.locator('.react-flow__node', { hasText: n }).first(); if (await el.count()) { await el.click({ timeout: 8000 }).catch(() => {}); t = await grab('P3-ST-state-panel-' + n.replace(' ', ''), 2500); out['statePanel ' + n] = has(t, ['Time limit', 'Warn before', 'Business hours', 'Calendar time', 'Escalation levels', 'Moves on by itself', 'Customer triggers', 'Nothing set, so a customer reply reopens the ticket as it does today.', 'For these replies', 'Order of transitions', 'Minutes', 'Hours', 'Days', 'Counted on']); out['statePanelText ' + n] = (t.match(/Counted on[^\n]*/) || [''])[0] + ' | ' + (t.match(/A ticket that enters on[^\n]*/) || [''])[0]; } }
// click a transition label
const tl = page.getByText('QA go').first(); if (await tl.count()) { await tl.click({ timeout: 8000 }).catch(() => {}); t = await grab('P3-TU-transition-panel', 2500); out.transitionPanel = has(t, ['Before', 'During', 'After', 'Who can run this', 'Add item', 'The agent sees these in this order.', 'Run in this order once the ticket moves.', 'Required for everyone', 'Checks']); }
// big blueprint
const b0 = Date.now(); await go('/settings/automation/blueprints/' + FX.bps.big); await grab('P3-CV-big-blueprint', 15000); out.bigLoadMs = Date.now() - b0;
const fit = page.getByRole('button', { name: /fit/i }).first(); if (await fit.count()) { await fit.click({ timeout: 8000 }).catch(() => {}); await grab('P3-CV-big-fit', 2500); }
// new blueprint
await go('/settings/automation/blueprints'); await sleep(5000);
const cb = page.getByRole('button', { name: /Create Blueprint/i }).first(); if (await cb.count()) { await cb.click({ timeout: 8000 }).catch(() => {}); t = await grab('P3-DT-new', 8000); out.newDesigner = has(t, ['Drag a status from the list onto the canvas, or use Add State to create one.', 'Details', 'Name', 'Description', 'Layout', 'Department']); out.newUrl = page.url().replace(H, ''); }
// tickets
for (const k of ['open', 'esc', 'done', 'revoked', 'both', 'approval', 'arabic', 'hold']) {
  const s0 = Date.now(); await go('/views/all/tickets/' + FX.tickets[k]); t = await grab('P3-RN-ticket-' + k, 9000); out['ticketMs ' + k] = Date.now() - s0;
  out['ticket ' + k] = has(t, ['Steps', 'Now', 'Next step', 'Due', 'Overdue by', 'Warning', 'In ', 'View configured actions', 'Set by blueprint', 'Close ticket', 'Revoke blueprint', 'No transitions you can run', 'Waiting for approval', 'Assign owners', 'This ticket follows blueprint']);
  out['ticketSnippet ' + k] = t.slice(0, 900).replace(/\s+/g, ' ');
}
// dashboard
await go('/analytics/dashboards/blueprints'); t = await grab('P3-RS-dashboard', 12000); out.dashboard = t.slice(0, 1200).replace(/\s+/g, ' ');
// approvals
await go('/approvals'); t = await grab('P3-RS-approvals', 9000); out.approvals = { url: page.url().replace(H, ''), hasTicket: t.includes('QA BP R UI approval') || t.includes(String(FX.approvalNo)), snippet: t.slice(0, 500).replace(/\s+/g, ' ') };
// views list
await go('/views/all/tickets'); t = await grab('P3-RS-views', 9000); out.views = has(t, ['Active Blueprint Tickets', 'All Transitions', 'My Transitions', 'My Team Transitions', 'Unassigned Transitions', 'Blueprint']);

// ticket interactions on the open ticket
await go('/views/all/tickets/' + FX.tickets.open); await sleep(9000);
page.on('dialog', d => d.accept().catch(() => {}));
const va = page.getByText('View configured actions').first(); if (await va.count()) { await va.click({ timeout: 8000 }).catch(() => {}); t = await grab('P3-RN-flow', 3000); out.flow = has(t, ['Steps from', 'You can run this step', 'Runs on its own', "You can't run this step now.", 'Asks for:', 'Nothing to fill in', 'Checklist', 'QA BP R check documents']); await page.keyboard.press('Escape'); await sleep(800); }
const ao = page.getByText(/Assign owners/).first(); if (await ao.count()) { await ao.click({ timeout: 8000 }).catch(() => {}); t = await grab('P3-DO-dialog', 3000); out.ownersDialog = has(t, ['These owners replace the blueprint', 'Add an agent or team', 'Add another department', 'This transition now runs on its own', 'Save', 'Clear']); await page.keyboard.press('Escape'); await sleep(800); }
const run = page.getByRole('button', { name: /QA go/ }).first(); if (await run.count()) { await run.click({ timeout: 8000 }).catch(() => {}); t = await grab('P3-RN-form', 3000); out.form = has(t, ['Fill in the required items', 'Required', 'Optional', 'Internal comment', 'QA BP R read the refund policy first', 'QA BP R check documents', 'Save draft', 'Run', 'To ']);
  const ta = page.locator('textarea').first(); if (await ta.count()) { await ta.fill('QA BP R typed text'); await page.keyboard.press('Escape'); t = await grab('P3-RN-leaveform', 1500); out.leaveForm = (t.split(String.fromCharCode(10)).filter(x => /Discard what you typed|Save what you typed as a draft|Leave without saving/.test(x)))[0] || ''; await page.keyboard.press('Escape'); } }
const ht = page.getByRole('tab', { name: /History/i }).first(); if (await ht.count()) { await ht.click({ timeout: 8000 }).catch(() => {}); t = await grab('P3-RS-history-open', 3000); out.historyOpen = (t.split(String.fromCharCode(10)).filter(x => /blueprint|Blueprint/.test(x))).slice(0, 8); }
for (const k of ['esc', 'done', 'revoked']) { await go('/views/all/tickets/' + FX.tickets[k]); await sleep(8000); const h2 = page.getByRole('tab', { name: /History/i }).first(); if (await h2.count()) { await h2.click({ timeout: 8000 }).catch(() => {}); t = await grab('P3-RS-history-' + k, 3500); out['history ' + k] = (t.split(String.fromCharCode(10)).filter(x => /blueprint|Blueprint|Moved|ran |Owners|revoked|Completed|Entered/.test(x))).slice(0, 10); } }
// Arabic designer + ticket
await page.evaluate(() => { localStorage.setItem('anyware_language', 'ar'); localStorage.setItem('anyware_language_explicit', 'ar'); });
await go('/settings/automation/blueprints/' + FX.bps.arabic); t = await grab('P3-UX-ar-designer', 12000); out.arDesigner = { raw: (t.match(/(blueprints|designer|editor).[a-zA-Z.]+/g) || []).slice(0, 8), english: (t.match(/(Details|Save Draft|Publish|Add State|Strict Mode|Continuous|Transition Owners|Layout|Description|Versions)/g) || []).slice(0, 12) };
await go('/views/all/tickets/' + FX.tickets.arabic); t = await grab('P3-UX-ar-ticket', 10000); out.arTicket = { raw: (t.match(/ticket.blueprint.[a-zA-Z.]+/g) || []).slice(0, 8), english: (t.match(/(Steps|Now|Next step|Due|Run|View configured actions|Revoke blueprint)/g) || []).slice(0, 12) };
await page.evaluate(() => { localStorage.setItem('anyware_language', 'en'); localStorage.setItem('anyware_language_explicit', 'en'); });
out.totalMs = Date.now() - t0;
return out;
