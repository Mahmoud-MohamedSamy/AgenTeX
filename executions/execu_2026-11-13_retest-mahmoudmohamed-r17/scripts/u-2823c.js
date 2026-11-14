const res = []; const t0 = Date.now();
page.on('response', async r => { const u = r.url(); if (/api\/v1\/desk\/tickets\/[^/]+\/close|bulk|mass/.test(u) && r.request().method() !== 'GET') res.push({ t: Date.now() - t0, s: r.status(), u: u.replace(/^.*api\/v1/, '').slice(0, 80), b: r.status() >= 300 ? (await r.text().catch(() => '')).slice(0, 200) : '' }); });
await page.goto(H + '/views', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/All Tickets/.test(await text())) break; }
const lk = page.getByText('QA RT17 2823 view', { exact: true }).first(); await lk.scrollIntoViewIfNeeded(); await lk.click();
for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA RT17 2823 \d\d/.test(await text())) break; } await sleep(3000);
await page.getByRole('checkbox', { name: /select all/i }).first().click(); await sleep(2000);
const link = page.getByText(/Select all \d+ in this view/i).first(); log('link', await link.innerText().catch(() => 'none')); if (await link.count()) { await link.click(); await sleep(2000); }
log('selected', ((await text()).match(/[^\n]*selected[^\n]*/gi) || []).slice(0, 2));
await page.getByRole('button', { name: /^Close$/ }).first().click(); await sleep(2000);
const dlg = page.locator('[role=dialog], [role=alertdialog]').last(); log('dialog', (await dlg.innerText().catch(() => '')).replace(/\n/g, ' | ').slice(0, 200));
await dlg.getByRole('button', { name: /^Close \d+ tickets/ }).last().click();
await sleep(25000); await shot('2823-6-close-again.png');
log('toast', ((await text()).match(/\d+ updated, \d+ failed\.?|[^\n]*failed[^\n]*/gi) || []).slice(0, 3));
const by = {}; res.forEach(x => { by[x.s] = (by[x.s] || 0) + 1; }); log('responses by status', by, 'n', res.length, 'span ms', res.length ? res[res.length - 1].t - res[0].t : 0);
log('sample errors', res.filter(x => x.s >= 300).slice(0, 3));
