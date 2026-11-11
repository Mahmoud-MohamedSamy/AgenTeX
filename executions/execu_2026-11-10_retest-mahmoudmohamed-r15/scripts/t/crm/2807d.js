const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V='800057b7-6125-4d18-9fb7-1c295d98e5b7';
await page.goto(H + '/modules/'+L+'?view='+V, { waitUntil: 'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if (/2807 0/.test(await text())) break; }
log(page.url()); let t = await text(); log('viewname', /QA RT15 2807 view/.test(t));
if (!/QA RT15 2807 view/.test(t)) { await page.getByRole('button', {name:'All Leads'}).click(); await sleep(1500); await page.getByText('QA RT15 2807 view').first().click(); await sleep(6000); }
t = await text(); log('rows', (t.match(/2807 \d{4}/g)||[]).length);
await page.locator('thead input[type=checkbox]').first().check(); await sleep(2000);
t = await text(); const k = t.search(/selected/i); log('sel', t.slice(Math.max(0,k-300), k+400));
await shot('NDC-2807-selected.png');
const btns = await page.$$eval('button', bs => bs.map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean)); log(btns.filter(b=>/select all|mass|update|delete|more|action/i.test(b)));
