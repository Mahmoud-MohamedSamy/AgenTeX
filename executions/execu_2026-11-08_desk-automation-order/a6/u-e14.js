await go('/settings/automation/blueprints/new'); await sleep(8000);
const canvas = page.locator('.react-flow').first(); const D = page.locator('[draggable=true]');
await D.nth(0).dragTo(canvas, { targetPosition: { x: 200, y: 250 } }); await sleep(1200);
await D.nth(2).dragTo(canvas, { targetPosition: { x: 600, y: 250 } }); await sleep(1200);
await page.getByRole('button', { name: 'Save and Publish' }).click({ force: true }); await sleep(1500);
await page.locator('li').filter({ hasText: /needs a name/ }).last().locator('button').first().click(); await sleep(1500);
const rpanel = page.locator('aside').last();
const RP = async () => (await rpanel.innerText()).replace(/\s+/g, ' ');
log('panel', (await RP()).slice(0, 2500)); await shot('e14-transition-panel');
for (const tab of ['During', 'After']) { const t = page.getByRole('tab', { name: new RegExp(tab) }).first(); if (await t.count()) { await t.click(); await sleep(1000); log(tab, (await RP()).slice(0, 1500)); await shot('e14-' + tab.toLowerCase()); } else { const b = page.getByText(tab, { exact: false }).first(); log('no tab', tab, await b.count()); } }
