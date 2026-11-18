const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.goto(H + '/settings/automation/blueprints/478a28c6-16eb-4aec-8ad4-dcdf5278fdd0', { waitUntil: 'domcontentloaded' }); await sleep(10000);
const t0 = (await text()).replace(/\s+/g, ' '); const i0 = t0.search(/no active owner/i); log('designer', i0 >= 0 ? t0.slice(Math.max(0, i0 - 200), i0 + 250) : 'NO WARNING TEXT');
await page.screenshot({ path: RAW + '3036-1-designer.png' });
await page.getByText('QA onlyA', { exact: true }).first().click().catch(e => log('click', String(e).slice(0, 80))); await sleep(2500);
const bf = page.getByText(/^Before$/).first(); if (await bf.count()) { await bf.click(); await sleep(1500); }
const t1 = (await text()).replace(/\s+/g, ' '); const i1 = t1.search(/Who can run|owner/i); log('before panel', t1.slice(Math.max(0, i1 - 100), i1 + 500));
await page.screenshot({ path: RAW + '3036-2-before-panel.png' });
await page.goto(H + '/views/all/tickets/d536db9b-cd3f-43d9-be5e-3aea26381114', { waitUntil: 'domcontentloaded' });
await page.getByText('QA BP RT19 3036 onlyA ticket 2').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(5000);
const t2 = (await text()).replace(/\s+/g, ' '); const i2 = t2.search(/Steps/); log('ticket2 card', t2.slice(i2, i2 + 300));
log('onlyA button', await page.getByRole('button', { name: /QA onlyA/ }).count());
await page.screenshot({ path: RAW + '3036-3-ticket2-suspended.png' });
return { ok: 1 };
