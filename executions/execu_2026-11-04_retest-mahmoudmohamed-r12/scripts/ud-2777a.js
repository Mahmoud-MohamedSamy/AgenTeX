const st = {}; const reqs = []; require(require('path').join(process.cwd(), 'hook.js'))(page, reqs);
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 80; i++) { await sleep(3000); if (/Departments/.test(await text())) break; }
await page.getByText('Departments', { exact: true }).first().click(); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Add department/.test(await text())) break; }
st.listUrl = page.url(); await page.getByPlaceholder('Search departments').fill('QA RT11 Dept A'); await sleep(4000); await page.getByText('QA RT11 Dept A', { exact: true }).first().click(); for (let i = 0; i < 30; i++) { await sleep(2000); if (/copied|CC/i.test(await text())) break; } await sleep(3000);
st.deptUrl = page.url(); await shot('2777-a2-dept.png');
st.lines = (await text()).split('\n').map(s => s.trim()).filter(s => /CC|copied|display name|Save|Edit|Help Center/i.test(s)).slice(0, 20);
st.reqs = reqs.filter(x => /department/.test(x)).slice(-5).map(x => x.slice(0, 200)); return st;
