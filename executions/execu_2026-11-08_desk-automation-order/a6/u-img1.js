// D-2 two tabs, D-3 continuous, D-9 ghost owner (screens). Ids from img-prep.json.
const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/img-prep.json'), 'utf8'));
const D = id => '/settings/automation/blueprints/' + id;
const editOpen = async p => { const ed = p.getByRole('button', { name: 'Edit' }).first(); if (await ed.count()) { await ed.click(); await p.waitForTimeout(1000); } };
// ---- D-2: tab 1 renames, tab 2 (opened earlier) changes the description; both Save and Publish
await go(D(M.B.D2)); await sleep(9000);
const p2 = await ctx.newPage(); await p2.goto(H + D(M.B.D2), { waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(12000);
await editOpen(page); const nameIn = page.locator('input').nth(1); log('name before', await nameIn.inputValue().catch(() => '?'));
await nameIn.fill('QA BP D2 tabs RENAMED IN TAB 1'); await sleep(800); await shot('d2-tab1-renamed');
await page.getByRole('button', { name: 'Save and Publish' }).click(); await sleep(6000); log('tab1 after publish', (await text()).replace(/\s+/g, ' ').slice(0, 200));
await editOpen(p2); await p2.locator('textarea').first().fill('QA D2 description changed in tab 2'); await p2.waitForTimeout(800);
await p2.screenshot({ path: require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/evidence/ui/d2-tab2-before-publish.png') });
await p2.getByRole('button', { name: 'Save and Publish' }).click(); await p2.waitForTimeout(6000);
log('tab2 after publish', (await p2.innerText('body')).replace(/\s+/g, ' ').slice(0, 300));
await p2.screenshot({ path: require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/evidence/ui/d2-tab2-after-publish.png') }); await p2.close();
await go(D(M.B.D2)); await sleep(9000); await editOpen(page);
log('final name', await page.locator('input').nth(1).inputValue().catch(() => '?')); log('final description', await page.locator('textarea').first().inputValue().catch(() => '?'));
await shot('d2-final-after-reload');
// ---- D-3: designer advanced configuration + ticket stuck
await go(D(M.B.D3)); await sleep(9000);
const adv = page.getByText(/Advanced configuration/i).first(); if (await adv.count()) { await adv.click(); await sleep(1500); }
const bt = (await text()).replace(/\s+/g, ' '); const ci = bt.search(/continuous/i); log('D3 designer', bt.slice(Math.max(0, ci - 300), ci + 300)); await shot('d3-designer-continuous');
await go('/views/all/tickets/' + M.T.D3); await page.getByText('QA BP D3 continuous ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(4000);
log('D3 ticket', (await text()).replace(/\s+/g, ' ').match(/Steps.{0,300}/)?.[0]); await shot('d3-ticket-stuck');
// ---- D-9: ghost owner on transition
await go(D(M.B.D9)); await sleep(9000);
await page.getByText('QA ghost', { exact: true }).first().click().catch(e => log('click ghost', String(e).slice(0, 80))); await sleep(2500);
const bf = page.getByText(/^Before$/).first(); if (await bf.count()) { await bf.click(); await sleep(1500); }
const g = (await text()).replace(/\s+/g, ' '); const gi = g.search(/owner|Who can run/i); log('D9 panel', g.slice(Math.max(0, gi - 200), gi + 500)); await shot('d9-ghost-owner');
return { ok: true };
