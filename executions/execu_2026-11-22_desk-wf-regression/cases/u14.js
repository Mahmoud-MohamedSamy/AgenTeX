// Re-run UI items (23 Nov): PF-03 list load with 225 rules, L-09 list fetch + reorder control, L-10 counter, TD-13 message, AT-03 placeholders. Nothing saved.
const out = {}; const clean = s => (s || '').replace(/\s+/g, ' '); const W = '/settings/automation/workflow-rules';
const reqs = []; page.on('request', r => { if (/workflow\/rules(\?|$)/.test(r.url())) reqs.push(r.url().replace(/^.*\/api\/v1/, '')); });
// PF-03
const t0 = Date.now(); await page.goto(H + W, { waitUntil: 'domcontentloaded' });
if (await page.locator('input[type=password]').locator('visible=true').count()) return { stopped: 'session not valid' };
await page.locator('main tbody tr').first().waitFor({ timeout: 180000 }); out.PF03_firstRowMs = Date.now() - t0; await sleep(4000);
out.PF03_rows = await page.locator('main tbody tr').count(); out.PF03_tabs = clean(await page.locator('main [role=tablist], main .mf-tabbar').first().innerText().catch(() => '')).slice(0, 120);
await shot('U14-PF03-list'); out.L09_listRequests = [...new Set(reqs)].slice(0, 6);
out.L09_dragHandles = await page.locator('main [aria-roledescription="sortable"], main [data-dnd-handle], main button[aria-label*="drag" i], main [aria-label*="Reorder" i]').count();
await page.mouse.wheel(0, 20000); await sleep(3000); out.PF03_rowsAfterScroll = await page.locator('main tbody tr').count(); await shot('U14-PF03-bottom');
out.PF03_moreButton = clean(await page.locator('main').getByRole('button', { name: /Load more|Show more|Next/i }).allInnerTexts().then(a => a.join('|')).catch(() => ''));
// L-10 counter
out.L10_text = (clean(await page.locator('main').innerText()).match(/\d+\s*(of|\/)\s*200[^.]{0,40}|rules used[^.]{0,40}/i) || [null])[0];
// TD-13: new rule with Date-Time trigger + Field Update -> message
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); }).catch(() => {});
await page.goto(H + W, { waitUntil: 'domcontentloaded' }); await page.locator('main tbody tr').first().waitFor({ timeout: 180000 }); await sleep(2000);
await page.getByRole('button', { name: /New Rule/i }).first().click(); await sleep(2500);
await page.locator('[role=dialog]').getByText('Select a module').click(); await sleep(1200); await page.locator('[role=option]').filter({ hasText: /^Tickets$/ }).first().click(); await sleep(800);
await page.locator('[role=dialog] input').last().fill('QA WF TD13 unsaved'); await sleep(500);
for (let i = 0; i < 4; i++) { const b = page.locator('[role=dialog]').getByRole('button', { name: /^(Next|Continue|Create|Open editor|Done)/ }); if (!(await b.count())) break; await b.last().click(); await sleep(2000); }
await sleep(3000); await shot('U14-TD13-editor');
await page.locator('main').getByText(/This rule will be executed when/).first().click().catch(() => {}); await sleep(1500); await shot('U14-TD13-when');
out.TD13_whenPanel = clean(await page.locator('main').innerText()).match(/WHEN.{0,600}/)?.[0]?.slice(0, 500);
return out;
