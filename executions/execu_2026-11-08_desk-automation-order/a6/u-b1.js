await go('/settings/automation/blueprints'); await sleep(5000);
const rows = await page.locator('main').last().innerText(); log('main', rows.replace(/\s+/g,' ').slice(0,900));
await shot('b1-list-qa');
const nm = page.getByText('QA BP B10L', { exact: false }).first();
const bx = await nm.boundingBox(); const sw = await nm.evaluate(e => [e.scrollWidth, e.clientWidth, getComputedStyle(e).textOverflow, e.getAttribute('title')]); log('long name box', bx, sw);
await nm.hover(); await sleep(1200); const tip = await page.locator('[role=tooltip]').allInnerTexts().catch(()=>[]); log('tooltip', tip); await shot('b10-hover');
log('hscroll', await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth));
// B3: department without blueprints
await page.getByRole('combobox').first().click().catch(async()=>{ await page.getByText('Customer Support').first().click(); });
await sleep(1000); await shot('b3-dept-menu');
const opt = page.getByRole('option', { name: 'QA AO Dept B' }); if (await opt.count()) await opt.click(); else await page.getByText('QA AO Dept B').last().click();
await sleep(3000); log('b3', (await page.locator('main').last().innerText()).replace(/\s+/g,' ').slice(0,400)); await shot('b3-empty-dept');
