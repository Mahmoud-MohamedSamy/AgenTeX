const st = {}; const reqs = []; require(require('path').join(process.cwd(), 'hook.js'))(page, reqs);
const bad = []; page.on('response', async r => { if (/api\/v1/.test(r.url()) && r.status() >= 400) bad.push(r.status() + ' ' + r.request().method() + ' ' + decodeURIComponent(r.url().replace(/^.*api\/v1/, '')).slice(0, 300) + ' → ' + (await r.text().catch(() => '')).slice(0, 300)); });
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); const t0 = Date.now(); for (let i = 0; i < 80; i++) { await sleep(3000); const t = await text(); if (/Total Recordss*d|Couldn't load/.test(t)) break; } st.loadMs = Date.now() - t0; await sleep(3000);
st.state1 = /Couldn't load/.test(await text()) ? 'error' : 'ok ' + ((await text()).match(/Total Records\s*([\d,]+)/) || [])[1]; await shot('1819-j1.png');
const tr = page.getByRole('button', { name: 'Try again' }); if (await tr.count()) { await tr.click(); await sleep(8000); st.tryAgain = /Couldn't load/.test(await text()) ? 'error' : 'ok'; }
st.bad = bad; st.recs = reqs.filter(x => /records\?/.test(x)).slice(-4); return st;
