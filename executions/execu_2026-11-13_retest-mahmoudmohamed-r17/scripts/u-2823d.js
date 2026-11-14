const res = []; const t0 = Date.now();
page.on('response', async r => { const u = r.url(); const m = r.request().method(); if (/api\/v1/.test(u) && m !== 'GET' && !/heartbeat|realtime|query|search|summaries|iam\/auth|resolved-batch/.test(u)) res.push({ t: Date.now() - t0, m, s: r.status(), u: u.replace(/^.*api\/v1/, '').replace(/[0-9a-f-]{36}/g, ':id').slice(0, 80), b: r.status() >= 300 ? (await r.text().catch(() => '')).slice(0, 220) : '' }); });
await page.goto(H + '/views', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/All Tickets/.test(await text())) break; }
const lk = page.getByText('QA RT17 2823 view', { exact: true }).first(); await lk.scrollIntoViewIfNeeded(); await lk.click();
for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA RT17 2823 \d\d/.test(await text())) break; } await sleep(3000);
await page.getByRole('checkbox', { name: /select all/i }).first().click(); await sleep(2000);
const link = page.getByText(/Select all \d+ in this view/i).first(); log('link', await link.innerText().catch(() => 'none')); if (await link.count()) { await link.click(); await sleep(2000); }
await page.getByRole('button', { name: /^Update$/ }).first().click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').last(); log('update dialog', (await dlg.innerText().catch(() => '')).replace(/\n/g, ' | ').slice(0, 400)); await shot('2823-7-update-dialog.png');
const sel = dlg.locator('select').first();
if (await sel.count()) { const opts = await sel.locator('option').allInnerTexts(); log('field opts', opts.slice(0, 20)); await sel.selectOption({ label: 'Priority' }).catch(e => log('selerr', e.message.slice(0, 60))); await sleep(1200); const vs = dlg.locator('select').nth(1); if (await vs.count()) { log('val opts', await vs.locator('option').allInnerTexts()); await vs.selectOption({ index: 2 }).catch(() => {}); } }
else { await dlg.getByText(/Choose a field|Select a field|Field/).first().click(); await sleep(1000); await page.getByRole('option', { name: 'Priority' }).first().click().catch(() => page.getByText('Priority', { exact: true }).last().click()); await sleep(1200); await dlg.getByText(/Select|Choose a value/).last().click(); await sleep(800); await page.getByRole('option').nth(1).click(); }
await sleep(800); await shot('2823-8-update-ready.png'); log('dialog ready', (await dlg.innerText().catch(() => '')).replace(/\n/g, ' | ').slice(0, 300));
await dlg.getByRole('button', { name: /^(Update|Apply|Save)/ }).last().click();
await sleep(25000); await shot('2823-9-update-done.png');
log('toast', ((await text()).match(/\d+ updated, \d+ failed\.?|[^\n]*updated[^\n]*/gi) || []).slice(0, 3));
const by = {}; res.forEach(x => { const k = x.m + ' ' + x.u + ' ' + x.s; by[k] = (by[k] || 0) + 1; }); log('responses', by);
log('sample errors', res.filter(x => x.s >= 500).slice(0, 2));
