const st = {}; const reqs = [];
page.on('request', r => { const u = r.url(); if (/api\/v1/.test(u) && /records/.test(u) && r.method() !== 'OPTIONS') reqs.push(decodeURIComponent(u.replace(/^.*api\/v1/, '')).slice(0, 500)); });
const total = async () => ((await text()).match(/Total Records\s*([\d,]+)/) || [])[1];
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(3000);
await page.getByRole('button', { name: 'My Leads, 51 records' }).first().click(); await sleep(8000);
await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(2500);
await page.locator('text=FILTER BY RELATED MODULES').locator('xpath=following::*[normalize-space(text())="Tasks"][1]').click(); await sleep(1500);
const sel = page.locator('select').filter({ hasText: 'With any Tasks' });
for (const opt of ['With any Tasks', 'Without any Tasks']) { await sel.selectOption({ label: opt }); await sleep(7000);
  st[opt] = { total: await total(), names: (await page.locator('table tbody tr').allInnerTexts()).map(x => x.split('\t').map(s => s.trim()).filter(Boolean)[0]).slice(0, 10) }; await shot(`1819-e-${opt.replace(/\s+/g, '-')}.png`); }
await sel.selectOption({ label: 'With Tasks matching…' }); await sleep(2500); await shot('1819-e-matching.png');
const t = await text(); const i = t.indexOf('With Tasks matching'); st.matching = t.slice(i, i + 400).replace(/\n+/g, ' | ');
const cf = page.getByRole('button', { name: /Clear filters/ }); st.cfCount = await cf.count(); await cf.last().click({ force: true, timeout: 8000 }).catch(e => st.cfErr = e.message.slice(0, 120)); await sleep(6000); st.cleared = await total(); await shot('1819-e-cleared.png');
await page.reload({ waitUntil: 'commit' }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Total Records/.test(await text())) break; } await sleep(3000); st.afterReload = await total();
st.reqs = [...new Set(reqs)].filter(x => /related|has_|exists|with/i.test(x)).slice(-6); return st;
