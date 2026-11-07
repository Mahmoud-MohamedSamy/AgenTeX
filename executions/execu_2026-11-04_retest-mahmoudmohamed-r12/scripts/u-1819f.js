const st = { steps: [] }; const reqs = [];
require(require('path').join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-04_retest-mahmoudmohamed-r12/scripts', 'hook.js'))(page, reqs);
const total = async () => ((await text()).match(/Total Records\s*([\d,]+)/) || [])[1];
const waitTotal = async (prev) => { for (let i = 0; i < 20; i++) { await sleep(1500); const t = await total(); if (t && t !== prev) return t; } return await total(); };
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(3000);
await page.getByRole('button', { name: 'My Leads, 51 records' }).first().click(); await sleep(9000); st.base = await total();
await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(2500);
await page.locator('text=FILTER BY RELATED MODULES').locator('xpath=following::*[normalize-space(text())="Tasks"][1]').click(); await sleep(1500);
const sel = page.locator('select').filter({ hasText: 'With any Tasks' }); const reopen = async () => { if (!(await sel.count())) { await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(2000); if (!(await sel.count())) { await page.locator('text=FILTER BY RELATED MODULES').locator('xpath=following::*[normalize-space(text())="Tasks"][1]').click(); await sleep(1200); } } };
let prev = st.base;
for (const opt of ['With any Tasks', 'Without any Tasks']) { await reopen(); await sel.selectOption({ label: opt }); await sleep(800); await page.getByRole('button', { name: 'Apply Filter' }).click(); const t = await waitTotal(prev); prev = t;
  st.steps.push({ opt, total: t, names: (await page.locator('table tbody tr').allInnerTexts()).map(x => x.split('\t').map(s => s.trim()).filter(Boolean)[0]).slice(0, 10) }); await shot(`1819-f-${st.steps.length}-${opt.replace(/\s+/g, '-')}.png`); }
const clr = page.getByText('Clear', { exact: true }); st.clearLinks = await clr.count(); await clr.last().click().catch(e => st.clrErr = e.message.slice(0, 80)); st.afterClear = await waitTotal(prev); await shot('1819-f-cleared.png');
st.reqs = reqs.filter(x => /records?/.test(x)).slice(-6); return st;
