const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56', C2 = '36c92f6b-c2e2-41dd-b651-1f5da310355b'; const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const snip = (t, k, n) => { const i = t.indexOf(k); return i < 0 ? '(not found: ' + k + ')' : t.slice(i, i + (n || 700)).replace(/\s+/g, ' '); };
// AI rerun via API (false-positive check)
o.aiRerun = (await api('POST', `/desk/tickets/${tk}/ai/summary`, { include_notes: false })).s;
// History creation row on C2 (short history)
await page.goto(H + '/views/all/tickets/' + C2, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 child 2/, 35); await sleep(2000);
const hist = page.locator('[role=tab]', { hasText: /HISTORY/i }).first(); o.histTab = await hist.count();
if (o.histTab) { await hist.click().catch(() => {}); await sleep(5000); const th = await txt(); o.hist = snip(th, 'Ticket History', 1800); o.histDeptRaw = /department_id/.test(th); o.histUuid = (th.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) || []).slice(0, 3); o.shotHist = await shot('wave2/ui-history-c2'); }
// Clone C2
const more = page.locator('button[aria-label="More ticket actions"]').first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(1200); const cl = page.getByRole('menuitem', { name: 'Clone' }).first(); if (await cl.count()) { await cl.click().catch(() => {}); await sleep(6000); o.cloneUrl = page.url().replace(H, ''); o.cloneView = snip(await txt(), 'Clone', 600); o.shotClone = await shot('wave2/ui-clone');
  const save = page.getByRole('button', { name: /^(Save|Create)$/ }).first(); o.cloneSaveBtn = await save.count(); if (o.cloneSaveBtn) { await save.click().catch(() => {}); await sleep(7000); o.cloneAfterSave = page.url().replace(H, ''); o.cloneAfterText = snip(await txt(), '(Clone)', 300); } } }
return done(o);
