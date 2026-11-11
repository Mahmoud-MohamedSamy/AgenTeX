await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Global Sets/.test(await text())) break; }
await page.getByRole('tab', { name: /Global Sets/ }).first().click().catch(async()=>{ await page.getByText('Global Sets').last().click(); }); await sleep(5000);
const t = await text(); log(t.slice(t.lastIndexOf('Global Sets'), t.lastIndexOf('Global Sets')+1500)); await shot('2806-ui-list.png');
await page.getByText('QA RT15 GS Colors', {exact:true}).first().click(); await sleep(5000);
const t2 = await text(); log('DETAIL', t2.slice(t2.indexOf('QA RT15 GS Colors'), t2.indexOf('QA RT15 GS Colors')+2500)); await shot('2806-ui-detail.png');
const btns = await page.$$eval('button', bs => bs.map(b => (b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean)); log(btns.slice(-40));
