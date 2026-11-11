await page.goto(H + '/settings/automation/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/Move to On Hold/i.test(await text())) break; }
await page.getByText('Move to On Hold', {exact:true}).first().click(); await sleep(3000);
const t = await text(); const k = t.indexOf('After'); log(t.slice(k, k+2500));
await shot('2729-desk-transition.png');
const btns = await page.$$eval('button', bs => bs.map(b => (b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean)); log(btns.slice(-60));
const sels = await page.$$eval('select', ss => ss.map(s => [...s.options].map(o=>o.text).slice(0,15).join('|')));
log(sels);
