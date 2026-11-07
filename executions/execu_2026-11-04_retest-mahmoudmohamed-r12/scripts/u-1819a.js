// NDC-1819 r12: Work Queue on NDC-Staging — filter panel groups (item 2 Related Modules), regression of header menu / settings / periods.
const st = {}; const reqs = [];
page.on('response', r => { const u = r.url(); if (/api\/v1/.test(u) && /records|activit|queue|filter/i.test(u) && r.request().method() !== 'OPTIONS') reqs.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^.*api\/v1/, '').slice(0, 200)); });
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(4000);
await shot('1819-a1-wq.png'); st.url = page.url();
st.top = (await text()).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 60).join(' | ').slice(0, 1200);
st.buttons = await page.locator('button').evaluateAll(a => a.map(x => (x.getAttribute('aria-label') || x.title || x.innerText.trim()).slice(0, 40)).filter(Boolean).slice(0, 80));
return st;
