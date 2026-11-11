const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + '/modules/'+L, { waitUntil: 'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('tbody tr')).length > 2) break; }
const s = page.getByPlaceholder(/Search/i).nth(1); log('search inputs', await page.getByPlaceholder(/Search/i).count());
const inputs = await page.$$eval('input', is => is.map(i=>i.getAttribute('placeholder')||i.type)); log(inputs);
await shot('NDC-2807-list.png');
const btns = await page.$$eval('button', bs => bs.map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,60)); log(btns);
