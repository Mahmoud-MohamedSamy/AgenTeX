// Phase 3 pass 0 (no fixture needed): list, new designer, dashboard, views, approvals, Arabic.
const out = {};
const grab = async (name, wait = 6000) => { await sleep(wait); const t = await text(); await shot(name); return t; };
const has = (t, arr) => Object.fromEntries(arr.map(s => [s.slice(0, 50), t.includes(s)]));
await go('/settings/automation/blueprints');
let t = await grab('P3-LS-list', 10000);
if (/sign in|log in/i.test(t.slice(0, 400)) && !/Blueprint/.test(t)) return { signedOut: true, url: page.url() };
out.url = page.url().replace(H, '');
out.list = has(t, ['Blueprints', 'Create Blueprint', 'Customer Support', 'Active', 'Inactive', 'in progress', 'Revoke tickets', 'Include tickets', 'Clone', 'Manage records', 'Drag to reorder']);
out.listTop = t.slice(0, 700).replace(/\s+/g, ' ');
// department control
const combos = await page.locator('select, [role=combobox]').count(); out.combos = combos;
const sel = page.locator('select').first();
if (await sel.count()) { const opts = await sel.locator('option').allInnerTexts(); out.deptOptions = opts.slice(0, 60); const q = opts.find(x => /QA BP Reg Dept/.test(x)); if (q) { await sel.selectOption({ label: q }); t = await grab('P3-LS-list-qa', 5000); out.listQa = t.slice(0, 900).replace(/\s+/g, ' '); }
  const hr = opts.find(x => /^\s*HR\s*$/.test(x)) || opts.find(x => /Marketing/.test(x)); if (hr) { await sel.selectOption({ label: hr }); t = await grab('P3-LS-empty', 4000); out.empty = (t.match(/No blueprints in[^\n]*/) || ['(none)'])[0]; } }
// new designer
await go('/settings/automation/blueprints'); await sleep(6000);
const cb = page.getByRole('button', { name: /Create Blueprint/i }).first();
if (await cb.count()) { await cb.click(); t = await grab('P3-DT-new', 9000); out.newUrl = page.url().replace(H, '');
  out.newDesigner = has(t, ['Drag a status from the list onto the canvas, or use Add State to create one.', 'Details', 'Name', 'Description', 'Layout', 'Department', 'Advanced configuration', 'Strict Mode', 'Dynamic Transition Owner Assignment', 'Continuous', 'Transition Owners', 'Save Draft', 'Publish', 'Add State', 'Used statuses', 'Other statuses', 'issue']);
  out.newText = t.slice(0, 1500).replace(/\s+/g, ' ');
  // phone width
  await page.setViewportSize({ width: 390, height: 844 }); t = await grab('P3-CV-phone', 3000); out.phone = t.includes('Draw states and connectors on a larger screen'); await page.setViewportSize({ width: 1600, height: 900 });
  // VR-09 leave with unsaved changes: type a name then go back
  const nm = page.getByLabel(/^Name/i).first(); if (await nm.count()) { await nm.fill('QA BP R unsaved ' + Date.now()); await sleep(800); let dlg = null; page.once('dialog', async d => { dlg = d.type() + ': ' + d.message(); await d.dismiss(); }); await page.goBack().catch(() => {}); await sleep(2500); t = await text(); out.leave = { dialog: dlg, inPage: /unsaved|discard|keep/i.test(t) ? (t.match(/[^\n]*(unsaved|Discard|Keep)[^\n]*/i) || [''])[0] : null }; await shot('P3-VR-leave');
    page.on('dialog', d => d.accept().catch(() => {})); await page.goto(H + '/settings/automation/blueprints', { waitUntil: 'commit' }).catch(() => {}); await sleep(6000); const cb2 = page.getByRole('button', { name: /Create Blueprint/i }).first(); if (await cb2.count()) { await cb2.click(); t = await grab('P3-VR-localdraft', 8000); out.localDraft = (t.match(/You have unsaved changes[^\n]*/) || [''])[0]; } } }
// dashboard
await go('/analytics/dashboards/blueprints'); t = await grab('P3-RS-dashboard', 14000); out.dashUrl = page.url().replace(H, ''); out.dashboard = t.slice(0, 1500).replace(/\s+/g, ' ');
// views
await go('/views/all/tickets'); t = await grab('P3-RS-views', 10000);
out.views = has(t, ['Active Blueprint Tickets', 'All Transitions', 'My Transitions', 'My Team Transitions', 'Unassigned Transitions']);
out.viewsSnippet = (t.match(/[^\n]*Transitions[^\n]*/g) || []).slice(0, 8);
// approvals
for (const p of ['/approvals', '/desk/approvals', '/views/approvals']) { await go(p); await sleep(6000); const u = page.url().replace(H, ''); const tt = await text(); if (!/not found|404/i.test(tt.slice(0, 300))) { out.approvals = { p, u, snippet: tt.slice(0, 500).replace(/\s+/g, ' ') }; await shot('P3-RS-approvals'); break; } }
// Arabic
await page.evaluate(() => { localStorage.setItem('anyware_language', 'ar'); localStorage.setItem('anyware_language_explicit', 'ar'); });
await go('/settings/automation/blueprints'); t = await grab('P3-UX-ar-list', 9000);
out.arList = { dir: await page.evaluate(() => document.documentElement.dir), rawKeys: (t.match(/blueprints\.[a-zA-Z.]+/g) || []).slice(0, 10), englishLeft: (t.match(/\b(Create Blueprint|Inactive|Active|in progress|Blueprints)\b/g) || []).slice(0, 10) };
const cb3 = page.locator('button').filter({ hasText: /مخطط|إنشاء/ }).first(); if (await cb3.count()) { await cb3.click(); t = await grab('P3-UX-ar-designer', 9000); out.arDesigner = { rawKeys: (t.match(/(blueprints|designer|editor)\.[a-zA-Z.]+/g) || []).slice(0, 10), english: (t.match(/\b(Details|Save Draft|Publish|Add State|Strict Mode|Continuous|Transition Owners|Layout|Description)\b/g) || []).slice(0, 15) }; }
await go('/analytics/dashboards/blueprints'); t = await grab('P3-UX-ar-dashboard', 12000); out.arDash = { rawKeys: (t.match(/analytics\.[a-zA-Z.]+/g) || []).slice(0, 10), english: (t.match(/\b(Blueprint|Department|Time in state|Transitions|Limit met|Limit missed)\b/g) || []).slice(0, 10) };
await page.evaluate(() => { localStorage.setItem('anyware_language', 'en'); localStorage.setItem('anyware_language_explicit', 'en'); });
return out;
