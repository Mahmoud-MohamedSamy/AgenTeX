await go('/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3', 8000);
for (let i = 0; i < 40 && /Loading Leads/.test(await txt()); i++) await sleep(1500);
await page.getByRole('button', { name: 'Module actions' }).click(); await sleep(1000);
await page.getByRole('menuitem', { name: /Import Leads/ }).click(); await sleep(6000);
const so = page.getByRole('button', { name: 'Start over' }); if (await so.count()) { await so.click(); await sleep(2500); }
await page.locator('input[type=file]').setInputFiles('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-21_retest-mahmoudmohamed/files/QA-RT-inv.csv'); await sleep(4000);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(5000);
await page.locator('select').first().selectOption({ label: 'FieldPermissions' }); await sleep(600);
await page.getByText('Add new records', { exact: true }).click(); await sleep(800);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(6000);
const rows = page.locator('table tbody tr'); const n = await rows.count(); const MAP = { Name: 'Name', 'Single Line': 'Single Line Permission', Percent: 'Percent Permission' };
for (let i = 0; i < n; i++) { const r = rows.nth(i); const col = (await r.locator('td').first().innerText()).replace(/\s*\*$/, '').trim(); if (MAP[col]) await r.locator('select').first().selectOption({ label: MAP[col] }); }
await page.getByRole('button', { name: 'Next' }).click(); await sleep(5000);
let validate = null; const f = async r => { if (/\/validate/.test(r.url())) validate = (await r.text().catch(() => '')).slice(0, 600); }; page.on('response', f);
await page.getByRole('button', { name: 'Save & next' }).click(); await sleep(8000); page.off('response', f);
// inspect the errors table + its filter state
const tbl = (await txt()).match(/All errors[\s\S]*?Rows per page/)?.[0];
await page.getByRole('button', { name: 'Filters' }).click(); await sleep(1200);
const filt = await page.evaluate(() => { const out = []; for (const el of document.querySelectorAll('input[type=checkbox], [role=checkbox], select, input[type=text]')) { const lab = el.closest('label')?.innerText || el.getAttribute('aria-label') || el.placeholder || ''; const v = el.type === 'checkbox' ? el.checked : (el.getAttribute('aria-checked') ?? el.value); if (lab || v) out.push((lab || el.tagName).slice(0, 50) + ' = ' + v); } return out.slice(-25); });
await shot('inv-import-errors-filters');
const state = await page.evaluate(() => { try { return Object.keys(localStorage).filter(k => /import|error|filter/i.test(k)).map(k => k + '=' + localStorage.getItem(k).slice(0, 300)); } catch (e) { return []; } });
return done({ validate, tbl, filt, state });
