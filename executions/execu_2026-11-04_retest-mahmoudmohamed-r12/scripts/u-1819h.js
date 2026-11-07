// NDC-1819 r12: "With Tasks matching…" Subject contains AEX-01 → expect 2 leads (API: 15bd4c9d, d5adc1b3)
const st = {}; const reqs = []; require(require('path').join(process.cwd(), 'hook.js'))(page, reqs);
const total = async () => ((await text()).match(/Total Records\s*([\d,]+)/) || [])[1];
const waitTotal = async (prev) => { for (let i = 0; i < 20; i++) { await sleep(1500); const t = await total(); if (t && t !== prev) return t; } return await total(); };
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(3000);
await page.getByRole('button', { name: 'My Leads, 51 records' }).first().click(); await sleep(9000);
await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(2000);
await page.locator('text=FILTER BY RELATED MODULES').locator('xpath=following::*[normalize-space(text())="Tasks"][1]').click(); await sleep(1200);
await page.locator('select').filter({ hasText: 'With any Tasks' }).selectOption({ label: 'With Tasks matching…' }); await sleep(1200);
await page.locator('select').filter({ hasText: 'Choose a field' }).selectOption({ label: 'Subject' }); await sleep(1500); await shot('1819-h1-subject.png');
const sec = page.locator('select').filter({ hasText: 'With Tasks matching' }).locator('xpath=ancestor::div[.//input or count(.//select)>2][1]');
st.secSelects = await sec.locator('select').evaluateAll(a => a.map(s => [...s.options].map(o => o.text).slice(0, 14).join('/')));
st.secInputs = await sec.locator('input').count();
const ops = sec.locator('select').nth(2); try { const o = await ops.evaluate(s => [...s.options].map(x => x.text)); const c = o.find(x => /^contains$/i.test(x)); if (c) await ops.selectOption({ label: c }); st.op = c; } catch (e) { st.opErr = e.message.slice(0, 80); }
await sec.locator('input').last().fill('AEX-01'); await sleep(600); await shot('1819-h2-filled.png');
await page.getByRole('button', { name: 'Apply Filter' }).click(); st.total = await waitTotal('51'); await sleep(1500);
st.names = (await page.locator('table tbody tr').allInnerTexts()).map(x => x.split('\t').map(s => s.trim()).filter(Boolean)[0]); await shot('1819-h3-result.png');
const cf = page.getByRole('button', { name: /Clear filters/ }); if (await cf.count()) { await cf.first().click(); await sleep(5000); } st.cleaned = await total();
st.reqs = reqs.filter(x => /records\?/.test(x) && /related/.test(x)).map(x => x.replace(/^.*total=(\d*).*filters=/, 't=$1 ')).slice(-3); return st;
