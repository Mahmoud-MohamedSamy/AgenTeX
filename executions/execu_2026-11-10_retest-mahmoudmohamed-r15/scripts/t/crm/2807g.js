const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V='800057b7-6125-4d18-9fb7-1c295d98e5b7';
await page.goto(H + '/modules/'+L+'?view='+V, { waitUntil: 'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('tbody tr')).length > 5) break; }
await sleep(2000);
const t = await text(); const k = t.search(/Rows per page|per page/i); log('pager', k>0 ? t.slice(k-200, k+200) : 'none');
await page.mouse.wheel(0, 50000); await sleep(1500); await shot('NDC-2807-pager.png');
const sels = await page.$$eval('select', ss => ss.map(s => [...s.options].map(o=>o.text).join('|'))); log('selects', sels);
const combos = await page.$$eval('button[aria-haspopup]', bs => bs.map(b=>b.innerText.trim()).filter(Boolean)); log('combos', combos);
